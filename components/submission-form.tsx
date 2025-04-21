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
  }

  return (
    <div className="border-2 border-black mb-4">
      <div className="border-b-2 border-black bg-[#99cc99] p-2">
        <h2 className="font-bold">SUBMIT NEW MEME STONK</h2>
      </div>
      <div className="p-4 bg-[#ddffdd]">
        {error && <div className="mb-4 p-2 border-2 border-red-500 bg-red-100 text-red-700">{error}</div>}
        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 font-bold">Meme Ticker (e.g., $KEK)</label>
              <input
                type="text"
                value={ticker}
                onChange={(e) => setTicker(e.target.value.toUpperCase())}
                className="w-full p-2 border-2 border-black font-mono"
                placeholder="STONK"
                maxLength={5}
              />
            </div>
            <div>
              <label className="block mb-1 font-bold">Meme Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border-2 border-black font-mono"
                placeholder="To The Moon"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 font-bold">Fake Price ($)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-2 border-2 border-black font-mono"
                placeholder="420.69"
                step="0.01"
                min="0"
              />
            </div>
            <div>
              <label className="block mb-1 font-bold">Fake % Change</label>
              <input
                type="number"
                value={percentChange}
                onChange={(e) => setPercentChange(e.target.value)}
                className="w-full p-2 border-2 border-black font-mono"
                placeholder="-69.42"
                step="0.01"
              />
            </div>
            <div>
              <label className="block mb-1 font-bold">Fake Volume</label>
              <input
                type="number"
                value={volume}
                onChange={(e) => setVolume(e.target.value)}
                className="w-full p-2 border-2 border-black font-mono"
                placeholder="8008135"
                step="1"
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1 font-bold">Meme Image</label>
            <p className="text-sm mb-2">A random meme image will be assigned to your ticker.</p>
            <div className="p-2 border-2 border-black bg-gray-100 text-gray-700">Random meme image selected on submission</div>
          </div>

          <div>
            <button type="submit" className="px-4 py-2 bg-[#99cc99] border-2 border-black font-bold hover:bg-[#88bb88]">
              SUBMIT MEME STONK
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
