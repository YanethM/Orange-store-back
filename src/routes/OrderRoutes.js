const express = require('express');
const router = express.Router();

const orderController = require('../controllers/OrderController');
const authenticatedToken = require('../middlewares/authMiddleware');


router.post('/new-order', authenticatedToken, orderController.createOrder);
router.get('/', authenticatedToken, orderController.getAllOrders);
router.get('/:id', authenticatedToken, orderController.getOrderById);
router.get('/user/:userId', /* authenticatedToken, */ orderController.getOrderByUserId);
router.patch('/edit/:id', authenticatedToken, orderController.updateOrder);
router.delete('/remove/:id', authenticatedToken, orderController.deleteOrder);

module.exports = router;
