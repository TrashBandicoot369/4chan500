"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { formatLulzScore, formatNumber, formatVibeShift, getLulzTooltip, LULZ_SYMBOL } from "@/lib/format-utils"
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
  const [lastUpdated, setLastUpdated] = useState<string>("");
  
  // Initialize values without animation - use final values directly
  useEffect(() => {
    const initialValues: NumericValueMap = {};
    
    memes.forEach(meme => {
      initialValues[meme.id] = {
        price: meme.price || 0,
        percentChange: meme.percentChange || 0,
        volume: meme.volume || 0
      };
    });
    
    setNumericValues(initialValues);
    
    // Set the last updated time once
    setLastUpdated(new Date().toLocaleTimeString());
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
                <div className="flex items-center justify-end">
                  <span>LULZ SCORE{getSortIndicator("price")}</span>
                  <span className="text-xs ml-1 text-[#ffd75e]">↕</span>
                </div>
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
              // Ensure all values are defined
              const safeMemeTicker: MemeTicker = {
                id: meme.id || `meme-${index}`,
                ticker: meme.ticker || 'UNKNOWN',
                title: meme.title || 'Untitled Meme',
                imageUrl: meme.imageUrl || '/placeholder.svg',
                price: meme.price || 0,
                percentChange: meme.percentChange || 0,
                volume: meme.volume || 0,
                timestamp: meme.timestamp || Date.now(),
                link: meme.link
              };

              const percentChange = safeMemeTicker.percentChange;
              const isBigMover = Math.abs(percentChange) > 10;
              
              return (
                <tr 
                  key={safeMemeTicker.id} 
                  className={`${index % 2 === 0 ? "bg-[#171717]" : "bg-[#1c1c1c]"} hover:bg-[#13233a] cursor-pointer`}
                  onClick={() => {
                    // Open Reddit post in a new tab
                    if (safeMemeTicker.link) {
                      window.open(safeMemeTicker.link, '_blank', 'noopener,noreferrer');
                    } else {
                      // If no specific link, open a Reddit search for the meme title
                      const searchQuery = encodeURIComponent(safeMemeTicker.title);
                      window.open(`https://www.reddit.com/search/?q=${searchQuery}`, '_blank', 'noopener,noreferrer');
                    }
                  }}
                >
                  <td className="px-2 py-1 border border-[#555555] font-bold text-[#ffd75e]">{safeMemeTicker.ticker}</td>
                  <td className="px-2 py-1 border border-[#555555]">
                    <div className="w-[40px] h-[40px] relative">
                      <Image
                        src={safeMemeTicker.imageUrl}
                        alt={safeMemeTicker.title}
                        fill
                        sizes="40px"
                        className="object-cover border border-[#555555]"
                        style={{ objectFit: "cover" }}
                      />
                    </div>
                  </td>
                  <td className="px-2 py-1 border border-[#555555]">
                    <div className="text-[#6ab6fd]">{safeMemeTicker.title}</div>
                    <div className="text-xs text-[#ffd75e]">
                      Meme Heat: <span className="text-white">#{index + 1}</span>
                      <span className="ml-2 text-[#6ab6fd]">Virality:</span> <span className="text-white">–</span>
                    </div>
                  </td>
                  <td 
                    className={`px-2 py-1 border border-[#555555] text-right text-white ${isBigMover ? (percentChange >= 0 ? "flash-green" : "flash-red") : ""}`}
                    onMouseEnter={() => setShowLulzTooltip(safeMemeTicker.id)}
                    onMouseLeave={() => setShowLulzTooltip(null)}
                  >
                    <div className="relative flex items-center justify-end">
                      <span className="cursor-pointer" onClick={(e) => {
                        e.stopPropagation();
                        onSort("price");
                      }}>
                        {formatLulzScore(safeMemeTicker.price)}
                      </span>
                      <span 
                        className="text-xs text-[#6ab6fd] ml-1 cursor-pointer" 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (safeMemeTicker.link) {
                            window.open(safeMemeTicker.link, '_blank', 'noopener,noreferrer');
                          }
                        }}
                      >
                        🔗
                      </span>
                      {showLulzTooltip === safeMemeTicker.id && (
                        <div className="absolute right-0 bottom-full mb-1 bg-[#000] border border-[#555555] p-1 text-xs text-white z-20 w-40">
                          {getLulzTooltip()}
                        </div>
                      )}
                    </div>
                  </td>
                  <td
                    className={`px-2 py-1 border border-[#555555] text-right ${
                      percentChange >= 0 ? "text-[#00b04d]" : "text-[#d7282f]"
                    } ${isBigMover ? (percentChange >= 0 ? "flash-green" : "flash-red") : ""}`}
                  >
                    {formatVibeShift(percentChange)}
                  </td>
                  <td className="px-2 py-1 border border-[#555555] text-right">
                    <div className="text-white count-up">{formatNumber(safeMemeTicker.volume)}</div>
                    <div className="text-xs text-[#6ab6fd]">
                      {percentChange >= 0 ? "↑" : "↓"} {formatNumber(Math.abs(Math.floor(safeMemeTicker.volume * percentChange / 100)))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="px-2 py-1 text-xs text-[#6ab6fd] border-t border-[#555555]">
        <p>Last update: {lastUpdated} | AI-generated metrics | MEME <span className="text-[#ffd75e]">Trend Analysis</span></p>
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
