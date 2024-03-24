const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
require('dotenv').config;
const { ethers, JsonRpcProvider } = require("ethers");
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const fs = require('fs');

const abiData = JSON.parse(fs.readFileSync("./abi.json", "utf8"));
const abi = abiData.abi;

router.post('/register', async (req, res) => {
  try {
      const { name, email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(409).send({ error: 'Email already registered.' });
      }

      const user = new User({ name, email, password });
      await user.save();

      res.status(201).send({ message: 'User successfully registered. Please log in.' });
  } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Server error. Please try again later.' }); 
  }
});
  

router.post('/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.send({ user });
  } catch (error) {
    res.status(400).send(error);
  }
});


router.get('/verifySession', (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ isLoggedIn: false });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    res.json({ isLoggedIn: true });
  } catch (error) {
    res.status(401).json({ isLoggedIn: false });
  }
});

router.get('/user-name', auth, async (req, res) => {
  const user = await User.findById(req.user._id);
  res.status(201).json({name: user.name});
});

router.post("/send-transaction", auth, async (req, res) => {
  try {
    const { recipient, amount, note } = req.body;
    const user = await User.findById(req.user._id);
    const userEmail = user.email;

    const privateKey = process.env.PRIVATE_KEY_1;
    const contractAddress = process.env.CONTRACT_ADDRESS;

    const provider = new JsonRpcProvider(process.env.RPC_URL);

    const wallet = new ethers.Wallet(privateKey, provider);

    const contract = new ethers.Contract(contractAddress, abi, wallet);

    console.log("Sending transaction...");
    const txResponse = await contract.sendETH(recipient, note, userEmail, {
      value: ethers.parseEther(amount),
    });
    console.log("Transaction sent. Waiting for confirmation...");

    const txReceipt = await txResponse.wait();
    console.log("Transaction confirmed:", txReceipt);
    console.log("logs: ",txReceipt.logs)

   
    res.json({ transactionHash: txResponse.hash });
  } catch (error) {
    console.error("Error sending transaction:", error);
    res.status(500).json({ error: "Failed to send transaction" });
  }
});





router.post('/logout', auth, (req, res) => {
  res.clearCookie('token', { httpOnly: true, sameSite: 'strict' });
  res.json({ message: 'Logged out successfully' });
});


module.exports = router;
