"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { formatLulzScore, formatNumber, formatPercentage, formatVibeShift, getLulzTooltip, LULZ_SYMBOL } from "@/lib/format-utils"
import type { MemeTicker } from "@/lib/types"

interface MemeSignalTableProps {
  memes: MemeTicker[]
  onSort: (key: keyof MemeTicker) => void
  sortConfig: {
    key: keyof MemeTicker
    direction: "ascending" | "descending"
  } | null
}

export function MemeSignalTable({ memes, onSort, sortConfig }: MemeSignalTableProps) {
  type NumericValueMap = Record<string, {price: number, percentChange: number, volume: number}>;
  const [numericValues, setNumericValues] = useState<NumericValueMap>({});
  const [showLulzTooltip, setShowLulzTooltip] = useState<string | null>(null);
  
  // Initialize values and start animation effect
  useEffect(() => {
    const initialValues: NumericValueMap = {};
    
    memes.forEach(meme => {
      // Start with lower values for animation
      initialValues[meme.id] = {
        price: meme.price * 0.98,
        percentChange: meme.percentChange * 0.98,
        volume: meme.volume * 0.98
      };
    });
    
    setNumericValues(initialValues);
    
    // Animate to target values
    const interval = setInterval(() => {
      setNumericValues(prev => {
        const updated = {...prev};
        let allComplete = true;
        
        memes.forEach(meme => {
          if (!updated[meme.id]) return;
          
          // If we're getting close, just set to final value
          if (Math.abs(updated[meme.id].price - meme.price) < 0.01) {
            updated[meme.id].price = meme.price;
          } else {
            updated[meme.id].price += (meme.price - updated[meme.id].price) * 0.2;
            allComplete = false;
          }
          
          if (Math.abs(updated[meme.id].percentChange - meme.percentChange) < 0.01) {
            updated[meme.id].percentChange = meme.percentChange;
          } else {
            updated[meme.id].percentChange += (meme.percentChange - updated[meme.id].percentChange) * 0.2;
            allComplete = false;
          }
          
          if (Math.abs(updated[meme.id].volume - meme.volume) < 1000) {
            updated[meme.id].volume = meme.volume;
          } else {
            updated[meme.id].volume += (meme.volume - updated[meme.id].volume) * 0.2;
            allComplete = false;
          }
        });
        
        if (allComplete) {
          clearInterval(interval);
        }
        
        return updated;
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, [memes]);

  const getSortIndicator = (key: keyof MemeTicker) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null
    }
    return sortConfig.direction === "ascending" ? " ▲" : " ▼"
  }

  return (
    <div className="border border-[#555555] mb-2 bg-[#171717] relative">
      {/* Add static noise overlay */}
      <div className="static-noise opacity-[0.02]"></div>
      
      <div className="border-b border-[#555555] bg-[#13233a] px-2 py-1">
        <h2 className="font-bold text-[#ffd75e]">TOP MEME SIGNAL THREADS</h2>
        <div className="text-xs text-[#6ab6fd] mt-0.5 flex justify-between">
          <span>AI-tracked real-time meme data | Sorted by {sortConfig?.key || 'default'} ({sortConfig?.direction || 'neutral'})</span>
          <span>MEME <span className="text-[#ffd75e]">SCANNER</span> 500</span>
        </div>
        <div className="text-xs text-white mt-0.5">
          <span>Click any row to view on Reddit</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#13233a] text-[#ffd75e]">
              <th className="px-2 py-1 text-left border border-[#555555] cursor-pointer" onClick={() => onSort("ticker")}>
                SIGNAL ID{getSortIndicator("ticker")}
              </th>
              <th className="px-2 py-1 text-left border border-[#555555]">
                IMG
              </th>
              <th className="px-2 py-1 text-left border border-[#555555]">
                MEME ID
              </th>
              <th 
                className="px-2 py-1 text-right border border-[#555555] cursor-pointer relative" 
                onClick={() => onSort("price")}
                onMouseEnter={() => setShowLulzTooltip("header")}
                onMouseLeave={() => setShowLulzTooltip(null)}
              >
                LULZ SCORE{getSortIndicator("price")}
                {showLulzTooltip === "header" && (
                  <div className="absolute right-0 top-full mt-1 bg-[#000] border border-[#555555] p-1 text-xs text-white z-20 w-40">
                    {getLulzTooltip()}
                  </div>
                )}
              </th>
              <th
                className="px-2 py-1 text-right border border-[#555555] cursor-pointer"
                onClick={() => onSort("percentChange")}
              >
                VIBE SHIFT %{getSortIndicator("percentChange")}
              </th>
              <th className="px-2 py-1 text-right border border-[#555555] cursor-pointer" onClick={() => onSort("volume")}>
                IMPRESSIONS{getSortIndicator("volume")}
              </th>
            </tr>
          </thead>
          <tbody>
            {memes.map((meme, index) => {
              const isBigMover = Math.abs(meme.percentChange) > 10;
              
              // TypeScript warnings can be ignored here as we have proper fallbacks
              // The warnings are about potential 'undefined' values, but our OR operator ensures we have valid defaults
              const currentValues = numericValues[meme.id] || { 
                price: meme.price, 
                percentChange: meme.percentChange, 
                volume: meme.volume 
              };
              
              return (
                <tr 
                  key={meme.id} 
                  className={`${index % 2 === 0 ? "bg-[#171717]" : "bg-[#1c1c1c]"} hover:bg-[#13233a] cursor-pointer`}
                  onClick={() => {
                    // Open Reddit post in a new tab
                    if (meme.link) {
                      window.open(meme.link, '_blank', 'noopener,noreferrer');
                    } else {
                      // If no specific link, open a Reddit search for the meme title
                      const searchQuery = encodeURIComponent(meme.title);
                      window.open(`https://www.reddit.com/search/?q=${searchQuery}`, '_blank', 'noopener,noreferrer');
                    }
                  }}
                >
                  <td className="px-2 py-1 border border-[#555555] font-bold text-[#ffd75e]">{meme.ticker}</td>
                  <td className="px-2 py-1 border border-[#555555]">
                    <div className="w-[40px] h-[40px] relative">
                      <Image
                        src={meme.imageUrl || "/placeholder.svg"}
                        alt={meme.title}
                        fill
                        sizes="40px"
                        className="object-cover border border-[#555555]"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  </td>
                  <td className="px-2 py-1 border border-[#555555]">
                    <div className="text-[#6ab6fd]">{meme.title}</div>
                    <div className="text-xs text-[#ffd75e]">
                      Meme Heat: <span className="text-white">#{Math.floor(Math.random() * 500) + 1}</span>
                      <span className="ml-2 text-[#6ab6fd]">Virality:</span> <span className="text-white">{(Math.random() * 0.3 + 0.7).toFixed(2)}</span>
                    </div>
                  </td>
                  <td 
                    className={`px-2 py-1 border border-[#555555] text-right text-white ${isBigMover ? (currentValues.percentChange >= 0 ? "flash-green" : "flash-red") : ""}`}
                    onMouseEnter={() => setShowLulzTooltip(meme.id)}
                    onMouseLeave={() => setShowLulzTooltip(null)}
                  >
                    <div className="relative">
                      {formatLulzScore(currentValues.price)} <span className="text-xs text-[#6ab6fd]">🔗</span>
                      {showLulzTooltip === meme.id && (
                        <div className="absolute right-0 bottom-full mb-1 bg-[#000] border border-[#555555] p-1 text-xs text-white z-20 w-40">
                          {getLulzTooltip()}
                        </div>
                      )}
                    </div>
                  </td>
                  <td
                    className={`px-2 py-1 border border-[#555555] text-right ${
                      currentValues.percentChange >= 0 ? "text-[#00b04d]" : "text-[#d7282f]"
                    } ${isBigMover ? (currentValues.percentChange >= 0 ? "flash-green" : "flash-red") : ""}`}
                  >
                    {formatVibeShift(currentValues.percentChange)}
                  </td>
                  <td className="px-2 py-1 border border-[#555555] text-right">
                    <div className="text-white count-up">{formatNumber(currentValues.volume)}</div>
                    <div className="text-xs text-[#6ab6fd]">
                      {currentValues.percentChange >= 0 ? "↑" : "↓"} {formatNumber(Math.abs(Math.floor(currentValues.volume * currentValues.percentChange / 100)))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="px-2 py-1 text-xs text-[#6ab6fd] border-t border-[#555555]">
        <p>Last update: {new Date().toLocaleTimeString()} | AI-generated metrics | MEME <span className="text-[#ffd75e]">Trend Analysis</span></p>
      </div>
    </div>
  )
}

// New component to fetch memes from Firestore
export function MemeSignalTableWithData() {
  const [memes, setMemes] = useState<MemeTicker[]>([])
  const [loading, setLoading] = useState(true)
  const [sortConfig, setSortConfig] = useState<{
    key: keyof MemeTicker;
    direction: "ascending" | "descending";
  } | null>({
    key: "price",
    direction: "descending"
  })

  useEffect(() => {
    setLoading(true)
    fetch("/api/memes")
      .then(res => res.json())
      .then((data: MemeTicker[]) => {
        setMemes(data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Error fetching memes:", err)
        setLoading(false)
      })
  }, [])

  const handleSort = (key: keyof MemeTicker) => {
    let direction: "ascending" | "descending" = "descending"
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "descending") {
      direction = "ascending"
    }
    
    setSortConfig({ key, direction })
    
    const sortedMemes = [...memes].sort((a, b) => {
      if (a[key] < b[key]) return direction === "ascending" ? -1 : 1
      if (a[key] > b[key]) return direction === "ascending" ? 1 : -1
      return 0
    })
    
    setMemes(sortedMemes)
  }

  if (loading) {
    return <div className="border border-[#555555] mb-2 bg-[#171717] p-4 text-center">
      Loading MEME SCANNER data...
    </div>
  }

  if (memes.length === 0) {
    return <div className="border border-[#555555] mb-2 bg-[#171717] p-4 text-center">
      No meme data available. Please run the KYM scraper first.
    </div>
  }

  return <MemeSignalTable memes={memes} onSort={handleSort} sortConfig={sortConfig} />
}
