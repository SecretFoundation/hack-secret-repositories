import { SecretNetworkClient, Wallet } from "secretjs";
import * as dotenv from "dotenv" // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

const wallet = new Wallet(process.env.MAIN_MNEMONIC);

const contractAddress = "secret1a65a9xgqrlsgdszqjtxhz069pgsh8h4a83hwt0"
const contractCodeHash = "e88165353d5d7e7847f2c84134c3f7871b2eee684ffac9fcf8d99a4da39dc2f2"

const secretjs = new SecretNetworkClient({
  url: process.env.MAIN_SECRET_LCD_URL,
  wallet: wallet,
  walletAddress: wallet.address,
  chainId: process.env.MAIN_SECRET_CHAIN_ID,
});

let query_token_info = async () => {
  const tokenInfoQuery = await secretjs.query.compute.queryContract({
    contract_address: contractAddress,
    query: {
      get_estimated_price: {},
    },
    code_hash: contractCodeHash,
  });

  console.log(tokenInfoQuery);
};
query_token_info();