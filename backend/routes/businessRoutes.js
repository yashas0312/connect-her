const express = require('express');
const router = express.Router();
const businessController = require('../controllers/businessController');

// GET /api/businesses/nearby - Get nearby businesses (must be before /:id)
router.get('/nearby', businessController.getNearbyBusinesses);

// GET /api/businesses - Get all businesses (with optional category filter)
router.get('/', businessController.getAllBusinesses);

// GET /api/businesses/:id - Get single business
router.get('/:id', businessController.getBusinessById);

// POST /api/businesses - Create new business (requires auth)
router.post('/', businessController.createBusiness);

// PUT /api/businesses/:id - Update business (requires auth + ownership)
router.put('/:id', businessController.updateBusiness);

// DELETE /api/businesses/:id - Delete business (requires auth + ownership/admin)
router.delete('/:id', businessController.deleteBusiness);

module.exports = router;
