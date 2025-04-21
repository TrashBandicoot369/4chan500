export interface MemeTicker {
  id: string
  ticker: string // Now represents "Meme Signal" or "Thread ID"
  title: string
  imageUrl: string
  price: number // Now represents "LULZ Score"
  percentChange: number // Now represents "Vibe Shift %"
  volume: number // Now represents "Impression Count"
  timestamp: number
}
