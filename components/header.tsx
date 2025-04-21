export function Header() {
  return (
    <header className="border-2 border-black bg-[#ddffdd] mb-4">
      <div className="border-b-2 border-black bg-[#99cc99] p-2">
        <h1 className="text-2xl font-bold text-center">4chan500 – The Meme Markets Are Open</h1>
      </div>
      <div className="p-2 text-sm">
        <p className="mb-1">
          <span className="font-bold">Disclaimer:</span> This is a parody site. Not financial advice. NGMI.
        </p>
        <div className="flex justify-between text-xs">
          <span>Market Hours: 24/7/365</span>
          <span>Last Updated: {new Date().toLocaleString()}</span>
        </div>
      </div>
    </header>
  )
}
