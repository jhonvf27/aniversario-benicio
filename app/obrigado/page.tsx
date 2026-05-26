'use client'

import { useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { FESTA_CONFIG } from '@/lib/config'
import { fireConfettiSuccess } from '@/components/ConfettiEffect'
import { FloatingBalloons } from '@/components/FloatingBalloons'

function ObrigadoContent() {
  const params = useSearchParams()
  const nome = params.get('nome') || 'você'
  const adultos = Number(params.get('adultos') || 1)
  const criancas = Number(params.get('criancas') || 0)
  const total = adultos + criancas

  useEffect(() => {
    const t = setTimeout(() => fireConfettiSuccess(), 400)
    return () => clearTimeout(t)
  }, [])

  function shareWhatsApp() {
    const url = encodeURIComponent(typeof window !== 'undefined' ? window.location.origin : '')
    const text = encodeURIComponent(
      `🎪🎂 Confirmei presença no aniversário de 1 aninho do ${FESTA_CONFIG.nomeBebe}!\n` +
      `Venha você também: ${typeof window !== 'undefined' ? window.location.origin : ''}`,
    )
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  return (
    <main
      className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center px-4 py-16 text-center"
      style={{ background: 'linear-gradient(135deg, #FFF9F5 0%, #FFE8F5 50%, #E8F5FF 100%)' }}
    >
      <FloatingBalloons />

      <div className="relative z-10 max-w-lg w-full">
        {/* Emoji animado */}
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

        {/* Card com detalhes da festa */}
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
            <p>🎠 <strong>Tema:</strong> {FESTA_CONFIG.temaBesta}</p>
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

        {/* Ações */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            onClick={shareWhatsApp}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-2xl
              font-nunito font-bold text-white shadow-lg text-sm"
            style={{ background: '#25D366' }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Compartilhar convite
          </motion.button>

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

export default function ObrigadoPage() {
  return (
    <Suspense fallback={null}>
      <ObrigadoContent />
    </Suspense>
  )
}
