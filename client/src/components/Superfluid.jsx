import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Box,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Card,
  CardContent,
  Alert,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { useAuth } from "../contexts/AuthContext";

const apiUrl = import.meta.env.VITE_API_URL || "/api";

const Superfluid = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  useEffect(() => {
    const { ethereum } = window;
    if (ethereum) {
      ethereum.request({ method: "eth_accounts" }).then((accounts) => {
        setIsWalletConnected(accounts.length > 0);
        const fetchUserName = async () => {
          try {
            const response = await fetch("/api/auth/current-user", {
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
      });
    }
  }, [setUserName]);

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
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Card
          sx={{
            width: "fit-content",
            p: 2,
            mb: 2,
            backgroundColor: "#ffffff",
            border: "1px solid #1976d2",
            borderRadius: "4px",
          }}
        >
          <Typography variant="h4" color="primary" sx={{ fontWeight: "bold" }}>
            Superfluid Actions
          </Typography>
        </Card>
        {isWalletConnected ? (
          <>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/superfluid/createflow")}
              sx={{ width: "200px" }}
            >
              Create Flow
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/superfluid/updateflow")}
              sx={{ width: "200px" }}
            >
              Update Flow
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/superfluid/deleteflow")}
              sx={{ width: "200px" }}
            >
              Delete Flow
            </Button>
          </>
        ) : (
          <Typography variant="body1" sx={{ mb: 4 }}>
            Please connect your wallet to proceed.
          </Typography>
        )}
        <Button
          variant="outlined"
          onClick={() => navigate("/dashboard")}
          sx={{ width: "200px" }}
        >
          Back to Dashboard
        </Button>
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <b>Note to Users:</b> For streaming transactions in Superfluid,
            ensure you use Super Tokens, typically ending with 'x' (e.g.,
            fDAIx). These tokens are "wrapped" versions of regular tokens,
            designed for fluid, continuous transactions. To convert regular
            tokens into Super Tokens or vice versa, visit{" "}
            <a
              href="https://app.superfluid.finance/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Superfluid App
            </a>
            , where you can easily wrap and unwrap tokens for use in streams.
            Always confirm you're interacting with the correct token for
            seamless transactions.
          </Typography>
        </Alert>
      </Box>
    </>
  );
};

export default Superfluid;
