import React from "react";
import { Box, Typography } from "@mui/material";

const Footer = () => {
  return (
    <Box
      sx={{
        mt: 4,
        py: 3,
        backgroundColor: "primary.dark",
        color: "white",
        textAlign: "center",
      }}
    >
      <Typography variant="body1">
        "Blockchain is a technology that fundamentally changes how we imagine
        the digital world, interoperability, and trust." - Vitalik Buterin
      </Typography>
    </Box>
  );
};

export default Footer;
