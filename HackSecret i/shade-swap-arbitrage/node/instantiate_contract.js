import { SecretNetworkClient, Wallet } from "secretjs";
import crypto from "crypto";
import * as dotenv from "dotenv" // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

const wallet = new Wallet(process.env.MNEMONIC);

const secretjs = new SecretNetworkClient({
  url: process.env.SECRET_LCD_URL,
  wallet: wallet,
  walletAddress: wallet.address,
  chainId: process.env.SECRET_CHAIN_ID,
});

const contractCodeHash = process.env.CONTRACRT_CODE_HASH

let instantiate_contract = async () => {
  const initMsg = {
    name: "Unko",
    symbol: "UNKO",
    decimals: 6,
    prng_seed: crypto.randomBytes(32).toString("base64"),
    admin: wallet.address,
    initial_balances: [
      {
        address: wallet.address,
        amount: "1000000000",
      },
    ],
  };

  let tx = await secretjs.tx.compute.instantiateContract(
    {
      code_id: 1,
      sender: wallet.address,
      code_hash: contractCodeHash,
      init_msg: initMsg,
      label: " Snip-20 Example" + Math.ceil(Math.random() * 10000),
    },
    {
      gasLimit: 800_000,
    }
  );

  //Find the contract_address in the logs
  const contractAddress = tx.arrayLog.find(
    (log) => log.type === "message" && log.key === "contract_address"
  ).value;

  console.log(contractAddress);
};

instantiate_contract().catch((error) => {
  console.error("An error occurred while instantiating the contract:", error);
});