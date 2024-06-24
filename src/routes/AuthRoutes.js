const express = require('express');
const router = express.Router();
const authController = require('../controllers/AuthController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/get-session', authController.getSession);
router.post("/request-password-reset", authController.requestPasswordReset);
router.post("/reset-password/:token", authController.resetPassword);

module.exports = router;

