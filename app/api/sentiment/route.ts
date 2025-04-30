import { NextResponse } from "next/server"
import { getFirestoreInstance } from "@/lib/firebase-admin"

// Use a fixed timestamp for consistent SSR/CSR rendering
const API_TIMESTAMP = new Date("2023-01-01").toISOString();

export async function GET() {
  try {
    // Get Firestore instance
    const db = getFirestoreInstance()
    
    // If Firestore is available, get data
    if (db) {
      const doc = await db.collection("status").doc("sentiment_summary").get()

      if (!doc.exists) {
        return NextResponse.json({ 
          summary: "No sentiment data available.",
          updated_at: API_TIMESTAMP
        })
      }

      const data = doc.data()
      return NextResponse.json({ 
        summary: data?.summary || "No summary.",
        updated_at: data?.updated_at || API_TIMESTAMP
      })
    } 
    // Fallback for when Firebase isn't initialized
    else {
      console.warn("Firebase not initialized in sentiment API route")
      return NextResponse.json({ 
        summary: "Firebase not configured. Check environment variables.",
        updated_at: API_TIMESTAMP
      })
    }
  } catch (e) {
    console.error("🔥 Sentiment API error:", e)
    return NextResponse.json({ 
      summary: "Error loading sentiment data.",
      updated_at: API_TIMESTAMP,
      error: e instanceof Error ? e.message : "Unknown error"
    }, { status: 500 })
  }
} 