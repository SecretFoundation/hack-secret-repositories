// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts@5.0.2/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@5.0.2/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts@5.0.2/access/Ownable.sol";


contract SliceNFT is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    mapping(string => string) private pizzaTypeToIPFSUrl;
    mapping(uint256 => nftData) public tokenData;


    constructor(address initialOwner)
        ERC721("SliceNFT", "SLICE")
        Ownable(initialOwner)
    {}
    
    struct nftData {
        uint256 place;
        string pizzaType;
        string currency;
        uint256 currentTime;
        uint256 amount;
    }

    function safeMint(
        address recipient,
        uint256 place,
        string memory pizzaType,
        string memory currency,
        uint256 amount

        //going to need to add image data based on
    ) public {
        uint256 tokenId = _nextTokenId++;
        
        // Define IPFS URLs for each pizza type
        string memory metadataUri = string(abi.encodePacked(
        '{',
            '"name": "SliceNFT #', Strings.toString(tokenId), '", ',
            '"description": "A delicious slice of ', pizzaType, ' pizza.", ',
            '"image": "', _getIpfsUrlForPizzaType(pizzaType), '", ',
            '"attributes": [',
                '{ "trait_type": "Recipient", "value": "', Strings.toHexString(uint256(uint160(recipient)), 20), '" },',
                '{ "trait_type": "Place", "value": "', Strings.toString(place), '" },',
                '{ "trait_type": "Pizza Type", "value": "', pizzaType, '" },',
                '{ "trait_type": "Currency", "value": "', currency, '" },',
                '{ "trait_type": "Amount", "value": "', Strings.toString(amount), '" },',
                '{ "trait_type": "Minting Time", "value": "', Strings.toString(block.timestamp), '" }',
            ']',
        '}'
    ));

        _setTokenURI(tokenId, metadataUri); 
        _safeMint(recipient, tokenId);


        //emit NftMetadata(pizza, etc)

        nftData memory newData = nftData({
            place: place, 
            pizzaType: pizzaType,
            currency: currency,
            currentTime: block.timestamp,
            amount: amount
        });


        tokenData[tokenId] = newData;
    }


        // Function to return IPFS URL for pizza types
    function _getIpfsUrlForPizzaType(string memory pizzaType) private pure returns (string memory) {
        if (keccak256(abi.encodePacked(pizzaType)) == keccak256(abi.encodePacked("supreme"))) {
            return "https://gray-odd-lynx-187.mypinata.cloud/ipfs/QmbMQpNZFrsPQqUwiK1wBUKiJ8Ep7EjF2TwH85ikR16fW5";
        } else if (keccak256(abi.encodePacked(pizzaType)) == keccak256(abi.encodePacked("pepperoni"))) {
            return "https://gray-odd-lynx-187.mypinata.cloud/ipfs/QmQdEPS2MCKAra8E4nwfs37Kh88wM1cStxUFC7WZm97eyV";
        } else if (keccak256(abi.encodePacked(pizzaType)) == keccak256(abi.encodePacked("mushroom"))) {
            return "https://gray-odd-lynx-187.mypinata.cloud/ipfs/QmYEqTEx96E9iusMj7WDVjHsmqPBRcsrKamUAuMXBGhpEG";
        } else {
            revert("Invalid pizza type");
        }
        }

    function getTokenData(uint256 tokenId) public view returns (nftData memory) {
        require(ownerOf(tokenId) != address(0), "Token ID does not exist.");
        return tokenData[tokenId];
    }
}
