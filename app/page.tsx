"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { MemeSignalTable } from "@/components/ticker-table"
import dynamic from "next/dynamic"
import { TrendingMemeSignals } from "@/components/trending-tickers"
import MarketSentiment from "@/components/market-sentiment"
import { ComicBubble } from "@/components/ComicBubble"
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
  const [terminalAlerts, setTerminalAlerts] = useState<{
    id: number;
    text: string;
    position: { top: string; left: string };
  }[]>([])
  
  const [memes, setMemes] = useState<MemeTicker[]>([])
  
  // Function to generate random terminal alerts
  const generateAlert = () => {
    const alerts = [
      "MEME ALERT: 'Wojak' vibing at +42.0%",
      "4CHAIN SIGNAL: $DOGE going parabolic",
      "PATTERN DETECTED: Diamond hands forming",
      "TREND BREAK: Pepe crossing 200MA",
      "VIRAL DETECTION: New Elon tweet causing 69% spike",
      "SIGNAL: Meme rotation from cats to frogs",
      "ALERT: FOMO index reaching critical levels",
      "AI DETECT: New template gaining traction",
      "WARNING: Meme cycle overheating",
      "FLASH ALERT: WSB activity spike detected",
    ]
    
    const newAlert = {
      id: Date.now(),
      text: alerts[Math.floor(Math.random() * alerts.length)],
      position: {
        top: `${Math.random() * 80 + 10}%`,
        left: `${Math.random() * 80 + 10}%`
      }
    }
    
    setTerminalAlerts(prev => [...prev, newAlert])
    
    // Remove alert after 3 seconds
    setTimeout(() => {
      setTerminalAlerts(prev => prev.filter(alert => alert.id !== newAlert.id))
    }, 3000)
  }
  
  // Generate a new alert every 5-10 seconds
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Initial alert
    const timeout = setTimeout(generateAlert, 2000)
    
    // Setup interval for subsequent alerts
    const interval = setInterval(() => {
      generateAlert()
    }, Math.random() * 5000 + 5000)
    
    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [])

  // Fetch ALL memes data once at the component level
  useEffect(() => {
    // Only run on client-side
    if (typeof window === 'undefined') return;
    
    // Add loading state
    const controller = new AbortController();
    const signal = controller.signal;
    
    fetch("/api/memes", { signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`API response status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          // Set the complete meme data for both components
          setMemes(data);
        } else {
          console.error("Invalid API response format:", data);
        }
      })
      .catch((err) => {
        // Ignore abort errors
        if (err.name === 'AbortError') return;
        
        console.error("Failed to fetch memes data", err);
      });
      
    return () => {
      controller.abort();
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#000] font-mono text-black relative">
      {/* Add the ComicBubble component and pass the memes data */}
      <ComicBubble memes={memes} />
      
      <div className="mx-auto py-4 max-w-6xl">
        <Header />
        <MarketSentiment />
        {/* Pass the same memes data to both components */}
        <TrendingMemeSignals trendingMemes={memes} />
        <MemeSignalTableWithData externalMemes={memes} />
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
