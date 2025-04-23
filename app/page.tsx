"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { MemeSignalTable } from "@/components/ticker-table"
import dynamic from "next/dynamic"
import { TrendingMemeSignals } from "@/components/trending-tickers"
import MarketSentiment from "@/components/market-sentiment"
// import { initialMemes } from "@/lib/data"
import type { MemeTicker } from "@/lib/types"

// Dynamically import the data component to ensure client-side only execution
const MemeSignalTableWithData = dynamic(
  () => import("@/components/MemeSignalTableWithData"),
  { 
    ssr: false,
    loading: () => (
      <div className="border border-[#555555] mb-2 bg-[#171717] p-4 text-center text-[#ffd75e]">
        <div className="animate-pulse">Loading MEME SCANNER data...</div>
      </div>
    )
  }
)

export default function Home() {
  // Use state for terminal alerts and trending memes
  const [trendingMemes, setTrendingMemes] = useState<MemeTicker[]>([])
  
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
      "WARNING: EXTREME VIRALITY RISK",
      "PRIORITY: ENGAGEMENT THRESHOLD EXCEEDED",
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

  // Fetch trending memes for the trending section
  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;
    
    fetch("/api/memes")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          // Sort by volume and take top 5
          const trending = [...data].sort((a, b) => b.volume - a.volume).slice(0, 5)
          setTrendingMemes(trending)
        }
      })
      .catch((err) => console.error("Failed to fetch trending memes", err))
  }, [])

  return (
    <main className="min-h-screen bg-[#000] font-mono text-black relative">
      <div className="container mx-auto px-2 py-4 max-w-6xl">
        <Header />
        <MarketSentiment />
        <TrendingMemeSignals trendingMemes={trendingMemes} />
        {/* Use the dynamically imported MemeSignalTableWithData */}
        <MemeSignalTableWithData />
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
