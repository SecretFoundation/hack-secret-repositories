const hre = require("hardhat");

async function main() {
  let VotingDappFactory = await hre.ethers.getContractFactory("VotingDapp");
  let votingDapp = await VotingDappFactory.deploy();

  console.log("VotingDapp deployed to: ", votingDapp.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
