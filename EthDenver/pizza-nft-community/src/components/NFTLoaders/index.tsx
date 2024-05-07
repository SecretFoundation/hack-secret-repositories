import React, { useEffect, useState } from 'react';
import { fetchNFTDataFromAPI } from '../../lib/hooks/useNFTCollectibles';// Adjust the path
import { SimpleNFTComponent } from './nft-card';
import { useFetchNFTData } from '@/lib/hooks/nfttest';

interface NFTGalleryProps {
	contractAddress: string;
	userAddress?: string; // Allow userAddress to be undefined
  }
  
// Adjust the path
// ... other imports
const NFTGallery: React.FC<NFTGalleryProps> = ({ contractAddress, userAddress }) => {
	const [nftData, setNFTData] = useState<any[]>([]); // Change the type if needed
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const { value, data, error2 } = useFetchNFTData(userAddress);
	console.log(value, ' -length')
  
	useEffect(() => {
	  const fetchData = async () => {
		setLoading(true);
		setError(null);
  
		try {
		  const data = await fetchNFTDataFromAPI(contractAddress);
		  console.log(data, 'test')
		  setNFTData(data);
		} catch (err) {
		  console.error('Error fetching NFT data:', err);
		  setError('Error loading gallery');
		} finally {
		  setLoading(false);
		}
	  };
  
	  fetchData();
	}, [contractAddress]);
  
	if (loading) {
	  return <div>Loading...</div>;
	}
  
	if (error) {
	  return <div>Error: {error}</div>;
	}
	
	if (value === 0) {
		return <div>You need to share your pizza price to see other people's slices.</div>;
	  }
  
	return (
	  <div>
		<h2>NFT Gallery</h2>
		<br></br><br></br>
		<div style={{ display: 'flex', flexWrap: 'wrap' }}>
		  {nftData && nftData.map((nft, index) => (
			<SimpleNFTComponent key={index} nft={nft} />
		  ))}
		</div>
	  </div>
	);//
  };
  
  export { NFTGallery };