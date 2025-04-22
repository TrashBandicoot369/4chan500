"use client"

import { useEffect, useState } from "react"

export default function MarketSentiment() {
  const [summary, setSummary] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch("/api/sentiment")
        const data = await res.json()
        setSummary(data.summary)
        setLastUpdated(data.updated_at)
        setLoading(false)
      } catch (err) {
        console.error("Failed to fetch sentiment summary", err)
        setSummary("Unable to load meme market conditions.")
        setLoading(false)
      }
    }

    fetchSummary()
  }, [])

  // Format the timestamp nicely
  const formatTimestamp = (timestamp: string) => {
    if (!timestamp) return null
    try {
      const date = new Date(timestamp)
      return date.toLocaleString()
    } catch (e) {
      return timestamp
    }
  }

  const formattedTime = lastUpdated ? formatTimestamp(lastUpdated) : null

  return (
    <div className="border border-[#333] bg-[#0e1823] rounded-xl p-4 mb-4 text-white">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold text-[#ffd75e]">
          🧠 MEME SENTIMENT ANALYSIS
        </h2>
        {!loading && formattedTime && (
          <span className="text-xs text-[#888]">Updated: {formattedTime}</span>
        )}
      </div>
      
      {loading ? (
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-5/6"></div>
        </div>
      ) : (
        <div>
          <p className="text-sm text-[#cccccc] mb-3">
            {summary || "No sentiment data available."}
          </p>
          
          <div className="grid grid-cols-3 gap-3 mt-4 text-xs">
            <div className="bg-[#111a25] p-2 rounded border border-[#2a3744]">
              <div className="text-[#6ab6fd] font-semibold mb-1">MEME VELOCITY</div>
              <div className="text-white">💹 Trending</div>
            </div>
            <div className="bg-[#111a25] p-2 rounded border border-[#2a3744]">
              <div className="text-[#6ab6fd] font-semibold mb-1">FORMAT DIVERSITY</div>
              <div className="text-white">📊 Medium</div>
            </div>
            <div className="bg-[#111a25] p-2 rounded border border-[#2a3744]">
              <div className="text-[#6ab6fd] font-semibold mb-1">MARKET SIGNAL</div>
              <div className="text-white">🔮 Watching</div>
            </div>
          </div>
          
          <div className="mt-3 text-xs text-[#aaa] italic border-t border-[#333] pt-2">
            Powered by AI market analysis. Data may be delayed.
          </div>
        </div>
      )}
    </div>
  )
}
