import { useEffect, useState } from 'react';
import { projectInfo } from '@/data/project-summary';

const useFetchNFTData = (address) => {
  const [value, setValue] = useState(0);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        //`https://base-sepolia.g.alchemy.com/nft/v3/${}/getNFTsForOwner?owner=0x41285462d2B1c7C5631B49bC6F57BfF78D4C0c2C&contractAddresses[]=0xE98B08db344678cB512C62C3d1D0004aa58e8901&withMetadata=true&pageSize=100
        const url = `https://base-sepolia.g.alchemy.com/nft/v3/${process.env.NEXT_PUBLIC_ALCHEMY_BASE_SEPOLIA}/getNFTsForOwner?owner=${address}&contractAddresses[]=${projectInfo.nftAddress}&withMetadata=true&pageSize=100`;
        const options = { method: 'GET', headers: { accept: 'application/json' } };

        const response = await fetch(url, options);
        console.log(response, ' - resp')
        const jsonData = await response.json();
        const ownedNftsLength: number = jsonData?.ownedNfts?.length ?? 0;

        setValue(ownedNftsLength); // Assuming the value is available in the 'value' field of the API response
        console.log(jsonData.ownedNfts)
        setData(jsonData.ownedNfts);
      } catch (error) {
        console.error('Error fetching value:', error);
        setError(error);
      }
    };

    fetchData();
  }, [address]);

  return { value, data, error };
};

export  {useFetchNFTData};