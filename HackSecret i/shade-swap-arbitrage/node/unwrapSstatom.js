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

async function unwrap_token(){
  let msg = new MsgExecuteContract({
    sender: wallet.address,
    contract_address: "secret155w9uxruypsltvqfygh5urghd5v0zc6f9g69sq",
    code_hash: "638a3e1d50175fbcb8373cf801565283e3eb23d88a9b7b7f99fcc5eb1e6b561e",
    msg: {
      redeem: {
        amount: "1000",
        denom: "ibc/A0E80E59956C754F1D9CB37234D13E0CF2949E7254896359F284512FA8428E18",
        padding: ""
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

unwrap_token().catch((error) => {
  console.error("An error occurred while unwrap sstATOM:", error);
});
