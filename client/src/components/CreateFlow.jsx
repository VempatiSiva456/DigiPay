import React, { useState, useEffect } from "react";
import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";
import {
  Button,
  TextField,
  Box,
  Typography,
  Card,
  CardContent,
  Container,
  Alert,
  CircularProgress,
} from "@mui/material";

const CreateFlow = () => {
  const navigate = useNavigate();
  const [recipient, setRecipient] = useState("");
  const [flowRate, setFlowRate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);
  const [isFlowCreated, setIsFlowCreated] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [tokenName, setTokenName] = useState("");

  useEffect(() => {
    const checkIfWalletIsConnected = async () => {
      try {
        const { ethereum } = window;
        if (ethereum && ethereum.isMetaMask) {
          const accounts = await ethereum.request({ method: "eth_accounts" });
          if (accounts.length > 0) {
            setWalletConnected(true);
          } else {
            setWalletConnected(false);
          }
        }
      } catch (error) {
        console.error("Error checking if wallet is connected:", error);
      }
    };

    checkIfWalletIsConnected();
  }, []);

  const createNewFlow = async () => {
    setIsLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const chainId = Number(
        await provider.getNetwork().then((network) => network.chainId)
      );
      const sf = await Framework.create({
        chainId,
        provider: provider,
      });

      const flowRateWei = ethers.utils.parseUnits(flowRate, 18).toString();

      const daix = await sf.loadSuperToken(tokenName);
      const createFlowOperation = daix.createFlow({
        sender: await signer.getAddress(),
        receiver: recipient,
        flowRate: flowRateWei,
      });

      await createFlowOperation.exec(signer);
      setIsFlowCreated(true);
      setSuccessMessage("Flow Created Successfully!");
    } catch (error) {
      console.error("Failed to create flow:", error);
      setErrorMessage("Failed to create flow. See console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!walletConnected) {
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
              Create Money Stream
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
            <TextField
              label="Flow Rate (wei/sec)"
              variant="outlined"
              value={flowRate}
              onChange={(e) => setFlowRate(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={createNewFlow}
                disabled={!recipient || !flowRate || isLoading}
              >
                {isLoading ? <CircularProgress size={24} /> : "Create Stream"}
              </Button>
            </Box>
            {isFlowCreated && (
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
                  See the Flow Here
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

export default CreateFlow;
