import React, { useState, useEffect, useInsertionEffect } from "react";
import { ethers, formatUnits } from "ethers";
import {
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
} from "@mui/material";

const ConnectWallet = ({ onStatusChange, refreshTrigger }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [currentBalance, setCurrentBalance] = useState("");
  const [metamask, setMetamask] = useState(false);

  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      if (window.ethereum) {
        try {
          setMetamask(true);
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          if (accounts.length > 0) {
            setCurrentAccount(accounts[0]);
            await getBalance(accounts[0]);
            onStatusChange(true);
          } else {
            setCurrentAccount("");
            setCurrentBalance("");
            onStatusChange(false);
          }
        } catch (error) {
          console.error("Error checking for connected account:", error);
        }
      } else {
        setMetamask(false);
        alert(
          "MetaMask is not installed. Please consider installing it: https://metamask.io/download.html"
        );
      }
    };

    checkIfWalletIsConnected();
  }, [onStatusChange]);

  const getBalance = async (account) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const balance = await provider.getBalance(account);
    setCurrentBalance(formatUnits(balance));
  };

  useEffect(() => {
    if (window.ethereum) {
      setMetamask(true);
      window.ethereum.on("accountsChanged", async (accounts) => {
        if (accounts.length > 0) {
          setCurrentAccount(accounts[0]);
          await getBalance(accounts[0]);
          onStatusChange(true);
        } else {
          setCurrentAccount("");
          setCurrentBalance("");
          onStatusChange(false);
        }
      });
    } else {
      setMetamask(false);
    }
  }, [onStatusChange]);

  useEffect(() => {
    if (currentAccount) {
      getBalance(currentAccount);
    }
  }, [refreshTrigger, currentAccount]);

  const connectWalletHandler = async () => {
    if (window.ethereum) {
      try {
        setMetamask(true);
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        if (accounts.length) {
          setCurrentAccount(accounts[0]);
          await getBalance(accounts[0]);
          onStatusChange(true);
        }
      } catch (error) {
        console.error("Error connecting to MetaMask", error);
      }
    } else {
      setMetamask(false);
      alert(
        "MetaMask is not installed. Please consider installing it: https://metamask.io/download.html"
      );
    }
  };

  return (
    <Box
      sx={{
        mt: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      {!currentAccount ? (
        <Button
          variant="contained"
          onClick={connectWalletHandler}
          sx={{ mb: 2 }}
        >
          Connect Wallet
        </Button>
      ) : (
        <TableContainer
          component={Paper}
          sx={{ maxWidth: 650, margin: "auto", mt: 2 }}
        >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableBody>
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  Connected Account:
                </TableCell>
                <TableCell align="right">{currentAccount}</TableCell>
              </TableRow>
              <TableRow
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  Balance:
                </TableCell>
                <TableCell align="right">$ {currentBalance}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ConnectWallet;
