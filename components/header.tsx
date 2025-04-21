export function Header() {
  return (
    <header className="border-2 border-black bg-[#ddffdd] mb-4">
      <div className="border-b-2 border-black bg-[#99cc99] p-2">
        <h1 className="text-2xl font-bold text-center">4CHAN500 – The AI-Powered Meme Index Fund</h1>
      </div>
      <div className="p-2">
        <p className="mb-1 text-center font-semibold">
          The first meta-memecoin tracking the top 500 memes across the internet
        </p>
        <p className="mb-2 text-sm">
          <span className="font-bold">About:</span> Powered by advanced AI agents, the 4CHAN500 ranks memes based on popularity, 
          impressions, and social sentiment in real-time.
        </p>
        <div className="flex justify-between text-xs">
          <span className="font-semibold">Market Status: LIVE 24/7/365</span>
          <span>Last AI Update: {new Date().toLocaleString()}</span>
        </div>
      </div>
    </header>
  )
}
