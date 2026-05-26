'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { fireConfettiSuccess } from './ConfettiEffect'
import type { Presente } from '@/lib/supabase'

interface PresenteCardProps {
  presente: Presente
  onReserved: (id: string, nome: string) => void
}

type ModalStatus = 'idle' | 'loading' | 'success' | 'conflict' | 'error'

export function PresenteCard({ presente, onReserved }: PresenteCardProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [nome, setNome] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [confirmado, setConfirmado] = useState(false)
  const [status, setStatus] = useState<ModalStatus>('idle')

  const reservado = !!presente.reservado_por

  function reset() {
    setNome('')
    setWhatsapp('')
    setConfirmado(false)
    setStatus('idle')
    setIsOpen(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!nome.trim() || !confirmado) return

    setStatus('loading')
    try {
      const res = await fetch('/api/reservar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ presenteId: presente.id, nome: nome.trim(), whatsapp: whatsapp.trim() }),
      })

      if (res.status === 409) {
        setStatus('conflict')
        return
      }
      if (!res.ok) throw new Error('Erro ao reservar')

      setStatus('success')
      fireConfettiSuccess()
      onReserved(presente.id, nome.trim())
    } catch {
      setStatus('error')
    }
  }

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`relative rounded-3xl overflow-hidden shadow-lg transition-all duration-300 ${
          reservado
            ? 'bg-gray-50 border-2 border-gray-200'
            : 'bg-white border-2 border-transparent hover:border-rosa hover:shadow-2xl hover:-translate-y-1'
        }`}
      >
        {/* Badge de status */}
        <div className="absolute top-3 right-3 z-10">
          {reservado ? (
            <span className="inline-flex items-center gap-1 bg-gray-400 text-white text-xs font-bold px-3 py-1 rounded-full">
              🔒 Reservado
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 bg-verde text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse">
              ✅ Disponível
            </span>
          )}
        </div>

        {/* Imagem */}
        <div className={`relative h-48 overflow-hidden ${reservado ? 'grayscale opacity-60' : ''}`}>
          {presente.imagem_url ? (
            <Image
              src={presente.imagem_url}
              alt={presente.nome}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl bg-gradient-to-br from-pink-50 to-blue-50">
              🎁
            </div>
          )}
        </div>

        {/* Conteúdo */}
        <div className="p-5">
          <h3
            className={`font-bubblegum text-xl mb-1 ${
              reservado ? 'text-gray-400' : 'text-texto'
            }`}
          >
            {presente.nome}
          </h3>

          {presente.descricao && (
            <p className={`text-sm mb-3 leading-relaxed ${reservado ? 'text-gray-300' : 'text-gray-500'}`}>
              {presente.descricao}
            </p>
          )}

          {presente.preco_estimado && (
            <p
              className={`text-xs font-semibold mb-4 ${
                reservado ? 'text-gray-300' : 'text-rosa'
              }`}
            >
              💰 {presente.preco_estimado}
            </p>
          )}

          {reservado ? (
            <p className="text-sm text-gray-400 text-center italic py-2">
              Já reservado por alguém especial ❤️
            </p>
          ) : (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setIsOpen(true)}
              className="w-full py-3 rounded-2xl font-nunito font-bold text-white text-sm
                bg-gradient-to-r from-rosa to-lilas shadow-md
                hover:shadow-lg transition-shadow"
            >
              🎁 Quero dar este presente!
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Modal de Reserva */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => status !== 'loading' && reset()}
            />

            {/* Card do modal */}
            <motion.div
              className="relative bg-white rounded-3xl p-5 sm:p-8 max-w-md w-full shadow-2xl z-10"
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            >
              {/* Fechar */}
              <button
                onClick={reset}
                disabled={status === 'loading'}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl leading-none"
                aria-label="Fechar"
              >
                ×
              </button>

              {status === 'success' ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-4"
                >
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="font-bubblegum text-2xl text-texto mb-2">Incrível!</h3>
                  <p className="text-gray-600 font-nunito mb-1">
                    <strong>{nome}</strong>, obrigado pelo seu presente!
                  </p>
                  <p className="text-gray-500 text-sm mb-6">
                    O <strong>{presente.nome}</strong> está reservado para você. 🎁
                  </p>
                  <button
                    onClick={reset}
                    className="px-6 py-3 bg-gradient-to-r from-rosa to-lilas text-white rounded-2xl font-bold"
                  >
                    Fechar
                  </button>
                </motion.div>
              ) : status === 'conflict' ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-4"
                >
                  <div className="text-5xl mb-4">😅</div>
                  <h3 className="font-bubblegum text-2xl text-texto mb-2">Que pena!</h3>
                  <p className="text-gray-600 mb-6">
                    Alguém foi mais rápido! Escolha outro presente 😊
                  </p>
                  <button
                    onClick={reset}
                    className="px-6 py-3 bg-azul text-white rounded-2xl font-bold"
                  >
                    Ver outros presentes
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <p className="text-rosa font-semibold text-sm mb-1">Que lindo! Você escolheu:</p>
                  <h3 className="font-bubblegum text-2xl text-texto mb-6">{presente.nome}</h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">
                        Seu nome completo <span className="text-rosa">*</span>
                      </label>
                      <input
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                        placeholder="Ex: Maria da Silva"
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">
                        Seu WhatsApp <span className="text-gray-400">(opcional)</span>
                      </label>
                      <input
                        type="tel"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        placeholder="(11) 99999-9999"
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-base"
                      />
                    </div>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={confirmado}
                        onChange={(e) => setConfirmado(e.target.checked)}
                        className="mt-0.5 w-5 h-5 accent-pink-500 rounded"
                        required
                      />
                      <span className="text-sm text-gray-600">
                        Confirmo que vou dar este presente 🎁
                      </span>
                    </label>

                    {status === 'error' && (
                      <p className="text-red-500 text-sm">
                        Ocorreu um erro. Tente novamente.
                      </p>
                    )}

                    <motion.button
                      type="submit"
                      disabled={!nome.trim() || !confirmado || status === 'loading'}
                      whileTap={{ scale: 0.97 }}
                      className="w-full py-4 bg-gradient-to-r from-rosa to-lilas text-white rounded-2xl
                        font-bold font-nunito text-base shadow-lg
                        disabled:opacity-50 disabled:cursor-not-allowed
                        transition-opacity"
                    >
                      {status === 'loading' ? '⏳ Reservando...' : 'Confirmar Reserva 🎁'}
                    </motion.button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
