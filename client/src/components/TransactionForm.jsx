import React, { useState, useEffect } from "react";
import { ethers, formatUnits } from "ethers";
import { Button, TextField, Box } from "@mui/material";

const TransactionForm = ({ contractAddress, abi }) => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");

  const checkWalletConnection = () => {
    setWalletConnected(!!window.ethereum);
  };

  useEffect(() => {
    checkWalletConnection();

    window.ethereum.on("accountsChanged", checkWalletConnection);

    return () => {
      window.ethereum.off("accountsChanged", checkWalletConnection);
    };
  }, []);

  const sendETH = async () => {
    try {
      if (!walletConnected) {
        throw new Error("No crypto wallet found. Please install MetaMask.");
      }

      await window.ethereum.request({ method: "eth_requestAccounts" });
      

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = provider.getSigner();
      console.log("signer",signer);
      const contract = new ethers.Contract(contractAddress, abi, signer);

      const userEmail = await getCurrentUserEmail();

      const txn = await contract.sendETH(recipient, note, userEmail, {
        value: ethers.parseEther(amount.toString()),
      });

      const receipt = await txn.wait();

      await recordTransactionOnServer({
        transactionHash: receipt.transactionHash,
        email: userEmail,
        note,
        recipient,
        amount,
      });

      alert("Transaction successful!");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  async function getCurrentUserEmail() {
    try {
      const response = await fetch("http://localhost:5000/api/auth/current-user", {
        method: "GET",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Failed to get current user email");
      }

      const data = await response.json();
      return data.email;
    } catch (error) {
      console.error("Error in getting current user email: ", error);
      throw error;
    }
  }

  async function recordTransactionOnServer(transactionData) {
    console.log("Recording transaction on server:", transactionData);
  }

  return (
    walletConnected && (
      <Box>
        <TextField
          label="Recipient Address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <TextField
          label="Amount"
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <TextField
          label="Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <Button onClick={sendETH}>Send</Button>
      </Box>
    )
  );
};

export default TransactionForm;
