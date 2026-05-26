'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { FESTA_CONFIG } from '@/lib/config'
import { Countdown } from '@/components/Countdown'
import { FloatingBalloons } from '@/components/FloatingBalloons'
import { ConfettiOnMount } from '@/components/ConfettiEffect'

// Estrelinhas decorativas aleatórias — geradas no cliente para evitar hidratação
function StarField() {
  const [stars, setStars] = useState<Array<{
    id: number; x: number; y: number; size: number; delay: number; emoji: string
  }>>([])

  useEffect(() => {
    const emojis = ['⭐', '✨', '🌟', '💫', '🎀', '🎪']
    setStars(
      Array.from({ length: 22 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 14 + 8,
        delay: Math.random() * 3,
        emoji: emojis[Math.floor(Math.random() * emojis.length)],
      })),
    )
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {stars.map((s) => (
        <span
          key={s.id}
          className="absolute select-none"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            fontSize: `${s.size}px`,
            animation: `sparkle ${2 + s.delay}s ease-in-out ${s.delay}s infinite`,
            opacity: 0.6,
          }}
        >
          {s.emoji}
        </span>
      ))}
    </div>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay, ease: 'easeOut' },
  }),
}

export default function HomePage() {
  const dataFormatada = format(
    new Date(`${FESTA_CONFIG.dataFesta}T12:00:00`),
    "dd 'de' MMMM 'de' yyyy",
    { locale: ptBR },
  )

  const hasPhoto =
    FESTA_CONFIG.fotoBebe !== '/foto-bebe.jpg' && FESTA_CONFIG.fotoBebe.length > 1

  return (
    <main className="relative min-h-screen overflow-x-hidden" style={{ background: 'var(--cor-fundo)' }}>
      <ConfettiOnMount />
      <FloatingBalloons />
      <StarField />

      {/* ============================================================
          HERO
          ============================================================ */}
      <section
        className="relative z-10 min-h-screen flex flex-col items-center justify-center
          px-4 py-20 text-center dots-bg"
        style={{
          background:
            'radial-gradient(circle at 15% 15%, rgba(255,107,157,0.18) 0%, transparent 40%),' +
            'radial-gradient(circle at 85% 85%, rgba(77,174,229,0.18) 0%, transparent 40%),' +
            'radial-gradient(circle at 65% 25%, rgba(255,217,61,0.12) 0%, transparent 30%),' +
            'radial-gradient(circle at 30% 75%, rgba(192,132,252,0.12) 0%, transparent 30%),' +
            '#FFF9F5',
        }}
      >
        {/* Você está convidado */}
        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.1}
          className="font-nunito font-bold text-rosa tracking-widest text-sm md:text-base uppercase mb-6"
        >
          ✨ Você está convidado! ✨
        </motion.p>

        {/* Foto do bebê */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.3}
          className="mb-8"
        >
          <div className="rainbow-border-wrapper">
            <div className="rainbow-border-inner w-44 h-44 md:w-56 md:h-56">
              {hasPhoto ? (
                <Image
                  src={FESTA_CONFIG.fotoBebe}
                  alt={`Foto do ${FESTA_CONFIG.nomeBebe}`}
                  width={224}
                  height={224}
                  className="rounded-full w-full h-full object-cover"
                  priority
                />
              ) : (
                <div
                  className="rounded-full w-full h-full flex items-center justify-center text-7xl md:text-8xl"
                  style={{
                    background: 'linear-gradient(135deg, #FFE8F5 0%, #E8F5FF 100%)',
                  }}
                >
                  👶
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Nome do bebê */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.5}
          className="font-bubblegum text-6xl md:text-8xl lg:text-9xl mb-2 leading-none text-gradient"
        >
          {FESTA_CONFIG.nomeBebe}
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.65}
          className="font-bubblegum text-2xl md:text-3xl text-texto mb-2"
        >
          está completando
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.8}
          className="flex items-center justify-center gap-3 mb-10"
        >
          <span className="text-4xl animate-bounce-gentle">🎂</span>
          <span className="font-bubblegum text-5xl md:text-7xl text-rosa">1 Aninho!</span>
          <span className="text-4xl animate-bounce-gentle" style={{ animationDelay: '0.3s' }}>🎂</span>
        </motion.div>

        {/* Seta de scroll */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={1.0}
          className="animate-bounce-gentle text-2xl text-rosa"
        >
          ↓
        </motion.div>
      </section>

      {/* ============================================================
          DETALHES DA FESTA
          ============================================================ */}
      <section className="relative z-10 py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl mx-auto"
        >
          <div className="card-glass rounded-3xl p-8 md:p-10 shadow-2xl border border-white/80">
            <h2 className="font-bubblegum text-3xl md:text-4xl text-centro text-center mb-8 text-texto">
              🎪 Detalhes da Festa
            </h2>

            <div className="space-y-5">
              <DetailRow icon="📅" label="Data" value={dataFormatada} />
              <DetailRow icon="🕐" label="Horário" value={`${FESTA_CONFIG.horarioFesta}h`} />
              <DetailRow icon="🎠" label="Tema" value={FESTA_CONFIG.temaBesta} />
              <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/60">
                <span className="text-3xl mt-0.5">📍</span>
                <div>
                  <p className="font-bold text-gray-500 text-xs uppercase tracking-wider mb-0.5">
                    Local
                  </p>
                  <p className="font-nunito font-semibold text-texto">
                    {FESTA_CONFIG.localFesta}
                  </p>
                  {FESTA_CONFIG.linkMaps && (
                    <a
                      href={FESTA_CONFIG.linkMaps}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-azul text-sm font-semibold hover:underline mt-1 inline-block"
                    >
                      Ver no mapa →
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* ============================================================
          COUNTDOWN
          ============================================================ */}
      <div className="relative z-10">
        <Countdown />
      </div>

      {/* ============================================================
          CTAs
          ============================================================ */}
      <section className="relative z-10 py-16 px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-xl mx-auto text-center"
        >
          <h2 className="font-bubblegum text-3xl md:text-4xl text-texto mb-3">
            O que você quer fazer?
          </h2>
          <p className="text-gray-500 font-nunito mb-10">
            Escolha uma das opções abaixo 🎉
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/presentes" className="group flex-1">
              <motion.span
                whileHover={{ scale: 1.04, y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-3 py-5 px-8 rounded-2xl
                  font-bubblegum text-xl text-white shadow-xl w-full
                  bg-gradient-to-br from-rosa via-lilas to-azul
                  transition-shadow hover:shadow-2xl"
                style={{ display: 'flex' }}
              >
                🎁 Ver Lista de Presentes
              </motion.span>
            </Link>

            <Link href="/confirmar" className="group flex-1">
              <motion.span
                whileHover={{ scale: 1.04, y: -3 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center justify-center gap-3 py-5 px-8 rounded-2xl
                  font-bubblegum text-xl text-white shadow-xl w-full
                  bg-gradient-to-br from-verde via-azul to-lilas
                  transition-shadow hover:shadow-2xl"
                style={{ display: 'flex' }}
              >
                ✅ Confirmar Presença
              </motion.span>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ============================================================
          MENSAGEM DOS PAIS
          ============================================================ */}
      <section
        className="relative z-10 py-20 px-4"
        style={{
          background:
            'linear-gradient(135deg, rgba(255,229,240,0.8) 0%, rgba(240,229,255,0.8) 50%, rgba(229,240,255,0.8) 100%)',
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="max-w-2xl mx-auto text-center"
        >
          {/* Aspas decorativas */}
          <p
            className="font-bubblegum text-8xl leading-none mb-4 opacity-20 select-none"
            style={{ color: 'var(--cor-rosa)' }}
          >
            "
          </p>
          <p className="font-nunito text-lg md:text-xl text-gray-700 italic leading-relaxed mb-6 px-4">
            {FESTA_CONFIG.mensagemPais}
          </p>
          <p className="font-bubblegum text-xl text-rosa">
            — Com amor, os papais 💕
          </p>
        </motion.div>
      </section>

      {/* ============================================================
          FOOTER
          ============================================================ */}
      <footer className="relative z-10 py-8 px-4 text-center">
        <p className="font-nunito text-gray-400 text-sm">
          Feito com ❤️ para{' '}
          <span className="font-bold text-rosa">{FESTA_CONFIG.nomeBebe}</span> — {' '}
          {FESTA_CONFIG.temaBesta} 🎪
        </p>
      </footer>
    </main>
  )
}

function DetailRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/60">
      <span className="text-3xl">{icon}</span>
      <div>
        <p className="font-bold text-gray-500 text-xs uppercase tracking-wider mb-0.5">{label}</p>
        <p className="font-nunito font-semibold text-texto capitalize">{value}</p>
      </div>
    </div>
  )
}
