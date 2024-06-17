const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/get-session', authController.getSession);

module.exports = router;

