import {
  getSigningStrideClientOptions,
  strideAccountParser,
  stride
} from "stridejs";
import { DirectSecp256k1HdWallet } from "@cosmjs/proto-signing";
import { assertIsDeliverTxSuccess, SigningStargateClient } from '@cosmjs/stargate'
import * as dotenv from "dotenv" // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

const wallet = await DirectSecp256k1HdWallet.fromMnemonic(process.env.MAIN_MNEMONIC, { prefix: "stride" });

const { registry, aminoTypes } = getSigningStrideClientOptions();

const client = await SigningStargateClient.connectWithSigner(
  process.env.STRIDE_RPC_URL,
  wallet,
  {
    registry,
    aminoTypes,
    accountParser: strideAccountParser,
  }
);

console.log(client)

const msgClaimFreeAmount =
  stride.claim.MessageComposer.withTypeUrl.claimFreeAmount({
    user: "stride1vgvregsm4xjftczjzwkc9dcthask0f3yuham55",
  });

console.log(msgClaimFreeAmount)

const fee = {
  amount: [
    {
      amount: "0",
      denom: "STRD",
    },
  ],
  gas: "250000",
};

const tx = await client.signAndBroadcast(
  "stride1vgvregsm4xjftczjzwkc9dcthask0f3yuham55",
  [msgClaimFreeAmount],
  fee,
  ""
);

assertIsDeliverTxSuccess(tx);
console.log(tx)