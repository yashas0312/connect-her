const express = require('express');
const router = express.Router();
const storyController = require('../controllers/storyController');

// GET /api/stories - Get all stories (with optional category filter)
router.get('/', storyController.getAllStories);

// GET /api/stories/:id - Get single story
router.get('/:id', storyController.getStoryById);

// POST /api/stories - Create new story (requires auth)
router.post('/', storyController.createStory);

// PUT /api/stories/:id/like - Toggle like on story (requires auth)
router.put('/:id/like', storyController.likeStory);

// POST /api/stories/:id/comments - Add comment to story (requires auth)
router.post('/:id/comments', storyController.addComment);

// DELETE /api/stories/:id - Delete story (requires auth + ownership/admin)
router.delete('/:id', storyController.deleteStory);

module.exports = router;
