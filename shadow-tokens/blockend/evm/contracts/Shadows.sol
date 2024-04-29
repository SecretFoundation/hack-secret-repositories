// SPDX:License-Identifier: MIT

pragma solidity ^0.8.0;


import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/token/ERC1155/extensions/ERC1155URIStorage.sol";
import "./interface/IShadows.sol";

error NotInitialized();
error OnlyProtocol();
error AlreadyInitialized();
error TokenAlreadyExists();
error TokenDoesNotExist();


contract Shadows is ERC1155, ERC1155URIStorage, IShadows {

    bool public initialized;
    address public shadowProtocol;

    mapping(uint256=>bool) public tokenIdExists;

    constructor() ERC1155("") {
        initialized = true;
    }

    modifier isInitialized(){
        if(!initialized) revert NotInitialized();
        _;
    }
    
    modifier onlyProtocol(){
        if(msg.sender!=shadowProtocol) revert OnlyProtocol();
        _;
    }

    function initialize(address _protocol) public  {
        if(initialized) revert AlreadyInitialized();
        shadowProtocol=_protocol;   
        initialized = true;
    }

    function initNft(address _tokenAddress, uint256 _tokenId, uint256 _fractions, string memory _uri) public onlyProtocol isInitialized{
        uint256 _genTokenId=uint256(keccak256(abi.encodePacked(_tokenAddress, _tokenId)));
        if(tokenIdExists[_genTokenId]) revert TokenAlreadyExists();
        _mint(msg.sender, _genTokenId, _fractions, "");
        _setURI(_tokenId, _uri);
    }

    function mintFractions(address _receiver, address _tokenAddress, uint256 _tokenId, uint256 _fractions) public onlyProtocol isInitialized{
        uint256 _genTokenId=uint256(keccak256(abi.encodePacked(_tokenAddress, _tokenId)));
        if(!tokenIdExists[_genTokenId]) revert TokenDoesNotExist();
        
        _mint( _receiver, _genTokenId, _fractions, "");
    }

    function burnFractions(address _burner, address _tokenAddress, uint256 _tokenId, uint256 _fractions) public onlyProtocol isInitialized{

        uint256 _genTokenId=uint256(keccak256(abi.encodePacked(_tokenAddress, _tokenId)));
        if(!tokenIdExists[_genTokenId]) revert TokenDoesNotExist();
        
        _burn(_burner, _genTokenId, _fractions);
    }

    function getFractions(address _owner, address _tokenAddress, uint256 _tokenId) public view returns(uint256){
        uint256 _genTokenId=uint256(keccak256(abi.encodePacked(_tokenAddress, _tokenId)));
        return balanceOf(_owner, _genTokenId);
    }

    function uri(uint256 tokenId) public view virtual override(ERC1155, ERC1155URIStorage) returns (string memory) {
        return ERC1155URIStorage.uri(tokenId);
    }
}