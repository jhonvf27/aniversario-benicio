'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FESTA_CONFIG } from '@/lib/config'
import { fireConfettiSuccess } from '@/components/ConfettiEffect'
import { FloatingBalloons } from '@/components/FloatingBalloons'

/* ================================================================
   TELA: CONFIRMOU PRESENÇA
   ================================================================ */
function TelaPresenca({ nome, adultos, criancas }: { nome: string; adultos: number; criancas: number }) {
  const total = adultos + criancas

  useEffect(() => {
    const t = setTimeout(() => fireConfettiSuccess(), 400)
    return () => clearTimeout(t)
  }, [])

  return (
    <main
      className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-4 py-16 text-center"
      style={{ background: 'linear-gradient(135deg, #FFF9F5 0%, #FFE8F5 50%, #E8F5FF 100%)' }}
    >
      <FloatingBalloons />

      <div className="relative z-10 max-w-lg w-full">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 260, damping: 18 }}
          className="text-8xl mb-6 inline-block"
        >
          🎉
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-bubblegum text-4xl sm:text-5xl text-texto mb-3"
        >
          Que alegria,{' '}
          <span className="text-gradient">{nome.split(' ')[0]}!</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="font-nunito text-lg text-gray-600 mb-2"
        >
          Sua presença foi confirmada! 🎈
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="font-nunito text-gray-400 text-sm mb-8"
        >
          {total === 1 ? '1 pessoa confirmada' : `${total} pessoas confirmadas`} por você
        </motion.p>

        {/* Lembrete da festa */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="bg-white/80 backdrop-blur rounded-3xl p-6 shadow-xl border border-white/60 mb-8 text-left"
        >
          <h2 className="font-bubblegum text-xl text-texto mb-4 text-center">
            📋 Lembrete da festa
          </h2>
          <div className="space-y-2 font-nunito text-sm text-gray-600">
            <p>📅 <strong>Data:</strong> {FESTA_CONFIG.dataFesta.split('-').reverse().join('/')}</p>
            <p>🕐 <strong>Horário:</strong> {FESTA_CONFIG.horarioFesta}h</p>
            <p>📍 <strong>Local:</strong> {FESTA_CONFIG.localFesta}</p>
            <p>🏎️ <strong>Tema:</strong> {FESTA_CONFIG.temaBesta}</p>
          </div>
          {FESTA_CONFIG.linkMaps && (
            <a
              href={FESTA_CONFIG.linkMaps}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-block text-azul text-sm font-semibold hover:underline"
            >
              Ver no mapa →
            </a>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link href="/presentes">
            <motion.span
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl
                font-nunito font-bold text-white shadow-lg text-sm
                bg-gradient-to-r from-rosa to-lilas"
              style={{ display: 'flex' }}
            >
              🎁 Ver lista de presentes
            </motion.span>
          </Link>

          <Link href="/">
            <motion.span
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl
                font-nunito font-bold text-texto shadow-md text-sm bg-white/80 border border-gray-200"
              style={{ display: 'flex' }}
            >
              🏠 Voltar ao convite
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </main>
  )
}

/* ================================================================
   TELA: NÃO VAI COMPARECER
   ================================================================ */
function TelaAusencia({ nome }: { nome: string }) {
  return (
    <main
      className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-4 py-16 text-center"
      style={{ background: 'linear-gradient(135deg, #F5F5F5 0%, #EEF2F7 100%)' }}
    >
      <div className="relative z-10 max-w-md w-full">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 240, damping: 20 }}
          className="text-8xl mb-6 inline-block"
        >
          💌
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-bubblegum text-4xl sm:text-5xl text-texto mb-3"
        >
          Que pena,{' '}
          <span style={{ color: '#E31837' }}>{nome.split(' ')[0]}!</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="font-nunito text-lg text-gray-600 mb-2"
        >
          Sua mensagem chegou com muito carinho. 🥰
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="font-nunito text-gray-400 text-sm mb-10"
        >
          Os papais do {FESTA_CONFIG.nomeBebe} vão adorar saber que você pensou neles! 💕
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link href="/presentes">
            <motion.span
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl
                font-nunito font-bold text-white shadow-lg text-sm
                bg-gradient-to-r from-rosa to-lilas"
              style={{ display: 'flex' }}
            >
              🎁 Ver lista de presentes
            </motion.span>
          </Link>

          <Link href="/">
            <motion.span
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl
                font-nunito font-bold text-texto shadow-md text-sm bg-white/80 border border-gray-200"
              style={{ display: 'flex' }}
            >
              🏠 Voltar ao convite
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </main>
  )
}

/* ================================================================
   CONTEÚDO PRINCIPAL (lê search params)
   ================================================================ */
function ObrigadoContent() {
  const params = useSearchParams()
  const nome = params.get('nome') || 'você'
  const ausencia = params.get('ausencia') === 'true'
  const adultos = Number(params.get('adultos') || 1)
  const criancas = Number(params.get('criancas') || 0)

  if (ausencia) {
    return <TelaAusencia nome={nome} />
  }

  return <TelaPresenca nome={nome} adultos={adultos} criancas={criancas} />
}

export default function ObrigadoPage() {
  return (
    <Suspense fallback={null}>
      <ObrigadoContent />
    </Suspense>
  )
}
