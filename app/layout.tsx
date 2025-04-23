import "./globals.css"
import "../styles/animations.css"
import type { Metadata } from "next"

// Need to define metadata outside the client component
export const metadata: Metadata = {
  title: "4CHAN500 - Meme Signal Scanner",
  description: "AI-powered meme trend analysis and tracking",
  icons: {
    icon: '/4chan500_favicon.jpg',
    apple: '/4chan500_favicon.jpg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen text-sm" suppressHydrationWarning>
        <div className="relative overflow-hidden">
          {/* Static noise overlay */}
          <div className="static-noise"></div>
          
          <div className="flex justify-between items-center p-1 bg-[#8a171a] text-white">
            <div className="font-bold">4CHAN500 Terminal</div>
            <div className="flex space-x-2">
              <a href="https://youtu.be/dQw4w9WgXcQ" target="_blank" className="px-2 py-0.5 bg-[#13233a] text-[#ffd75e] border border-[#555555]">Help</a>
              <a href="https://knowyourmeme.com/memes/math-lady-confused-lady" target="_blank" className="px-2 py-0.5 bg-[#13233a] text-[#ffd75e] border border-[#555555]">Setup</a>
              <a href="https://youtu.be/ejC4L1DjL9g" target="_blank" className="px-2 py-0.5 bg-[#13233a] text-[#ffd75e] border border-[#555555]">Export</a>
            </div>
          </div>
          
          {/* Main content */}
          {children}
          
          {/* Footer */}
          <div className="p-1 bg-[#13233a] text-white text-xs border-t border-[#555555] flex justify-between">
            <div>Last Updated: <span id="timestamp">Server Time</span></div>
            <div>F1:Help | F2:Menu | F3:Charts | F4:Index</div>
          </div>
          
          {/* Simple script to update timestamp */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                document.getElementById('timestamp').innerText = new Date().toLocaleString();
              `,
            }}
          />
        </div>
      </body>
    </html>
  )
}
