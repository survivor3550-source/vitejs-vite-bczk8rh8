import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Your web app's Firebase configuration
// Replace these with your actual Firebase project config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBxTsRJZEsqTckiQFR77H037nLBF2Tdh_E",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "conferia.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "conferia",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "conferia.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "355970397665",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:355970397665:web:9794c3bdb3d4b614d9cea0",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || undefined,
};

// Initialize Firebase
let app;
let auth;
let db;
let storage;
let analytics = null;

try {
  // Initialize Firebase app
  app = initializeApp(firebaseConfig);
  
  // Initialize services
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  
  // Initialize Analytics (only in browser and if supported)
  isSupported().then((supported) => {
    if (supported && import.meta.env.PROD && firebaseConfig.measurementId) {
      analytics = getAnalytics(app);
    }
  });

  // Use emulators in development if enabled
  if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATORS === 'true') {
    connectAuthEmulator(auth, 'http://localhost:9099');
    connectFirestoreEmulator(db, 'localhost', 8080);
    connectStorageEmulator(storage, 'localhost', 9199);
    console.log('🔥 Firebase emulators connected');
  }

  console.log('✅ Firebase initialized successfully');
} catch (error) {
  console.error('❌ Firebase initialization error:', error);
  
  // Create mock instances for development
  app = null;
  auth = null;
  db = null;
  storage = null;
  
  console.warn('⚠️ Firebase is not configured. Using mock data instead.');
  console.warn('📝 To set up Firebase:');
  console.warn('   1. Create a Firebase project at https://console.firebase.google.com');
  console.warn('   2. Enable Authentication (Email/Password)');
  console.warn('   3. Create Firestore Database');
  console.warn('   4. Copy your config to .env file');
  console.warn('   5. See .env.example for required variables');
}

// Firebase Collections Reference
export const COLLECTIONS = {
  USERS: 'users',
  POSTS: 'posts',
  COMMENTS: 'comments',
  REPORTS: 'reports',
  NOTIFICATIONS: 'notifications',
  ADMIN_LOGS: 'adminLogs',
};

// Firebase Indexes (for reference - create these in Firebase Console)
export const REQUIRED_INDEXES = [
  {
    collection: 'posts',
    fields: [
      { fieldPath: 'status', order: 'ASCENDING' },
      { fieldPath: 'deletionDate', order: 'ASCENDING' },
      { fieldPath: 'createdAt', order: 'DESCENDING' },
    ],
  },
  {
    collection: 'posts',
    fields: [
      { fieldPath: 'status', order: 'ASCENDING' },
      { fieldPath: 'deletionDate', order: 'ASCENDING' },
      { fieldPath: 'trendingScore', order: 'DESCENDING' },
    ],
  },
  {
    collection: 'posts',
    fields: [
      { fieldPath: 'status', order: 'ASCENDING' },
      { fieldPath: 'deletionDate', order: 'ASCENDING' },
      { fieldPath: 'likes', order: 'DESCENDING' },
      { fieldPath: 'createdAt', order: 'DESCENDING' },
    ],
  },
  {
    collection: 'users',
    fields: [
      { fieldPath: 'status', order: 'ASCENDING' },
      { fieldPath: 'createdAt', order: 'DESCENDING' },
    ],
  },
  {
    collection: 'reports',
    fields: [
      { fieldPath: 'status', order: 'ASCENDING' },
      { fieldPath: 'createdAt', order: 'DESCENDING' },
    ],
  },
];

// Firestore Rules (for reference - set these in Firebase Console)
export const FIRESTORE_RULES = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return isAuthenticated() && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    function isOwner(userId) {
      return isAuthenticated() && request.auth.uid == userId;
    }
    
    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && request.auth.uid == userId;
      allow update: if isOwner(userId) || isAdmin();
      allow delete: if isAdmin();
    }
    
    // Posts collection
    match /posts/{postId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update: if isOwner(resource.data.userId) || isAdmin();
      allow delete: if isOwner(resource.data.userId) || isAdmin();
    }
    
    // Comments collection
    match /comments/{commentId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update: if isOwner(resource.data.userId) || isAdmin();
      allow delete: if isOwner(resource.data.userId) || isAdmin();
    }
    
    // Reports collection
    match /reports/{reportId} {
      allow read: if isAdmin();
      allow create: if isAuthenticated();
      allow update: if isAdmin();
      allow delete: if isAdmin();
    }
    
    // Admin logs
    match /adminLogs/{logId} {
      allow read: if isAdmin();
      allow create: if isAdmin();
      allow update: if isAdmin();
    }
    
    // Notifications
    match /notifications/{notificationId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update: if isOwner(resource.data.userId) || isAdmin();
    }
  }
}
`;

// Storage Rules (for reference - set these in Firebase Console)
export const STORAGE_RULES = `
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /avatars/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /reports/{allPaths=**} {
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
      allow write: if request.auth != null;
    }
  }
}
`;

// Helper function to check if Firebase is initialized
export const isFirebaseInitialized = () => {
  return app !== null && auth !== null && db !== null;
};

// Helper function to get Firebase error message
export const getFirebaseErrorMessage = (error) => {
  if (!error) return 'An unknown error occurred';

  const errorMessages = {
    'auth/user-not-found': 'No account found with this email address',
    'auth/wrong-password': 'Incorrect password. Please try again',
    'auth/email-already-in-use': 'An account already exists with this email',
    'auth/invalid-email': 'Please enter a valid email address',
    'auth/weak-password': 'Password should be at least 6 characters',
    'auth/too-many-requests': 'Too many attempts. Please try again later',
    'auth/network-request-failed': 'Network error. Check your connection',
    'auth/user-disabled': 'This account has been disabled',
    'auth/requires-recent-login': 'Please sign in again to continue',
    'auth/invalid-credential': 'Invalid credentials. Please try again',
    'auth/operation-not-allowed': 'This operation is not allowed',
    'auth/popup-closed-by-user': 'Sign in popup was closed',
    'auth/popup-blocked': 'Sign in popup was blocked by browser',
    'storage/unauthorized': 'You do not have permission to access this file',
    'storage/canceled': 'Upload was cancelled',
    'storage/unknown': 'An unknown error occurred during upload',
    'firestore/permission-denied': 'You do not have permission to perform this action',
    'firestore/not-found': 'The requested document was not found',
    'firestore/already-exists': 'The document already exists',
  };

  return errorMessages[error.code] || error.message || 'An unexpected error occurred';
};

// Export initialized services
export { app, auth, db, storage, analytics };
export default app;