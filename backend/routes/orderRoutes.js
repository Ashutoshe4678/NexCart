const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  assignRider,
  updateRiderLocation
} = require('../controllers/orderController');

router.post('/', createOrder);
router.get('/', getAllOrders);
router.get('/:id', getOrderById);
router.put('/:id/status', updateOrderStatus);
router.put('/:id/assign-rider', assignRider);
router.put('/:id/location', updateRiderLocation);

module.exports = router;
