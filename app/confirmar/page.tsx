'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { RSVPForm } from '@/components/RSVPForm'
import { FESTA_CONFIG } from '@/lib/config'
import { FloatingBalloons } from '@/components/FloatingBalloons'

export default function ConfirmarPage() {
  return (
    <main
      className="min-h-screen relative overflow-hidden"
      style={{
        background:
          'linear-gradient(135deg, #FFF9F5 0%, #FFE8F5 50%, #E8F5FF 100%)',
      }}
    >
      <FloatingBalloons />

      {/* Header */}
      <header className="relative z-10 px-4 py-4">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-rosa font-bold hover:opacity-70 transition-opacity"
          >
            ← Voltar ao convite
          </Link>
          <Link
            href="/presentes"
            className="text-sm font-bold text-white px-4 py-2 rounded-xl bg-gradient-to-r from-rosa to-lilas"
          >
            Ver presentes
          </Link>
        </div>
      </header>

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-8 pb-20">
        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="text-7xl mb-4 animate-bounce-gentle inline-block">🏎️</div>
          <h1 className="font-bubblegum text-4xl md:text-5xl text-texto mb-3">
            Confirmar Presença
          </h1>
          <p className="font-nunito text-gray-500 text-lg">
            Vai estar na festa do{' '}
            <strong className="text-rosa">{FESTA_CONFIG.nomeBebe}</strong>? Que incrível! 🎉
          </p>
        </motion.div>

        {/* Card do formulário */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/85 backdrop-blur rounded-3xl p-5 sm:p-8 md:p-10 shadow-2xl
            border border-white/60"
        >
          <RSVPForm />
        </motion.div>

        {/* Info da festa */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center text-sm text-gray-400 font-nunito space-y-1"
        >
          <p>📅 {FESTA_CONFIG.dataFesta.split('-').reverse().join('/')} às {FESTA_CONFIG.horarioFesta}h</p>
          <p>📍 {FESTA_CONFIG.localFesta}</p>
          <p>🎠 Tema: {FESTA_CONFIG.temaBesta}</p>
        </motion.div>
      </div>
    </main>
  )
}
