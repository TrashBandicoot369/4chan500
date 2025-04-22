// app/api/memes/route.ts

import { NextResponse } from "next/server"
import { DocumentData } from "firebase-admin/firestore"
import { getFirestoreInstance } from "@/lib/firebase-admin"

export async function GET() {
  try {
    // Get Firestore instance
    const db = getFirestoreInstance()
    
    // If Firestore is available, get data
    if (db) {
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
    } 
    // Fallback for when Firebase isn't initialized
    else {
      console.warn("Firebase not initialized in memes API route");
      return NextResponse.json([{
        id: "sample-meme",
        ticker: "SAMPLE",
        title: "Sample Meme (Firebase not configured)",
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
      { 
        error: "Failed to fetch memes data",
        message: error instanceof Error ? error.message : "Unknown error" 
      },
      { status: 500 }
    )
  }
} 