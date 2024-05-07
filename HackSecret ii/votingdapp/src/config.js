// config.js

import VotingDappAbi from './VotingDapp.json';

const config = {
  contractAddress: process.env.CONTRACT_ADDRESS,
  contractAbi: VotingDappAbi.abi,
};

export default config;
