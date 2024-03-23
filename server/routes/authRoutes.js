const express = require('express');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');

router.post('/register', async (req, res) => {
  try {
      const { name, email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(409).send({ error: 'Email already registered.' }); // 409 Conflict
      }

      const user = new User({ name, email, password });
      await user.save();

      const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
      res.status(201).send({ user, token });
  } catch (error) {
      console.error(error);
      res.status(500).send({ error: 'Server error. Please try again later.' }); // 500 Internal Server Error
  }
});

  

router.post('/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password);
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
    res.send({ user, token });
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
