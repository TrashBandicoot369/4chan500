// app/api/memes/route.ts

import { NextResponse } from "next/server"
import { getFirestore, DocumentData } from "firebase-admin/firestore"
import { initializeApp, cert, getApps } from "firebase-admin/app"

// Initialize Firebase with environment variables or local file
if (!getApps().length) {
  try {
    // First try to use environment variables if available (for production)
    if (process.env.FIREBASE_PROJECT_ID && 
        process.env.FIREBASE_PRIVATE_KEY && 
        process.env.FIREBASE_CLIENT_EMAIL) {
      initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        }),
      })
    } else {
      // In development, fallback to local credentials file
      try {
        const { readFileSync } = require('fs')
        const path = require('path')
        const serviceAccountPath = path.join(process.cwd(), "chan500-firebase-adminsdk-fbsvc-5f4b8c5c86.json")
        const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"))
        initializeApp({ credential: cert(serviceAccount) })
        console.log("Using local credentials file for Firebase")
      } catch (error) {
        console.warn("Local credentials file not found, using mock data")
      }
    }
  } catch (error) {
    console.error("Firebase initialization error:", error)
  }
}

export async function GET() {
  try {
    // Check if Firebase is initialized
    if (getApps().length) {
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
    } else {
      // Return mock data if Firebase isn't initialized
      return NextResponse.json([{
        id: "sample-meme",
        ticker: "SAMPLE",
        title: "Sample Meme",
        imageUrl: "https://i.kym-cdn.com/photos/images/newsfeed/002/652/454/c69.jpg",
        price: 3.50,
        percentChange: 2.5,
        volume: 50000,
        timestamp: Date.now(),
        link: "https://knowyourmeme.com/photos/sample"
      }])
    }
  } catch (error) {
    console.error("Error fetching memes:", error)
    return NextResponse.json(
      { error: "Failed to fetch memes data" },
      { status: 500 }
    )
  }
} 