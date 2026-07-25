const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String }
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  deliveryFee: { type: Number, default: 15 },
  tip: { type: Number, default: 0 },
  handlingFee: { type: Number, default: 5 },
  customerName: { type: String, default: "Rahul Sharma" },
  phone: { type: String, default: "+91 98765 43210" },
  address: { type: String, required: true },
  paymentMethod: { type: String, default: "UPI Instant" },
  status: {
    type: String,
    enum: ['placed', 'packing', 'rider_assigned', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'placed'
  },
  riderName: { type: String, default: null },
  riderPhone: { type: String, default: null },
  riderDistanceKm: { type: Number, default: 2.4 },
  estimatedDeliveryMinutes: { type: Number, default: 10 }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
