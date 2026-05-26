'use client'

import { useEffect } from 'react'
import confetti from 'canvas-confetti'

const COLORS = ['#FF6B9D', '#FFD93D', '#4DAEE5', '#C084FC', '#4ADE80', '#FF9A4A']

export function fireConfetti(opts?: { origin?: { x?: number; y?: number } }) {
  const origin = { y: 0.6, x: 0.5, ...opts?.origin }

  confetti({ particleCount: 120, spread: 70, origin, colors: COLORS })

  setTimeout(() => {
    confetti({ particleCount: 80, angle: 60, spread: 55, origin: { x: 0, y: 0.7 }, colors: COLORS })
  }, 200)

  setTimeout(() => {
    confetti({ particleCount: 80, angle: 120, spread: 55, origin: { x: 1, y: 0.7 }, colors: COLORS })
  }, 350)
}

export function fireConfettiSuccess() {
  const end = Date.now() + 2000
  const frame = () => {
    confetti({
      particleCount: 6,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: COLORS,
    })
    confetti({
      particleCount: 6,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: COLORS,
    })
    if (Date.now() < end) requestAnimationFrame(frame)
  }
  frame()
}

/** Dispara confetes automaticamente ao montar — use na página principal */
export function ConfettiOnMount() {
  useEffect(() => {
    const t = setTimeout(() => fireConfetti(), 600)
    return () => clearTimeout(t)
  }, [])

  return null
}
