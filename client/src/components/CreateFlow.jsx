import React, { useState, useEffect } from "react";
import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";
import { Button, TextField, Box, Typography } from "@mui/material";

const CreateFlow = () => {
  const [recipient, setRecipient] = useState("");
  const [flowRate, setFlowRate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [walletConnected, setWalletConnected] = useState(false);

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
      const chainId = Number(await provider.getNetwork().then((network) => network.chainId));
      const sf = await Framework.create({
        chainId,
        provider: provider,
      });

      const daix = await sf.loadSuperToken("fDAIx");

      const createFlowOperation = daix.createFlow({
        sender: await signer.getAddress(),
        receiver: recipient,
        flowRate: flowRate,
      });

      await createFlowOperation.exec(signer);
      alert("Flow created successfully!");
    } catch (error) {
      console.error("Failed to create flow:", error);
      alert("Failed to create flow. See console for details.");
    } finally {
      setIsLoading(false);
    }
  };


  if (!walletConnected) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        '& > :not(style)': { m: 1 },
      }}
    >
      <Typography variant="h6" gutterBottom>
        Create Money Stream
      </Typography>
      <TextField
        label="Recipient Address"
        variant="outlined"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        fullWidth
      />
      <TextField
        label="Flow Rate (wei/sec)"
        variant="outlined"
        value={flowRate}
        onChange={(e) => setFlowRate(e.target.value)}
        fullWidth
      />
      <Button
        variant="contained"
        onClick={createNewFlow}
        disabled={!recipient || !flowRate || isLoading}
      >
        {isLoading ? "Creating..." : "Create Stream"}
      </Button>
    </Box>
  );
};

export default CreateFlow;
