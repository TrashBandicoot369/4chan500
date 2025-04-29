import { Timestamp } from './timestamp'

export function Header() {
  return (
    <header className="border border-[#555555] mb-2 bg-[#171717]">
      <div className="border-b border-[#555555] bg-[#13233a] px-2 py-1">
        <h1 className="text-xl font-bold text-[#ffd75e]">4CHAN500 | Meme Index Fund</h1>
      </div>
      <div className="px-2 py-1">
        <div className="flex justify-between mb-1">
          <div className="text-[#ffd75e]">RANK: <span className="text-[#00b04d]">TRENDING</span></div>
        </div>
        <div className="flex justify-between text-xs">
          <Timestamp />
        </div>
      </div>
      <div className="bg-[#13233a] text-white text-xs px-2 py-1 flex space-x-4 border-t border-[#555555]">
        <span className="text-[#ffd75e]">INDEX</span>
        <span>ANALYTICS</span>
        <span>PERFORMANCE</span>
        <span>CONSTITUENTS</span>
        <span>NEWS</span>
        <span>METRICS</span>
      </div>
    </header>
  )
}
