import axios from 'axios';
import { BigNumber } from 'bignumber.js';

async function getDepositRecords() {
  const response = await axios.get('https://stride-fleet.main.stridenet.co/api/Stride-Labs/stride/records/deposit_record');
  console.log(response.data.deposit_record)
  return response.data.deposit_record;
}

// async function getHostZoneStakedBal() {
//   const response = await axios.get('https://stride-api.polkachu.com/Stride-Labs/stride/stakeibc/host_zone');
//   return response.data.result;
// }

// async function getTotalStTokenSupply() {
//   const response = await axios.get('https://stride-rpc.polkachu.com:443/Stride-Labs/stride/stakeibc/host_zone');
//   return response.data.result;
// }

(async () => {
  const chainId = 'cosmoshub-4'; // Change this to the appropriate chain_id

  const depositRecords = await getDepositRecords();
  // const hostZoneStakedBal = await getHostZoneStakedBal();
  // const stTokenSupply = await getTotalStTokenSupply();

  const undelegatedRecordBalance = depositRecords
    .filter(record => record.host_zone_id === chainId && (record.status === 'DELEGATION_QUEUE' || record.status === 'DELEGATION_IN_PROGRESS'))
    .reduce((sum, record) => sum.plus(record.amount), new BigNumber(0));

  console.log(undelegatedRecordBalance)

  // const moduleAccountBalance = depositRecords
  //   .filter(record => record.chain_id === chainId && (record.status === 'TRANSFER_QUEUE' || record.status === 'TRANSFER_IN_PROGRESS'))
  //   .reduce((sum, record) => sum.plus(record.amount), new BigNumber(0));

  // const stakedBalance = new BigNumber(hostZoneStakedBal[chainId]);
  // const stTokenSupplyBig = new BigNumber(stTokenSupply);

  // const redemptionRate = undelegatedRecordBalance.plus(moduleAccountBalance).plus(stakedBalance).dividedBy(stTokenSupplyBig);
  // console.log(`Redemption rate for ${chainId}:`, redemptionRate.toString());
})();
