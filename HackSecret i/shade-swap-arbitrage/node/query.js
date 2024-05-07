import { SecretNetworkClient, Wallet } from "secretjs";
import * as dotenv from "dotenv" // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

const wallet = new Wallet(process.env.MNEMONIC);

const contractAddress = process.env.CONTRACRT_ADDRESS
const contractCodeHash = process.env.CONTRACRT_CODE_HASH

const secretjs = new SecretNetworkClient({
  url: process.env.SECRET_LCD_URL,
  wallet: wallet,
  walletAddress: wallet.address,
  chainId: process.env.SECRET_CHAIN_ID,
});

let query_token_info = async () => {
  const tokenInfoQuery = await secretjs.query.compute.queryContract({
    contract_address: contractAddress,
    query: {
      token_info: {},
    },
    code_hash: contractCodeHash,
  });

  console.log(tokenInfoQuery);
};
query_token_info();
