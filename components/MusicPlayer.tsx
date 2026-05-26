'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// Coloque um arquivo MP3 em /public/musica.mp3
// Sugestão gratuita: https://pixabay.com/music/ → busque "birthday" ou "children"
const MUSIC_SRC = '/musica.mp3'

export function MusicPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const [hasFile, setHasFile] = useState(false)

  useEffect(() => {
    const audio = new Audio(MUSIC_SRC)
    audio.loop = true
    audio.volume = 0.25
    audio.currentTime = 15
    audio.addEventListener('canplaythrough', () => setHasFile(true), { once: true })
    // Volta para 15s no loop para não começar do zero
    audio.addEventListener('ended', () => { audio.currentTime = 15 })
    audioRef.current = audio

    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [])

  async function toggle() {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      try {
        await audio.play()
        setPlaying(true)
      } catch {
        // autoplay bloqueado ou arquivo não encontrado
      }
    }
  }

  // Só renderiza se o arquivo existir
  if (!hasFile) return null

  return (
    <motion.button
      onClick={toggle}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.92 }}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-2xl
        flex items-center justify-center text-2xl select-none
        bg-gradient-to-br from-rosa to-lilas border-2 border-white/50"
      title={playing ? 'Pausar música' : 'Tocar música 🎵'}
      aria-label={playing ? 'Pausar música' : 'Tocar música'}
    >
      {/* Anel pulsante quando tocando */}
      {playing && (
        <span className="absolute inset-0 rounded-full animate-ping bg-rosa/30 pointer-events-none" />
      )}
      <AnimatePresence mode="wait">
        <motion.span
          key={playing ? 'on' : 'off'}
          initial={{ scale: 0, rotate: -90 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 90 }}
          transition={{ duration: 0.18 }}
        >
          {playing ? '🔊' : '🎵'}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  )
}
