// app/api/memes/route.ts

import { NextResponse } from "next/server"
import { getFirestore, DocumentData } from "firebase-admin/firestore"
import { initializeApp, cert, getApps } from "firebase-admin/app"
import * as fs from 'fs'
import * as path from 'path'

// Read service account file directly
const serviceAccountPath = path.join(process.cwd(), 'chan500-firebase-adminsdk-fbsvc-5f4b8c5c86.json')
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'))

if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount as any),
  })
}

export async function GET() {
  const db = getFirestore()
  const snapshot = await db.collection("memes").get()
  const memes = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() as DocumentData }))
  return NextResponse.json(memes)
} 