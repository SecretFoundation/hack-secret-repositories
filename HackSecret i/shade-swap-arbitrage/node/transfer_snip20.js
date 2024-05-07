import { SecretNetworkClient, Wallet } from "secretjs";
import * as dotenv from "dotenv" // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

const wallet = new Wallet(process.env.MNEMONIC);

const contractAddress = process.env.CONTRACT_ADDRESS
const contractCodeHash = process.env.CONTRACT_CODE_HASH

const secretjs = new SecretNetworkClient({
  url: process.env.SECRET_LCD_URL,
  wallet: wallet,
  walletAddress: wallet.address,
  chainId: process.env.SECRET_CHAIN_ID,
});

let transfer_snip20 = async () => {
  let executeMsg = {
    transfer: {
      owner: wallet.address,
      amount: "1000",
      recipient: "secret1uvvl8hlvkwgj9nuwrl84wne00plyflhy8wxe9u",
    },
  };

  let tx = await secretjs.tx.compute.executeContract(
    {
      sender: wallet.address,
      contract_address: contractAddress,
      code_hash: contractCodeHash,
      msg: executeMsg,
    },
    {
      gasLimit: 400_000,
    }
  );
  console.log(tx);
};

transfer_snip20().catch((error) => {
  console.error("An error occurred while instantiating the contract:", error);
});