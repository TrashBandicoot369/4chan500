"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { TickerTable } from "@/components/ticker-table"
import { SubmissionForm } from "@/components/submission-form"
import { TrendingTickers } from "@/components/trending-tickers"
import { MarketSentiment } from "@/components/market-sentiment"
import { initialMemes } from "@/lib/data"
import type { MemeTicker } from "@/lib/types"

export default function Home() {
  const [memes, setMemes] = useState<MemeTicker[]>(initialMemes)
  const [sortConfig, setSortConfig] = useState<{
    key: keyof MemeTicker
    direction: "ascending" | "descending"
  } | null>(null)
  const [sentiment, setSentiment] = useState<"bullish" | "bearish" | "neutral">("neutral")
  const [submissionCount, setSubmissionCount] = useState(0)

  // Update market sentiment based on submission frequency
  useEffect(() => {
    if (submissionCount > 5) {
      setSentiment("bullish")
    } else if (submissionCount > 2) {
      setSentiment("neutral")
    } else {
      setSentiment("bearish")
    }
  }, [submissionCount])

  const handleSubmit = (newMeme: MemeTicker) => {
    setMemes([newMeme, ...memes])
    setSubmissionCount((prev) => prev + 1)
  }

  const handleSort = (key: keyof MemeTicker) => {
    let direction: "ascending" | "descending" = "ascending"

    if (sortConfig && sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending"
    }

    setSortConfig({ key, direction })
  }

  const sortedMemes = [...memes].sort((a, b) => {
    if (!sortConfig) return 0

    const { key, direction } = sortConfig

    if (a[key] < b[key]) {
      return direction === "ascending" ? -1 : 1
    }
    if (a[key] > b[key]) {
      return direction === "ascending" ? 1 : -1
    }
    return 0
  })

  const trendingMemes = [...memes].sort((a, b) => b.volume - a.volume).slice(0, 5)

  return (
    <main className="min-h-screen bg-[#eeffee] font-mono text-black">
      <div className="container mx-auto px-2 py-4 max-w-6xl">
        <Header />
        <MarketSentiment sentiment={sentiment} />
        <TrendingTickers trendingMemes={trendingMemes} />
        <TickerTable memes={sortedMemes} onSort={handleSort} sortConfig={sortConfig} />
        <SubmissionForm onSubmit={handleSubmit} />
      </div>
    </main>
  )
}
