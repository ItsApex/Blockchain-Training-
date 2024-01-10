'use client'

import { useAccount, useConnect, useDisconnect, useReadContract } from 'wagmi'
import { abi } from './constants'
import { useState, useEffect } from 'react'
import {config} from '../wagmi';
import { writeContract } from 'wagmi/actions';
import { formatEther, parseEther } from 'viem';

function App() {
  const account = useAccount()
  const { connectors, connect, status, error } = useConnect()
  const { disconnect } = useDisconnect()
  const [numberofplayer , setnumberofplayer] = useState("");
  const [enterfee ,setEnterFee] = useState("");

  const result =  useReadContract({
    abi,
    address: '0xCcdF944Ba59E055E2e6bFA9BEE8fD699521e37E5',
    functionName: 'getNumofPlayer',
    args: []
  })

  
  

  const entrenceFee =  useReadContract({
    abi,
    address: '0xCcdF944Ba59E055E2e6bFA9BEE8fD699521e37E5',
    functionName: 'getEntranceFee',
    args: []
  })

  const EnterRaffle = async () => {
    const writeContractContract = await writeContract(config, {
      abi,
      address: '0xCcdF944Ba59E055E2e6bFA9BEE8fD699521e37E5',
      functionName: 'enterRaffle',
      args: [],
      value: parseEther(enterfee)
    });
    console.log("The result:", writeContractContract);
  };


  useEffect(() => { 


    console.log("Status:", status);
    if(account.status === 'connected'){

      const resultClone = JSON.parse(JSON.stringify(result, (_, value) =>
        typeof value === 'bigint' ? value.toString() : value
      ));
      
      console.log("The result:", resultClone.data);
      setnumberofplayer(resultClone.data);
  
      console.log("The Enterance Fee:", entrenceFee);  
      if(entrenceFee.data === undefined){

      }else{

        console.log("Ether :", formatEther(entrenceFee.data as bigint));  
        setEnterFee(formatEther(entrenceFee.data as bigint));
      }
    }
    // console.log("The result:", writeContractContract);

  }, [result ]);
  


  

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 min-h-screen font-sans flex items-center justify-center">
      <div className="bg-black bg-opacity-50 backdrop-filter backdrop-blur-lg p-10 rounded-md shadow-lg">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-white">Sepolia Lottery</h1>
          <div>
            {account.status === 'connected' && (
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-300 ease-in-out transform hover:scale-105"
                onClick={() => disconnect()}
              >
                Disconnect
              </button>
            )}
          </div>
        </header>
  
        <main className="flex flex-col items-center">
          <div className="bg-black bg-opacity-50 backdrop-filter backdrop-blur-lg p-6 rounded-md mb-8">
            <p className="text-gray-200 mb-2">Status: {account.status}</p>
            <p className="text-gray-200 mb-2">Number of players: {numberofplayer}</p>
            <p className="text-gray-200 mb-2">Entrance fee: {enterfee}</p>
          </div>
  
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 shadow-lg"
            onClick={EnterRaffle}
          >
            Enter Raffle
          </button>
  
          <div className="mt-8">
            <h2 className="text-2xl font-semibold text-white mb-4">Connect</h2>
            <div className="flex space-x-4">
              {connectors.map((connector) => (
                <button
                  key={connector.uid}
                  onClick={() => connect({ connector })}
                  className="bg-white bg-opacity-25 backdrop-filter backdrop-blur-lg text-white px-6 py-3 rounded-full transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 shadow-lg"
                  type="button"
                >
                  {connector.name}
                </button>
              ))}
            </div>
            <div className="text-gray-200 text-center bg-gray-900 bg-opacity-75 rounded-lg p-2 my-3">
      {status}
    </div>
    {error && (
      <div className="text-red-500 text-center bg-gray-900 bg-opacity-75 rounded-lg p-2">
        {error.message}
      </div>
    )}
          </div>
        </main>
        
      </div>
    </div>
  );
  
  
}

export default App
