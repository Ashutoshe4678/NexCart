const mongoose = require('mongoose');

// In-Memory store for graceful fallback when MongoDB is not running
const inMemoryStore = {
  products: [],
  orders: [],
  isFallback: false
};

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/snapbasket';
  
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2000 // Quick timeout to fallback if local mongo is offline
    });
    console.log(`⚡ MongoDB Connected: ${conn.connection.host}`);
    inMemoryStore.isFallback = false;
  } catch (error) {
    console.log(`⚠️ Local MongoDB server offline. Switching to high-speed in-memory database fallback mode!`);
    inMemoryStore.isFallback = true;
  }
};

module.exports = { connectDB, inMemoryStore };
