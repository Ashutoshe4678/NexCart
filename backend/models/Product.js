const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  discountPrice: { type: Number, required: true },
  unit: { type: String, required: true },
  image: { type: String, required: true },
  inStock: { type: Number, default: 20 },
  rating: { type: Number, default: 4.5 },
  deliveryTimeMinutes: { type: Number, default: 10 },
  tags: [{ type: String }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);
