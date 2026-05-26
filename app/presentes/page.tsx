'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { supabase, type Presente } from '@/lib/supabase'
import { PresenteCard } from '@/components/PresenteCard'
import { FESTA_CONFIG } from '@/lib/config'

type Filter = 'todos' | 'disponiveis' | 'reservados'

export default function PresentesPage() {
  const [presentes, setPresentes] = useState<Presente[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<Filter>('todos')
  const [error, setError] = useState('')

  useEffect(() => {
    fetchPresentes()

    // Supabase Realtime — atualiza cards em tempo real
    const channel = supabase
      .channel('presentes-realtime')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'presentes' },
        (payload) => {
          setPresentes((prev) =>
            prev.map((p) =>
              p.id === payload.new.id ? { ...p, ...(payload.new as Presente) } : p,
            ),
          )
        },
      )
      .subscribe()

    return () => { supabase.removeChannel(channel) }
  }, [])

  async function fetchPresentes() {
    setLoading(true)
    setError('')
    const { data, error } = await supabase
      .from('presentes')
      .select('*')
      .order('created_at')

    if (error) {
      setError('Não foi possível carregar a lista. Verifique a conexão com o Supabase.')
    } else {
      setPresentes(data as Presente[])
    }
    setLoading(false)
  }

  function handleReserved(id: string, nome: string) {
    setPresentes((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, reservado_por: nome, reservado_em: new Date().toISOString() } : p,
      ),
    )
  }

  const disponiveis = presentes.filter((p) => !p.reservado_por).length
  const total = presentes.length

  const filtered = presentes.filter((p) => {
    if (filter === 'disponiveis') return !p.reservado_por
    if (filter === 'reservados') return !!p.reservado_por
    return true
  })

  const filterBtns: { key: Filter; label: string }[] = [
    { key: 'todos', label: `Todos (${total})` },
    { key: 'disponiveis', label: `Disponíveis (${disponiveis})` },
    { key: 'reservados', label: `Reservados (${total - disponiveis})` },
  ]

  return (
    <main className="min-h-screen" style={{ background: 'var(--cor-fundo)' }}>
      {/* Header */}
      <header
        className="sticky top-0 z-40 px-4 py-4 backdrop-blur-md border-b border-white/60"
        style={{ background: 'rgba(255,249,245,0.92)' }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-rosa font-bold hover:opacity-70 transition-opacity"
          >
            ← Voltar ao convite
          </Link>
          <span className="font-bubblegum text-lg text-texto hidden sm:block">
            🎂 {FESTA_CONFIG.nomeBebe} — 1 Aninho
          </span>
          <Link
            href="/confirmar"
            className="text-sm font-bold text-white px-4 py-2 rounded-xl bg-gradient-to-r from-rosa to-lilas"
          >
            Confirmar presença
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="font-bubblegum text-4xl md:text-6xl text-texto mb-3">
            🎁 Lista de Presentes
          </h1>
          <p className="font-nunito text-gray-500 text-lg">
            para o aniversário de 1 aninho do{' '}
            <strong className="text-rosa">{FESTA_CONFIG.nomeBebe}</strong>
          </p>

          {!loading && !error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 mt-4 px-5 py-2 rounded-full
                font-nunito font-bold text-sm text-white
                bg-gradient-to-r from-verde to-azul shadow-md"
            >
              🎁 {disponiveis} de {total} presentes ainda disponíveis
            </motion.div>
          )}
        </motion.div>

        {/* Filtros */}
        {!loading && !error && (
          <div className="flex justify-center gap-3 mb-8 flex-wrap">
            {filterBtns.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-5 py-2 rounded-full font-nunito font-bold text-sm transition-all ${
                  filter === key
                    ? 'bg-rosa text-white shadow-md scale-105'
                    : 'bg-white text-gray-500 border-2 border-gray-200 hover:border-rosa'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* Estados */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="text-5xl animate-bounce-gentle">🎁</div>
            <p className="font-nunito text-gray-400 text-lg">Carregando presentes...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">😕</p>
            <p className="text-gray-500 font-nunito mb-4">{error}</p>
            <button
              onClick={fetchPresentes}
              className="px-6 py-3 bg-rosa text-white rounded-xl font-bold"
            >
              Tentar novamente
            </button>
          </div>
        )}

        {/* Grid de presentes */}
        {!loading && !error && (
          <>
            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-5xl mb-4">🎊</p>
                <p className="text-gray-500 font-nunito text-lg">
                  {filter === 'disponiveis'
                    ? 'Todos os presentes já foram reservados! 🎉'
                    : 'Nenhum presente encontrado nesta categoria.'}
                </p>
              </div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {filtered.map((presente, i) => (
                  <motion.div
                    key={presente.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.5 }}
                  >
                    <PresenteCard presente={presente} onReserved={handleReserved} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </>
        )}

        {/* CTA Confirmar presença */}
        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <Link href="/confirmar">
              <motion.span
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-3 py-4 px-10 rounded-2xl
                  font-bubblegum text-xl text-white shadow-xl
                  bg-gradient-to-r from-verde to-azul"
                style={{ display: 'inline-flex' }}
              >
                ✅ Confirmar minha presença
              </motion.span>
            </Link>
          </motion.div>
        )}
      </div>
    </main>
  )
}
