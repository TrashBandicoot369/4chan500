"use client"

import "./globals.css"
import "../styles/animations.css"
import type { Metadata } from "next"
import { useState, useEffect } from "react"

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
  const [isClient, setIsClient] = useState(false)
  const [hydrationError, setHydrationError] = useState<string | null>(null)
  
  // Handle hydration error detection
  useEffect(() => {
    setIsClient(true)
    
    // Only enable error tracking in development mode
    if (process.env.NODE_ENV === "development") {
      // Listen for React hydration errors
      const originalConsoleError = console.error
      
      console.error = (...args) => {
        // Check if this is a hydration error
        const errorString = args.join(' ')
        if (errorString.includes('hydrat') || errorString.includes('mismatched')) {
          setHydrationError(errorString)
        }
        originalConsoleError(...args)
      }
      
      return () => {
        console.error = originalConsoleError
      }
    }
    
    // Update timestamp when component mounts
    const timestampEl = document.getElementById('last-updated-time')
    if (timestampEl) {
      timestampEl.innerText = new Date().toLocaleString()
    }
  }, [])
  
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
            <div>Last Updated: <span id="last-updated-time">Loading...</span></div>
            <div>F1:Help | F2:Menu | F3:Charts | F4:Index</div>
          </div>
          
          {/* Hydration error display - only visible in development mode */}
          {process.env.NODE_ENV === "development" && hydrationError && (
            <div style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '10px',
              background: '#ffcccc',
              color: 'black',
              zIndex: 9999,
              fontSize: '14px',
              boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
              maxHeight: '30vh',
              overflow: 'auto'
            }}>
              <h3>Hydration Error Detected!</h3>
              <p style={{ whiteSpace: 'pre-wrap' }}>{hydrationError}</p>
              <p>
                <strong>Client Hydrated:</strong> {isClient ? 'Yes' : 'No'}
              </p>
            </div>
          )}
        </div>
      </body>
    </html>
  )
}
