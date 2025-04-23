"use client"

import { useEffect, useState, useRef } from "react"
import Image from "next/image"
import { formatLulzScore, formatPercentage, formatVibeShift, getMemeHeatIndex } from "@/lib/format-utils"
import type { MemeTicker } from "@/lib/types"

interface TrendingMemeSignalsProps {
  trendingMemes: MemeTicker[]
}

export function TrendingMemeSignals({ trendingMemes }: TrendingMemeSignalsProps) {
  const [aiScores, setAiScores] = useState<{[key: string]: {score: string, visible: boolean}}>({});
  const [isClient, setIsClient] = useState(false);
  
  // Set isClient to true when component mounts on client
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // Initialize AI scores on component mount
  useEffect(() => {
    if (!isClient || trendingMemes.length === 0) return;
    
    const scores: {[key: string]: {score: string, visible: boolean}} = {};
    trendingMemes.forEach(meme => {
      scores[meme.id] = {
        score: getMemeHeatIndex(meme.volume).toString(),
        visible: false
      };
    });
    
    // Start showing AI scores with a typing effect
    let delay = 500;
    Object.keys(scores).forEach(id => {
      setTimeout(() => {
        setAiScores(prev => ({
          ...prev,
          [id]: { ...prev[id], visible: true }
        }));
      }, delay);
      delay += 800;
    });
  }, [trendingMemes, isClient]);

  // Create ticker display with duplicates for infinite scroll effect
  const tickerText = trendingMemes.length > 0 
    ? trendingMemes.map(meme => 
        `#${meme.ticker}:${formatLulzScore(meme.price)} ${formatVibeShift(meme.percentChange)}`
      ).join(' • ')
    : "LOADING MEME DATA • PLEASE WAIT • SCANNER INITIALIZING";
  
  // Create duplicate for smooth scrolling
  const duplicatedText = `${tickerText} • ${tickerText} • ${tickerText}`;
  
  // Show random alerts
  const [alert, setAlert] = useState<{visible: boolean, text: string, position: {top: string, left: string}}>({
    visible: false,
    text: "",
    position: {top: "10%", left: "20%"}
  });
  
  // Add random alerts
  useEffect(() => {
    if (!isClient) return;
    
    const showRandomAlert = () => {
      const alerts = [
        "BREAKING: NEW MEME FORMAT DETECTED",
        "ALERT: VIRALITY SPIKE DETECTED",
        "WARNING: SIGNIFICANT SOCIAL VOLUME",
        "SIGNAL: MEME CROSSOVER DETECTED"
      ];
      
      const randomAlert = alerts[Math.floor(Math.random() * alerts.length)];
      const top = `${Math.floor(Math.random() * 70) + 10}%`;
      const left = `${Math.floor(Math.random() * 60) + 20}%`;
      
      setAlert({
        visible: true,
        text: randomAlert,
        position: {top, left}
      });
      
      setTimeout(() => {
        setAlert(prev => ({...prev, visible: false}));
      }, 4000);
    };
    
    // Show alerts every 10-20 seconds
    const interval = setInterval(() => {
      showRandomAlert();
    }, Math.random() * 10000 + 10000);
    
    return () => clearInterval(interval);
  }, [isClient]);
  
  const showLoadingState = !isClient || trendingMemes.length === 0;
  
  return (
    <div className="border border-[#555555] mb-2 bg-[#171717]">
      <div className="border-b border-[#555555] bg-[#13233a] px-2 py-1">
        <div className="flex justify-between">
          <h2 className="font-bold text-[#ffd75e]">TOP VIRAL MEME SIGNALS</h2>
          <span className="text-[#6ab6fd] text-xs">AI RANKED</span>
        </div>
      </div>
      
      {/* Scrolling ticker banner */}
      <div className="ticker-container px-2 py-1 bg-[#13233a] border-b border-[#555555]">
        <div className="ticker-scroll text-[#ffd75e]">
          {duplicatedText}
        </div>
      </div>
      
      <div className="px-2 py-1 bg-[#171717]">
        <div className="text-xs text-[#6ab6fd] mb-1">Real-time engagement velocity | Sorted by Meme Heat Index</div>
        
        {showLoadingState ? (
          <div className="grid grid-cols-5 gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="border border-[#555555] bg-[#13233a] p-1 relative min-h-[100px]">
                <div className="animate-pulse flex flex-col items-center justify-center h-full">
                  <div className="h-10 w-10 bg-[#555555] rounded mb-2"></div>
                  <div className="h-2 w-16 bg-[#555555] rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-5 gap-1">
            {trendingMemes.map((meme) => (
              <div key={meme.id} className="border border-[#555555] bg-[#13233a] p-1 relative">
                <div className="absolute top-0 right-0 bg-[#8a171a] text-white text-xs px-1 flex items-center">
                  <span className="mr-1 text-[#6ab6fd]">HEAT:</span>
                  {aiScores[meme.id]?.visible ? (
                    <div className="typing-container">
                      <span className="typing-text text-[#ffd75e]">{aiScores[meme.id]?.score || '??'}</span>
                      <span className="cursor"></span>
                    </div>
                  ) : (
                    <span className="cursor"></span>
                  )}
                </div>
                <div className="font-bold text-[#ffd75e]">#{meme.ticker}</div>
                <div className="w-full h-[36px] relative mb-1 border border-[#555555]">
                  <Image
                    src={meme.imageUrl || "/placeholder.svg"}
                    alt={meme.title}
                    fill
                    sizes="100%"
                    className="object-cover"
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className={`${meme.percentChange >= 0 ? "text-[#00b04d]" : "text-[#d7282f]"} ${Math.abs(meme.percentChange) > 10 ? (meme.percentChange >= 0 ? "flash-green" : "flash-red") : ""}`}>
                  {formatLulzScore(meme.price)} ({formatVibeShift(meme.percentChange)})
                </div>
                <div className="text-[#6ab6fd] text-xs mt-1 flex justify-between">
                  <span>IMP:</span>
                  <span className="text-[#ffd75e]">{Math.floor(meme.volume / 1000)}K</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Random alert box */}
      {alert.visible && (
        <div className="alert-box" style={{top: alert.position.top, left: alert.position.left}}>
          {alert.text}
        </div>
      )}
    </div>
  )
}
