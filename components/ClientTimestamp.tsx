"use client"
import { useEffect, useState } from "react"

export default function ClientTimestamp() {
  const [time, setTime] = useState("...")

  useEffect(() => {
    setTime(new Date().toLocaleString())
  }, [])

  return <span>{time}</span>
} 