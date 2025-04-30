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
    // Add debug logging for environment variables
    console.log('Checking Firebase environment variables...');
    console.log('FIREBASE_PROJECT_ID exists:', !!process.env.FIREBASE_PROJECT_ID);
    console.log('FIREBASE_CLIENT_EMAIL exists:', !!process.env.FIREBASE_CLIENT_EMAIL);
    console.log('FIREBASE_PRIVATE_KEY exists:', !!process.env.FIREBASE_PRIVATE_KEY);
    
    // Check for environment variables (Vercel production)
    if (
      process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
    ) {
      // Log some more info for debugging
      console.log('Initializing Firebase with environment variables');
      
      // Check if private key starts with the expected format
      const privateKey = process.env.FIREBASE_PRIVATE_KEY;
      console.log('Private key format check:', 
        privateKey.includes('-----BEGIN PRIVATE KEY-----') ? 'valid' : 'invalid');
      
      // Initialize with environment variables
      const app = initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          // First remove any surrounding quotes that might have been added
          privateKey: privateKey
            .replace(/^["']/, '')
            .replace(/["']$/, '')
            .replace(/\\n/g, '\n'),
        }),
      });
      
      console.log('Firebase Admin initialized with environment variables successfully');
      return app;
    } 
    
    // Fallback to local service account file (development)
    else {
      // Log fallback attempt
      console.log('Environment variables not found, trying local service account file...');
      
      try {
        // Only import these in development to avoid bundling issues
        const { readFileSync } = require('fs');
        const path = require('path');
        
        // Use the correct service account file name
        const serviceAccountPath = path.join(process.cwd(), 'chan500-firebase-adminsdk-fbsvc-aa307e321e.json');
        console.log('Looking for service account at:', serviceAccountPath);
        
        const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));
        
        const app = initializeApp({
          credential: cert(serviceAccount),
        });
        
        console.log('Firebase Admin initialized with local service account successfully');
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
    
    console.warn('No Firebase app available, returning null Firestore instance');
    return null;
  } catch (error) {
    console.error('Error getting Firestore instance:', error);
    return null;
  }
}

// Initialize Firebase on module import - this is optional
// We can also initialize on-demand in each API route
initFirebase(); 