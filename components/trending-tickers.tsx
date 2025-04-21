import Image from "next/image"
import { formatCurrency, formatPercentage } from "@/lib/utils"
import type { MemeTicker } from "@/lib/types"

interface TrendingTickersProps {
  trendingMemes: MemeTicker[]
}

export function TrendingTickers({ trendingMemes }: TrendingTickersProps) {
  return (
    <div className="border border-[#555555] mb-2 bg-[#171717]">
      <div className="border-b border-[#555555] bg-[#13233a] px-2 py-1">
        <div className="flex justify-between">
          <h2 className="font-bold text-[#ffd75e]">TOP TRENDING MEMES</h2>
          <span className="text-[#6ab6fd] text-xs">BLMBG RNKNG</span>
        </div>
      </div>
      <div className="px-2 py-1 bg-[#171717]">
        <div className="text-xs text-[#6ab6fd] mb-1">Real-time engagement velocity | Sorted by AI score</div>
        <div className="grid grid-cols-5 gap-1">
          {trendingMemes.map((meme) => (
            <div key={meme.id} className="border border-[#555555] bg-[#13233a] p-1 relative">
              <div className="absolute top-0 right-0 bg-[#8a171a] text-white text-xs px-1 flex items-center">
                <span className="mr-1 text-[#6ab6fd]">AI:</span>
                <span className="text-[#ffd75e]">{(meme.volume / 1000000).toFixed(1)}</span>
              </div>
              <div className="font-bold text-[#ffd75e]">${meme.ticker}</div>
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
              <div className={meme.percentChange >= 0 ? "text-[#00b04d]" : "text-[#d7282f]"}>
                {formatCurrency(meme.price)} ({formatPercentage(meme.percentChange)})
              </div>
              <div className="text-[#6ab6fd] text-xs mt-1 flex justify-between">
                <span>VOL:</span>
                <span className="text-[#ffd75e]">{Math.floor(meme.volume / 1000)}K</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
