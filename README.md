# ConnectHer – Empower | Inspire | Grow

A digital platform empowering women through storytelling and entrepreneurship.

## 🌟 Features

### Story Hub
- Share personal stories across categories (Career, Health, Education, Growth)
- Post anonymously or publicly
- Like and comment on stories
- Browse stories by category

### Business Hub
- Interactive Google Maps directory of women-led businesses
- Register and discover local businesses
- Search by category and location
- View business details and contact information

### Authentication
- Secure Firebase Authentication
- Email/password and Google sign-in
- User profile management

### Admin Panel
- Content moderation for stories and businesses
- Approve, reject, or mark content as pending
- Admin-only access control

## 🛠️ Tech Stack

**Frontend:**
- React.js 18
- Tailwind CSS
- React Router DOM
- Axios
- Firebase SDK
- @react-google-maps/api

**Backend:**
- Node.js
- Express.js
- MongoDB (Mongoose)
- CORS
- dotenv

**External Services:**
- Firebase Authentication
- MongoDB Atlas
- Google Maps API

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- MongoDB Atlas account
- Firebase project
- Google Maps API key

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd hackio
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/connecther?retryWrites=true&w=majority

# Server Configuration
PORT=5000
NODE_ENV=development

# Firebase Admin SDK (for token verification)
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour-Private-Key\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-project-id.iam.gserviceaccount.com

# CORS Configuration
CORS_ORIGIN=http://localhost:3000
```

Start the backend server:

```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
# Backend API URL
REACT_APP_API_URL=http://localhost:5000

# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
REACT_APP_FIREBASE_APP_ID=your-app-id

# Google Maps API Key
REACT_APP_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

Start the frontend:

```bash
npm start
```

The frontend will run on `http://localhost:3000`

## 🔑 Getting API Keys

### Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing
3. Enable Authentication → Sign-in methods → Email/Password and Google
4. Go to Project Settings → General → Your apps → Web app
5. Copy the Firebase configuration values
6. For Firebase Admin SDK (backend):
   - Go to Project Settings → Service Accounts
   - Generate new private key
   - Use the values from the downloaded JSON file

### MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string from "Connect" → "Connect your application"

### Google Maps API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable these APIs:
   - Maps JavaScript API
   - Geocoding API
4. Create credentials → API Key
5. Restrict the API key (optional but recommended)

## 📁 Project Structure

```
hackio/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── storyController.js
│   │   └── businessController.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Story.js
│   │   └── Business.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── storyRoutes.js
│   │   ├── businessRoutes.js
│   │   └── adminRoutes.js
│   ├── server.js
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── StoryCard.jsx
│   │   │   └── BusinessCard.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Stories.jsx
│   │   │   ├── Businesses.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   └── AdminPanel.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── firebaseConfig.js
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   └── .env.example
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/verify` - Verify Firebase token
- `GET /api/auth/me` - Get current user

### Stories
- `GET /api/stories` - Get all stories (optional ?category=Career)
- `GET /api/stories/:id` - Get single story
- `POST /api/stories` - Create story (requires auth)
- `PUT /api/stories/:id/like` - Toggle like (requires auth)
- `POST /api/stories/:id/comments` - Add comment (requires auth)
- `DELETE /api/stories/:id` - Delete story (requires auth)

### Businesses
- `GET /api/businesses` - Get all businesses
- `GET /api/businesses/nearby` - Get nearby businesses (?lat=X&lng=Y&radius=5000)
- `GET /api/businesses/:id` - Get single business
- `POST /api/businesses` - Create business (requires auth)
- `PUT /api/businesses/:id` - Update business (requires auth)
- `DELETE /api/businesses/:id` - Delete business (requires auth)

### Admin
- `GET /api/admin/stories` - Get all stories for moderation (requires admin)
- `PUT /api/admin/stories/:id/status` - Update story status (requires admin)
- `GET /api/admin/businesses` - Get all businesses for moderation (requires admin)
- `PUT /api/admin/businesses/:id/status` - Update business status (requires admin)

## 🚢 Deployment

### Frontend (Vercel/Firebase Hosting)

**Vercel:**
1. Install Vercel CLI: `npm i -g vercel`
2. Run `vercel` in the frontend directory
3. Add environment variables in Vercel dashboard

**Firebase Hosting:**
1. Install Firebase CLI: `npm i -g firebase-tools`
2. Run `firebase init hosting`
3. Build: `npm run build`
4. Deploy: `firebase deploy`

### Backend (Render/Railway)

**Render:**
1. Create new Web Service
2. Connect your repository
3. Set build command: `npm install`
4. Set start command: `npm start`
5. Add environment variables

**Railway:**
1. Create new project
2. Connect your repository
3. Add environment variables
4. Deploy automatically

## 🐛 Troubleshooting

### Backend won't start
- Check MongoDB connection string
- Ensure all environment variables are set
- Verify Node.js version (v18+)

### Frontend build errors
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check for missing environment variables
- Ensure all dependencies are installed

### Firebase authentication not working
- Verify Firebase configuration in .env
- Check Firebase console for enabled auth methods
- Ensure domain is authorized in Firebase console

### Google Maps not loading
- Verify API key is correct
- Check that Maps JavaScript API is enabled
- Ensure API key restrictions allow your domain

## 📝 Notes for Development

- The backend uses mock Firebase token verification by default. Implement Firebase Admin SDK for production.
- Admin role must be manually set in MongoDB for users who need admin access.
- For production, implement proper authentication middleware and rate limiting.
- Add proper error logging and monitoring for production deployment.

## 🤝 Contributing

This is a hackathon project. Feel free to fork and modify for your needs!

## 📄 License

MIT License

## 👥 Team

Built with ❤️ for empowering women entrepreneurs and storytellers.
