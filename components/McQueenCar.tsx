'use client'

import { motion } from 'framer-motion'

/**
 * Carro estilo Relâmpago McQueen em SVG — vermelho com número 95
 */
export function McQueenCar({ className = '' }: { className?: string }) {
  return (
    <motion.div
      className={className}
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
        {/* Sombra embaixo */}
        <ellipse cx="140" cy="122" rx="95" ry="7" fill="rgba(0,0,0,0.15)" />

        {/* Corpo principal — vermelho McQueen */}
        <path
          d="M30 80 C30 80 45 55 75 48 L110 40 C120 38 135 32 155 32 L185 32 C210 32 235 42 248 58 L258 72 C262 78 262 88 258 92 L30 92 Z"
          fill="#E31837"
        />

        {/* Capô frontal */}
        <path
          d="M248 58 L258 72 L262 80 L248 80 Z"
          fill="#C01020"
        />

        {/* Teto / cabine */}
        <path
          d="M95 48 C100 36 115 26 140 24 L175 24 C195 24 215 34 225 48 Z"
          fill="#C01020"
        />

        {/* Para-brisa */}
        <path
          d="M100 47 C104 37 116 28 138 26 L170 26 C188 26 205 35 213 47 Z"
          fill="#87CEEB"
          fillOpacity="0.85"
        />

        {/* Janela lateral */}
        <path
          d="M90 48 L100 47 L213 47 L225 48 L215 58 L95 58 Z"
          fill="#B0D8F0"
          fillOpacity="0.7"
        />

        {/* Faixa dourada lateral */}
        <path
          d="M32 74 L255 74 L258 78 L30 78 Z"
          fill="#FFD700"
        />

        {/* Relâmpago ⚡ lateral */}
        <path
          d="M145 60 L135 72 L143 72 L133 84 L148 68 L140 68 Z"
          fill="#FFD700"
        />

        {/* Número 95 */}
        <text
          x="175"
          y="73"
          fontFamily="Arial Black, sans-serif"
          fontWeight="900"
          fontSize="22"
          fill="#FFD700"
          textAnchor="middle"
        >
          95
        </text>

        {/* Pneu traseiro */}
        <circle cx="72" cy="95" r="20" fill="#1A1A1A" />
        <circle cx="72" cy="95" r="13" fill="#333" />
        <circle cx="72" cy="95" r="6" fill="#888" />

        {/* Pneu dianteiro */}
        <circle cx="210" cy="95" r="20" fill="#1A1A1A" />
        <circle cx="210" cy="95" r="13" fill="#333" />
        <circle cx="210" cy="95" r="6" fill="#888" />

        {/* Farol dianteiro */}
        <ellipse cx="253" cy="70" rx="5" ry="8" fill="#FFF9A0" fillOpacity="0.9" />

        {/* Para-choque dianteiro */}
        <path
          d="M255 80 L262 80 L265 86 L252 88 Z"
          fill="#C01020"
        />

        {/* Para-choque traseiro */}
        <path
          d="M25 80 L30 80 L30 90 L22 88 Z"
          fill="#C01020"
        />

        {/* Detalhe traseiro */}
        <rect x="22" y="65" width="10" height="8" rx="2" fill="#FF4444" />
      </svg>
    </motion.div>
  )
}
