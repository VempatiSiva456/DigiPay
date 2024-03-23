import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#556cd6",
    },
    secondary: {
      main: "#19857b",
    },
    background: {
      default: "#ffffff",
    },
  },
});

const features = [
  {
    title: "Secure Transactions",
    description:
      "Every transaction is secured and encrypted, ensuring your data and assets are safe.",
  },
  {
    title: "Instant Payments",
    description: "Send and receive payments instantly, without the wait.",
  },
  {
    title: "Global Reach",
    description:
      "Access your account and make transactions from anywhere in the world.",
  },
];

export default function HomePage() {
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    navigate("/login");
  };
  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ bgcolor: "background.default", py: 8 }}>
        <Box
          sx={{
            my: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h2" component="h1" gutterBottom color="primary">
            Welcome to Digipay
          </Typography>
          <Typography
            variant="h5"
            align="center"
            color="textSecondary"
            paragraph
          >
            The next-generation blockchain-based payment solution.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={handleGetStartedClick}
          >
            Get Started
          </Button>
        </Box>
        <Grid container spacing={4} justifyContent="center">
          {features.map((feature, index) => (
            <Grid item key={index} xs={12} sm={6} md={4}>
              <Card
                variant="outlined"
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                }}
              >
                <CardContent>
                  <Typography
                    gutterBottom
                    variant="h5"
                    component="h2"
                    color="primary"
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </ThemeProvider>
  );
}
