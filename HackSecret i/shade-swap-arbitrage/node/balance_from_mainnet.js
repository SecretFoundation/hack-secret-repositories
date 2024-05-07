// ShadeSwapからATOM / stATOMのレートを参照してくる

import { SecretNetworkClient, Wallet } from "secretjs";
import * as dotenv from "dotenv" // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

const wallet = new Wallet(process.env.MAIN_MNEMONIC);

const secretjs = new SecretNetworkClient({
  url: process.env.MAIN_SECRET_LCD_URL,
  wallet: wallet,
  walletAddress: wallet.address,
  chainId: process.env.MAIN_SECRET_CHAIN_ID,
});

let query_account_balance_info = async () => {
  const {
    balance: { amount },
  } = await secretjs.query.bank.balance(
    {
      address: wallet.address,
      denom: "uscrt",
    }
  );
  console.log(amount);
};
query_account_balance_info();
