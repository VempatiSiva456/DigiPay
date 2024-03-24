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

const ShowHistory = ({ refreshTrigger }) => {
  const providerUrl =
    "https://polygon-mumbai.infura.io/v3/52bcd780570e4378afca6c432b67ce94";
  const contractAddress = "0xCD961BA1A211dCdF86E8AC1f2fCE6c909614fDC5";
  const abi = abiData.abi;
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [contractBalance, setContractBalance] = useState(null);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/current-user",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUserEmail(data.email);
      } catch (error) {
        console.error("Error fetching user email:", error);
      }
      finally {
        setIsLoading(false);
      }
    };

    fetchUserEmail();
  }, []);

  useEffect(() => {
    if (userEmail) {
      const fetchTransactions = async () => {
        try {
          const provider = new JsonRpcProvider(providerUrl);
          const contract = new ethers.Contract(contractAddress, abi, provider);

          const events = await contract.queryFilter("*");
          const filteredEvents = events.filter(
            (event) => event.args[4] === userEmail
          );
          const transactionsData = filteredEvents.map((event) => ({
            hash: event.transactionHash,
            blockNumber: event.blockNumber,
            sender: event.args[0],
            recipient: event.args[1],
            amount: formatEther(event.args[2]),
            note: event.args[3],
            email: event.args[4],
          }));

          setTransactions(transactionsData);
        } catch (error) {
          console.error("Error fetching transactions:", error);
        }
      };

      fetchTransactions();
    }
  }, [userEmail, contractAddress, abi, providerUrl, refreshTrigger]);
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
              <TableCell>Sender</TableCell>
              <TableCell>Recipient</TableCell>
              <TableCell>Note</TableCell>
              <TableCell align="right">Amount ($)</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {transactions.map((tx, index) => (
              <TableRow key={index}>
                <TableCell component="th" scope="row">
                  {index + 1}
                </TableCell>
                <TableCell>
                  <Link
                    href={`https://mumbai.polygonscan.com/tx/${tx.hash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {tx.hash}
                  </Link>
                </TableCell>
                <TableCell>{tx.sender}</TableCell>
                <TableCell>{tx.recipient}</TableCell>
                <TableCell>{tx.note}</TableCell>
                <TableCell align="right">{tx.amount}</TableCell>
              </TableRow>
            ))}
            {transactions.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {transactions.length > 0 && (
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
            Total No. of Transactions: {transactions.length}
          </Typography>
        </Box>
      )}
    </div>
  );
};

export default ShowHistory;
