import React from 'react';
import { projectInfo } from '@/data/project-summary';
import { NFTGallery } from '.';
import { useFetchNFTData } from '@/lib/hooks/nfttest';

const YourSlices = ({ address }) => {
  console.log(address, ' in your slices')
  const { value, data, error } = useFetchNFTData(address);

  //console.log(data[0].raw.tokenUri, ' data')

  return (
    <div>
      {value === 0 ? (
        <p>Mint an NFT and it will show up here!</p>
      ) : (
        <div>
          {data && data.map((tokenData, index) => {
            // Parse the JSON within the tokenUri string
            const parsedTokenUri = JSON.parse(tokenData.raw.tokenUri);

            return (
              <div key={index}>

                <h3>{parsedTokenUri.name}</h3>
                <br></br>
                <p> {parsedTokenUri.description}</p>
                <br></br>
                <img src={parsedTokenUri.image} alt={parsedTokenUri.name} />
                {/* Add more HTML elements as needed based on your data structure */}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export { YourSlices };