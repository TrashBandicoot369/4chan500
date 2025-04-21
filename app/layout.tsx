import "./globals.css"
import "../styles/animations.css"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "4CHAN500 - Bloomberg Terminal",
  description: "AI-powered meme index fund tracker",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen text-sm">
        <div className="relative overflow-hidden">
          {/* Static noise overlay */}
          <div className="static-noise"></div>
          
          <div className="flex justify-between items-center p-1 bg-[#8a171a] text-white">
            <div className="font-bold">4CHAN500 Terminal</div>
            <div className="flex space-x-2">
              <span className="px-2 py-0.5 bg-[#13233a] text-[#ffd75e] border border-[#555555]">Help</span>
              <span className="px-2 py-0.5 bg-[#13233a] text-[#ffd75e] border border-[#555555]">Setup</span>
              <span className="px-2 py-0.5 bg-[#13233a] text-[#ffd75e] border border-[#555555]">Export</span>
            </div>
          </div>
          {children}
          <div className="p-1 bg-[#13233a] text-white text-xs border-t border-[#555555] flex justify-between">
            <div>Last Updated: {new Date().toLocaleString()}</div>
            <div>F1:Help | F2:Menu | F3:Charts | F4:Index</div>
          </div>
        </div>
      </body>
    </html>
  )
}
