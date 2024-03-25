import React, { useState, useEffect } from "react";
import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";
import { Button, TextField, CircularProgress, Box, Typography, Container } from "@mui/material";

const UpdateFlow = () => {
  const [recipient, setRecipient] = useState("");
  const [flowRate, setFlowRate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  useEffect(() => {
    const checkWalletConnection = async () => {
      const { ethereum } = window;
      if (ethereum) {
        const accounts = await ethereum.request({ method: "eth_accounts" });
        setIsWalletConnected(accounts.length > 0);
      }
    };

    checkWalletConnection();
  }, []);

  const updateExistingFlow = async () => {
    if (!isWalletConnected) {
      alert("Please connect your MetaMask wallet.");
      return;
    }

    setIsLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const chainId = Number(await provider.getNetwork().then((network) => network.chainId));
      const sf = await Framework.create({
        chainId,
        provider: provider,
      });

      const daix = await sf.loadSuperToken("fDAIx");

      const updateFlowOperation = daix.updateFlow({
        sender: await signer.getAddress(),
        receiver: recipient,
        flowRate: flowRate,
      });

      await updateFlowOperation.exec(signer);
      alert("Flow updated successfully!");
    } catch (error) {
      console.error("Failed to update flow:", error);
      alert("Failed to update flow. See console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isWalletConnected) {
    return null; // Or a minimal component informing the user to connect their wallet
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 8 }}>
        <Typography variant="h5" gutterBottom>
          Update Money Stream
        </Typography>
        <TextField
          label="Recipient Address"
          variant="outlined"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="New Flow Rate (wei/sec)"
          variant="outlined"
          value={flowRate}
          onChange={(e) => setFlowRate(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />
        <Button
          variant="contained"
          onClick={updateExistingFlow}
          disabled={!recipient || !flowRate || isLoading}
          fullWidth
        >
          {isLoading ? <CircularProgress size={24} /> : "Update Stream"}
        </Button>
      </Box>
    </Container>
  );
};

export default UpdateFlow;
