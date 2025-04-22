import { NextResponse } from "next/server"
import { getFirestore } from "firebase-admin/firestore"
import { initializeApp, cert, getApps } from "firebase-admin/app"
import { readFileSync } from "fs"
import path from "path"

if (!getApps().length) {
  const serviceAccountPath = path.join(process.cwd(), "chan500-firebase-adminsdk-fbsvc-5f4b8c5c86.json")
  const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf8"))
  initializeApp({ credential: cert(serviceAccount as any) })
}

export async function GET() {
  try {
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
  } catch (e) {
    console.error("🔥 Sentiment API error:", e)
    return NextResponse.json({ 
      summary: "Error loading sentiment.",
      updated_at: new Date().toISOString()
    }, { status: 500 })
  }
} 