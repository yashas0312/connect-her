const Story = require('../models/Story');

// Get all stories with optional category filter
exports.getAllStories = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = { status: 'approved' };
    
    if (category && category !== 'All') {
      filter.category = category;
    }

    const stories = await Story.find(filter)
      .populate('author', 'displayName email')
      .sort({ createdAt: -1 })
      .limit(50);

    // Hide author info for anonymous stories
    const storiesWithPrivacy = stories.map(story => {
      const storyObj = story.toObject();
      if (storyObj.isAnonymous) {
        storyObj.author = { displayName: 'Anonymous' };
      }
      return storyObj;
    });

    res.json({ stories: storiesWithPrivacy });
  } catch (error) {
    console.error('Get stories error:', error);
    res.status(500).json({ error: { message: 'Failed to fetch stories' } });
  }
};

// Get single story by ID
exports.getStoryById = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id)
      .populate('author', 'displayName email')
      .populate('comments.user', 'displayName');

    if (!story) {
      return res.status(404).json({ error: { message: 'Story not found' } });
    }

    const storyObj = story.toObject();
    if (storyObj.isAnonymous) {
      storyObj.author = { displayName: 'Anonymous' };
    }

    res.json({ story: storyObj });
  } catch (error) {
    console.error('Get story error:', error);
    res.status(500).json({ error: { message: 'Failed to fetch story' } });
  }
};

// Create new story
exports.createStory = async (req, res) => {
  try {
    const { title, content, category, isAnonymous, userId } = req.body;

    // Validation
    if (!title || !content || !category || !userId) {
      return res.status(400).json({ 
        error: { message: 'Title, content, category, and userId are required' } 
      });
    }

    if (content.length < 50) {
      return res.status(400).json({ 
        error: { message: 'Story content must be at least 50 characters' } 
      });
    }

    const story = await Story.create({
      title,
      content,
      category,
      author: userId,
      isAnonymous: isAnonymous || false
    });

    const populatedStory = await Story.findById(story._id)
      .populate('author', 'displayName email');

    res.status(201).json({ story: populatedStory });
  } catch (error) {
    console.error('Create story error:', error);
    res.status(500).json({ error: { message: 'Failed to create story' } });
  }
};

// Toggle like on story
exports.likeStory = async (req, res) => {
  try {
    const { userId } = req.body;
    const storyId = req.params.id;

    if (!userId) {
      return res.status(400).json({ error: { message: 'User ID is required' } });
    }

    const story = await Story.findById(storyId);
    
    if (!story) {
      return res.status(404).json({ error: { message: 'Story not found' } });
    }

    const likeIndex = story.likes.indexOf(userId);
    
    if (likeIndex > -1) {
      // Unlike
      story.likes.splice(likeIndex, 1);
    } else {
      // Like
      story.likes.push(userId);
    }

    await story.save();

    res.json({ 
      story: { 
        id: story._id, 
        likes: story.likes,
        likeCount: story.likes.length 
      } 
    });
  } catch (error) {
    console.error('Like story error:', error);
    res.status(500).json({ error: { message: 'Failed to like story' } });
  }
};

// Add comment to story
exports.addComment = async (req, res) => {
  try {
    const { userId, text } = req.body;
    const storyId = req.params.id;

    if (!userId || !text) {
      return res.status(400).json({ 
        error: { message: 'User ID and comment text are required' } 
      });
    }

    const story = await Story.findById(storyId);
    
    if (!story) {
      return res.status(404).json({ error: { message: 'Story not found' } });
    }

    story.comments.push({
      user: userId,
      text,
      createdAt: new Date()
    });

    await story.save();

    const updatedStory = await Story.findById(storyId)
      .populate('comments.user', 'displayName');

    res.status(201).json({ 
      story: { 
        id: updatedStory._id, 
        comments: updatedStory.comments 
      } 
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ error: { message: 'Failed to add comment' } });
  }
};

// Delete story
exports.deleteStory = async (req, res) => {
  try {
    const { userId, isAdmin } = req.body;
    const storyId = req.params.id;

    const story = await Story.findById(storyId);
    
    if (!story) {
      return res.status(404).json({ error: { message: 'Story not found' } });
    }

    // Check ownership or admin
    if (story.author.toString() !== userId && !isAdmin) {
      return res.status(403).json({ 
        error: { message: 'Not authorized to delete this story' } 
      });
    }

    await Story.findByIdAndDelete(storyId);

    res.json({ message: 'Story deleted successfully' });
  } catch (error) {
    console.error('Delete story error:', error);
    res.status(500).json({ error: { message: 'Failed to delete story' } });
  }
};
