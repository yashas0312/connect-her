const express = require('express');
const router = express.Router();
const Story = require('../models/Story');
const Business = require('../models/Business');
const User = require('../models/User');

// Middleware to verify admin role
const verifyAdmin = async (req, res, next) => {
  try {
    const { userId } = req.body;
    
    if (!userId) {
      return res.status(401).json({ error: { message: 'User ID is required' } });
    }

    const user = await User.findById(userId);
    
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: { message: 'Admin access required' } });
    }

    next();
  } catch (error) {
    console.error('Admin verification error:', error);
    res.status(500).json({ error: { message: 'Failed to verify admin status' } });
  }
};

// GET /api/admin/stories - Get all stories for moderation
router.get('/stories', async (req, res) => {
  try {
    // For simplicity, checking userId in query params for GET request
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(401).json({ error: { message: 'User ID is required' } });
    }

    const user = await User.findById(userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: { message: 'Admin access required' } });
    }

    const stories = await Story.find()
      .populate('author', 'displayName email')
      .sort({ createdAt: -1 });

    res.json({ stories });
  } catch (error) {
    console.error('Get stories for moderation error:', error);
    res.status(500).json({ error: { message: 'Failed to fetch stories' } });
  }
});

// PUT /api/admin/stories/:id/status - Update story status
router.put('/stories/:id/status', verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const storyId = req.params.id;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ 
        error: { message: 'Invalid status. Must be pending, approved, or rejected' } 
      });
    }

    const story = await Story.findByIdAndUpdate(
      storyId,
      { status },
      { new: true }
    ).populate('author', 'displayName email');

    if (!story) {
      return res.status(404).json({ error: { message: 'Story not found' } });
    }

    res.json({ story, message: `Story ${status} successfully` });
  } catch (error) {
    console.error('Update story status error:', error);
    res.status(500).json({ error: { message: 'Failed to update story status' } });
  }
});

// GET /api/admin/businesses - Get all businesses for moderation
router.get('/businesses', async (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(401).json({ error: { message: 'User ID is required' } });
    }

    const user = await User.findById(userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ error: { message: 'Admin access required' } });
    }

    const businesses = await Business.find()
      .populate('owner', 'displayName email')
      .sort({ createdAt: -1 });

    res.json({ businesses });
  } catch (error) {
    console.error('Get businesses for moderation error:', error);
    res.status(500).json({ error: { message: 'Failed to fetch businesses' } });
  }
});

// PUT /api/admin/businesses/:id/status - Update business status
router.put('/businesses/:id/status', verifyAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const businessId = req.params.id;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ 
        error: { message: 'Invalid status. Must be pending, approved, or rejected' } 
      });
    }

    const business = await Business.findByIdAndUpdate(
      businessId,
      { status },
      { new: true }
    ).populate('owner', 'displayName email');

    if (!business) {
      return res.status(404).json({ error: { message: 'Business not found' } });
    }

    res.json({ business, message: `Business ${status} successfully` });
  } catch (error) {
    console.error('Update business status error:', error);
    res.status(500).json({ error: { message: 'Failed to update business status' } });
  }
});

module.exports = router;
