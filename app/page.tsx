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
  
  // Add random terminal alert boxes
  const [terminalAlerts, setTerminalAlerts] = useState<{
    id: number;
    text: string;
    position: {top: string, left: string};
    visible: boolean;
  }[]>([]);
  
  // Function to generate random terminal alerts
  useEffect(() => {
    const terminalAlertMessages = [
      "SIGNAL: NEW MEME FORMAT DETECTED",
      "ALERT: PATTERN RECOGNITION COMPLETE",
      "WARNING: EXTREME VOLATILITY RISK",
      "PRIORITY: VIRALITY THRESHOLD EXCEEDED",
      "NOTICE: AI CONFIDENCE INTERVAL EXPANDED"
    ];
    
    const showRandomAlert = () => {
      const text = terminalAlertMessages[Math.floor(Math.random() * terminalAlertMessages.length)];
      const top = `${Math.floor(Math.random() * 70)}%`;
      const left = `${Math.floor(Math.random() * 70)}%`;
      const id = Date.now();
      
      setTerminalAlerts(prev => [...prev, {
        id,
        text,
        position: {top, left},
        visible: true
      }]);
      
      // Remove alert after 5 seconds
      setTimeout(() => {
        setTerminalAlerts(prev => prev.filter(alert => alert.id !== id));
      }, 5000);
    };
    
    // Show alert every 15-25 seconds
    const interval = setInterval(() => {
      showRandomAlert();
    }, Math.random() * 10000 + 15000);
    
    return () => clearInterval(interval);
  }, []);

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
    <main className="min-h-screen bg-[#000] font-mono text-black relative">
      <div className="container mx-auto px-2 py-4 max-w-6xl">
        <Header />
        <MarketSentiment sentiment={sentiment} />
        <TrendingTickers trendingMemes={trendingMemes} />
        <TickerTable memes={sortedMemes} onSort={handleSort} sortConfig={sortConfig} />
        <SubmissionForm onSubmit={handleSubmit} />
      </div>
      
      {/* Terminal Alert Boxes */}
      {terminalAlerts.map(alert => (
        <div 
          key={alert.id}
          className="alert-box"
          style={{
            top: alert.position.top,
            left: alert.position.left
          }}
        >
          {alert.text}
        </div>
      ))}
    </main>
  )
}
