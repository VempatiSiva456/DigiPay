import React, { useState, useEffect, useInsertionEffect } from "react";
import { ethers } from "ethers";
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
import digiTokenAbiData from "../digi-token-abi.json";

const contractAddress = "0x4BCde7A407AC377E89991fFc31818350feD47Ae1";
const digitokensContractAddress = "0xaC6292A3235985FcA638A9658823af5abccaC28A";

const isMetaMaskInstalled = typeof window.ethereum !== "undefined";

const ConnectWallet = ({ onStatusChange, refreshTrigger }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [digiTokenBalance, setDigiTokenBalance] = useState("");
  const [metamask, setMetamask] = useState(false);
  const [digitoken_abi, setDigiTokenAbi] = useState([]);

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
            await getDigiTokenBalance(accounts[0]);
            onStatusChange(true);
          } else {
            setCurrentAccount("");
            setDigiTokenBalance("");
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

    if (isMetaMaskInstalled) {
  
        const fetchDigiTokenAbi = async () => {
          try {
            const digi_abi = digiTokenAbiData.abi;
            setDigiTokenAbi(digi_abi);
          } catch (error) {
            console.error("Error fetching ABI:", error);
          }
        };
  
        fetchDigiTokenAbi();
      }
  
  }, [onStatusChange, setDigiTokenAbi]);

  const getDigiTokenBalance = async (account) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const digiTokenContract = new ethers.Contract(digitokensContractAddress, digitoken_abi, provider);
    const balance = await digiTokenContract.balanceOf(account);
    setDigiTokenBalance(ethers.utils.formatUnits(balance, 18));
  };

  useEffect(() => {
    if (window.ethereum) {
      setMetamask(true);
      window.ethereum.on("accountsChanged", async (accounts) => {
        if (accounts.length > 0) {
          setCurrentAccount(accounts[0]);
          await getDigiTokenBalance(accounts[0]);
          onStatusChange(true);
        } else {
          setCurrentAccount("");
          setDigiTokenBalance("");
          onStatusChange(false);
        }
      });
    } else {
      setMetamask(false);
    }
  }, [onStatusChange]);

  useEffect(() => {
    if (currentAccount) {
      getDigiTokenBalance(currentAccount);
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
          await getDigiTokenBalance(accounts[0]);
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
                <TableCell align="right">{digiTokenBalance} DIGI</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default ConnectWallet;
