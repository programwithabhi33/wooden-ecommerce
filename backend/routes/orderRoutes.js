const express = require('express');
const router = express.Router();
const { addOrderItems, getMyOrders, getOrderById, updateOrderToPaid, verifyPayment } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, addOrderItems);
router.get('/myorders', protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/verify-payment').put(protect, verifyPayment);

module.exports = router;
