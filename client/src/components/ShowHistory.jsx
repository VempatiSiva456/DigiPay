import React, { useEffect, useState } from "react";
import { ethers, JsonRpcProvider, formatEther } from "ethers";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  Link,
} from "@mui/material";
import abiData from "../abi.json";

// Component to show transaction history
const ShowHistory = () => {
  const providerUrl =
    "https://polygon-mumbai.infura.io/v3/52bcd780570e4378afca6c432b67ce94";
  const contractAddress = "0x18f46afb2Cb1571Ee8dBFc2b751f6604218c8e28";
  const abi = abiData.abi;
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [balance, setBalance] = useState(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const provider = new JsonRpcProvider(providerUrl);
        const contract = new ethers.Contract(contractAddress, abi, provider);

        const events = await contract.queryFilter("*");
        const transactionsData = events.map((event) => ({
          hash: event.transactionHash,
          blockNumber: event.blockNumber,
          amount: formatEther(event.args.amount),
        }));

        setTransactions(transactionsData);

        const curr_balance = await contract.getBalance();
        setBalance(formatEther(curr_balance));
        // console.log("Remaining Balance: ", balance);

      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, [contractAddress, abi, providerUrl]);

  if (isLoading) return <p>Loading transactions...</p>;

  return (
    <div>
      <Box
        mt={3}
        sx={{
          display: "flex",
          justifyContent: "center",
          padding: "10px",
          border: "1px solid",
          borderColor: "grey.300",
          borderRadius: "4px",
          backgroundColor: "white",
          boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
          margin: "20px 0",
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          sx={{ textAlign: "center", color: "grey.800" }}
        >
          Transaction History
        </Typography>
      </Box>
      <TableContainer component={Paper}>
        <Table aria-label="transactions table">
          <TableHead>
            <TableRow>
              <TableCell>S.No</TableCell>
              <TableCell>Hash</TableCell>
              <TableCell align="right">Amount (ETH)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.length > 0 ? (
              transactions.map((tx, index) => (
                <TableRow key={index}>
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell>
                    <Link href={`https://mumbai.polygonscan.com/tx/${tx.hash}`} target="_blank" rel="noopener noreferrer">
                      {tx.hash}
                    </Link>
                  </TableCell>
                  <TableCell align="right">{tx.amount}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {transactions.length > 0 && (
        <Box mt={3} sx={{
          display: 'flex',
          justifyContent: 'center',
          padding: '10px', 
          border: '1px solid', 
          borderColor: 'grey.300',
          borderRadius: '4px', 
          backgroundColor: 'white', 
          boxShadow: '0px 2px 4px rgba(0,0,0,0.1)', 
          margin: '20px 0', 
        }}>
          <Typography variant="h5" component="h2" sx={{ textAlign: 'center', color: 'grey.800' }}>
            Total No. of Transactions: {transactions.length}
          </Typography>
        </Box>
      )}
    </div>
  );
};

export default ShowHistory;
