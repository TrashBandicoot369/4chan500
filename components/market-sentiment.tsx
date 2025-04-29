"use client"

import { useEffect, useState } from "react"
import { getFirestore, collection, query, orderBy, limit, getDocs } from "firebase/firestore"
import { initializeApp } from "firebase/app"

const firebaseConfig = {
  apiKey: "dummy",
  authDomain: "dummy",
  projectId: "chan500",
}
const app = initializeApp(firebaseConfig)
const firestore = getFirestore(app)

export default function MarketSentiment() {
  const [summary, setSummary] = useState<string | null>(null)
  const [forecastSummary, setForecastSummary] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [topForecasts, setTopForecasts] = useState<any[]>([])

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch("/api/sentiment")
        const data = await res.json()
        setSummary(data.summary)
        setLastUpdated(new Date().toLocaleString())
      } catch (e) {
        console.error("Error fetching sentiment:", e)
      } finally {
        setLoading(false)
      }
    }
    fetchSummary()
  }, [])

  useEffect(() => {
    const fetchTopForecasts = async () => {
      try {
        const snapRef = collection(firestore, "trending_snapshots")
        const q = query(snapRef, orderBy("timestamp", "desc"), limit(1))
        const snapshot = await getDocs(q)
        if (!snapshot.empty) {
          const latest = snapshot.docs[0].data()
          setTopForecasts(latest.memes || [])
        }
      } catch (e) {
        console.error("Failed to fetch top forecasts", e)
      }
    }
    fetchTopForecasts()
  }, [])

  function getShortSummary(title: string) {
    const lower = title.toLowerCase()
    if (lower.includes("same")) return "Existential dread never fails. This meme’s farming engagement on repeat."
    if (lower.includes("cat")) return "Top hats and teacups. A polite scroll pause, maybe more."
    if (lower.includes("looking")) return "You’re looking at it. That’s it. That’s the joke."
    return "This meme has legs — or at least a shot. Keep an eye on it."
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-bold">Meme Market Sentiment</h2>
        {lastUpdated && (
          <button
            onClick={() => {
              navigator.clipboard.writeText(summary || "")
              setCopied(true)
              setTimeout(() => setCopied(false), 2000)
            }}
            className="text-xs bg-gray-700 px-2 py-1 rounded"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-sm text-gray-400">Loading sentiment...</p>
      ) : summary ? (
        <div className="text-sm whitespace-pre-line">{summary}</div>
      ) : (
        <p className="text-sm text-gray-400">No sentiment available.</p>
      )}

      {topForecasts.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm text-[#6ab6fd] mb-2">🔥 AI Forecast: Top Viral Memes Right Now</h3>
          <div className="space-y-4">
            {topForecasts.map((meme) => (
              <div key={meme.id} className="border border-[#333] rounded px-3 py-2">
                <h4 className="text-yellow-300 text-sm font-bold">🔥 {meme.title}</h4>
                <p className="text-green-400 text-xs font-semibold mb-1">forecastScore: {meme.forecastScore}</p>
                <p className="text-purple-300 text-xs font-mono">{getShortSummary(meme.title)}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
