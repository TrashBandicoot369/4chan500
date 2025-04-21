interface MarketSentimentProps {
  sentiment: "bullish" | "bearish" | "neutral"
}

export function MarketSentiment({ sentiment }: MarketSentimentProps) {
  const getSentimentColor = () => {
    switch (sentiment) {
      case "bullish":
        return "text-[#00b04d]" // Bloomberg green
      case "bearish":
        return "text-[#d7282f]" // Bloomberg red
      default:
        return "text-[#ffd75e]" // Bloomberg yellow
    }
  }

  const getSentimentText = () => {
    switch (sentiment) {
      case "bullish":
        return "BULLISH: Social sentiment positive, meme reach expanding 🚀"
      case "bearish":
        return "BEARISH: Negative engagement metrics, reduced impression count 📉"
      default:
        return "NEUTRAL: Balanced social indicators, steady impression rate 🦀"
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

  const metrics = getMetricData();

  return (
    <div className="border border-[#555555] mb-2 bg-[#171717]">
      <div className="border-b border-[#555555] bg-[#13233a] px-2 py-1 flex justify-between items-center">
        <span className="font-bold text-[#ffd75e]">MEME SENTIMENT ANALYSIS</span>
        <span className={`font-bold ${getSentimentColor()}`}>{getSentimentText()}</span>
      </div>
      <div className="px-2 py-1">
        <div className="mb-2 text-[#6ab6fd]">{getAIInsight()}</div>
        <div className="grid grid-cols-3 gap-2 text-xs border-t border-[#555555] pt-2">
          <div className="px-2 py-1 bg-[#13233a] border border-[#555555]">
            <div className="text-[#6ab6fd] font-semibold">TWITTER IMPRESSIONS</div>
            <div className={getSentimentColor()}>{metrics.impressions}</div>
          </div>
          <div className="px-2 py-1 bg-[#13233a] border border-[#555555]">
            <div className="text-[#6ab6fd] font-semibold">VIRALITY INDEX</div>
            <div className={getSentimentColor()}>{metrics.virality}</div>
          </div>
          <div className="px-2 py-1 bg-[#13233a] border border-[#555555]">
            <div className="text-[#6ab6fd] font-semibold">FORMAT DIVERSITY</div>
            <div className={getSentimentColor()}>{metrics.diversity}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
