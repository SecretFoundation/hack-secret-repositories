// SPDX:License-Identifier: MIT

pragma solidity ^0.8.0;

import "./interface/IShadows.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Create2.sol";

import {AxelarExecutable} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/executable/AxelarExecutable.sol";
import {IAxelarGateway} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol";
import {IAxelarGasService} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol";
import {StringToAddress, AddressToString} from "@axelar-network/axelar-gmp-sdk-solidity/contracts/libs/AddressString.sol";

error NftNotApproved(address nftContract, uint256 tokenId);
error NftAlreadyFractionalized(address nftContract, uint256 tokenId);
error NftNotFractionalized(address nftContract, uint256 tokenId);
error InvalidFractions(address nftContract, address caller, uint256 tokenId,  uint256 fractions);

contract ShadowProtocol is AxelarExecutable{
    using StringToAddress for string;
    using AddressToString for address;

    IAxelarGasService public immutable gasService;
    string public chainName;
    string public destinationChain;
    string public destinationAddress;
    
    mapping(address=>mapping(uint256=>bool)) public nftFractionalized;
    IShadows public shadows;

    constructor(address _shadowsImplementation, address gateway_, address gasReceiver_, string memory chainName_, string memory _destinationChainName, string memory _destinationAddress ) AxelarExecutable(gateway_) {
        gasService = IAxelarGasService(gasReceiver_);
        chainName = chainName_;
        shadows = IShadows(_deployProxy(_shadowsImplementation, 0));
        destinationChain = _destinationChainName;
        destinationAddress = _destinationAddress;
    }

    function fractionalizeNftToSecret(address _nftContract, uint256 _tokenId, uint256 _fractions, uint256 _pricePerFractionInUscrt, string memory _fractionUri) external payable {
        
        if(IERC721(_nftContract).getApproved(_tokenId)!=address(this)) revert NftNotApproved(_nftContract, _tokenId);
        
        if(nftFractionalized[_nftContract][_tokenId]) revert NftAlreadyFractionalized(_nftContract, _tokenId);

        IERC721(_nftContract).transferFrom(msg.sender, address(this), _tokenId);
        nftFractionalized[_nftContract][_tokenId] = true;
        shadows.initNft(_nftContract, _tokenId, _fractions, _fractionUri);
        
        // Mint fractions in Secret
        _send("fractionalize_nft", abi.encode(_nftContract, _tokenId, _pricePerFractionInUscrt, _fractions, msg.sender));
    }

    function _mintFractionsInEvm(address _nftContract, uint256 _tokenId, address _receiver, uint256 _fractions) internal {
        if(!nftFractionalized[_nftContract][_tokenId]) revert NftNotFractionalized(_nftContract, _tokenId);
        shadows.mintFractions(_receiver, _nftContract, _tokenId, _fractions);
    }
    

    function sendFractionsToSecret(uint256 assetId, address _nftContract, uint256 _tokenId, uint256 _fractions) external {
        if(shadows.getFractions(msg.sender, _nftContract, _tokenId) < _fractions) revert InvalidFractions(_nftContract, msg.sender, _tokenId, _fractions);      
        shadows.burnFractions(msg.sender, _nftContract, _tokenId, _fractions);

        // send the fractions to the secret network
        _send("send_fractions_to_secret",abi.encode(assetId, _nftContract,  _tokenId, _fractions, msg.sender));
    }

    function _deployProxy(
        address implementation,
        uint salt
    ) internal returns (address _contractAddress) {
        bytes memory code = _creationCode(implementation, salt);
        _contractAddress = Create2.computeAddress(
            bytes32(salt),
            keccak256(code)
        );
        if (_contractAddress.code.length != 0) return _contractAddress;

        _contractAddress = Create2.deploy(0, bytes32(salt), code);
    }

    function _creationCode(
        address implementation_,
        uint256 salt_
    ) internal pure returns (bytes memory) {
        return
            abi.encodePacked(
                hex"3d60ad80600a3d3981f3363d3d373d3d3d363d73",
                implementation_,
                hex"5af43d82803e903d91602b57fd5bf3",
                abi.encode(salt_)
            );
    }

    function _send(string memory functionName, bytes memory executeMsgPayload) internal {
        // 1. Generate GMP payload
        bytes memory payload = _encodePayloadToCosmWasm(functionName,executeMsgPayload);

        // 2. Pay for gas
        gasService.payNativeGasForContractCall{value: msg.value}(
            address(this),
            destinationChain,
            destinationAddress,
            payload,
            msg.sender
        );

        // 3. Make GMP call
        gateway.callContract(destinationChain, destinationAddress, payload);
    }

    function _encodePayloadToCosmWasm(string memory functionName, bytes memory executeMsgPayload) internal view returns (bytes memory) {
        // Schema
        //   bytes4  version number (0x00000001)
        //   bytes   ABI-encoded payload, indicating function name and arguments:           
        //     string                   CosmWasm contract method name
        //     dynamic array of string  CosmWasm contract argument name array
        //     dynamic array of string  argument abi type array
        //     bytes                    abi encoded argument values

        // contract call arguments for ExecuteMsg::receive_message_evm{ source_chain, source_address, payload }
        bytes memory argValues = abi.encode(
            chainName,
            address(this).toString(),
            executeMsgPayload
        );

        string[] memory argumentNameArray = new string[](3);
        argumentNameArray[0] = "source_chain";
        argumentNameArray[1] = "source_address";
        argumentNameArray[2] = "payload";

        string[] memory abiTypeArray = new string[](3);
        abiTypeArray[0] = "string";
        abiTypeArray[1] = "string";
        abiTypeArray[2] = "bytes";

        bytes memory gmpPayload;
        gmpPayload = abi.encode(
            functionName,
            argumentNameArray,
            abiTypeArray,
            argValues
        );

        return abi.encodePacked(
            bytes4(0x00000001),
            gmpPayload
        );
    }

    function _execute(
        string calldata /*sourceChain*/,
        string calldata /*sourceAddress*/,
        bytes calldata payload
    ) internal override {      
        (address _nftContract, uint256 _tokenId, uint256 _fractions, address _receiver) = abi.decode(payload, (address, uint256, uint256, address));
        _mintFractionsInEvm(_nftContract, _tokenId, _receiver, _fractions);
    }
}