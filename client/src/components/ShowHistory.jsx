import React, { useEffect, useState } from 'react';
import { ethers, JsonRpcProvider, formatEther } from 'ethers';
import abiData from '../abi.json';

// Component to show transaction history
const ShowHistory = () => {
const providerUrl = "https://polygon-mumbai.infura.io/v3/52bcd780570e4378afca6c432b67ce94";
const contractAddress = "0x18f46afb2Cb1571Ee8dBFc2b751f6604218c8e28";
const abi = abiData.abi;
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const provider = new JsonRpcProvider(providerUrl);
        const contract = new ethers.Contract(contractAddress, abi, provider);

        const events = await contract.queryFilter("*");
        const transactionsData = events.map(event => ({
          hash: event.transactionHash,
          blockNumber: event.blockNumber,
          from: event.args.from,
          to: event.args.to,
          amount: formatEther(event.args.amount),
          userEmail: event.args.userEmail,
        }));

        setTransactions(transactionsData);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [contractAddress, abi, providerUrl]);

  if (isLoading) return <p>Loading transactions...</p>;

  return (
    <div>
      <h2>Transaction History</h2>
      {transactions.length === 0 ? (
        <p>No transactions found.</p>
      ) : (
        <ul>
          {transactions.map((tx, index) => (
            <li key={index}>
              <p>Hash: {tx.hash}</p>
              <p>Block Number: {tx.blockNumber}</p>
              <p>From: {tx.from}</p>
              <p>To: {tx.to}</p>
              <p>Amount: {tx.amount} ETH</p>
              <p>Email: {tx.userEmail}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ShowHistory;
