import React, { useState, useEffect } from 'react';
import StoryCard from '../components/StoryCard';
import api from '../services/api';

const Stories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [categories] = useState(['Career', 'Health', 'Education', 'Growth']);

  const [newStory, setNewStory] = useState({
    title: '',
    content: '',
    category: 'Career',
    isAnonymous: false,
    tags: []
  });

  useEffect(() => {
    fetchStories();
  }, [selectedCategory]);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/stories?category=${selectedCategory}&limit=20`);
      setStories(response.data.data.stories || []);
    } catch (error) {
      console.error('Error fetching stories:', error);
      // Use dummy data for development
      setStories([
        {
          _id: '1',
          title: 'Breaking Through the Glass Ceiling',
          content: 'My journey from intern to CEO wasn\'t easy, but every challenge taught me something valuable...',
          category: 'Career',
          author: { displayName: 'Sarah Johnson', profilePicture: '', isAnonymous: false },
          likes: ['user1', 'user2'],
          comments: [
            { author: { displayName: 'Emma' }, content: 'So inspiring!', createdAt: new Date() }
          ],
          createdAt: new Date(),
          isAnonymous: false
        },
        {
          _id: '2',
          title: 'Finding Balance in Motherhood',
          content: 'Balancing career and family life has been my biggest challenge and greatest reward...',
          category: 'Health',
          author: { displayName: 'Anonymous', profilePicture: '', isAnonymous: true },
          likes: ['user3'],
          comments: [],
          createdAt: new Date(),
          isAnonymous: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStory = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/stories', newStory);
      setStories([response.data.data.story, ...stories]);
      setNewStory({
        title: '',
        content: '',
        category: 'Career',
        isAnonymous: false,
        tags: []
      });
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating story:', error);
      // For development, add to local state
      const dummyStory = {
        _id: Date.now().toString(),
        ...newStory,
        author: { displayName: newStory.isAnonymous ? 'Anonymous' : 'You', profilePicture: '' },
        likes: [],
        comments: [],
        createdAt: new Date()
      };
      setStories([dummyStory, ...stories]);
      setNewStory({
        title: '',
        content: '',
        category: 'Career',
        isAnonymous: false,
        tags: []
      });
      setShowCreateForm(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Story Hub</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Share your experiences, inspire others, and connect through powerful stories
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                selectedCategory === 'all'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              All Stories
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Create Story Button */}
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-primary flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Share Your Story
          </button>
        </div>

        {/* Create Story Form */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Share Your Story</h2>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleCreateStory} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Story Title
                    </label>
                    <input
                      type="text"
                      value={newStory.title}
                      onChange={(e) => setNewStory({ ...newStory, title: e.target.value })}
                      className="input-field"
                      placeholder="Give your story a compelling title..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Category
                    </label>
                    <select
                      value={newStory.category}
                      onChange={(e) => setNewStory({ ...newStory, category: e.target.value })}
                      className="input-field"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Story
                    </label>
                    <textarea
                      value={newStory.content}
                      onChange={(e) => setNewStory({ ...newStory, content: e.target.value })}
                      className="input-field h-40 resize-none"
                      placeholder="Share your experience, insights, and journey..."
                      required
                    />
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="anonymous"
                      checked={newStory.isAnonymous}
                      onChange={(e) => setNewStory({ ...newStory, isAnonymous: e.target.checked })}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-700">
                      Post anonymously
                    </label>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button type="submit" className="btn-primary flex-1">
                      Share Story
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="btn-outline flex-1"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Stories Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {stories.map((story) => (
              <StoryCard key={story._id} story={story} />
            ))}
          </div>
        )}

        {!loading && stories.length === 0 && (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No stories yet</h3>
            <p className="text-gray-600 mb-4">Be the first to share your story in this category!</p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn-primary"
            >
              Share Your Story
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stories;