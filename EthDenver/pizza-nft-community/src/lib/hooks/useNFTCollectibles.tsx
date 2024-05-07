//this is used to get NFTs on a contract
interface Contract {
  address: string;
  name: string;
  symbol: string;
  totalSupply: number | null;
  tokenType: string;
  contractDeployer: string;
  deployedBlockNumber: number;
  openSeaMetadata: {
    floorPrice: number | null;
    collectionName: string | null;
    collectionSlug: string | null;
    safelistRequestStatus: string | null;
    imageUrl: string | null;
    description: string | null;
    externalUrl: string | null;
    twitterUsername: string | null;
    discordUrl: string | null;
    bannerImageUrl: string | null;
    lastIngestedAt: string | null;
  };
  isSpam: boolean | null;
  spamClassifications: string[];
}

interface Image {
  cachedUrl: string | null;
  thumbnailUrl: string | null;
  pngUrl: string | null;
  contentType: string | null;
  size: number | null;
  originalUrl: string | null;
}

interface Raw {
  tokenUri: string;
  metadata: Record<string, unknown>;
  error: string | null;
}

interface Mint {
  mintAddress: string | null;
  blockNumber: number | null;
  timestamp: string | null;
  transactionHash: string | null;
}

interface NFT {
  contract: Contract;
  tokenId: string;
  tokenType: string;
  name: string | null;
  description: string | null;
  tokenUri: string | null;
  image: Image;
  raw: Raw;
  collection: unknown | null;
  mint: Mint;
  owners: unknown | null;
  timeLastUpdated: string;
}

interface NFTResponse {
  nfts: NFT[];
  pageKey: string | null;
}

const fetchNFTDataFromAPI = async (contract: string): Promise<NFTCollectible[]> => {

  //console.log(`https://base-sepolia.g.alchemy.com/nft/v3/${process.env.NEXT_PUBLIC_ALCHEMY_BASE_SEPOLIA}/getNFTsForContract?contractAddress=${contract}&withMetadata=true`)
  const response = await fetch(
    `https://base-sepolia.g.alchemy.com/nft/v3/${process.env.NEXT_PUBLIC_ALCHEMY_BASE_SEPOLIA}/getNFTsForContract?contractAddress=${contract}&withMetadata=true`
  );

  console.log(response)

  if (!response.ok) {
    throw new Error(`Failed to fetch NFT data: ${response.statusText}`);
  }

  const responseData: NFTResponse = await response.json();

  const parsedNFTs = responseData.nfts.map((nft) => {
    // Parse tokenUri string to JSON
    const tokenUriData = JSON.parse(nft.raw.tokenUri);

    // Extract the required properties
    const { name, description, image, attributes } = tokenUriData;

    // attributes is an array, you can loop through it if needed
    const parsedAttributes = attributes.map((attribute) => {
        const { trait_type, value } = attribute;
        // Do something with trait_type and value
        return { trait_type, value };
    });

    // Return the parsed data for each NFT including image
    return {
        name,
        description,
        image,
        attributes: parsedAttributes,
    };

});

// Now parsedNFTs is an array containing the parsed data for all NFTs
return parsedNFTs

};

export {fetchNFTDataFromAPI};
