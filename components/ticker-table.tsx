"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { formatCurrency, formatNumber, formatPercentage } from "@/lib/utils"
import type { MemeTicker } from "@/lib/types"

interface TickerTableProps {
  memes: MemeTicker[]
  onSort: (key: keyof MemeTicker) => void
  sortConfig: {
    key: keyof MemeTicker
    direction: "ascending" | "descending"
  } | null
}

export function TickerTable({ memes, onSort, sortConfig }: TickerTableProps) {
  const [numericValues, setNumericValues] = useState<{[key: string]: {price: number, percentChange: number, volume: number}}>({});
  
  // Initialize values and start animation effect
  useEffect(() => {
    const initialValues: {[key: string]: {price: number, percentChange: number, volume: number}} = {};
    
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
        <h2 className="font-bold text-[#ffd75e]">4CHAN500 MEME INDEX FUND COMPONENTS</h2>
        <div className="text-xs text-[#6ab6fd] mt-0.5 flex justify-between">
          <span>AI-tracked real-time meme data | Sorted by {sortConfig?.key || 'default'} ({sortConfig?.direction || 'neutral'})</span>
          <span>MEMX <span className="text-[#ffd75e]">500</span> Index</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#13233a] text-[#ffd75e]">
              <th className="px-2 py-1 text-left border border-[#555555] cursor-pointer" onClick={() => onSort("ticker")}>
                TICKER{getSortIndicator("ticker")}
              </th>
              <th className="px-2 py-1 text-left border border-[#555555]">
                IMG
              </th>
              <th className="px-2 py-1 text-left border border-[#555555]">
                MEME ID
              </th>
              <th className="px-2 py-1 text-right border border-[#555555] cursor-pointer" onClick={() => onSort("price")}>
                LULZ{getSortIndicator("price")}
              </th>
              <th
                className="px-2 py-1 text-right border border-[#555555] cursor-pointer"
                onClick={() => onSort("percentChange")}
              >
                CHG%{getSortIndicator("percentChange")}
              </th>
              <th className="px-2 py-1 text-right border border-[#555555] cursor-pointer" onClick={() => onSort("volume")}>
                IMP{getSortIndicator("volume")}
              </th>
            </tr>
          </thead>
          <tbody>
            {memes.map((meme, index) => {
              const isBigMover = Math.abs(meme.percentChange) > 10;
              const currentValues = numericValues[meme.id] || meme;
              
              return (
                <tr key={meme.id} className={`${index % 2 === 0 ? "bg-[#171717]" : "bg-[#1c1c1c]"} hover:bg-[#13233a]`}>
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
                      Rank: <span className="text-white">#{Math.floor(Math.random() * 500) + 1}</span>
                      <span className="ml-2 text-[#6ab6fd]">Conf:</span> <span className="text-white">{(Math.random() * 0.3 + 0.7).toFixed(2)}</span>
                    </div>
                  </td>
                  <td className={`px-2 py-1 border border-[#555555] text-right text-white ${isBigMover ? (meme.percentChange >= 0 ? "flash-green" : "flash-red") : ""}`}>
                    {formatCurrency(currentValues.price)}
                  </td>
                  <td
                    className={`px-2 py-1 border border-[#555555] text-right ${
                      meme.percentChange >= 0 ? "text-[#00b04d]" : "text-[#d7282f]"
                    } ${isBigMover ? (meme.percentChange >= 0 ? "flash-green" : "flash-red") : ""}`}
                  >
                    {formatPercentage(currentValues.percentChange)}
                  </td>
                  <td className="px-2 py-1 border border-[#555555] text-right">
                    <div className="text-white count-up">{formatNumber(currentValues.volume)}</div>
                    <div className="text-xs text-[#6ab6fd]">
                      {meme.percentChange >= 0 ? "↑" : "↓"} {formatNumber(Math.abs(Math.floor(currentValues.volume * currentValues.percentChange / 100)))}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="px-2 py-1 text-xs text-[#6ab6fd] border-t border-[#555555]">
        <p>Last update: {new Date().toLocaleTimeString()} | AI-generated metrics | MEMX <span className="text-[#ffd75e]">Bloomberg Professional</span></p>
      </div>
    </div>
  )
}
