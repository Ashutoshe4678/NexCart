const Product = require('../models/Product');
const seedProducts = require('../data/seedData');
const { inMemoryStore } = require('../config/db');

// Ensure in-memory seed data is populated
if (inMemoryStore.products.length === 0) {
  inMemoryStore.products = seedProducts.map((p, index) => ({
    _id: `prod_${index + 1}`,
    ...p,
    createdAt: new Date(),
    updatedAt: new Date()
  }));
}

// @desc    Get all products with category and search filter
// @route   GET /api/products
exports.getProducts = async (req, res) => {
  try {
    const { category, search } = req.query;

    if (!inMemoryStore.isFallback) {
      let query = {};
      if (category && category !== 'All') {
        query.category = category;
      }
      if (search) {
        query.name = { $regex: search, $options: 'i' };
      }
      let products = await Product.find(query);
      
      // If DB empty, auto-seed
      if (products.length === 0 && !category && !search) {
        await Product.insertMany(seedProducts);
        products = await Product.find({});
      }
      return res.json(products);
    } else {
      // In-Memory Mode
      let list = inMemoryStore.products;
      if (category && category !== 'All') {
        list = list.filter(p => p.category.toLowerCase() === category.toLowerCase());
      }
      if (search) {
        const queryLower = search.toLowerCase();
        list = list.filter(p => 
          p.name.toLowerCase().includes(queryLower) || 
          p.category.toLowerCase().includes(queryLower) ||
          (p.tags && p.tags.some(t => t.toLowerCase().includes(queryLower)))
        );
      }
      return res.json(list);
    }
  } catch (error) {
    res.status(500).json({ message: 'Error fetching products', error: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
exports.getProductById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!inMemoryStore.isFallback) {
      const product = await Product.findById(id);
      if (!product) return res.status(404).json({ message: 'Product not found' });
      return res.json(product);
    } else {
      const product = inMemoryStore.products.find(p => p._id === id);
      if (!product) return res.status(404).json({ message: 'Product not found' });
      return res.json(product);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create new product (Admin)
// @route   POST /api/products
exports.createProduct = async (req, res) => {
  try {
    const newProductData = req.body;
    if (!inMemoryStore.isFallback) {
      const created = await Product.create(newProductData);
      return res.status(201).json(created);
    } else {
      const newObj = {
        _id: `prod_${Date.now()}`,
        ...newProductData,
        inStock: Number(newProductData.inStock || 20),
        price: Number(newProductData.price),
        discountPrice: Number(newProductData.discountPrice || newProductData.price),
        rating: 4.8,
        deliveryTimeMinutes: 10,
        createdAt: new Date()
      };
      inMemoryStore.products.unshift(newObj);
      return res.status(201).json(newObj);
    }
  } catch (error) {
    res.status(400).json({ message: 'Failed to create product', error: error.message });
  }
};

// @desc    Update product stock/price
// @route   PUT /api/products/:id
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    if (!inMemoryStore.isFallback) {
      const updated = await Product.findByIdAndUpdate(id, req.body, { new: true });
      return res.json(updated);
    } else {
      const index = inMemoryStore.products.findIndex(p => p._id === id);
      if (index === -1) return res.status(404).json({ message: 'Product not found' });
      inMemoryStore.products[index] = { ...inMemoryStore.products[index], ...req.body };
      return res.json(inMemoryStore.products[index]);
    }
  } catch (error) {
    res.status(400).json({ message: 'Failed to update product', error: error.message });
  }
};
