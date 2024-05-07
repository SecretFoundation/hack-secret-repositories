const { ethers } = require("hardhat");
require("dotenv").config();

async function vote(pollId, voteOption) {
  const votingDappAddress = process.env.CONTRACT_ADDRESS; // Replace with your deployed contract's address

  const VotingDapp = await ethers.getContractFactory("VotingDapp");
  const votingDapp = await VotingDapp.attach(votingDappAddress);

  // Check if poll is active before voting
  const poll = await votingDapp.polls(pollId);
  if (!poll.isActive) {
    console.error("Poll is not active!");
    return;
  }

  // Validate vote option (e.g., "yes" or "no")
  const validOptions = ["yes", "no"];
  if (!validOptions.includes(voteOption)) {
    console.error("Invalid vote option!");
    return;
  }

  // Cast the vote
  const tx = await votingDapp.vote(pollId, voteOption);

  console.log(`Transaction hash: ${tx.hash}`);
  await tx.wait();

  console.log("Vote cast successfully!");
}

const pollId = 3; // Replace with the actual poll ID
const voteOption = "yes"; // Replace with "yes" or "no" depending on your choice

vote(pollId, voteOption);
