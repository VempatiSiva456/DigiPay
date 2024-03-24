import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Button, TextField, Box, CircularProgress } from "@mui/material";

const TransactionForm = ({ contractAddress, abi, onTransactionComplete }) => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserEmail = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/current-user",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUserEmail(data.email);
      } catch (error) {
        console.error("Error fetching user email:", error);
      }
    };

    fetchUserEmail();
  }, [setUserEmail]);

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
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      console.log(contractAddress, abi, signer);
      const contract = new ethers.Contract(contractAddress, abi, signer);

      console.log(contract);

      const txResponse = await contract.sendETH(recipient, note, userEmail, {
        value: ethers.parseEther(amount),
      });
      console.log("Transaction sent. Waiting for confirmation...");
      const txReceipt = await txResponse.wait();
      console.log("Transaction confirmed:", txReceipt);

      onTransactionComplete();
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("Transaction failed: " + error.message);
    } finally {
      setIsLoading(false);
      setRecipient("");
      setAmount("");
      setNote("");
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
      <TextField
        label="Recipient Address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        required
        sx={{ margin: "5px", width: "60%" }}
      />
      <TextField
        label="Amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
        sx={{ margin: "5px", width: "60%" }}
      />
      <TextField
        label="Note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
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
        {isLoading ? <CircularProgress size={24} /> : "Send"}
      </Button>
    </Box>
  );
};

export default TransactionForm;
