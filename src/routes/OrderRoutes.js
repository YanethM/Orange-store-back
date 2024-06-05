const express = require('express');
const router = express.Router();

const orderController = require('../controllers/OrderController');

router.post('/new-order', orderController.createOrder);
router.get('/', orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.patch('/edit/:id', orderController.updateOrder);
router.delete('/remove/:id', orderController.deleteOrder);

module.exports = router;
