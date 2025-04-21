"use client"

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
  const getSortIndicator = (key: keyof MemeTicker) => {
    if (!sortConfig || sortConfig.key !== key) {
      return null
    }
    return sortConfig.direction === "ascending" ? " ▲" : " ▼"
  }

  return (
    <div className="border-2 border-black mb-4">
      <div className="border-b-2 border-black bg-[#99cc99] p-2">
        <h2 className="font-bold">4CHAN500 MEME INDEX FUND - AI TRACKED COMPONENTS</h2>
        <p className="text-xs mt-1">Live tracking and analysis of the top memes across social platforms</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#ddffdd] border-b border-black">
              <th className="p-2 text-left border-r border-black cursor-pointer" onClick={() => onSort("ticker")}>
                Ticker{getSortIndicator("ticker")}
              </th>
              <th className="p-2 text-left border-r border-black">Image</th>
              <th className="p-2 text-left border-r border-black">Meme</th>
              <th className="p-2 text-right border-r border-black cursor-pointer" onClick={() => onSort("price")}>
                Index Value{getSortIndicator("price")}
              </th>
              <th
                className="p-2 text-right border-r border-black cursor-pointer"
                onClick={() => onSort("percentChange")}
              >
                24h Change{getSortIndicator("percentChange")}
              </th>
              <th className="p-2 text-right cursor-pointer" onClick={() => onSort("volume")}>
                Social Impressions{getSortIndicator("volume")}
              </th>
            </tr>
          </thead>
          <tbody>
            {memes.map((meme, index) => (
              <tr key={meme.id} className={`${index % 2 === 0 ? "bg-white" : "bg-[#f0fff0]"} hover:bg-[#ddffdd]`}>
                <td className="p-2 border-r border-t border-black font-bold">${meme.ticker}</td>
                <td className="p-2 border-r border-t border-black">
                  <div className="w-[60px] h-[60px] relative overflow-hidden">
                    <Image
                      src={meme.imageUrl || "/placeholder.svg"}
                      alt={meme.title}
                      fill
                      sizes="60px"
                      className="object-cover border border-black"
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                </td>
                <td className="p-2 border-r border-t border-black">
                  <div>{meme.title}</div>
                  <div className="text-xs text-gray-600">
                    Popularity Rank: #{Math.floor(Math.random() * 500) + 1} 
                    <span className="ml-2">AI Confidence: {(Math.random() * 0.3 + 0.7).toFixed(2)}</span>
                  </div>
                </td>
                <td className="p-2 border-r border-t border-black text-right">{formatCurrency(meme.price)}</td>
                <td
                  className={`p-2 border-r border-t border-black text-right ${
                    meme.percentChange >= 0 ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {formatPercentage(meme.percentChange)}
                </td>
                <td className="p-2 border-t border-black text-right">
                  {formatNumber(meme.volume)}
                  <div className="text-xs text-gray-600">
                    {meme.percentChange >= 0 ? "↑" : "↓"} {formatNumber(Math.abs(Math.floor(meme.volume * meme.percentChange / 100)))} today
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-2 text-xs bg-[#ddffdd] border-t border-black">
        <p>* AI-generated metrics based on real-time social media analysis across Twitter, Reddit, and other platforms</p>
        <p>* Index values and impressions updated every 5 minutes through our algorithmic sentiment tracking system</p>
      </div>
    </div>
  )
}
