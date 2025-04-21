interface MarketSentimentProps {
  sentiment: "bullish" | "bearish" | "neutral"
}

export function MarketSentiment({ sentiment }: MarketSentimentProps) {
  const getSentimentColor = () => {
    switch (sentiment) {
      case "bullish":
        return "bg-green-200 text-green-800 border-green-500"
      case "bearish":
        return "bg-red-200 text-red-800 border-red-500"
      default:
        return "bg-yellow-200 text-yellow-800 border-yellow-500"
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

  return (
    <div className={`border-2 border-black mb-4 ${getSentimentColor()}`}>
      <div className="border-b-2 border-black p-2">
        <div className="flex justify-between items-center">
          <span className="font-bold">AI MARKET SENTIMENT ANALYSIS</span>
          <span className="font-bold">{getSentimentText()}</span>
        </div>
      </div>
      <div className="p-2 text-sm">
        <p className="mb-2">{getAIInsight()}</p>
        <div className="grid grid-cols-3 gap-2 mt-2 text-xs">
          <div className="p-1 border border-black bg-white/50 rounded">
            <p className="font-semibold">Twitter Impressions</p>
            <p>{sentiment === "bullish" ? "↑ 24.8M" : sentiment === "bearish" ? "↓ 12.3M" : "→ 18.5M"}</p>
          </div>
          <div className="p-1 border border-black bg-white/50 rounded">
            <p className="font-semibold">Virality Index</p>
            <p>{sentiment === "bullish" ? "0.83" : sentiment === "bearish" ? "0.32" : "0.57"}</p>
          </div>
          <div className="p-1 border border-black bg-white/50 rounded">
            <p className="font-semibold">Format Diversity</p>
            <p>{sentiment === "bullish" ? "High" : sentiment === "bearish" ? "Low" : "Medium"}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
