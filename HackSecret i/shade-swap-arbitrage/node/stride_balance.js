import { stride } from "stridejs";
import * as dotenv from "dotenv" // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config()

const client = await stride.ClientFactory.createRPCQueryClient({
  rpcEndpoint: process.env.STRIDE_RPC_URL,
});

const balance = await client.cosmos.bank.v1beta1.allBalances({
  address: "stride1vgvregsm4xjftczjzwkc9dcthask0f3yuham55",
});

console.log(balance);