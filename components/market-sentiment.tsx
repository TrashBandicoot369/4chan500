"use client"

import { useEffect, useState } from "react"
import { fetchDexData, formatMarketCap, formatNumber } from "@/lib/utils"

export default function MarketSentiment() {
  const [summary, setSummary] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<string | null>(null)
  const [marketData, setMarketData] = useState<{ marketCap: number; volume24h: number } | null>(null)
  const [marketDataLoading, setMarketDataLoading] = useState(true)

  // Define token contract address - in production this would be an ENV variable
  const TOKEN_CONTRACT_ADDRESS = "0xd3f1A58DDADb9a33103FBc1B6C1D89E221F0A0BD" // Example address, replace with actual token address

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

  // Fetch DEX data from Dexscreener
  useEffect(() => {
    const getDexData = async () => {
      setMarketDataLoading(true)
      try {
        const data = await fetchDexData(TOKEN_CONTRACT_ADDRESS)
        setMarketData(data)
      } catch (error) {
        console.error("Error fetching DEX data:", error)
      } finally {
        setMarketDataLoading(false)
      }
    }

    getDexData()
    
    // Refresh every 5 minutes
    const intervalId = setInterval(getDexData, 5 * 60 * 1000)
    
    return () => clearInterval(intervalId)
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
              <div className="text-[#6ab6fd] font-semibold mb-1">MEME STONKS</div>
              <div className="text-white">🚀 To The Moon</div>
            </div>
            <div className="bg-[#111a25] p-2 rounded border border-[#2a3744]">
              <div className="text-[#6ab6fd] font-semibold mb-1">BRAIN DAMAGE</div>
              <div className="text-white">
                {marketDataLoading ? (
                  <span className="animate-pulse">Loading...</span>
                ) : (
                  marketData ? formatMarketCap(marketData.marketCap) : "My last brain cell left the chat"
                )}
              </div>
            </div>
            <div className="bg-[#111a25] p-2 rounded border border-[#2a3744]">
              <div className="text-[#6ab6fd] font-semibold mb-1">CHAD FACTOR</div>
              <div className="text-white">
                {marketDataLoading ? (
                  <span className="animate-pulse">Loading...</span>
                ) : (
                  marketData ? `💪 ${formatNumber(marketData.volume24h)}` : "Over 9000!!1!"
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
