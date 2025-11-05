import axios from 'axios';
import { auth } from '../firebaseConfig';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error getting auth token:', error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle different types of errors
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;
      
      switch (status) {
        case 401:
          // Unauthorized - redirect to login or refresh token
          console.error('Unauthorized access:', data.error?.message);
          // You might want to redirect to login here
          break;
        case 403:
          // Forbidden
          console.error('Access forbidden:', data.error?.message);
          break;
        case 404:
          // Not found
          console.error('Resource not found:', data.error?.message);
          break;
        case 422:
          // Validation error
          console.error('Validation error:', data.error?.message);
          break;
        case 500:
          // Server error
          console.error('Server error:', data.error?.message);
          break;
        default:
          console.error('API error:', data.error?.message || 'Unknown error');
      }
      
      // Return a more user-friendly error
      const errorMessage = data.error?.message || `Request failed with status ${status}`;
      return Promise.reject(new Error(errorMessage));
    } else if (error.request) {
      // Network error
      console.error('Network error:', error.message);
      return Promise.reject(new Error('Network error. Please check your connection.'));
    } else {
      // Something else happened
      console.error('Request error:', error.message);
      return Promise.reject(error);
    }
  }
);

// API methods for different endpoints
export const authAPI = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  verifyToken: (token) => api.post('/auth/verify-token', { token }),
};

export const storiesAPI = {
  getStories: (params = {}) => api.get('/stories', { params }),
  createStory: (storyData) => api.post('/stories', storyData),
  getStoryById: (id) => api.get(`/stories/${id}`),
  updateStory: (id, storyData) => api.put(`/stories/${id}`, storyData),
  deleteStory: (id) => api.delete(`/stories/${id}`),
  toggleLike: (id) => api.post(`/stories/${id}/like`),
  addComment: (id, commentData) => api.post(`/stories/${id}/comment`, commentData),
  deleteComment: (storyId, commentId) => api.delete(`/stories/${storyId}/comment/${commentId}`),
  getCategories: () => api.get('/stories/categories'),
};

export const businessesAPI = {
  getBusinesses: (params = {}) => api.get('/businesses', { params }),
  createBusiness: (businessData) => api.post('/businesses', businessData),
  getBusinessById: (id) => api.get(`/businesses/${id}`),
  updateBusiness: (id, businessData) => api.put(`/businesses/${id}`, businessData),
  deleteBusiness: (id) => api.delete(`/businesses/${id}`),
  addReview: (id, reviewData) => api.post(`/businesses/${id}/review`, reviewData),
  deleteReview: (businessId, reviewId) => api.delete(`/businesses/${businessId}/review/${reviewId}`),
  toggleFavorite: (id) => api.post(`/businesses/${id}/favorite`),
  searchBusinesses: (params = {}) => api.get('/businesses/search', { params }),
};

export const adminAPI = {
  getAnalytics: () => api.get('/admin/analytics'),
  getPendingStories: (params = {}) => api.get('/admin/stories/pending', { params }),
  approveStory: (id) => api.put(`/admin/stories/${id}/approve`),
  rejectStory: (id, reason) => api.put(`/admin/stories/${id}/reject`, { reason }),
  getPendingBusinesses: (params = {}) => api.get('/admin/businesses/pending', { params }),
  approveBusiness: (id) => api.put(`/admin/businesses/${id}/approve`),
  rejectBusiness: (id, reason) => api.put(`/admin/businesses/${id}/reject`, { reason }),
  getUsers: (params = {}) => api.get('/admin/users', { params }),
  suspendUser: (id, reason) => api.put(`/admin/users/${id}/suspend`, { reason }),
  activateUser: (id) => api.put(`/admin/users/${id}/activate`),
  getReports: (params = {}) => api.get('/admin/reports', { params }),
};

// Utility functions
export const handleApiError = (error) => {
  if (error.response?.data?.error?.message) {
    return error.response.data.error.message;
  }
  return error.message || 'An unexpected error occurred';
};

export const isNetworkError = (error) => {
  return !error.response && error.request;
};

export const isServerError = (error) => {
  return error.response && error.response.status >= 500;
};

export const isClientError = (error) => {
  return error.response && error.response.status >= 400 && error.response.status < 500;
};

// Export default api instance
export default api;