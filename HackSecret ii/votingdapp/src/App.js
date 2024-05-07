import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import VotingDappContract from './VotingDapp.json';
import CandidateCard from './components/CandidateCard';
import ConnectWalletButton from './components/ConnectWalletButton';
import Header from './components/Header';
import electionData from './electionData.json';

import './App.css';


function App() {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [polls, setPolls] = useState([]);

  useEffect(() => {
    const initWeb3 = async () => {
      // Connect to the local Ethereum node
      if (window.ethereum) {
        try {
          await window.ethereum.enable();
          setWeb3(new Web3(window.ethereum));
        } catch (error) {
          console.error('User denied account access:', error);
        }
      } else if (window.web3) {
        setWeb3(new Web3(window.web3.currentProvider));
      } else {
        console.error('No web3 provider detected');
      }
    };

    initWeb3();
  }, []);

  useEffect(() => {
    const initContract = async () => {
      try {
        // For demonstration, assuming the contract address is already known
        const contractAddress = process.env.REACT_APP_CONTRACT_ADDRESS;

        // Create an instance of the smart contract with the address
        const instance = new web3.eth.Contract(
          VotingDappContract.abi,
          contractAddress
        );

        if (instance.options.address !== undefined) {
          console.log('Contract deployed at address:', instance.options.address);
        } else {
          console.error('Contract deployment address is undefined');
        }

        setContract(instance);
        console.log('Contract instance created:', instance);

        // Use the election data from the imported JSON
        setPolls(electionData);
        console.log('Polls loaded from JSON:', electionData);
      } catch (error) {
        console.error('Error initializing contract:', error);
        console.log('Contract address:', process.env.REACT_APP_CONTRACT_ADDRESS);
      }
    };

    if (web3) {
      initContract();
    }
  }, [web3]);

  const handleVote = async (pollId, candidateName) => {
    try {
      // For demonstration, just log the vote event
      console.log(`Vote recorded for ${candidateName} in poll ${pollId} by account ${accounts[0]}`);
    } catch (error) {
      console.error('Error voting:', error);
      console.log('Contract address:', process.env.REACT_APP_CONTRACT_ADDRESS);
    }
  };

  return (
    <div className="app-container">
      <Header /> 
      <ConnectWalletButton/>
      {polls.map((poll) => (
        <div key={poll.id}>
          <h2>{poll.title}</h2>
          <p>{poll.description}</p>
          {poll.isActive && (
          <>
            <h3>Candidates</h3>
            <div className="candidate-cards">
              {poll.candidates.map((candidate, index) => (
                <CandidateCard
                  key={`${poll.id}-${index}`}
                  name={candidate.name}
                  imageCID={candidate.imageCID}
                  partyName={candidate.partyName}
                  partySymbolCID={candidate.partySymbolCID}
                  handleVote={() => handleVote(poll.id, candidate.name)}
                />
              ))}
            </div>
          </>
        )}


        </div>
      ))}
    </div>
  );
}

export default App;
