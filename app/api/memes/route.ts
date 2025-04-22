// app/api/memes/route.ts

import { NextResponse } from "next/server"
import { getFirestore, DocumentData } from "firebase-admin/firestore"
import { initializeApp, cert, getApps } from "firebase-admin/app"

// Initialize Firebase with environment variables or local file
if (!getApps().length) {
  try {
    // Try using environment variables first
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      // Parse the JSON string from environment variable
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
      initializeApp({
        credential: cert(serviceAccount as any),
      })
    } 
    // Individual environment variables
    else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY) {
      const serviceAccount = {
        type: "service_account",
        project_id: process.env.FIREBASE_PROJECT_ID,
        private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
        private_key: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        client_email: process.env.FIREBASE_CLIENT_EMAIL,
        client_id: process.env.FIREBASE_CLIENT_ID,
        auth_uri: process.env.FIREBASE_AUTH_URI || "https://accounts.google.com/o/oauth2/auth",
        token_uri: process.env.FIREBASE_TOKEN_URI || "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_CERT_URL || "https://www.googleapis.com/oauth2/v1/certs",
        client_x509_cert_url: process.env.FIREBASE_CLIENT_CERT_URL
      }
      
      initializeApp({
        credential: cert(serviceAccount as any),
      })
    }
    // Fallback to local file but only if not on Vercel
    else if (!process.env.VERCEL) {
      const fs = require('fs')
      const path = require('path')
      const serviceAccountPath = path.join(process.cwd(), 'chan500-firebase-adminsdk-fbsvc-5f4b8c5c86.json')
      const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'))
      
      initializeApp({
        credential: cert(serviceAccount as any),
      })
    }
    else {
      // On Vercel without credentials - for build step
      console.warn("No Firebase credentials available - API will return mock data during build")
    }
  } catch (error) {
    console.error("Error initializing Firebase:", error)
  }
}

export async function GET() {
  try {
    // Check if we're in Vercel build process
    if (process.env.VERCEL_ENV === 'production' && !process.env.FIREBASE_SERVICE_ACCOUNT) {
      // Return mock data for build process
      return NextResponse.json([{
        id: "sample-meme",
        name: "Sample Meme",
        ticker: "SAMPLE",
        price: 3.50,
        percentChange: 2.5,
        volume: 50000,
        image_url: "https://i.kym-cdn.com/photos/images/newsfeed/002/652/454/c69.jpg",
        link: "https://knowyourmeme.com/photos/sample"
      }])
    }
    
    const db = getFirestore()
    const snapshot = await db.collection("memes").get()
    
    // Transform Firestore data to expected format with proper data types
    const memes = snapshot.docs.map((doc) => {
      const data = doc.data() as DocumentData;
      
      // Instead of using vibeShift, just generate a random number between -20 and +20
      const randomChange = Math.floor(Math.random() * 40) - 20;
      
      return {
        id: doc.id,
        ticker: data.ticker || 'UNKNOWN',
        title: data.name || 'Untitled Meme',
        imageUrl: data.image_url || '',
        price: typeof data.lulzScore === 'number' ? data.lulzScore : Math.floor(Math.random() * 1000), 
        percentChange: randomChange, // Use random number instead
        volume: typeof data.upvotes === 'number' ? data.upvotes : Math.floor(Math.random() * 100000),
        timestamp: data.created_utc || 0,
        link: data.link || ''
      };
    });
    
    return NextResponse.json(memes);
  } catch (error) {
    console.error("Error fetching memes:", error)
    return NextResponse.json(
      { error: "Failed to fetch memes data" },
      { status: 500 }
    )
  }
} 