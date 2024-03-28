import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Container,
  Button,
  Alert,
  Card,
  CardContent,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../contexts/AuthContext";
import ConnectWallet from "./ConnectWallet";
import TransactionForm from "./TransactionForm";
import abiData from "../abi.json";
import digiTokenAbiData from "../digi-token-abi.json";
import ShowHistory from "./ShowHistory";
import Footer from "./Footer";
import ClaimTokensForm from "./ClaimTokensForm";
const apiUrl = import.meta.env.VITE_API_URL || "/api";

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

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
  const digitokensContractAddress = "0xcA9C753D4d4968167D12d9f8cf39fcF53271202C";
  const [userName, setUserName] = useState("");
  const [abi, setAbi] = useState([]);
  const [digitoken_abi, setDigiTokenAbi] = useState([]);

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

      const fetchDigiTokenAbi = async () => {
        try {
          const digi_abi = digiTokenAbiData.abi;
          setDigiTokenAbi(digi_abi);
        } catch (error) {
          console.error("Error fetching ABI:", error);
        }
      };

      fetchDigiTokenAbi();

      const fetchUserName = async () => {
        try {
          const response = await fetch(apiUrl+"/api/auth/current-user", {
            method: "GET",
            credentials: "include",
          });

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
  }, [setAbi, setDigiTokenAbi, setUserName]);

  if (!isMetaMaskInstalled) {
    return (
      <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {userName ? `${userName}'s Dashboard` : "Dashboard"}
          </Typography>
          <IconButton color="inherit" onClick={logout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
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
      </>
    );
  }
  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            {userName ? `${userName}'s Dashboard` : "Dashboard"}
          </Typography>
          <IconButton color="inherit" onClick={logout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <Box sx={{ my: 4, textAlign: "center" }}>
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <b>Note to Users:</b> The DigiPay application operates on the
              Polygon Mumbai test network, requiring MATIC tokens for
              transactions. Ensure your wallet is connected to the Mumbai
              network and has enough MATIC to cover transaction fees. If not,
              you can get free Tokens from{" "}
              <Button
                href="https://faucet.polygon.technology/"
                target="_blank"
                color="primary"
              >
                Polygon Faucet
              </Button>{" "}
              and select network as Polygon PoS (Mumbai).

              To import DIGI Tokens in your wallet, use this contract address: <b>0xcA9C753D4d4968167D12d9f8cf39fcF53271202C</b>
             <br></br> <u> A user can get only 100 tokens per week, and his account should have less than 100 Digi to claim more </u>
            </Typography>
          </Alert>
          <ConnectWallet
            onStatusChange={setWalletConnected}
            refreshTrigger={refreshTrigger}
          />
        </Box>
        {walletConnected && (
          <>
            <TransactionForm
              contractAddress={contractAddress}
              abi={abi}
              onTransactionComplete={handleTransactionComplete}
            />
            <ClaimTokensForm
              contractAddress={digitokensContractAddress}
              abi={digitoken_abi}
            />
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                my: 2,
              }}
            >
              <Card variant="outlined" sx={{ minWidth: 275 }}>
                <CardContent
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/superfluid")}
                    sx={{ mt: 1, mb: 1 }}
                  >
                    Pay with Superfluid
                  </Button>
                </CardContent>
              </Card>
            </Box>
          </>
        )}
        <ShowHistory refreshTrigger={refreshTrigger} />
      </Container>
      <Footer />
    </>
  );
};

export default Dashboard;
