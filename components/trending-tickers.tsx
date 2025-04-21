import Image from "next/image"
import { formatCurrency, formatPercentage } from "@/lib/utils"
import type { MemeTicker } from "@/lib/types"

interface TrendingTickersProps {
  trendingMemes: MemeTicker[]
}

export function TrendingTickers({ trendingMemes }: TrendingTickersProps) {
  return (
    <div className="border-2 border-black mb-4">
      <div className="border-b-2 border-black bg-[#99cc99] p-2">
        <h2 className="font-bold">AI-DETECTED TRENDING MEMES</h2>
      </div>
      <div className="p-2 bg-[#ddffdd]">
        <p className="text-xs mb-2 font-medium">Real-time analysis of social media engagement and impression velocity</p>
        <div className="grid grid-cols-5 gap-2 text-sm">
          {trendingMemes.map((meme) => (
            <div key={meme.id} className="border border-black p-1 relative">
              <div className="absolute top-0 right-0 bg-[#99cc99] text-xs px-1 border-l border-b border-black">
                AI Score: {(meme.volume / 1000000).toFixed(1)}
              </div>
              <div className="font-bold">${meme.ticker}</div>
              <div className="w-full h-[40px] relative mb-1">
                <Image
                  src={meme.imageUrl || "/placeholder.svg"}
                  alt={meme.title}
                  fill
                  sizes="100%"
                  className="object-cover"
                  style={{ objectFit: "cover" }}
                />
              </div>
              <div className={meme.percentChange >= 0 ? "text-green-700" : "text-red-700"}>
                {formatCurrency(meme.price)} ({formatPercentage(meme.percentChange)})
              </div>
              <div className="text-xs mt-1">
                Mentions: {Math.floor(meme.volume / 1000)}K
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
