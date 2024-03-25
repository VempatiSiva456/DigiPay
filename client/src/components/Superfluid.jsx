import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Box, Typography } from "@mui/material";

const Superfluid = () => {
  const navigate = useNavigate();
  const [isWalletConnected, setIsWalletConnected] = useState(false);

  useEffect(() => {
    const { ethereum } = window;
    if (ethereum) {
      ethereum.request({ method: "eth_accounts" }).then(accounts => {
        setIsWalletConnected(accounts.length > 0);
      });
    }
  }, []);

  return (
    <Box sx={{ mt: 8, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
      <Typography variant="h4" sx={{ mb: 4 }}>Superfluid Actions</Typography>
      {isWalletConnected ? (
        <>
          <Button variant="contained" color="primary" onClick={() => navigate("/superfluid/createflow")} sx={{ width: '200px' }}>
            Create Flow
          </Button>
          <Button variant="contained" color="primary" onClick={() => navigate("/superfluid/updateflow")} sx={{ width: '200px' }}>
            Update Flow
          </Button>
          <Button variant="contained" color="primary" onClick={() => navigate("/superfluid/deleteflow")} sx={{ width: '200px' }}>
            Delete Flow
          </Button>
        </>
      ) : (
        <Typography variant="body1" sx={{ mb: 4 }}>Please connect your wallet to proceed.</Typography>
      )}
      <Button variant="outlined" onClick={() => navigate("/dashboard")} sx={{ width: '200px' }}>
        Back to Dashboard
      </Button>
    </Box>
  );
};

export default Superfluid;
