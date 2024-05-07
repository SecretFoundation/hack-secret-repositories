import axios from 'axios';

export async function getStrideChainsData() {
  const response = await axios.get('https://stride-api.polkachu.com/Stride-Labs/stride/stakeibc/host_zone');
  return response.data.host_zone;
}

export async function getRedemptionRate(chainId) {
  const chainsData = await getStrideChainsData();
  let filteredData = chainsData.filter(item => item.chain_id === chainId);

  // Check if we found an item for the given chainId
  if (filteredData.length > 0) {
    return filteredData[0].redemption_rate;
  } else {
    throw new Error(`No item found for chain_id: ${chainId}`);
  }
}
