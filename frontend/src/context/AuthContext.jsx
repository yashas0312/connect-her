import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged, 
  signOut,
  signInAnonymously 
} from 'firebase/auth';
import { auth } from '../firebaseConfig';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // Get or create user in our database
          const userData = await syncUserWithDatabase(firebaseUser);
          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Auth state change error:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const syncUserWithDatabase = async (firebaseUser) => {
    try {
      // First, try to login (check if user exists in our database)
      const loginResponse = await api.post('/auth/login', {
        firebaseUid: firebaseUser.uid
      });

      return loginResponse.data.data.user;
    } catch (loginError) {
      // If login fails, user doesn't exist in our database, so register them
      try {
        const registerResponse = await api.post('/auth/register', {
          firebaseUid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
          profilePicture: firebaseUser.photoURL || '',
          isAnonymous: firebaseUser.isAnonymous
        });

        return registerResponse.data.data.user;
      } catch (registerError) {
        console.error('Registration error:', registerError);
        // Return basic user data if database sync fails
        return {
          id: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0],
          profilePicture: firebaseUser.photoURL || '',
          role: 'user',
          isAnonymous: firebaseUser.isAnonymous
        };
      }
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setError(null);
    } catch (error) {
      console.error('Logout error:', error);
      setError(error.message);
      throw error;
    }
  };

  const loginAnonymously = async () => {
    try {
      setLoading(true);
      const result = await signInAnonymously(auth);
      // User will be set through the onAuthStateChanged listener
      return result.user;
    } catch (error) {
      console.error('Anonymous login error:', error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData);
      const updatedUser = response.data.data.user;
      setUser(prevUser => ({ ...prevUser, ...updatedUser }));
      return updatedUser;
    } catch (error) {
      console.error('Profile update error:', error);
      setError(error.message);
      throw error;
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    logout,
    loginAnonymously,
    updateUserProfile,
    clearError,
    // Helper functions
    isAuthenticated: !!user && !user.isAnonymous,
    isAnonymous: !!user && user.isAnonymous,
    isAdmin: !!user && user.role === 'admin',
    isBusinessOwner: !!user && user.role === 'business_owner'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};