const { ethers } = require("hardhat");
require("dotenv").config();

async function query_poll(pollId) {
  const votingDappAddress = process.env.CONTRACT_ADDRESS; // Replace with your deployed contract's address

  const VotingDapp = await ethers.getContractFactory("VotingDapp");
  const votingDapp = await VotingDapp.attach(votingDappAddress);

  const poll = await votingDapp.polls(pollId);

  console.log(`Poll ID: ${poll.id}`);
  console.log(`Title: ${poll.title}`);
  console.log(`Description: ${poll.description}`);
  console.log(`Start Time: ${new Date(poll.startTime * 1000)}`); // Convert timestamp to human-readable date
  console.log(`Duration: ${poll.duration} seconds`);
  console.log(`Is Active: ${poll.isActive}`);
  console.log(`Yes Votes: ${poll.yesVotes}`);
  console.log(`No Votes: ${poll.noVotes}`);
}

const pollId = 3; // Replace with the actual ID of the poll you created

query_poll(pollId);
