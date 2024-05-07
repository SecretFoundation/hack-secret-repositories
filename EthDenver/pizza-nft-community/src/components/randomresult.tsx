import React, { useState } from 'react';
import { useWriteContract,useReadContract } from 'wagmi';
import { RandomnessReceiver_ABI } from '../abi/objects';
import { pizzaPlaces } from '@/data/project-summary';
import { parseEther } from 'viem';
import { projectInfo } from '@/data/project-summary';


import { watchContractEvent } from '@wagmi/core'
//import {config} from '../pages/_app'


function RandomPizzaPlaceComponent() {
  const { writeContract } = useWriteContract();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [randomData, setRandomData] = useState(0);
  const [chosenRestaurant, setChosenRestaurant] = useState('');

  // const result=  useReadContract({
  //   abi:RandomnessReceiver_ABI,
  //   address: '0xc5642Fcf15D5915054F1679F366c861052720ca2',
  // functionName: 'getRandomNumber',
  // })

  // console.log(result, ' here')
 
  const getRandomNumber = async () => {}
    // setIsLoading(true);}
//     try {
// //et your desired gas price (in wei)
//       const transaction = writeContract({
//         address: '0xc5642Fcf15D5915054F1679F366c861052720ca2',
//         abi: RandomnessReceiver_ABI,
//         functionName: 'requestRandomnessTestPreset',
//         args: [],
//         value: parseEther('.002') // Equivalent to 0.002 ETH
//       });

      // const randomResult = useReadContract({
      //   abi:RandomnessReceiver_ABI,
      //   address: '0xc5642Fcf15D5915054F1679F366c861052720ca2',
      // functionName: 'getRandomNumber',
      // })
  //     setRandomData(Math.floor(Math.random() * 6) + 1);
  //     setIsLoading(false);
  //   } catch (error) {
  //     setError(error);
  //     setIsLoading(false);
  //   }
  // };
  const handleButtonClick = () => {
    // Check if data has been fetched successfully
    // if (!randomData) {
    //   console.log('returned')
    //   return; // Prevent action if data not available
    // }
    // Ensure index stays within dictionary range
    const rn = Math.floor(Math.random() * 6) + 1
    console.log(rn)
    const selectedRestaurant = pizzaPlaces[rn]; 
    console.log(selectedRestaurant)// Adjust for 1-based indexing
    // Set the chosen restaurant in the state
    setChosenRestaurant(selectedRestaurant);
    // Optional: Perform further actions with the selected restaurant (e.g., display on screen)
  };
  return (
    <div>
      {isLoading ? (
        <p>Choosing a pizza place for you...</p>
      ) : error ? (
        <p>Error fetching randomness: {error.message}</p>
      ) : (
        <>
          <button onClick={handleButtonClick}>Click me to find a new pizza place to eat at!</button>
          <br></br><br></br>
          {/* <button onClick={handleButtonClick} disabled={!randomData}>
            Let's eat!
          </button> */}
          {chosenRestaurant && <p>Let's eat at {chosenRestaurant}</p>}
        </>
      )}
    </div>
  );
      }

export { RandomPizzaPlaceComponent };
