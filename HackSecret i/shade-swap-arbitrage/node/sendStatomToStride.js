import { Wallet, SecretNetworkClient } from "secretjs";
import * as dotenv from "dotenv" // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

const wallet = new Wallet(process.env.MAIN_MNEMONIC);

const secretjs = new SecretNetworkClient({
  url: process.env.MAIN_SECRET_LCD_URL,
  wallet: wallet,
  walletAddress: wallet.address,
  chainId: process.env.MAIN_SECRET_CHAIN_ID,
});

const tx = await secretjs.tx.ibc.transfer(
  {
    sender: wallet.address,
    receiver: "stride1vgvregsm4xjftczjzwkc9dcthask0f3yuham55",
    source_channel: "channel-37",
    source_port: "transfer",
    token: {
      amount: "1000",
      denom: "ibc/A0E80E59956C754F1D9CB37234D13E0CF2949E7254896359F284512FA8428E18"
    },
    timeout_timestamp: String(Math.floor(Date.now() / 1000) + 10 * 60), // 10 minutes
  },
  {
    gasLimit: 100_000,
    ibcTxsOptions: {
      resolveResponses: true, // enable IBC responses resolution (defualt)
      resolveResponsesTimeoutMs: 12 * 60 * 1000, // stop checking after 12 minutes (default is 2 minutes)
      resolveResponsesCheckIntervalMs: 15_000, // check every 15 seconds (default)
    },
  },
);

if (tx.code !== 0) {
  console.log(tx);
  console.error("failed sending 0.01stATOM from Secret to Stride:", tx.rawLog);
} else {
  try {
    const ibcResp = await tx.ibcResponses[0];
    if (ibcResp.type === "ack") {
      console.log("successfuly sent 0.01stATOM from Secret to Stride!");
    } else {
      console.error(
        "failed sending0.01stATOM from Secret to Stride: IBC packet timed-out before committed on Stride",
      );
    }
  } catch (_error) {
    console.error(
      `timed-out while trying to resolve IBC response for txhash ${tx.transactionHash}`,
    );
  }
}