const User = require('../models/User');

// Placeholder for Firebase Admin SDK verification
// In production, you would use: const admin = require('firebase-admin');
const verifyFirebaseToken = async (idToken) => {
  // TODO: Implement Firebase Admin SDK token verification
  // const decodedToken = await admin.auth().verifyIdToken(idToken);
  // return decodedToken;
  
  // For now, return a mock decoded token for development
  console.warn('⚠️  Using mock Firebase token verification. Implement Firebase Admin SDK for production.');
  return {
    uid: 'mock-firebase-uid',
    email: 'user@example.com',
    name: 'Mock User'
  };
};

// Get or create user in MongoDB
const getOrCreateUser = async (firebaseUid, email, displayName) => {
  try {
    let user = await User.findOne({ firebaseUid });
    
    if (!user) {
      user = await User.create({
        firebaseUid,
        email,
        displayName
      });
      console.log('✅ New user created:', user.email);
    }
    
    return user;
  } catch (error) {
    console.error('Error in getOrCreateUser:', error);
    throw error;
  }
};

// Verify Firebase token and get/create user
exports.verifyToken = async (req, res) => {
  try {
    const { idToken } = req.body;
    
    if (!idToken) {
      return res.status(400).json({ error: { message: 'ID token is required' } });
    }

    // Verify Firebase token
    const decodedToken = await verifyFirebaseToken(idToken);
    
    // Get or create user in MongoDB
    const user = await getOrCreateUser(
      decodedToken.uid,
      decodedToken.email,
      decodedToken.name || decodedToken.email
    );

    res.json({
      user: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ error: { message: 'Invalid or expired token' } });
  }
};

// Get current user profile
exports.getCurrentUser = async (req, res) => {
  try {
    // In production, extract user ID from verified token in middleware
    // For now, this is a placeholder
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: { message: 'User ID is required' } });
    }

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: { message: 'User not found' } });
    }

    res.json({
      user: {
        id: user._id,
        email: user.email,
        displayName: user.displayName,
        role: user.role,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ error: { message: 'Failed to fetch user' } });
  }
};
