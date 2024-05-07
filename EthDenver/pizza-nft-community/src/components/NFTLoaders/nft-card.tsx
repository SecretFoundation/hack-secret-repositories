import React from 'react';


const SimpleNFTComponent: React.FC<{ nft: any }> = ({ nft }) => {

    const amount = nft.attributes.find(attribute => attribute.trait_type === 'Amount')?.value || '';
    const currency = nft.attributes.find(attribute => attribute.trait_type === 'Currency')?.value.toUpperCase() || '';
    const place = nft.attributes.find(attribute => attribute.trait_type === 'Place')?.value.toUpperCase()
  

    const filtered_attr = nft.attributes.filter(attribute =>
        attribute.trait_type === 'Amount'
      );// Take the first 4 attributes

    console.log(filtered_attr, ' filtered')

    return (
      <div>
        <h4>{nft.name}</h4>
        <br></br>
        <p>{nft.description}</p>
        <br></br>
        <img src={nft.image} alt={`NFT ${nft.name}`} />
        
        <p><strong>Payment Details:</strong> {amount} ({currency})</p>
        <p><strong>Place: {place}</strong></p>
      
        <ul style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', marginTop: '10px', padding: '0' }}>
          {filtered_attr.map((attribute: any, index: number) => (
            <li key={index}>
              <strong>{attribute.trait_type}:</strong> {attribute.value}
            </li>
          ))}
        </ul>
      </div>
    );
  };

export { SimpleNFTComponent };