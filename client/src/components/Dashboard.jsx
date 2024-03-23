import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Container } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import { useAuth } from '../contexts/AuthContext';
import ConnectWallet from './ConnectWallet';

const Dashboard = () => {
  const { logout } = useAuth();

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
          <Typography variant="body1" gutterBottom>
          </Typography>
          <ConnectWallet />
        </Box>
      </Container>
    </>
  );
};

export default Dashboard;
