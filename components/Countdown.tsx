'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FESTA_CONFIG } from '@/lib/config'

interface TimeLeft {
  dias: number
  horas: number
  minutos: number
  segundos: number
}

function calcularTempo(): TimeLeft | null {
  const agora = Date.now()
  const festa = new Date(`${FESTA_CONFIG.dataFesta}T${FESTA_CONFIG.horarioFesta}:00`).getTime()
  const diff = Math.floor((festa - agora) / 1000)

  if (diff <= 0) return null

  return {
    dias: Math.floor(diff / 86400),
    horas: Math.floor((diff % 86400) / 3600),
    minutos: Math.floor((diff % 3600) / 60),
    segundos: diff % 60,
  }
}

function FlipCard({ value, label, color }: { value: number; label: string; color: string }) {
  const display = String(value).padStart(2, '0')

  return (
    <div className="flex flex-col items-center gap-2">
      <AnimatePresence mode="wait">
        <motion.div
          key={display}
          initial={{ rotateX: -90, opacity: 0 }}
          animate={{ rotateX: 0, opacity: 1 }}
          exit={{ rotateX: 90, opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="relative"
          style={{ perspective: 400 }}
        >
          <div
            className="w-16 h-20 md:w-24 md:h-28 rounded-2xl flex items-center justify-center shadow-xl"
            style={{ background: color }}
          >
            <span className="font-bubblegum text-4xl md:text-6xl text-white drop-shadow">
              {display}
            </span>
          </div>
        </motion.div>
      </AnimatePresence>
      <span className="font-nunito font-bold text-xs md:text-sm uppercase tracking-widest text-white/90">
        {label}
      </span>
    </div>
  )
}

function Separator() {
  return (
    <span className="font-bubblegum text-3xl md:text-5xl text-white/80 mt-4 select-none">
      :
    </span>
  )
}

export function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null | 'loading'>('loading')

  useEffect(() => {
    setTimeLeft(calcularTempo())
    const id = setInterval(() => setTimeLeft(calcularTempo()), 1000)
    return () => clearInterval(id)
  }, [])

  if (timeLeft === 'loading') return null

  return (
    <section
      className="py-16 px-4 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #FF6B9D 0%, #C084FC 50%, #4DAEE5 100%)',
      }}
    >
      {/* Fundo decorativo */}
      <div className="absolute inset-0 opacity-10">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: `${Math.random() * 60 + 20}px`,
              height: `${Math.random() * 60 + 20}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-bubblegum text-3xl md:text-5xl text-white mb-2 drop-shadow-lg"
        >
          ⏰ Faltam apenas...
        </motion.h2>
        <p className="text-white/80 font-nunito font-semibold mb-10 text-lg">
          Corre que vem festa! 🎪🎈
        </p>

        {timeLeft === null ? (
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="font-bubblegum text-4xl text-white"
          >
            🎉 A festa já aconteceu! Que saudade!
          </motion.p>
        ) : (
          <div className="flex items-start justify-center gap-3 md:gap-6">
            <FlipCard value={timeLeft.dias} label="Dias" color="rgba(0,0,0,0.25)" />
            <Separator />
            <FlipCard value={timeLeft.horas} label="Horas" color="rgba(0,0,0,0.25)" />
            <Separator />
            <FlipCard value={timeLeft.minutos} label="Min" color="rgba(0,0,0,0.25)" />
            <Separator />
            <FlipCard value={timeLeft.segundos} label="Seg" color="rgba(255,255,255,0.2)" />
          </div>
        )}
      </div>
    </section>
  )
}
