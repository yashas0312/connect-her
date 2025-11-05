import React, { useState, useEffect } from 'react';
import api from '../services/api';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [analytics, setAnalytics] = useState(null);
  const [pendingStories, setPendingStories] = useState([]);
  const [pendingBusinesses, setPendingBusinesses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
    fetchPendingContent();
    fetchUsers();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/admin/analytics');
      setAnalytics(response.data.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Use dummy data for development
      setAnalytics({
        overview: {
          totalUsers: 1247,
          totalStories: 89,
          totalBusinesses: 34,
          activeUsers: 1180,
          pendingStories: 5,
          pendingBusinesses: 3
        },
        growth: {
          recentUsers: 47,
          recentStories: 12,
          recentBusinesses: 8
        },
        categories: [
          { _id: 'Career', count: 32 },
          { _id: 'Health', count: 28 },
          { _id: 'Education', count: 18 },
          { _id: 'Growth', count: 11 }
        ]
      });
    }
  };

  const fetchPendingContent = async () => {
    try {
      const [storiesRes, businessesRes] = await Promise.all([
        api.get('/admin/stories/pending'),
        api.get('/admin/businesses/pending')
      ]);
      setPendingStories(storiesRes.data.data.stories || []);
      setPendingBusinesses(businessesRes.data.data.businesses || []);
    } catch (error) {
      console.error('Error fetching pending content:', error);
      // Use dummy data
      setPendingStories([
        {
          _id: '1',
          title: 'My Journey to Tech Leadership',
          category: 'Career',
          author: { displayName: 'Jane Doe', email: 'jane@example.com' },
          createdAt: new Date()
        }
      ]);
      setPendingBusinesses([
        {
          _id: '1',
          name: 'Green Beauty Studio',
          category: 'Beauty & Wellness',
          owner: { displayName: 'Sarah Smith', email: 'sarah@example.com' },
          location: { city: 'New York', state: 'NY' },
          createdAt: new Date()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users?limit=50');
      setUsers(response.data.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      // Use dummy data
      setUsers([
        {
          _id: '1',
          displayName: 'Alice Johnson',
          email: 'alice@example.com',
          role: 'user',
          isActive: true,
          createdAt: new Date()
        },
        {
          _id: '2',
          displayName: 'Maria Rodriguez',
          email: 'maria@example.com',
          role: 'business_owner',
          isActive: true,
          createdAt: new Date()
        }
      ]);
    }
  };

  const handleApproveStory = async (storyId) => {
    try {
      await api.put(`/admin/stories/${storyId}/approve`);
      setPendingStories(pendingStories.filter(story => story._id !== storyId));
    } catch (error) {
      console.error('Error approving story:', error);
    }
  };

  const handleRejectStory = async (storyId) => {
    try {
      await api.put(`/admin/stories/${storyId}/reject`, {
        reason: 'Content does not meet community guidelines'
      });
      setPendingStories(pendingStories.filter(story => story._id !== storyId));
    } catch (error) {
      console.error('Error rejecting story:', error);
    }
  };

  const handleApproveBusiness = async (businessId) => {
    try {
      await api.put(`/admin/businesses/${businessId}/approve`);
      setPendingBusinesses(pendingBusinesses.filter(business => business._id !== businessId));
    } catch (error) {
      console.error('Error approving business:', error);
    }
  };

  const handleRejectBusiness = async (businessId) => {
    try {
      await api.put(`/admin/businesses/${businessId}/reject`, {
        reason: 'Business information incomplete or invalid'
      });
      setPendingBusinesses(pendingBusinesses.filter(business => business._id !== businessId));
    } catch (error) {
      console.error('Error rejecting business:', error);
    }
  };

  const handleSuspendUser = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/suspend`, {
        reason: 'Violation of community guidelines'
      });
      setUsers(users.map(user => 
        user._id === userId ? { ...user, isActive: false } : user
      ));
    } catch (error) {
      console.error('Error suspending user:', error);
    }
  };

  const tabs = [
    { id: 'overview', name: 'Overview', icon: '📊' },
    { id: 'stories', name: 'Stories', icon: '📖' },
    { id: 'businesses', name: 'Businesses', icon: '🏢' },
    { id: 'users', name: 'Users', icon: '👥' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Panel</h1>
          <p className="text-gray-600">Manage content, users, and platform analytics</p>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && analytics && (
              <div className="space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-blue-100 text-sm">Total Users</p>
                        <p className="text-3xl font-bold">{analytics.overview.totalUsers}</p>
                      </div>
                      <div className="text-blue-200">👥</div>
                    </div>
                    <p className="text-blue-100 text-sm mt-2">
                      +{analytics.growth.recentUsers} this month
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-green-100 text-sm">Total Stories</p>
                        <p className="text-3xl font-bold">{analytics.overview.totalStories}</p>
                      </div>
                      <div className="text-green-200">📖</div>
                    </div>
                    <p className="text-green-100 text-sm mt-2">
                      +{analytics.growth.recentStories} this month
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-purple-100 text-sm">Total Businesses</p>
                        <p className="text-3xl font-bold">{analytics.overview.totalBusinesses}</p>
                      </div>
                      <div className="text-purple-200">🏢</div>
                    </div>
                    <p className="text-purple-100 text-sm mt-2">
                      +{analytics.growth.recentBusinesses} this month
                    </p>
                  </div>

                  <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-orange-100 text-sm">Pending Reviews</p>
                        <p className="text-3xl font-bold">
                          {analytics.overview.pendingStories + analytics.overview.pendingBusinesses}
                        </p>
                      </div>
                      <div className="text-orange-200">⏳</div>
                    </div>
                    <p className="text-orange-100 text-sm mt-2">Needs attention</p>
                  </div>
                </div>

                {/* Category Distribution */}
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold mb-4">Story Categories</h3>
                  <div className="space-y-3">
                    {analytics.categories.map((category) => (
                      <div key={category._id} className="flex items-center justify-between">
                        <span className="text-gray-700">{category._id}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-primary-600 h-2 rounded-full"
                              style={{
                                width: `${(category.count / Math.max(...analytics.categories.map(c => c.count))) * 100}%`
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-8">
                            {category.count}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Stories Tab */}
            {activeTab === 'stories' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Pending Stories ({pendingStories.length})</h3>
                {pendingStories.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No pending stories to review</p>
                ) : (
                  <div className="space-y-4">
                    {pendingStories.map((story) => (
                      <div key={story._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-lg">{story.title}</h4>
                            <p className="text-sm text-gray-600">
                              by {story.author.displayName} • {story.category}
                            </p>
                          </div>
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                            Pending
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApproveStory(story._id)}
                            className="btn-primary text-sm"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectStory(story._id)}
                            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg text-sm"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Businesses Tab */}
            {activeTab === 'businesses' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Pending Businesses ({pendingBusinesses.length})</h3>
                {pendingBusinesses.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No pending businesses to review</p>
                ) : (
                  <div className="space-y-4">
                    {pendingBusinesses.map((business) => (
                      <div key={business._id} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-lg">{business.name}</h4>
                            <p className="text-sm text-gray-600">
                              by {business.owner.displayName} • {business.category}
                            </p>
                            <p className="text-sm text-gray-500">
                              {business.location.city}, {business.location.state}
                            </p>
                          </div>
                          <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                            Pending
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleApproveBusiness(business._id)}
                            className="btn-primary text-sm"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRejectBusiness(business._id)}
                            className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg text-sm"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">User Management ({users.length})</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          User
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Joined
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user._id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {user.displayName}
                              </div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.isActive 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {user.isActive ? 'Active' : 'Suspended'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {user.isActive ? (
                              <button
                                onClick={() => handleSuspendUser(user._id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Suspend
                              </button>
                            ) : (
                              <button className="text-green-600 hover:text-green-900">
                                Activate
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;