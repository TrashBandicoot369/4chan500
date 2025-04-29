import { NextResponse } from "next/server"
import { getFirestore } from "firebase-admin/firestore"
import { initializeApp, cert, getApps } from "firebase-admin/app"

if (!getApps().length) {
  const serviceAccount = JSON.parse(
    Buffer.from(process.env.FIREBASE_CONFIG_B64!, "base64").toString()
  )
  initializeApp({ credential: cert(serviceAccount) })
}

const db = getFirestore()

export async function GET() {
  try {
    const snapshotRef = db.collection("trending_snapshots").orderBy("timestamp", "desc").limit(1)
    const snapDocs = await snapshotRef.get()
    if (snapDocs.empty) return NextResponse.json({ summary: null })

    const memes = snapDocs.docs[0].data().memes
    if (!Array.isArray(memes) || memes.length === 0) {
      console.log("⚠️ No valid meme data in snapshot.")
      return NextResponse.json({ summary: null })
    }

    const formatted = memes.map((m: any, i: number) =>
      `${i + 1}. "${m.title}" – forecastScore: ${m.forecastScore}`
    ).join("\n")

    const messages = [
      {
        role: "system",
        content: "You are a deranged meme market analyst. Speak like you're reporting on a meme ETF with absolutely no filter."
      },
      {
        role: "user",
        content: `Here's today's top forecasted memes:\n\n${formatted}\n\nGive your take. Be chaotic, sarcastic, and deeply online.`
      }
    ]

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-70b-8192",
        messages,
        temperature: 1.2
      })
    })

    const raw = await res.text()
    console.log("📥 GROQ RAW RESPONSE:\n", raw)

    let data = null
    try {
      data = JSON.parse(raw)
    } catch (e) {
      console.error("❌ Could not parse Groq JSON:", e)
      return NextResponse.json({ summary: null })
    }

    if (!data || !data.choices || !data.choices[0]?.message?.content) {
      console.error("⚠️ Invalid Groq response format:", data)
      return NextResponse.json({ summary: null })
    }

    const summary = data.choices[0].message.content.trim()
    console.log("✅ GROQ SUMMARY:", summary)

    return NextResponse.json({ summary })

  } catch (e) {
    console.error("🔥 Forecast sentiment error:", e)
    return NextResponse.json({ summary: null })
  }
}
