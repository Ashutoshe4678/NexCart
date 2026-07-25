const mongoose = require('mongoose');
const Product = require('./models/Product');
const seedProducts = require('./data/seedData');
require('dotenv').config();

const seedDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nexcart';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB...');

    await Product.deleteMany({});
    console.log('Cleared old products');

    await Product.insertMany(seedProducts);
    console.log(`Successfully seeded ${seedProducts.length} items to database!`);

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedDB();
