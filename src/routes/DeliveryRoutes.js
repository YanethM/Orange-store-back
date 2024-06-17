const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/DeliveryController');
const authenticatedToken = require('../middlewares/authMiddleware');

router.post('/new-delivery', authenticatedToken, deliveryController.createDelivery);
router.get('/', authenticatedToken, deliveryController.getDeliveries);
router.get('/:id',authenticatedToken, deliveryController.getDeliveryById);
router.patch('/edit/:id',authenticatedToken, deliveryController.updateDelivery);
router.delete('/remove/:id', authenticatedToken, deliveryController.deleteDelivery);

module.exports = router;
