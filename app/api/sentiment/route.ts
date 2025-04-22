import { NextResponse } from "next/server"
import { getFirestore } from "firebase-admin/firestore"
import { initializeApp, cert, getApps } from "firebase-admin/app"

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
      const doc = await db.collection("status").doc("sentiment_summary").get()

      if (!doc.exists) {
        return NextResponse.json({ 
          summary: "No sentiment data available.",
          updated_at: new Date().toISOString()
        })
      }

      const data = doc.data()
      return NextResponse.json({ 
        summary: data?.summary || "No summary.",
        updated_at: data?.updated_at || new Date().toISOString()
      })
    } else {
      // Return mock data if Firebase isn't initialized
      return NextResponse.json({ 
        summary: "Development mode: Firebase not configured.",
        updated_at: new Date().toISOString()
      })
    }
  } catch (e) {
    console.error("🔥 Sentiment API error:", e)
    return NextResponse.json({ 
      summary: "Error loading sentiment.",
      updated_at: new Date().toISOString()
    }, { status: 500 })
  }
} 