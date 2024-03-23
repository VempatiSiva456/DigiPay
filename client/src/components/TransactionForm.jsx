import React, { useState } from "react";
import { Button, TextField, Box } from "@mui/material";

const TransactionForm = () => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const sendTransactionToServer = async (recipient, amount, note) => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/send-transaction", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ recipient, amount, note }),
      });
  
      if (!response.ok) {
        throw new Error("Failed to send transaction to server");
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error sending transaction to server:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendTransactionToServer(recipient, amount, note );
      setRecipient("");
      setAmount("");
      setNote("");
    } catch (error) {
      console.error("Error sending transaction:", error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        label="Recipient Address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        required
      />
      <TextField
        label="Amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        required
      />
      <TextField
        label="Note"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      <Button type="submit">Send</Button>
    </Box>
  );
};

export default TransactionForm;
