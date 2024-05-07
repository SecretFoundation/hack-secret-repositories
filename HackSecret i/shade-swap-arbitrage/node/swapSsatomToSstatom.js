import { SecretNetworkClient, Wallet, MsgExecuteContract } from "secretjs";
import * as dotenv from "dotenv" // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

const wallet = new Wallet(process.env.MAIN_MNEMONIC);

const secretjs = new SecretNetworkClient({
  url: process.env.MAIN_SECRET_LCD_URL,
  wallet: wallet,
  walletAddress: wallet.address,
  chainId: process.env.MAIN_SECRET_CHAIN_ID,
});

async function shadeswap_swap(){
  const hookmsg = {
    swap_tokens: {
      offer: {
        token: {
          custom_token: {
            contract_addr: "secret155w9uxruypsltvqfygh5urghd5v0zc6f9g69sq",
            token_code_hash: "638a3e1d50175fbcb8373cf801565283e3eb23d88a9b7b7f99fcc5eb1e6b561e"
          }
        },
        amount: "8000"
      }
    }
  }
  let hookmsg64 = btoa(JSON.stringify(hookmsg));

  let msg = new MsgExecuteContract({
    sender: wallet.address,
    contract_address: "secret19e75l25r6sa6nhdf4lggjmgpw0vmpfvsw5cnpe",
    code_hash: "638a3e1d50175fbcb8373cf801565283e3eb23d88a9b7b7f99fcc5eb1e6b561e",
    msg: {
      send: {
        recipient: "secret1a65a9xgqrlsgdszqjtxhz069pgsh8h4a83hwt0",
        recipient_code_hash: "e88165353d5d7e7847f2c84134c3f7871b2eee684ffac9fcf8d99a4da39dc2f2",
        amount: "10000",
        msg: hookmsg64
      }
    }
  });

  let response = await secretjs.tx.broadcast([msg], {
    gasLimit: 1_000_000,
    gasPriceInFeeDenom: 0.1,
    feeDenom: "uscrt",
  });

  console.log(response)
}

shadeswap_swap().catch((error) => {
  console.error("An error occurred while swap on shadeswap:", error);
});
