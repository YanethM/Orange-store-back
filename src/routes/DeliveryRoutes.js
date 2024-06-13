const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/DeliveryController');

router.post('/new-delivery', deliveryController.createDelivery);
router.get('/', deliveryController.getDeliveries);
router.get('/:id', deliveryController.getDeliveryById);
router.patch('/edit/:id', deliveryController.updateDelivery);
router.delete('/remove/:id', deliveryController.deleteDelivery);

module.exports = router;
