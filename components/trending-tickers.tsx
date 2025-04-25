"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { formatVibeShift } from "@/lib/format-utils"
import type { MemeTicker } from "@/lib/types"

interface TrendingMemeSignalsProps {
  trendingMemes?: MemeTicker[]
}

export function TrendingMemeSignals({ trendingMemes = [] }: TrendingMemeSignalsProps) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Pull exactly top 10 memes by LULZ SCORE
  const topMemes = [...trendingMemes]
    .sort((a, b) => (b.price || 0) - (a.price || 0))
    .slice(0, 10);

  const scrollingMemes = Array(4).fill(topMemes).flat();  // Repeat for smooth scroll

  return (
    <section className="border border-[#555555] mb-4 bg-[#111827]">
      <div className="border-b border-[#555555] bg-[#13233a] px-2 py-1">
        <h2 className="font-bold text-[#ffd75e]">TOP VIRAL MEME SIGNALS</h2>
      </div>
      <div className="px-2 py-1 bg-[#13233a] border-b border-[#555555]">
        <div className="text-xs text-[#6ab6fd]">Real-time engagement velocity | Sorted by LULZ SCORE</div>
      </div>
      {!isClient || trendingMemes.length === 0 ? (
        <div className="p-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse mx-1">
                <div className="w-20 h-20 bg-[#333]"></div>
                <div className="h-3 w-20 mt-1 bg-[#333]"></div>
                <div className="h-3 w-20 mt-1 bg-[#333]"></div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="overflow-hidden">
          <div className="ticker-wrap">
            <div className="ticker">
              {scrollingMemes.map((meme, index) => (
                <div key={`${meme.id}-${index}`} className="ticker__item">
                  <div className="meme-box">
                    <Image
                      src={meme.imageUrl || "/placeholder.svg"}
                      alt={meme.title}
                      width={80}
                      height={80}
                      className="object-cover"
                    />
                  </div>
                  <div className="text-center w-20">
                    <div className="text-[#ffd75e] text-xs font-bold whitespace-nowrap overflow-hidden text-ellipsis">#{meme.ticker}</div>
                    <div className={`text-xs ${meme.percentChange >= 0 ? "text-[#00b04d]" : "text-[#d7282f]"}`}>
                      {formatVibeShift(meme.percentChange)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .meme-box { width: 80px; height: 80px; border: 1px solid #555555; overflow: hidden; }
        .ticker-wrap { overflow: hidden; background-color: #111827; padding: 8px 0; width: 100%; }
        .ticker { display: flex; white-space: nowrap; animation: ticker 60s linear infinite; }
        .ticker__item { flex-shrink: 0; margin: 0 5px; display: flex; flex-direction: column; align-items: center; }
        @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}</style>
    </section>
  )
}
