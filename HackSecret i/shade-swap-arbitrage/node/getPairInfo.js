import { SecretNetworkClient} from "secretjs";
import * as dotenv from "dotenv"
dotenv.config()

const url = "https://secret-api.lavenderfive.com:443";

const secretjs = new SecretNetworkClient({
  url,
  chainId: "secret-4",
});

export async function getPairInfo() {
  const contractAddress = "secret1a65a9xgqrlsgdszqjtxhz069pgsh8h4a83hwt0";
  const contractHash = "0xe88165353d5d7e7847f2c84134c3f7871b2eee684ffac9fcf8d99a4da39dc2f2"

  const pairInfo = await secretjs.query.compute.queryContract({
    contract_address: contractAddress,
    code_hash: contractHash,
    query: { get_pair_info: {} },
  })

  console.log(pairInfo.get_pair_info)
  console.log(pairInfo.get_pair_info.pair)
  return pairInfo.get_pair_info.stable_info.p
}



