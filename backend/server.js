const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB } = require('./config/db');

const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Root Endpoint
app.get('/', (req, res) => {
  res.json({
    message: '⚡ Welcome to SnapBasket Ultra-Fast Grocery API',
    status: 'Operational',
    version: '1.0.0'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 SnapBasket Backend Server running at http://localhost:${PORT}`);
});
