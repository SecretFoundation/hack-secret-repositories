import { getRedemptionRate } from './getRedemptionRate.js';
import { getPairInfo } from './getPairInfo.js';


async function main() {
  const chainId = 'cosmoshub-4';
  try {
    const redemptionRate = await getRedemptionRate(chainId);
    const pairInfo = await getPairInfo();
    console.log(`stride_redemption_rate: ${redemptionRate}`);
    console.log(`shadeswap_rate:         ${pairInfo}`);

    // 購入するamountだけ指定したら、shadeswapでsATOM -> sstATOMとswapするためのmsgを用意してくれる関数
    // 指定したamountだけ(交換して得たsstATOMの量だけ)、sstATOMをunwrapして、stATOMにするmsgを用意する関数
    // 指定したamountだけ、stATOMをibc経由でstrideに送金するmsgを用意する関数
    // 指定したamountだけ、stride上でstATOMをredeemする関数

    

    
  } catch (error) {
    console.log(error.message);
  }
}

main();