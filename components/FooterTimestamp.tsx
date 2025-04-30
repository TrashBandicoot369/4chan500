'use client'

import ClientTimestamp from "./ClientTimestamp"

export function FooterTimestamp() {
  return (
    <div className="p-1 bg-[#13233a] text-white text-xs border-t border-[#555555] flex justify-between">
      <div>Last Updated: <ClientTimestamp /></div>
      <div>F1:Help | F2:Menu | F3:Charts | F4:Index</div>
    </div>
  )
} 