import { useReadContract,useWriteContract } from 'wagmi';
import { RandomnessReceiver_ABI } from '../../abi/objects';

function useRandomizer() {
  const result = useWriteContract({
    address: '0x1d709a7C76a8af1eCbd1Bbe9388fBa366610F311',
    abi: RandomnessReceiver_ABI,
    functionName: 'requestRandomnessTestPreset',
    args:[]
  });

  return result;
}

export { useRandomizer };