import React, {useState, useEffect} from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Container,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../contexts/AuthContext";
import ConnectWallet from "./ConnectWallet";
import TransactionForm from "./TransactionForm";
import abiData from "../abi.json";

const Dashboard = () => {
  const { logout } = useAuth();

  const contractAddress = "0x919108f9Ce5F63F3e2B1718204A820a7D8e467Bd";
  const [abi, setAbi] = useState([]);

  useEffect(() => {
    const fetchAbi = async () => {
      try {
        const abi = abiData.abi;
        setAbi(abi);
      } catch (error) {
        console.error("Error fetching ABI:", error);
      }
    };

    fetchAbi();
  }, []);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <IconButton color="inherit" onClick={logout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <Typography variant="body1" gutterBottom></Typography>
          <ConnectWallet />
        </Box>
        <Box>
          <Box mt={3}>
            <Typography variant="h5" gutterBottom>
              Transaction Form
            </Typography>
            <TransactionForm contractAddress={contractAddress} abi={abi} />
          </Box>
        </Box>
      </Container>
    </>
  );
};

export default Dashboard;
