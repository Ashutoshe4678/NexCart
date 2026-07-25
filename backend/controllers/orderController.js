const mongoose = require('mongoose');
const Order = require('../models/Order');
const { inMemoryStore } = require('../config/db');

// Available Riders Pool
const AVAILABLE_RIDERS = [
  { name: 'Vikram Kumar', phone: '+91 98112 33445', vehicle: 'EV Scooter (DL-01-EA-1024)' },
  { name: 'Amit Singh', phone: '+91 98223 44556', vehicle: 'EV Bike (DL-02-EB-3045)' },
  { name: 'Priya Verma', phone: '+91 98334 55667', vehicle: 'EV Scooter (DL-03-EC-5590)' }
];

// Strict RBAC Transition Matrix
const ALLOWED_TRANSITIONS = {
  placed: ['packing', 'cancelled'],
  packing: ['rider_assigned', 'cancelled'],
  rider_assigned: ['out_for_delivery', 'cancelled'],
  out_for_delivery: ['delivered'],
  delivered: [],
  cancelled: []
};

// Helper for safe Mongoose query without CastError on orderId string (e.g. 'SB-137384')
const buildQuery = (id) => {
  if (mongoose.Types.ObjectId.isValid(id)) {
    return { $or: [{ orderId: id }, { _id: id }] };
  }
  return { orderId: id };
};

// Role Permission Check Helper
const canRolePerformTransition = (role, targetStatus) => {
  if (role === 'Super Admin') return true;
  if (targetStatus === 'delivered' || targetStatus === 'out_for_delivery') {
    return role === 'Delivery Partner';
  }
  if (targetStatus === 'packing' || targetStatus === 'rider_assigned') {
    return role === 'Store Admin';
  }
  return true;
};

// @desc    Create a new delivery order
// @route   POST /api/orders
exports.createOrder = async (req, res) => {
  try {
    const { items, totalAmount, deliveryFee, tip, handlingFee, address, paymentMethod, customerName, phone } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart items cannot be empty' });
    }

    const orderId = `SB-${Math.floor(100000 + Math.random() * 900000)}`;

    const orderPayload = {
      orderId,
      items,
      totalAmount,
      deliveryFee: deliveryFee ?? 15,
      tip: tip ?? 0,
      handlingFee: handlingFee ?? 5,
      address: address || 'House #402, Block B, Green Heights, Tech Park Road',
      paymentMethod: paymentMethod || 'UPI Instant',
      customerName: customerName || 'Rahul Sharma',
      phone: phone || '+91 98765 43210',
      status: 'placed',
      riderName: null,
      riderPhone: null,
      riderDistanceKm: 2.4,
      estimatedDeliveryMinutes: 10,
      createdAt: new Date()
    };

    if (!inMemoryStore.isFallback) {
      const created = await Order.create(orderPayload);
      return res.status(201).json(created);
    } else {
      inMemoryStore.orders.unshift(orderPayload);
      return res.status(201).json(orderPayload);
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to place order', error: error.message });
  }
};

// @desc    Get order details by orderId or _id
// @route   GET /api/orders/:id
exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!inMemoryStore.isFallback) {
      const order = await Order.findOne(buildQuery(id));
      if (!order) return res.status(404).json({ message: 'Order not found' });
      return res.json(order);
    } else {
      const order = inMemoryStore.orders.find(o => o.orderId === id || o._id === id);
      if (!order) return res.status(404).json({ message: 'Order not found' });
      return res.json(order);
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
exports.getAllOrders = async (req, res) => {
  try {
    if (!inMemoryStore.isFallback) {
      const orders = await Order.find().sort({ createdAt: -1 });
      return res.json(orders);
    } else {
      return res.json(inMemoryStore.orders);
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};

// @desc    Assign Rider (Store Admin function)
// @route   PUT /api/orders/:id/assign-rider
exports.assignRider = async (req, res) => {
  try {
    const { id } = req.params;
    const { riderName } = req.body;
    const rider = AVAILABLE_RIDERS.find(r => r.name === riderName) || AVAILABLE_RIDERS[0];

    if (!inMemoryStore.isFallback) {
      const updated = await Order.findOneAndUpdate(
        buildQuery(id),
        {
          status: 'rider_assigned',
          riderName: rider.name,
          riderPhone: rider.phone,
          riderDistanceKm: 2.4
        },
        { new: true }
      );
      if (!updated) return res.status(404).json({ message: 'Order not found' });
      return res.json(updated);
    } else {
      const idx = inMemoryStore.orders.findIndex(o => o.orderId === id || o._id === id);
      if (idx === -1) return res.status(404).json({ message: 'Order not found' });
      inMemoryStore.orders[idx].status = 'rider_assigned';
      inMemoryStore.orders[idx].riderName = rider.name;
      inMemoryStore.orders[idx].riderPhone = rider.phone;
      inMemoryStore.orders[idx].riderDistanceKm = 2.4;
      return res.json(inMemoryStore.orders[idx]);
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to assign rider', error: error.message });
  }
};

// @desc    Update order status with Role Permission Check
// @route   PUT /api/orders/:id/status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status: targetStatus, userRole = 'Customer' } = req.body;

    const validStatuses = ['placed', 'packing', 'rider_assigned', 'out_for_delivery', 'delivered', 'cancelled'];
    if (!validStatuses.includes(targetStatus)) {
      return res.status(400).json({ message: 'Invalid order status parameter' });
    }

    let existingOrder = null;
    let existingIndex = -1;

    if (!inMemoryStore.isFallback) {
      existingOrder = await Order.findOne(buildQuery(id));
    } else {
      existingIndex = inMemoryStore.orders.findIndex(o => o.orderId === id || o._id === id);
      if (existingIndex !== -1) existingOrder = inMemoryStore.orders[existingIndex];
    }

    if (!existingOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Role Permission Enforcement
    if (!canRolePerformTransition(userRole, targetStatus)) {
      return res.status(403).json({
        message: `Permission Denied! Role '${userRole}' is not authorized to set status to '${targetStatus}'. Only Delivery Partner or Super Admin can mark Delivered.`
      });
    }

    const currentStatus = existingOrder.status || 'placed';
    const allowedNext = ALLOWED_TRANSITIONS[currentStatus] || [];

    if (currentStatus !== targetStatus && !allowedNext.includes(targetStatus)) {
      return res.status(400).json({
        message: `Illegal transition! Order in '${currentStatus}' state cannot jump to '${targetStatus}'. Allowed next state: ${allowedNext.length > 0 ? allowedNext.join(', ') : 'None'}`
      });
    }

    if (!inMemoryStore.isFallback) {
      const updated = await Order.findOneAndUpdate(
        buildQuery(id),
        { status: targetStatus },
        { new: true }
      );
      return res.json(updated);
    } else {
      inMemoryStore.orders[existingIndex].status = targetStatus;
      return res.json(inMemoryStore.orders[existingIndex]);
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order status', error: error.message });
  }
};

// @desc    Update Live Rider GPS Distance (2.4 km -> 1.8 km -> 0.8 km)
// @route   PUT /api/orders/:id/location
exports.updateRiderLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { distanceKm } = req.body;

    if (!inMemoryStore.isFallback) {
      const updated = await Order.findOneAndUpdate(
        buildQuery(id),
        { riderDistanceKm: distanceKm },
        { new: true }
      );
      return res.json(updated);
    } else {
      const idx = inMemoryStore.orders.findIndex(o => o.orderId === id || o._id === id);
      if (idx === -1) return res.status(404).json({ message: 'Order not found' });
      inMemoryStore.orders[idx].riderDistanceKm = distanceKm;
      return res.json(inMemoryStore.orders[idx]);
    }
  } catch (error) {
    res.status(500).json({ message: 'Failed to update location', error: error.message });
  }
};
