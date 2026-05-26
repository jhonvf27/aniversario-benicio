'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { fireConfettiSuccess } from './ConfettiEffect'
import { FESTA_CONFIG } from '@/lib/config'

interface FormState {
  nome: string
  telefone: string
  quantidade_adultos: number
  quantidade_criancas: number
  mensagem: string
}

type Status = 'idle' | 'loading' | 'success' | 'error'

const initial: FormState = {
  nome: '',
  telefone: '',
  quantidade_adultos: 1,
  quantidade_criancas: 0,
  mensagem: '',
}

export function RSVPForm() {
  const [form, setForm] = useState<FormState>(initial)
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nome.trim()) return

    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Erro ao confirmar presença')

      setStatus('success')
      fireConfettiSuccess()
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Erro inesperado')
    }
  }

  function shareWhatsApp() {
    if (typeof window === 'undefined') return
    const url = encodeURIComponent(window.location.origin)
    const text = encodeURIComponent(
      `🎪🎂 Estou confirmado(a) no aniversário de 1 aninho do ${FESTA_CONFIG.nomeBebe}!\n` +
      `Venha você também: ${window.location.origin}`,
    )
    window.open(`https://wa.me/?text=${text}`, '_blank')
  }

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12 px-4"
      >
        <motion.div
          animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="text-8xl mb-6"
        >
          🎉
        </motion.div>
        <h2 className="font-bubblegum text-4xl text-texto mb-3">Uhuu!</h2>
        <p className="text-xl text-gray-600 font-nunito mb-2">
          <strong>{form.nome}</strong> está confirmado(a)!
        </p>
        <p className="text-gray-500 mb-8">
          Mal podemos esperar para celebrar juntos! 🎪🎈
        </p>

        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={shareWhatsApp}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white text-lg shadow-lg"
          style={{ background: '#25D366' }}
        >
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Compartilhar o Convite
        </motion.button>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Seu nome completo <span className="text-rosa">*</span>
        </label>
        <input
          type="text"
          value={form.nome}
          onChange={(e) => set('nome', e.target.value)}
          required
          placeholder="Ex: Ana e João"
          className="w-full border-2 border-gray-200 rounded-2xl px-5 py-4 text-base focus:outline-none"
        />
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Telefone / WhatsApp <span className="text-rosa">*</span>
        </label>
        <input
          type="tel"
          value={form.telefone}
          onChange={(e) => set('telefone', e.target.value)}
          required
          placeholder="(11) 99999-9999"
          className="w-full border-2 border-gray-200 rounded-2xl px-5 py-4 text-base focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">👩‍👨 Adultos</label>
          <input
            type="number"
            min={0}
            max={20}
            value={form.quantidade_adultos}
            onChange={(e) => set('quantidade_adultos', Number(e.target.value))}
            className="w-full border-2 border-gray-200 rounded-2xl px-5 py-4 text-base text-center focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">👶 Crianças</label>
          <input
            type="number"
            min={0}
            max={20}
            value={form.quantidade_criancas}
            onChange={(e) => set('quantidade_criancas', Number(e.target.value))}
            className="w-full border-2 border-gray-200 rounded-2xl px-5 py-4 text-base text-center focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          Algum recado para os papais? 💌
        </label>
        <textarea
          value={form.mensagem}
          onChange={(e) => set('mensagem', e.target.value)}
          rows={3}
          placeholder="Deixe uma mensagem carinhosa..."
          className="w-full border-2 border-gray-200 rounded-2xl px-5 py-4 text-base resize-none focus:outline-none"
        />
      </div>

      <AnimatePresence>
        {errorMsg && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="text-red-500 text-sm text-center"
          >
            {errorMsg}
          </motion.p>
        )}
      </AnimatePresence>

      <motion.button
        type="submit"
        disabled={!form.nome.trim() || !form.telefone.trim() || status === 'loading'}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-5 rounded-2xl font-bubblegum text-xl sm:text-2xl text-white shadow-xl
          bg-gradient-to-r from-rosa to-lilas
          disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
      >
        {status === 'loading' ? '⏳ Confirmando...' : '✅ Confirmar Presença com Alegria!'}
      </motion.button>
    </form>
  )
}
