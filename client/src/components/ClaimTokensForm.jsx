import React, { useState } from "react";
import { ethers } from "ethers";
import { Button, TextField, Box, CircularProgress, Alert } from "@mui/material";

const ClaimTokensForm = ({ contractAddress, abi }) => {
  const [amount, setAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!window.ethereum) {
      alert("Please install MetaMask to use this feature.");
      setIsLoading(false);
      return;
    }

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const txResponse = await contract.claimTokens(ethers.utils.parseUnits(amount, 18));
      console.log("Claiming tokens. Waiting for confirmation...");
      const txReceipt = await txResponse.wait();
      console.log("Tokens claimed:", txReceipt);
      setSuccessMessage(`Successfully claimed ${amount} DigiTokens!`);
    } catch (error) {
      console.error("Claiming tokens failed:", error);
      setErrorMessage("Failed to claim tokens. " + error.message);
    } finally {
      setIsLoading(false);
      setAmount("");
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        marginTop: "1%",
      }}
    >
      {successMessage && (
        <Alert severity="success" sx={{ width: "50%", mb: 2 }}>
          {successMessage}
        </Alert>
      )}
      {errorMessage && (
        <Alert severity="error" sx={{ width: "50%", mb: 2 }}>
          {errorMessage}
        </Alert>
      )}
      <TextField
        label="Amount to Claim"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
        sx={{ margin: "5px", width: "60%" }}
      />
      <Button
        type="submit"
        variant="contained"
        sx={{
          mb: 2,
          margin: "20px",
          "&:hover": { backgroundColor: "#648dae" },
          width: "60%",
        }}
        disabled={isLoading}
      >
        {isLoading ? <CircularProgress size={24} /> : "Claim DigiTokens"}
      </Button>
    </Box>
  );
};

export default ClaimTokensForm;
