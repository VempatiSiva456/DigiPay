import React, { useState, useEffect } from "react";
import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";
import { Button, TextField, Box, Typography, CircularProgress, Container } from "@mui/material";

const DeleteFlow = () => {
  const [recipient, setRecipient] = useState("");
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
      const chainId = Number(await provider.getNetwork().then((network) => network.chainId));
      const sf = await Framework.create({
        chainId,
        provider: provider,
      });

      const daix = await sf.loadSuperToken("fDAIx");

      const deleteFlowOperation = daix.deleteFlow({
        sender: await signer.getAddress(),
        receiver: recipient,
      });

      await deleteFlowOperation.exec(signer);
      alert("Flow deleted successfully!");
    } catch (error) {
      console.error("Failed to delete flow:", error);
      alert("Failed to delete flow. See console for details.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isWalletConnected) {
    return null; // Or a minimal component informing the user to connect their wallet
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4">Delete a Flow</Typography>
        <Box component="form" sx={{ mt: 3 }}>
          <TextField
            label="Recipient Address"
            variant="outlined"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button
            variant="contained"
            onClick={deleteExistingFlow}
            disabled={!recipient || isLoading}
            fullWidth
            sx={{ mt: 2 }}
          >
            {isLoading ? <CircularProgress size={24} /> : "Delete Flow"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default DeleteFlow;
