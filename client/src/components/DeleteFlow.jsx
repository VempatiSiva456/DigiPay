import React, { useState, useEffect } from "react";
import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  CircularProgress,
  Box,
  Typography,
  Card,
  CardContent,
  Container,
  Alert,
} from "@mui/material";

const DeleteFlow = () => {
  const navigate = useNavigate();

  const [recipient, setRecipient] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [isFlowDeleted, setIsFlowDeleted] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [tokenName, setTokenName] = useState("");

  useEffect(() => {
    const checkWalletConnection = async () => {
      const { ethereum } = window;
      if (ethereum) {
        const accounts = await ethereum.request({ method: "eth_accounts" });
        setIsWalletConnected(accounts.length > 0);
      }
    };

    checkWalletConnection();
    const handleAccountsChanged = (accounts) => {
      setIsWalletConnected(accounts.length > 0);
    };

    window.ethereum?.on("accountsChanged", handleAccountsChanged);

    return () =>
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged);
  }, []);

  const deleteExistingFlow = async () => {
    if (!isWalletConnected) {
      alert("Please connect your MetaMask wallet.");
      return;
    }

    setIsLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const chainId = Number(
        await provider.getNetwork().then((network) => network.chainId)
      );
      const sf = await Framework.create({ chainId, provider: provider });
      const daix = await sf.loadSuperToken(tokenName);

      const deleteFlowOperation = daix.deleteFlow({
        sender: await signer.getAddress(),
        receiver: recipient,
      });

      await deleteFlowOperation.exec(signer);
      setSuccessMessage("Flow deleted successfully!");
      setIsFlowDeleted(true);
    } catch (error) {
      console.error("Failed to delete flow:", error);
      setErrorMessage("Failed to delete flow. See console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isWalletConnected) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "background.default",
          p: 3,
        }}
      >
        <Typography
          variant="h6"
          align="center"
          gutterBottom
          sx={{
            mb: 4,
            color: "text.primary",
          }}
        >
          Please Connect to Metamask Wallet
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/dashboard")}
          sx={{
            mt: 2,
            px: 5,
            py: 1,
          }}
        >
          Back to Dashboard
        </Button>
      </Box>
    );
  }

  return (
    <Container>
      <Box
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Card sx={{ minWidth: 275, boxShadow: 3 }}>
          <CardContent>
            <Typography
              variant="h5"
              color="primary"
              gutterBottom
              sx={{ fontWeight: "medium" }}
            >
              Delete Money Stream
            </Typography>
            {successMessage && (
              <Alert severity="success" sx={{ width: "100%", mb: 2 }}>
                {successMessage}
              </Alert>
            )}
            {errorMessage && (
              <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
                {errorMessage}
              </Alert>
            )}
            <TextField
              label="Token Name"
              variant="outlined"
              placeholder="e.g., fDAIx"
              value={tokenName}
              onChange={(e) => setTokenName(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <TextField
              label="Recipient Address"
              variant="outlined"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={deleteExistingFlow}
                disabled={!recipient || isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : "Delete Stream"}
              </Button>
            </Box>
            {isFlowDeleted && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  onClick={() =>
                    window.open(
                      `https://console.superfluid.finance/mumbai/accounts/${recipient}?tab=tokens`,
                      "_blank"
                    )
                  }
                  sx={{ mt: 1 }}
                >
                  Check Here
                </Button>
              </Box>
            )}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate("/superfluid")}
                sx={{ mt: 2 }}
              >
                Back
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default DeleteFlow;
