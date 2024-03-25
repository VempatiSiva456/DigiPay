const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
require('dotenv').config();
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));
// app.use(express.static('../client/dist'));

mongoose.connect(process.env.DB_CONNECTION_STRING, {
})
.then(() => console.log('MongoDB connected'))
.catch((error) => console.error('MongoDB connection error:', error));

app.use(cookieParser());
app.use('/api/auth', authRoutes);

// app.get('*', (req, res) => {
//   res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html'));
// });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

