'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

interface FormState {
  nome: string
  telefone: string
  presenca: boolean
  quantidade_adultos: number
  quantidade_criancas: number
  mensagem: string
}

type Status = 'idle' | 'loading' | 'success' | 'error' | 'duplicate'

const initial: FormState = {
  nome: '',
  telefone: '',
  presenca: true,
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

      if (res.status === 409) {
        setStatus('duplicate')
        return
      }

      if (!res.ok) throw new Error(data.error || 'Erro ao enviar')

      if (form.presenca) {
        router.push(
          `/obrigado?nome=${encodeURIComponent(form.nome.trim())}` +
          `&adultos=${form.quantidade_adultos}` +
          `&criancas=${form.quantidade_criancas}`,
        )
      } else {
        router.push(
          `/obrigado?ausencia=true&nome=${encodeURIComponent(form.nome.trim())}`,
        )
      }
    } catch (err) {
      setStatus('error')
      setErrorMsg(err instanceof Error ? err.message : 'Erro inesperado')
    }
  }

  if (status === 'duplicate') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-10 px-4"
      >
        <div className="text-7xl mb-4">🏎️</div>
        <h2 className="font-bubblegum text-3xl text-texto mb-2">Já confirmado!</h2>
        <p className="text-gray-600 font-nunito mb-6">
          Esse telefone já está na lista de convidados. <br />
          Te esperamos na festa! 🎉
        </p>
        <button
          onClick={() => setStatus('idle')}
          className="px-6 py-3 rounded-2xl font-nunito font-bold text-white
            bg-gradient-to-r from-rosa to-lilas shadow-md"
        >
          Voltar
        </button>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Toggle presença */}
      <div>
        <p className="text-sm font-bold text-gray-700 mb-3">
          Você vai comparecer? <span className="text-rosa">*</span>
        </p>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => set('presenca', true)}
            className={`py-3 px-4 rounded-2xl font-nunito font-bold text-sm transition-all border-2 ${
              form.presenca
                ? 'bg-gradient-to-r from-rosa to-lilas text-white border-transparent shadow-md scale-105'
                : 'bg-white text-gray-500 border-gray-200 hover:border-rosa'
            }`}
          >
            ✅ Vou estar lá!
          </button>
          <button
            type="button"
            onClick={() => set('presenca', false)}
            className={`py-3 px-4 rounded-2xl font-nunito font-bold text-sm transition-all border-2 ${
              !form.presenca
                ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white border-transparent shadow-md scale-105'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
            }`}
          >
            😢 Não poderei ir
          </button>
        </div>
      </div>

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

      {/* Adultos/crianças — só exibe se vai comparecer */}
      <AnimatePresence>
        {form.presenca && (
          <motion.div
            key="qtd"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-2 gap-4 pt-1">
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
          </motion.div>
        )}
      </AnimatePresence>

      <div>
        <label className="block text-sm font-bold text-gray-700 mb-2">
          {form.presenca
            ? 'Algum recado para os papais? 💌'
            : 'Deixe uma mensagem para os papais 💌'}
        </label>
        <textarea
          value={form.mensagem}
          onChange={(e) => set('mensagem', e.target.value)}
          rows={3}
          placeholder={
            form.presenca
              ? 'Deixe uma mensagem carinhosa...'
              : 'Que pena não poder ir... mas mando muito amor! ❤️'
          }
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
        className={`w-full py-5 rounded-2xl font-bubblegum text-xl sm:text-2xl text-white shadow-xl
          disabled:opacity-50 disabled:cursor-not-allowed transition-opacity
          ${form.presenca
            ? 'bg-gradient-to-r from-rosa to-lilas'
            : 'bg-gradient-to-r from-gray-500 to-gray-600'
          }`}
      >
        {status === 'loading'
          ? '⏳ Enviando...'
          : form.presenca
          ? '✅ Confirmar Presença com Alegria!'
          : '💌 Enviar Mensagem'}
      </motion.button>
    </form>
  )
}
