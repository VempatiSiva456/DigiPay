import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Container,
  Button,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../contexts/AuthContext";
import ConnectWallet from "./ConnectWallet";
import TransactionForm from "./TransactionForm";
import abiData from "../abi.json";
import ShowHistory from "./ShowHistory";
import Footer from "./Footer";
const apiUrl = process.env.REACT_APP_API_URL || '/api';

const Dashboard = () => {
  const { logout } = useAuth();

  const [walletConnected, setWalletConnected] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  const handleWalletStatusChange = (isConnected) => {
    setWalletConnected(isConnected);
  };

  const handleTransactionComplete = () => {
    setRefreshTrigger((prev) => !prev);
  };

  const isMetaMaskInstalled = typeof window.ethereum !== "undefined";

  const contractAddress = "0xCD961BA1A211dCdF86E8AC1f2fCE6c909614fDC5";
  const [userName, setUserName] = useState("");
  const [abi, setAbi] = useState([]);

  useEffect(() => {
    if (isMetaMaskInstalled) {
      const fetchAbi = async () => {
        try {
          const abi = abiData.abi;
          setAbi(abi);
        } catch (error) {
          console.error("Error fetching ABI:", error);
        }
      };

      fetchAbi();

      const fetchUserName = async () => {
        try {
          const response = await fetch(
            apiUrl+"/auth/current-user",
            {
              method: "GET",
              credentials: "include",
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }

          const data = await response.json();
          setUserName(data.name);
        } catch (error) {
          console.error("Error fetching user name:", error);
        }
      };

      fetchUserName();
    }
  }, [setAbi, setUserName]);

  if (!isMetaMaskInstalled) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        sx={{
          backgroundColor: "background.default",
          p: 3,
        }}
      >
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{
            mb: 4,
            color: "text.primary",
            maxWidth: "600px",
          }}
        >
          Install Metamask to Proceed!
        </Typography>
        <Button
          variant="contained"
          color="primary"
          href="https://metamask.io/download.html"
          target="_blank"
          sx={{
            px: 5,
            py: 1,
          }}
        >
          Install MetaMask
        </Button>
      </Box>
    );
  }
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {userName ? `${userName}'s Dashboard` : "Dashboard"}
          </Typography>
          <IconButton color="inherit" onClick={logout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <Box sx={{ my: 4, alignItems: "center" }}>
          <Typography variant="body1" gutterBottom></Typography>
          <ConnectWallet
            onStatusChange={handleWalletStatusChange}
            refreshTrigger={refreshTrigger}
          />
        </Box>
        {walletConnected && (
          <Box>
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
                Transaction Form
              </Typography>
            </Box>
            <TransactionForm
              contractAddress={contractAddress}
              abi={abi}
              onTransactionComplete={handleTransactionComplete}
            />
          </Box>
        )}
        <Box>
          <Box mt={3}>
            <ShowHistory refreshTrigger={refreshTrigger} />
          </Box>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default Dashboard;
