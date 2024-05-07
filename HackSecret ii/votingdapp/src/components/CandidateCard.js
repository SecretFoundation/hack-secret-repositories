// CandidateCard.js
import React from 'react';

const CandidateCard = ({ name, imageCID, partyName, partySymbolCID, handleVote }) => {
  return (
    <div className="candidate-card">
      <img src={`http://ipfs.io/ipfs/${imageCID}`} alt={name} />
      <h3>{name}</h3>
      <p>Party Name: {partyName}</p>
      <p>Party Symbol: {partySymbolCID}</p>
      <button onClick={handleVote}>Vote</button>
    </div>
  );
}

export default CandidateCard;
