'use client'

import { useState, useEffect } from 'react'
import { motion, useAnimation, AnimatePresence } from 'framer-motion'

/**
 * Relâmpago McQueen — SVG redesenhado com gradientes, spoiler e rodas com raios
 * Easter egg: clique para o turbo! 🔥
 */
export function McQueenCar({ className = '' }: { className?: string }) {
  const controls = useAnimation()
  const [turbo, setTurbo] = useState(false)
  const [showHint, setShowHint] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setShowHint(true), 2000)
    return () => clearTimeout(t)
  }, [])

  async function handleClick() {
    if (turbo) return
    setTurbo(true)
    setShowHint(false)

    await controls.start({
      x: '170vw',
      scaleX: 1.15,
      transition: { duration: 0.45, ease: [0.2, 0, 0.9, 1] },
    })

    controls.set({ x: '-30vw', scaleX: 1 })

    await controls.start({
      x: 0,
      scaleX: 1,
      transition: { type: 'spring', stiffness: 160, damping: 16 },
    })

    setTurbo(false)
  }

  return (
    <div className={`relative ${className}`}>
      <motion.div
        animate={controls}
        onClick={handleClick}
        className="cursor-pointer select-none relative"
        title="Clique para o turbo! 🔥"
        whileHover={!turbo ? { scale: 1.03 } : undefined}
      >
        <AnimatePresence>
          {turbo && (
            <motion.div
              key="flames"
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: [0, -6, 2, -4, 0] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, repeat: Infinity }}
              className="absolute top-1/2 -translate-y-[60%] text-4xl pointer-events-none z-10"
              style={{ right: '94%' }}
            >
              🔥
            </motion.div>
          )}
        </AnimatePresence>

        {/* Y bounce — independente do turbo */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        >
          <svg
            viewBox="0 0 280 130"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-full h-full drop-shadow-2xl"
            aria-label="Relâmpago McQueen"
          >
            <defs>
              {/* Gradiente do corpo — vermelho com profundidade */}
              <linearGradient id="mcbody" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#FF2535" />
                <stop offset="45%" stopColor="#E31837" />
                <stop offset="100%" stopColor="#9A0E1C" />
              </linearGradient>
              {/* Gradiente do teto — vermelho mais escuro */}
              <linearGradient id="mcroof" x1="0.3" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#CC1530" />
                <stop offset="100%" stopColor="#7E0A16" />
              </linearGradient>
              {/* Vidro */}
              <linearGradient id="mcglass" x1="0.1" y1="0" x2="0.9" y2="1">
                <stop offset="0%" stopColor="#C8E8FF" stopOpacity="0.96" />
                <stop offset="100%" stopColor="#4070B0" stopOpacity="0.78" />
              </linearGradient>
              {/* Pneu */}
              <radialGradient id="mctire" cx="38%" cy="30%" r="56%">
                <stop offset="0%" stopColor="#404040" />
                <stop offset="100%" stopColor="#0C0C0C" />
              </radialGradient>
            </defs>

            {/* Sombra */}
            <ellipse cx="140" cy="124" rx="90" ry="6" fill="rgba(0,0,0,0.18)" />

            {/* ── SPOILER TRASEIRO ── */}
            {/* Haste */}
            <rect x="31" y="54" width="8" height="24" rx="2" fill="#8C0A16" />
            {/* Asa superior */}
            <path
              d="M 16,47 L 50,47 C 53,47 55,50 53,52 L 19,52 C 17,52 14,50 16,47 Z"
              fill="#C01430"
            />
            {/* Reflexo na asa */}
            <path
              d="M 17,47 L 51,47 L 51,49 L 17,49 Z"
              fill="#E02040"
              opacity="0.7"
            />

            {/* ── CORPO PRINCIPAL (contorno completo com cabine) ── */}
            <path
              d="
                M 38,90
                L 248,90
                C 259,90 266,83 263,71
                L 253,55
                L 227,41
                L 203,37
                L 207,23
                L 178,19
                L 149,19
                L 124,22
                L 111,37
                L 83,54
                L 54,69
                L 38,79
                Z
              "
              fill="url(#mcbody)"
            />

            {/* ── TETO (faixa escura no topo da cabine) ── */}
            <path
              d="
                M 128,23
                C 132,18 144,16 156,17
                L 178,17
                C 190,17 198,20 202,25
                L 200,23
                C 196,19 186,17 174,17
                L 150,17
                C 138,17 128,21 124,25
                Z
              "
              fill="url(#mcroof)"
            />

            {/* ── VIDROS DA CABINE ── */}
            <path
              d="
                M 115,37
                L 127,25
                C 131,20 143,18 155,19
                L 178,19
                L 203,25
                L 199,37
                Z
              "
              fill="url(#mcglass)"
            />

            {/* ── FAIXA DOURADA LATERAL ── */}
            <path d="M 40,76 L 250,76 L 253,82 L 39,82 Z" fill="#FFD700" />

            {/* ── RELÂMPAGO ⚡ ── */}
            <path
              d="M 152,56 L 140,70 L 150,70 L 138,83 L 156,66 L 146,66 Z"
              fill="#FFD700"
            />

            {/* ── NÚMERO 95 ── */}
            <text
              x="194"
              y="73"
              fontFamily="Arial Black, sans-serif"
              fontWeight="900"
              fontSize="22"
              fill="#FFD700"
              textAnchor="middle"
            >
              95
            </text>

            {/* ── PNEU TRASEIRO ── */}
            <circle cx="74" cy="97" r="19" fill="url(#mctire)" />
            <circle cx="74" cy="97" r="12" fill="#1A1A1A" />
            <circle cx="74" cy="97" r="5" fill="#888" />
            {/* Raios */}
            <g stroke="#5A5A5A" strokeWidth="2.5" strokeLinecap="round">
              <line x1="74" y1="84" x2="74" y2="110" />
              <line x1="85.3" y1="89.5" x2="62.7" y2="104.5" />
              <line x1="85.3" y1="104.5" x2="62.7" y2="89.5" />
            </g>

            {/* ── PNEU DIANTEIRO ── */}
            <circle cx="210" cy="97" r="19" fill="url(#mctire)" />
            <circle cx="210" cy="97" r="12" fill="#1A1A1A" />
            <circle cx="210" cy="97" r="5" fill="#888" />
            {/* Raios */}
            <g stroke="#5A5A5A" strokeWidth="2.5" strokeLinecap="round">
              <line x1="210" y1="84" x2="210" y2="110" />
              <line x1="221.3" y1="89.5" x2="198.7" y2="104.5" />
              <line x1="221.3" y1="104.5" x2="198.7" y2="89.5" />
            </g>

            {/* ── NARIZ DIANTEIRO (detalhe escuro) ── */}
            <path
              d="M 248,90 C 259,90 266,83 263,71 L 253,71 C 255,79 253,87 245,88 Z"
              fill="#BC0E28"
            />

            {/* ── FAROL (olho do McQueen) ── */}
            <path
              d="M 256,61 C 255,54 259,49 264,51 C 268,54 267,63 262,66 C 258,66 256,64 256,61 Z"
              fill="#FFFAAA"
              fillOpacity="0.95"
            />
            <ellipse cx="261" cy="59" rx="3" ry="4.5" fill="white" fillOpacity="0.5" />

            {/* ── LUZ TRASEIRA ── */}
            <rect x="34" y="64" width="7" height="14" rx="2" fill="#FF2233" />
            <rect x="34" y="64" width="7" height="5" rx="2" fill="#FF5566" />

            {/* ── ESCAPAMENTO ── */}
            <rect x="27" y="83" width="13" height="5" rx="2.5" fill="#666" />
            <rect x="27" y="83" width="4" height="5" rx="2" fill="#444" />
          </svg>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showHint && !turbo && (
          <motion.p
            key="hint"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.5, 0, 0.5, 0] }}
            transition={{ duration: 3, times: [0, 0.2, 0.5, 0.7, 1] }}
            onAnimationComplete={() => setShowHint(false)}
            className="text-center text-xs text-gray-400 mt-1 font-nunito pointer-events-none select-none"
          >
            💡 clique no McQueen!
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  )
}
