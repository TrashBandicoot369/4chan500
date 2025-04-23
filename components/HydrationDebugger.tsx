"use client"

import { useEffect, useState } from 'react'

interface HydrationDebuggerProps {
  children: React.ReactNode
}

export default function HydrationDebugger({ children }: HydrationDebuggerProps) {
  const [hydrated, setHydrated] = useState(false)
  const [hydrationError, setHydrationError] = useState<string | null>(null)
  
  // Track hydration state
  useEffect(() => {
    setHydrated(true)
    
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
  }, [])
  
  return (
    <>
      {hydrationError && (
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
            <strong>Client Hydrated:</strong> {hydrated ? 'Yes' : 'No'}
          </p>
        </div>
      )}
      {children}
    </>
  )
} 