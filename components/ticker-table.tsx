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
        <h2 className="font-bold">MEME STONK MARKET</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-[#ddffdd] border-b border-black">
              <th className="p-2 text-left border-r border-black cursor-pointer" onClick={() => onSort("ticker")}>
                Ticker{getSortIndicator("ticker")}
              </th>
              <th className="p-2 text-left border-r border-black">Image</th>
              <th className="p-2 text-left border-r border-black">Title</th>
              <th className="p-2 text-right border-r border-black cursor-pointer" onClick={() => onSort("price")}>
                Price{getSortIndicator("price")}
              </th>
              <th
                className="p-2 text-right border-r border-black cursor-pointer"
                onClick={() => onSort("percentChange")}
              >
                24h %{getSortIndicator("percentChange")}
              </th>
              <th className="p-2 text-right cursor-pointer" onClick={() => onSort("volume")}>
                Volume{getSortIndicator("volume")}
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
                <td className="p-2 border-r border-t border-black">{meme.title}</td>
                <td className="p-2 border-r border-t border-black text-right">{formatCurrency(meme.price)}</td>
                <td
                  className={`p-2 border-r border-t border-black text-right ${
                    meme.percentChange >= 0 ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {formatPercentage(meme.percentChange)}
                </td>
                <td className="p-2 border-t border-black text-right">{formatNumber(meme.volume)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
