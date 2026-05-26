'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

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
  const router = useRouter()
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

      // Redireciona para página de agradecimento personalizada
      router.push(
        `/obrigado?nome=${encodeURIComponent(form.nome.trim())}` +
        `&adultos=${form.quantidade_adultos}` +
        `&criancas=${form.quantidade_criancas}`,
      )
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Erro inesperado')
    }
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
