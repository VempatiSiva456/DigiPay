import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Button, Box, Typography, Table, TableBody, TableCell, TableContainer, TableRow, Paper } from "@mui/material";

const ConnectWallet = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [currentBalance, setCurrentBalance] = useState("");

  const checkIfWalletIsConnected = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_accounts" });
        if (accounts.length > 0) {
          setCurrentAccount(accounts[0]);
          await getBalance(accounts[0]);
        } else {
          setCurrentAccount("");
          setCurrentBalance("");
        }
      } catch (error) {
        console.error("Error checking for connected account:", error);
      }
    } else {
      alert("MetaMask is not installed. Please consider installing it: https://metamask.io/download.html");
    }
  };

  const getBalance = async (account) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const balance = await provider.getBalance(account);
    setCurrentBalance(ethers.utils.formatEther(balance));
  };

  useEffect(() => {
    checkIfWalletIsConnected();
    window.ethereum.on('accountsChanged', (accounts) => {
      if (accounts.length > 0) {
        setCurrentAccount(accounts[0]);
        getBalance(accounts[0]);
      } else {
        setCurrentAccount("");
        setCurrentBalance("");
      }
    });
  }, []);

  const connectWalletHandler = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        if (accounts.length) {
          setCurrentAccount(accounts[0]);
          await getBalance(accounts[0]);
        }
      } catch (error) {
        console.error("Error connecting to MetaMask", error);
      }
    } else {
      alert("MetaMask is not installed. Please consider installing it: https://metamask.io/download.html");
    }
  };

  return (
    <Box sx={{ mt: 3, width: '100%' }}>
      {!currentAccount ? (
        <Button variant="contained" onClick={connectWalletHandler} sx={{ mb: 2 }}>
          Connect Wallet
        </Button>
      ) : (
        <TableContainer component={Paper} sx={{ maxWidth: 650, margin: 'auto', mt: 2 }}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableBody>
              <TableRow
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  Connected Account:
                </TableCell>
                <TableCell align="right">{currentAccount}</TableCell>
              </TableRow>
              <TableRow
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  Balance:
                </TableCell>
                <TableCell align="right">{currentBalance} ETH</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ConnectWallet;