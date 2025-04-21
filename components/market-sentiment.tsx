"use client"

import { useEffect, useState } from "react"

interface MemeSentimentProps {
  sentiment: "bullish" | "bearish" | "neutral"
}

export function MemeSentiment({ sentiment }: MemeSentimentProps) {
  const [metrics, setMetrics] = useState({
    impressions: "0M",
    virality: "0.00",
    diversity: "Low"
  });
  
  // Animate metrics with count-up effect
  useEffect(() => {
    const targetMetrics = getMetricData();
    
    // Extract the numeric part from impressions
    const targetImpNum = parseFloat(targetMetrics.impressions.replace(/[^\d.-]/g, ''));
    const targetVirality = parseFloat(targetMetrics.virality);
    
    // Start from lower values
    let currentImpNum = targetImpNum * 0.2;
    let currentVirality = targetVirality * 0.2;
    
    // Animate the values
    const interval = setInterval(() => {
      if (currentImpNum < targetImpNum) {
        currentImpNum += targetImpNum * 0.1;
        
        // Format with arrow direction
        const arrow = targetMetrics.impressions.startsWith("↑") ? "↑" : 
                     targetMetrics.impressions.startsWith("↓") ? "↓" : "→";
        
        setMetrics(prev => ({
          ...prev,
          impressions: `${arrow} ${currentImpNum.toFixed(1)}M`
        }));
      }
      
      if (currentVirality < targetVirality) {
        currentVirality += targetVirality * 0.1;
        setMetrics(prev => ({
          ...prev,
          virality: currentVirality.toFixed(2)
        }));
      }
      
      // Stop once we reach the target values
      if (currentImpNum >= targetImpNum && currentVirality >= targetVirality) {
        setMetrics(targetMetrics);
        clearInterval(interval);
      }
    }, 100);
    
    return () => clearInterval(interval);
  }, [sentiment]);

  const getSentimentColor = () => {
    switch (sentiment) {
      case "bullish":
        return "text-[#00b04d]" // Green
      case "bearish":
        return "text-[#d7282f]" // Red
      default:
        return "text-[#ffd75e]" // Yellow
    }
  }

  const getSentimentText = () => {
    switch (sentiment) {
      case "bullish":
        return "ASCENDING: Social sentiment positive, meme reach expanding 🚀"
      case "bearish":
        return "DESCENDING: Negative engagement metrics, reduced impression count 📉"
      default:
        return "STABLE: Balanced social indicators, steady impression rate 🦀"
    }
  }

  const getAIInsight = () => {
    switch (sentiment) {
      case "bullish":
        return "AI Prediction: Rising meme velocity across platforms. Top formats seeing increased engagement."
      case "bearish":
        return "AI Prediction: Declining interaction rates. Meme fatigue detected in primary demographics."
      default:
        return "AI Prediction: Stable engagement metrics. New format emergence likely within 48-72 hours."
    }
  }

  const getMetricData = () => {
    switch (sentiment) {
      case "bullish":
        return { impressions: "↑ 24.8M", virality: "0.83", diversity: "High" }
      case "bearish":
        return { impressions: "↓ 12.3M", virality: "0.32", diversity: "Low" }
      default:
        return { impressions: "→ 18.5M", virality: "0.57", diversity: "Medium" }
    }
  }

  // Add bearish underline class
  const sentimentClass = `font-bold ${getSentimentColor()} pulse-sentiment ${sentiment === "bearish" ? "red-underline" : ""}`;

  return (
    <div className="border border-[#555555] mb-2 bg-[#171717]">
      <div className="border-b border-[#555555] bg-[#13233a] px-2 py-1 flex justify-between items-center">
        <span className="font-bold text-[#ffd75e]">MEME SENTIMENT ANALYSIS</span>
        <span className={sentimentClass}>{getSentimentText()}</span>
      </div>
      <div className="px-2 py-1">
        <div className="mb-2 text-[#6ab6fd]">{getAIInsight()}</div>
        <div className="grid grid-cols-3 gap-2 text-xs border-t border-[#555555] pt-2">
          <div className="px-2 py-1 bg-[#13233a] border border-[#555555]">
            <div className="text-[#6ab6fd] font-semibold">SOCIAL IMPRESSIONS</div>
            <div className={`${getSentimentColor()} count-up`}>{metrics.impressions}</div>
          </div>
          <div className="px-2 py-1 bg-[#13233a] border border-[#555555]">
            <div className="text-[#6ab6fd] font-semibold">VIRALITY INDEX</div>
            <div className={`${getSentimentColor()} count-up`}>{metrics.virality}</div>
          </div>
          <div className="px-2 py-1 bg-[#13233a] border border-[#555555]">
            <div className="text-[#6ab6fd] font-semibold">FORMAT DIVERSITY</div>
            <div className={`${getSentimentColor()} count-up`}>{metrics.diversity}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
