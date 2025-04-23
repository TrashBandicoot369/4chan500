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
      try {
        const snapshot = await db.collection("memes").get()
      
        // Log collection details for debugging
        console.log(`Fetched ${snapshot.size} memes from Firestore`)
      
        // Transform Firestore data to expected format with proper data types
        const memes = snapshot.docs.map((doc) => {
          const data = doc.data() as DocumentData;
          
          // Instead of using vibeShift, just generate a random number between -20 and +20
          const randomChange = Math.floor(Math.random() * 40) - 20;
          
          // For debugging:
          if (!data.name) {
            console.warn(`Meme ${doc.id} missing name property`)
          }
          
          return {
            id: doc.id,
            ticker: data.ticker || 'UNKNOWN',
            title: data.name || 'Untitled Meme',
            imageUrl: data.image_url || '',
            price: typeof data.lulzScore === 'number' ? data.lulzScore : Math.floor(Math.random() * 1000), 
            percentChange: randomChange, // Use random number instead
            volume: typeof data.upvotes === 'number' ? data.upvotes : Math.floor(Math.random() * 100000),
            timestamp: data.created_utc || Date.now(),
            link: data.link || ''
          };
        });
        
        return NextResponse.json(memes);
      } catch (firestoreError) {
        console.error("Firestore query error:", firestoreError)
        return NextResponse.json([{
          id: "error-meme",
          ticker: "ERROR",
          title: "Failed to query Firestore",
          imageUrl: "https://i.kym-cdn.com/photos/images/newsfeed/002/652/454/c69.jpg",
          price: 3.50,
          percentChange: -42.0,
          volume: 50000,
          timestamp: Date.now(),
          link: ""
        }])
      }
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
      [{ 
        id: "fatal-error-meme",
        ticker: "ERROR",
        title: "Fatal Error: " + (error instanceof Error ? error.message : "Unknown error"),
        imageUrl: "https://i.kym-cdn.com/photos/images/newsfeed/002/652/454/c69.jpg",
        price: 0.01,
        percentChange: -99.9,
        volume: 1,
        timestamp: Date.now(),
        link: ""
      }],
      { status: 200 } // Still return 200 so client can display the error meme
    )
  }
} 