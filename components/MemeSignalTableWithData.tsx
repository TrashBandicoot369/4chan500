"use client"

import { useState, useEffect } from "react"
import { MemeSignalTable } from "./ticker-table"
import type { MemeTicker } from "@/lib/types"

interface MemeSignalTableWithDataProps {
  externalMemes?: MemeTicker[]
}

export default function MemeSignalTableWithData({ externalMemes }: MemeSignalTableWithDataProps = {}) {
  const [memes, setMemes] = useState<MemeTicker[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isClient, setIsClient] = useState(false)
  const [sortConfig, setSortConfig] = useState<{
    key: keyof MemeTicker;
    direction: "ascending" | "descending";
  } | null>({
    key: "price",
    direction: "descending"
  })

  // Add a separate useEffect for client-side detection
  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    // If we have external memes, use those instead of fetching
    if (externalMemes && externalMemes.length > 0) {
      // Apply default sorting to the external memes
      const sortedData = [...externalMemes].sort((a, b) => {
        const aValue = a.price || 0;
        const bValue = b.price || 0;
        if (aValue < bValue) return 1;
        if (aValue > bValue) return -1;
        return 0;
      });
      setMemes(sortedData);
      setLoading(false);
      return;
    }

    // Only fetch data on the client side and if no external memes provided
    if (!isClient) return
    
    const controller = new AbortController()
    const signal = controller.signal
    
    setLoading(true)
    fetch("/api/memes", { signal })
      .then(res => {
        if (!res.ok) {
          throw new Error(`API response status: ${res.status}`)
        }
        return res.json()
      })
      .then((data: MemeTicker[]) => {
        if (Array.isArray(data)) {
          // Sort by price (LULZ SCORE) in descending order by default
          const sortedData = [...data].sort((a, b) => {
            const aValue = a.price || 0;
            const bValue = b.price || 0;
            if (aValue < bValue) return 1;
            if (aValue > bValue) return -1;
            return 0;
          });
          setMemes(sortedData)
          setError(null)
        } else {
          console.error("Invalid API response format:", data)
          setError("Invalid data format received from API")
        }
        setLoading(false)
      })
      .catch(err => {
        // Ignore abort errors
        if (err.name === 'AbortError') return
        
        console.error("Error fetching memes:", err)
        setError(err instanceof Error ? err.message : "Failed to load meme data")
        setLoading(false)
      })
      
    return () => {
      controller.abort()
    }
  }, [isClient, externalMemes]) // Re-run when isClient or externalMemes changes

  const handleSort = (key: keyof MemeTicker) => {
    let direction: "ascending" | "descending" = "descending"
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === "descending") {
      direction = "ascending"
    }
    
    setSortConfig({ key, direction })
    
    const sortedMemes = [...memes].sort((a, b) => {
      const aValue = a[key] || 0;
      const bValue = b[key] || 0;
      if (aValue < bValue) return direction === "ascending" ? -1 : 1;
      if (aValue > bValue) return direction === "ascending" ? 1 : -1;
      return 0;
    })
    
    setMemes(sortedMemes)
  }

  if (!isClient) {
    return (
      <div className="border border-[#555555] mb-2 bg-[#171717] p-4 text-center text-[#ffd75e]">
        <div className="animate-pulse">Initializing MEME SCANNER...</div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="border border-[#555555] mb-2 bg-[#171717] p-4 text-center text-[#ffd75e]">
        <div className="animate-pulse">Loading MEME SCANNER data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="border border-[#555555] mb-2 bg-[#171717] p-4 text-center">
        <div className="text-[#d7282f]">Error: {error}</div>
        <div className="text-[#6ab6fd] mt-2">
          <button 
            onClick={() => {
              setLoading(true)
              setError(null)
              // Retry the fetch after a short delay
              setTimeout(() => {
                fetch("/api/memes")
                  .then(res => {
                    if (!res.ok) {
                      throw new Error(`API response status: ${res.status}`)
                    }
                    return res.json()
                  })
                  .then((data: MemeTicker[]) => {
                    if (Array.isArray(data)) {
                      // Apply default sorting by price (LULZ SCORE) in descending order
                      const sortedData = [...data].sort((a, b) => {
                        const aValue = a.price || 0;
                        const bValue = b.price || 0;
                        if (aValue < bValue) return 1;
                        if (aValue > bValue) return -1;
                        return 0;
                      });
                      setMemes(sortedData)
                    } else {
                      throw new Error("Invalid data format received from API")
                    }
                    setLoading(false)
                  })
                  .catch(err => {
                    const errorMessage = err instanceof Error ? err.message : "Failed to load meme data"
                    setError(errorMessage)
                    setLoading(false)
                  })
              }, 1000)
            }}
            className="px-2 py-1 bg-[#13233a] border border-[#555555] text-[#ffd75e]"
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  if (memes.length === 0) {
    return (
      <div className="border border-[#555555] mb-2 bg-[#171717] p-4 text-center">
        <div className="text-[#ffd75e]">No meme data available.</div>
        <div className="text-[#6ab6fd] mt-2">Please check Firestore collection or run the Reddit scraper</div>
      </div>
    )
  }

  return <MemeSignalTable memes={memes} onSort={handleSort} sortConfig={sortConfig} />
} 