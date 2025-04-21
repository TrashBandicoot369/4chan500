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
        return "BULLISH AF: Meme markets mooning! 🚀🌕"
      case "bearish":
        return "BEARISH: Wojak suicide watch initiated 📉💀"
      default:
        return "NEUTRAL: Crab market, sideways action 🦀"
    }
  }

  return (
    <div className={`border-2 border-black mb-4 p-2 ${getSentimentColor()}`}>
      <div className="flex justify-between items-center">
        <span className="font-bold">MARKET SENTIMENT:</span>
        <span className="font-bold">{getSentimentText()}</span>
      </div>
    </div>
  )
}
