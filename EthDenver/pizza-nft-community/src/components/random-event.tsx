import React, { useEffect } from 'react';
import { useWatchContractEvent } from 'wagmi';
import { RandomnessReceiver_ABI } from '../abi/objects';

const EventComponent = () => {

  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const unwatch = useWatchContractEvent({
      address: '0x6b175474e89094c44da98b954eedeac495271d0f',
      abi: RandomnessReceiver_ABI,
      eventName: 'RandomNumberGenerated',
      onLogs(logs) {
        console.log('New logs!', logs);
        setLogs((prevLogs) => [...prevLogs, ...newLogs]);
        // Handle the logs and update pizzaPlaceValue accordingly
      },
    });
    // Cleanup function, unsubscribe when the component is unmounted
  }, []); // Add dependencies if relevant

  return (
<div>
      {logs.length > 0 && (
        <div>
          <h2>Event Logs:</h2>
          <ul>
            {logs.map((log, index) => (
              <li key={index}>{JSON.stringify(log)}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Other components or JSX here */}
    </div>
  );
};

export default EventComponent;
