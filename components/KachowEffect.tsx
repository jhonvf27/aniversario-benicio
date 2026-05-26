'use client'

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'

// 8 raios voando em todas as direções
const SPARKS = Array.from({ length: 8 }, (_, i) => {
  const angle = (i / 8) * 2 * Math.PI
  return {
    id: i,
    dx: Math.cos(angle) * 160,
    dy: Math.sin(angle) * 160,
  }
})

/** Hook: retorna trigger e estado ativo */
export function useKachow() {
  const [active, setActive] = useState(false)

  const trigger = useCallback(() => {
    if (active) return
    setActive(true)
    setTimeout(() => setActive(false), 1400)
  }, [active])

  return { active, trigger }
}

/** Overlay com animação Ka-chow! — renderize uma vez na página */
export function KachowOverlay({ active }: { active: boolean }) {
  if (!active) return null

  return (
    <div
      className="fixed inset-0 z-[60] pointer-events-none flex items-center justify-center overflow-hidden"
      aria-hidden="true"
    >
      {/* Flash radial */}
      <motion.div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at center, rgba(255,215,0,0.65) 0%, rgba(255,107,0,0.25) 45%, transparent 70%)',
        }}
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      />

      {/* Texto Ka-chow! */}
      <motion.div
        className="relative z-10 text-center select-none"
        initial={{ scale: 0, rotate: -18, opacity: 1 }}
        animate={{
          scale: [0, 1.55, 1.35, 1.35, 0],
          rotate: [-18, 6, 0, 0, 0],
          opacity: [0, 1, 1, 1, 0],
        }}
        transition={{
          duration: 1.3,
          times: [0, 0.22, 0.38, 0.68, 1],
          ease: ['easeOut', 'easeOut', 'linear', 'easeIn'],
        }}
      >
        <span
          className="font-bubblegum block leading-none"
          style={{
            fontSize: 'clamp(3.5rem, 12vw, 7rem)',
            fontStyle: 'italic',
            color: '#FFD700',
            WebkitTextStroke: '2px #C01020',
            textShadow:
              '0 0 40px rgba(255,107,0,0.9), 4px 4px 0 #C01020, -2px -2px 0 #9A0010, 0 8px 24px rgba(0,0,0,0.35)',
          }}
        >
          Ka-chow!
        </span>
        <span
          className="block mt-1"
          style={{ fontSize: 'clamp(2.5rem, 8vw, 5rem)' }}
        >
          ⚡
        </span>
      </motion.div>

      {/* Raios voando para fora */}
      {SPARKS.map(({ id, dx, dy }) => (
        <motion.span
          key={id}
          className="absolute text-3xl"
          style={{ top: 'calc(50% - 20px)', left: 'calc(50% - 20px)' }}
          initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
          animate={{ x: dx, y: dy, opacity: 0, scale: 1.4 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
        >
          ⚡
        </motion.span>
      ))}
    </div>
  )
}
