import { SecretNetworkClient, Wallet, MsgSend, stringToCoins } from "secretjs";
import * as dotenv from "dotenv" // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

const wallet = new Wallet(process.env.MNEMONIC);

const myAddress = wallet.address;

const secretjs = new SecretNetworkClient({
  url: process.env.SECRET_LCD_URL,
  wallet: wallet,
  walletAddress: wallet.address,
  chainId: process.env.SECRET_CHAIN_ID,
});

// 残高の参照をする
const {
  balance: { amount },
} = await secretjs.query.bank.balance(
  {
    address: myAddress,
    denom: "uscrt",
  }
);
console.log(amount)

const bob = "secret1f0353c2rsg0708ugl7qvhrpr7w8065p0mf0sae"

// uscrtを送金する
const msg = new MsgSend({
  from_address: myAddress,
  to_address: bob,
  amount: stringToCoins("100uscrt"),
});

const tx = await secretjs.tx.broadcast([msg], {
  gasLimit: 20_000,
  gasPriceInFeeDenom: 0.1,
  feeDenom: "uscrt",
});

console.log(tx)
