import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

/**
 * Initialize Firebase Admin SDK
 * Handles both local development (using service account file)
 * and production (using environment variables)
 */
export function initFirebase(): App | null {
  // If already initialized, return existing app
  if (getApps().length > 0) {
    return getApps()[0];
  }

  try {
    // Check for environment variables (Vercel production)
    if (
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
    ) {
      // Initialize with environment variables
      const app = initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          // Handle escaped newlines in the private key
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });
      
      console.log('Firebase Admin initialized with environment variables');
      return app;
    } 
    
    // Fallback to local service account file (development)
    else {
      try {
        // Only import these in development to avoid bundling issues
        const { readFileSync } = require('fs');
        const path = require('path');
        
        const serviceAccountPath = path.join(process.cwd(), 'chan500-firebase-adminsdk-fbsvc-5f4b8c5c86.json');
        const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
        
        const app = initializeApp({
          credential: cert(serviceAccount),
        });
        
        console.log('Firebase Admin initialized with local service account');
        return app;
      } catch (error) {
        console.warn('Could not initialize Firebase with local service account:', error);
        return null;
      }
    }
  } catch (error) {
    console.error('Firebase initialization error:', error);
    return null;
  }
}

/**
 * Get Firestore instance
 * Returns null if Firebase isn't initialized
 */
export function getFirestoreInstance() {
  try {
    // Try to initialize Firebase first
    const app = initFirebase();
    
    // If Firebase initialized successfully, return Firestore
    if (app) {
      return getFirestore(app);
    }
    
    return null;
  } catch (error) {
    console.error('Error getting Firestore instance:', error);
    return null;
  }
}

// Initialize Firebase on module import - this is optional
// We can also initialize on-demand in each API route
initFirebase(); 