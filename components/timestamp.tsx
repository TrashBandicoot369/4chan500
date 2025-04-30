'use client'

import { useEffect, useState } from 'react'

export function Timestamp() {
  const [timestamp, setTimestamp] = useState<string>('')

  useEffect(() => {
    // Set initial timestamp
    setTimestamp(new Date().toLocaleString())
    
    // Update timestamp every second
    const interval = setInterval(() => {
      setTimestamp(new Date().toLocaleString())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  return <div className="text-[#ffd75e]" suppressHydrationWarning>LAST UPDATE: {timestamp}</div>
} 