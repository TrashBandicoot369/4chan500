"use client"

import type React from "react"

import { useState } from "react"
import { generateId } from "@/lib/utils"
import type { MemeTicker } from "@/lib/types"

// List of available meme images
const memeImages = [
  "/assets/memes/trollface.jpg",
  "/assets/memes/wojak.jpg",
  "/assets/memes/pepe the frog.jpg",
  "/assets/memes/doge.jpg",
  "/assets/memes/surprised pikachu.jpg",
  "/assets/memes/stonks.jpg",
  "/assets/memes/this is fine.jpg",
  "/assets/memes/hide the pain harold.jpg",
  "/assets/memes/sad pablo.jpg",
  "/assets/memes/giga cahd.jpg",
  "/assets/memes/distracted boyfriend.jpg",
  "/assets/memes/woman yelling at cat.jpg",
  "/assets/memes/hotline bling.jpg",
  "/assets/memes/numa numa.jpg",
  "/assets/memes/star wars kid.jpg",
  "/assets/memes/change my mind.jpg",
  "/assets/memes/Mocking-Spongebob.jpg",
  "/assets/memes/two buttons.jpg",
  "/assets/memes/big chungus.jpg",
  "/assets/memes/saltbae.jpg",
  "/assets/memes/karen.jpg",
  "/assets/memes/good guy greg.jpg",
  "/assets/memes/overly attached girlfriend.jpg",
  "/assets/memes/chocolate rain.jpg",
  "/assets/memes/morpheus.jpg",
  "/assets/memes/leroy jenkins.jpg",
  "/assets/memes/philosoraptor.jpg",
  "/assets/memes/scumbag steve.jpg",
  "/assets/memes/chuck norris facts.jpg",
  "/assets/memes/Disaster_Girl.jpg",
  "/assets/memes/ancient aliens guy.jpg",
  "/assets/memes/Confused Math Lady.jpg",
  "/assets/memes/Success Kid.jpg",
  "/assets/memes/Keyboard Cat.jpg",
  "/assets/memes/Over 9000.jpg",
  "/assets/memes/Harambe.jpg",
  "/assets/memes/bad luck bryan.jpg",
  "/assets/memes/one does not simply.jpg",
  "/assets/memes/dancing baby.jpg",
  "/assets/memes/grumpy cat.jpg",
  "/assets/memes/nyan cat.jpg",
  "/assets/memes/rage comics.jpg",
  "/assets/memes/lolcats.jpg",
  "/assets/memes/rick roll.jpg",
  "/assets/memes/leonardo dicaprio laughing.jpg",
  "/assets/memes/first world problems.jpg",
]

interface SubmissionFormProps {
  onSubmit: (meme: MemeTicker) => void
}

export function SubmissionForm({ onSubmit }: SubmissionFormProps) {
  const [ticker, setTicker] = useState("")
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState("")
  const [percentChange, setPercentChange] = useState("")
  const [volume, setVolume] = useState("")
  const [error, setError] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!ticker || !title || !price || !percentChange || !volume) {
      setError("All fields are required")
      return
    }

    if (!ticker.match(/^[A-Z0-9]{1,5}$/)) {
      setError("Ticker must be 1-5 uppercase letters/numbers")
      return
    }

    // Select a random meme image from our collection
    const randomImageIndex = Math.floor(Math.random() * memeImages.length)
    const randomImage = memeImages[randomImageIndex]

    // Simulate AI analysis
    setIsAnalyzing(true)
    setTimeout(() => {
      const newMeme: MemeTicker = {
        id: generateId(),
        ticker,
        title,
        imageUrl: randomImage,
        price: Number.parseFloat(price),
        percentChange: Number.parseFloat(percentChange),
        volume: Number.parseFloat(volume),
        timestamp: Date.now(),
      }
  
      onSubmit(newMeme)
  
      // Reset form
      setTicker("")
      setTitle("")
      setPrice("")
      setPercentChange("")
      setVolume("")
      setError("")
      setIsAnalyzing(false)
    }, 1500)
  }

  return (
    <div className="border border-[#555555] mb-2 bg-[#171717]">
      <div className="border-b border-[#555555] bg-[#13233a] px-2 py-1">
        <h2 className="font-bold text-[#ffd75e] flex justify-between">
          <span>MEME SCAN REQUEST</span>
          <span className="text-xs text-[#6ab6fd]">BLMBG &lt;MEME&gt; SCAN</span>
        </h2>
      </div>
      <div className="p-2">
        {error && (
          <div className="mb-3 p-1 border border-[#d7282f] bg-[#13233a] text-[#d7282f]">{error}</div>
        )}
        <p className="text-xs mb-2 text-[#6ab6fd]">
          Enter parameters for AI meme analysis. Our system will evaluate impressions and sentiment metrics.
        </p>
        <form onSubmit={handleSubmit} className="grid gap-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label className="block mb-1 text-xs text-[#ffd75e]">TICKER SYMBOL</label>
              <input
                type="text"
                value={ticker}
                onChange={(e) => setTicker(e.target.value.toUpperCase())}
                className="w-full p-1 border border-[#555555] bg-[#13233a] text-[#ffd75e] font-mono text-sm"
                placeholder="MEME"
                maxLength={5}
              />
            </div>
            <div>
              <label className="block mb-1 text-xs text-[#ffd75e]">DESCRIPTION</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-1 border border-[#555555] bg-[#13233a] text-[#ffd75e] font-mono text-sm"
                placeholder="Name"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block mb-1 text-xs text-[#ffd75e]">LULZ</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-1 border border-[#555555] bg-[#13233a] text-[#ffd75e] font-mono text-sm"
                placeholder="420.69"
                step="0.01"
                min="0"
              />
            </div>
            <div>
              <label className="block mb-1 text-xs text-[#ffd75e]">TREND %</label>
              <input
                type="number"
                value={percentChange}
                onChange={(e) => setPercentChange(e.target.value)}
                className="w-full p-1 border border-[#555555] bg-[#13233a] text-[#ffd75e] font-mono text-sm"
                placeholder="-69.42"
                step="0.01"
              />
            </div>
            <div>
              <label className="block mb-1 text-xs text-[#ffd75e]">IMPRESSIONS</label>
              <input
                type="number"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                className="w-full p-1 border border-[#555555] bg-[#13233a] text-[#ffd75e] font-mono text-sm"
                placeholder="8008135"
                step="1"
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 text-xs text-[#ffd75e]">FORMAT ANALYSIS</label>
            <div className="p-1 border border-[#555555] bg-[#13233a] text-[#6ab6fd] text-xs">
              AI auto-classify: [image recognition] ≫ [semantic analysis] ≫ [format determination]
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isAnalyzing}
              className={`p-1 border border-[#555555] font-bold w-full text-sm ${
                isAnalyzing 
                  ? "bg-[#8a171a] text-white" 
                  : "bg-[#13233a] hover:bg-[#23335a] text-[#ffd75e]"
              }`}
            >
              {isAnalyzing ? "⟳ PROCESSING REQUEST..." : "EXECUTE MEME ANALYSIS"}
            </button>
          </div>
          {isAnalyzing && (
            <div className="text-xs text-[#6ab6fd] text-center">
              Running impression analysis | Processing sentiment metrics | Computing market impact
            </div>
          )}
        </form>
      </div>
    </div>
  )
}
