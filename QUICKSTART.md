# ConnectHer - Quick Start Guide

## ⚡ Fast Setup (5 minutes)

### Step 1: Install Dependencies

```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Step 2: Configure Environment Variables

**Backend (.env in backend folder):**
```env
MONGODB_URI=your_mongodb_connection_string
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
```

**Frontend (.env in frontend folder):**
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_key
```

### Step 3: Start Both Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```

### Step 4: Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Health Check: http://localhost:5000/health

## 🎯 What You Can Do Now

1. **Sign Up** - Create an account with email or Google
2. **Share Stories** - Post your story in the Story Hub
3. **Register Business** - Add your business to the Business Hub
4. **Explore** - Browse stories and businesses from other users

## 🔧 Troubleshooting

### Backend won't start?
- Make sure MongoDB connection string is correct
- Check if port 5000 is available

### Frontend won't start?
- Make sure port 3000 is available
- Check if all environment variables are set

### Can't sign in?
- Verify Firebase configuration
- Check Firebase console for enabled auth methods

## 📚 Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Configure Firebase Authentication properly
- Set up MongoDB Atlas database
- Get Google Maps API key for business locations
- Deploy to production (Vercel + Render/Railway)

## 💡 Tips

- Use `.env.example` files as templates
- The backend uses mock auth by default - implement Firebase Admin SDK for production
- Admin access requires manual role assignment in MongoDB
- Test with sample data before going live

Happy hacking! 🚀
