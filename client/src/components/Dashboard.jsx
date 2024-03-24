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
import ShowHistory from "./ShowHistory";
import Footer from "./Footer";

const Dashboard = () => {
  const { logout } = useAuth();

  const [walletConnected, setWalletConnected] = useState(false);

  const handleWalletStatusChange = (isConnected) => {
    setWalletConnected(isConnected);
  };

  const contractAddress = "0x919108f9Ce5F63F3e2B1718204A820a7D8e467Bd";
  const [userName, setUserName] = useState("");
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

    const fetchUserName = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/user-name', {
          method: 'GET',
          credentials: "include"
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        setUserName(data.name);
      } catch (error) {
        console.error("Error fetching user name:", error);
      }
    };

    fetchUserName();
  }, [setAbi, setUserName]);


  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          {userName ? `${userName}'s Dashboard` : 'Dashboard'}
          </Typography>
          <IconButton color="inherit" onClick={logout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <Box sx={{ my: 4, alignItems: 'center' }}>
          <Typography variant="body1" gutterBottom></Typography>
          <ConnectWallet onStatusChange={handleWalletStatusChange} />
        </Box>
        {walletConnected && (
        <Box>
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
                Transaction Form
              </Typography>
            </Box>
            <TransactionForm />
        </Box>
        )}
        <Box>
          <Box mt={3}>
            <ShowHistory/>
          </Box>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

export default Dashboard;
