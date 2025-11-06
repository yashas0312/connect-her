const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// POST /api/auth/verify - Verify Firebase token and get/create user
router.post('/verify', authController.verifyToken);

// GET /api/auth/me - Get current user profile
router.get('/me', authController.getCurrentUser);

module.exports = router;
