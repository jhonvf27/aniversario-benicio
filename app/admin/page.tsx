'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { supabase } from '@/lib/supabase'
import { FESTA_CONFIG } from '@/lib/config'

// Senha do admin — defina NEXT_PUBLIC_ADMIN_PASSWORD no .env.local
// Padrão: benicio2026
const ADMIN_PWD =
  (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_ADMIN_PASSWORD) ||
  'benicio2026'

type Tab = 'confirmacoes' | 'presentes' | 'fotos'

interface RSVP {
  id: string
  nome: string
  telefone: string
  presenca: boolean | null
  quantidade_adultos: number
  quantidade_criancas: number
  mensagem: string | null
  created_at: string
}

interface Presente {
  id: string
  nome: string
  preco_estimado: string | null
  reservado_por: string | null
  reservado_em: string | null
}

interface FotoPendente {
  id: string
  nome_autor: string
  url: string
  created_at: string
}

function buildWaMsg(nome: string) {
  const partes = [
    `Oi, ${nome}! 🎪✨`,
    ``,
    `Lembrando que a festa do *${FESTA_CONFIG.nomeBebe}* está chegando! 🎂`,
    ``,
    `📅 *Data:* ${FESTA_CONFIG.dataFesta.split('-').reverse().join('/')}`,
    `🕐 *Horário:* ${FESTA_CONFIG.horarioFesta}h`,
    `📍 *Local:* ${FESTA_CONFIG.localFesta}`,
    `🎠 *Tema:* ${FESTA_CONFIG.temaBesta}`,
    ``,
    `Te esperamos com muito amor! 🎉🎈`,
  ]
  return encodeURIComponent(partes.join('\n'))
}

/* ================================================================
   TELA DE LOGIN
   ================================================================ */
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pwd, setPwd] = useState('')
  const [error, setError] = useState('')

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (pwd === ADMIN_PWD) {
      localStorage.setItem('admin_ok', ADMIN_PWD)
      onLogin()
    } else {
      setError('Senha incorreta 🔐')
      setPwd('')
    }
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: 'var(--cor-fundo)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 shadow-2xl w-full max-w-sm border border-gray-100"
      >
        <div className="text-center mb-6">
          <div className="text-6xl mb-3">🔐</div>
          <h1 className="font-bubblegum text-2xl text-texto">Área Admin</h1>
          <p className="text-gray-400 text-sm mt-1 font-nunito">
            Exclusivo para os papais do {FESTA_CONFIG.nomeBebe} 💕
          </p>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <input
            type="password"
            value={pwd}
            autoFocus
            onChange={(e) => { setPwd(e.target.value); setError('') }}
            placeholder="Senha"
            className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-base"
          />
          {error && (
            <p className="text-red-400 text-sm font-nunito text-center">{error}</p>
          )}
          <button
            type="submit"
            className="w-full py-3 rounded-2xl font-nunito font-bold text-white
              bg-gradient-to-r from-rosa to-lilas shadow-lg"
          >
            Entrar
          </button>
        </form>

        <div className="mt-5 text-center">
          <Link href="/" className="text-sm text-gray-400 hover:text-rosa font-nunito">
            ← Voltar ao convite
          </Link>
        </div>
      </motion.div>
    </main>
  )
}

/* ================================================================
   PAINEL PRINCIPAL
   ================================================================ */
function AdminDashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useState<Tab>('confirmacoes')
  const [rsvps, setRsvps] = useState<RSVP[]>([])
  const [presentes, setPresentes] = useState<Presente[]>([])
  const [fotosPendentes, setFotosPendentes] = useState<FotoPendente[]>([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    const [{ data: r }, { data: p }, { data: f }] = await Promise.all([
      supabase.from('rsvp').select('*').order('created_at', { ascending: false }),
      supabase.from('presentes').select('id,nome,preco_estimado,reservado_por,reservado_em').order('nome'),
      supabase.from('fotos').select('id,nome_autor,url,created_at').eq('aprovada', false).order('created_at', { ascending: true }),
    ])
    setRsvps((r as RSVP[]) || [])
    setPresentes((p as Presente[]) || [])
    setFotosPendentes((f as FotoPendente[]) || [])
    setLoading(false)
  }, [])

  async function aprovarFoto(id: string) {
    setActionLoading(id)
    await supabase.from('fotos').update({ aprovada: true }).eq('id', id)
    setFotosPendentes((prev) => prev.filter((f) => f.id !== id))
    setActionLoading(null)
  }

  async function rejeitarFoto(id: string) {
    setActionLoading(id)
    await supabase.from('fotos').delete().eq('id', id)
    setFotosPendentes((prev) => prev.filter((f) => f.id !== id))
    setActionLoading(null)
  }

  useEffect(() => { loadData() }, [loadData])

  const vao = rsvps.filter((r) => r.presenca !== false)
  const naoVao = rsvps.filter((r) => r.presenca === false)
  const totalAdultos = vao.reduce((s, r) => s + r.quantidade_adultos, 0)
  const totalCriancas = vao.reduce((s, r) => s + r.quantidade_criancas, 0)
  const reservados = presentes.filter((p) => p.reservado_por).length

  return (
    <main className="min-h-screen" style={{ background: 'var(--cor-fundo)' }}>

      {/* Header */}
      <header
        className="sticky top-0 z-40 px-4 py-4 shadow-sm"
        style={{ background: 'linear-gradient(135deg, #FF6B9D 0%, #C084FC 100%)' }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h1 className="font-bubblegum text-lg text-white leading-tight">
              🎪 Admin — {FESTA_CONFIG.nomeBebe}
            </h1>
            <p className="text-white/70 text-xs font-nunito">Painel da festa</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={loadData}
              className="bg-white/20 hover:bg-white/30 text-white text-sm px-3 py-1.5 rounded-xl font-nunito font-bold transition-colors"
            >
              ↺ Atualizar
            </button>
            <button
              onClick={onLogout}
              className="bg-white/20 hover:bg-white/30 text-white text-sm px-3 py-1.5 rounded-xl font-nunito font-bold transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { emoji: '✅', valor: vao.length, label: 'Vão', grad: 'from-rosa to-lilas' },
            { emoji: '😢', valor: naoVao.length, label: 'Não vão', grad: 'from-gray-400 to-gray-500' },
            { emoji: '🧑', valor: `${totalAdultos}+${totalCriancas}`, label: 'Ad+Cri', grad: 'from-azul to-lilas' },
            { emoji: '🎁', valor: `${reservados}/${presentes.length}`, label: 'Presentes', grad: 'from-verde to-azul' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className={`bg-gradient-to-br ${s.grad} rounded-2xl p-4 text-white shadow-lg`}
            >
              <div className="text-2xl mb-1">{s.emoji}</div>
              <div className="font-bubblegum text-3xl">{s.valor}</div>
              <div className="text-white/80 text-xs font-nunito font-bold uppercase tracking-wide mt-0.5">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {[
            { key: 'confirmacoes', label: `✅ Respostas (${vao.length} vão · ${naoVao.length} não)` },
            { key: 'presentes', label: `🎁 Presentes (${reservados}/${presentes.length})` },
            { key: 'fotos', label: `📸 Fotos${fotosPendentes.length > 0 ? ` (${fotosPendentes.length} pendente${fotosPendentes.length > 1 ? 's' : ''})` : ''}` },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as Tab)}
              className={`px-4 py-2 rounded-xl font-nunito font-bold text-sm transition-all ${
                tab === t.key
                  ? 'bg-rosa text-white shadow-md scale-105'
                  : 'bg-white text-gray-500 border-2 border-gray-200 hover:border-rosa'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Conteúdo */}
        {loading ? (
          <div className="text-center py-20 text-gray-400 font-nunito">
            <div className="text-4xl mb-3 animate-bounce-gentle">⏳</div>
            Carregando...
          </div>
        ) : tab === 'confirmacoes' ? (
          <>
            {rsvps.length === 0 ? (
              <div className="text-center py-20 text-gray-400 font-nunito">
                <p className="text-4xl mb-3">😊</p>
                Nenhuma confirmação ainda.
              </div>
            ) : (
              <div className="space-y-3">
                {rsvps.map((r, i) => (
                  <motion.div
                    key={r.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="bg-white rounded-2xl p-5 shadow-md border border-gray-100"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-bubblegum text-lg text-texto">{r.nome}</h3>
                          {r.presenca === false ? (
                            <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-semibold">
                              😢 Não vai
                            </span>
                          ) : (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                              ✅ Confirmado
                            </span>
                          )}
                        </div>
                        <div className="flex gap-x-4 gap-y-1 flex-wrap text-sm text-gray-500 font-nunito">
                          <span>📞 {r.telefone}</span>
                          {r.presenca !== false && (
                            <>
                              <span>🧑 {r.quantidade_adultos} adulto{r.quantidade_adultos !== 1 ? 's' : ''}</span>
                              <span>👶 {r.quantidade_criancas} criança{r.quantidade_criancas !== 1 ? 's' : ''}</span>
                            </>
                          )}
                          <span>🗓 {format(new Date(r.created_at), "dd/MM 'às' HH:mm", { locale: ptBR })}</span>
                        </div>
                        {r.mensagem && (
                          <p className="mt-2 text-sm text-gray-600 italic bg-gray-50 rounded-xl px-3 py-2 font-nunito">
                            "{r.mensagem}"
                          </p>
                        )}
                      </div>

                      {/* Botão WhatsApp lembrete */}
                      {r.telefone && (
                        <a
                          href={`https://wa.me/55${r.telefone.replace(/\D/g, '')}?text=${buildWaMsg(r.nome)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-shrink-0 flex items-center gap-1.5 bg-green-500 hover:bg-green-600
                            text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors"
                          title="Enviar lembrete no WhatsApp"
                        >
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                          Lembrete
                        </a>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        ) : tab === 'fotos' ? (
          <>
            {fotosPendentes.length === 0 ? (
              <div className="text-center py-20 text-gray-400 font-nunito">
                <p className="text-4xl mb-3">✅</p>
                Nenhuma foto aguardando aprovação.
              </div>
            ) : (
              <>
                <p className="text-sm text-gray-500 font-nunito mb-4">
                  {fotosPendentes.length} foto{fotosPendentes.length > 1 ? 's' : ''} aguardando revisão — aprovadas aparecem na galeria pública.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {fotosPendentes.map((foto) => (
                    <motion.div
                      key={foto.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={foto.url}
                        alt={`Foto de ${foto.nome_autor}`}
                        className="w-full aspect-video object-cover"
                      />
                      <div className="p-3">
                        <p className="font-nunito font-semibold text-texto text-sm mb-3 truncate">
                          📷 {foto.nome_autor}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => aprovarFoto(foto.id)}
                            disabled={actionLoading === foto.id}
                            className="flex-1 py-2 rounded-xl font-nunito font-bold text-sm text-white
                              bg-green-500 hover:bg-green-600 disabled:opacity-50 transition-colors"
                          >
                            {actionLoading === foto.id ? '⏳' : '✅ Aprovar'}
                          </button>
                          <button
                            onClick={() => rejeitarFoto(foto.id)}
                            disabled={actionLoading === foto.id}
                            className="flex-1 py-2 rounded-xl font-nunito font-bold text-sm text-white
                              bg-red-400 hover:bg-red-500 disabled:opacity-50 transition-colors"
                          >
                            {actionLoading === foto.id ? '⏳' : '🗑️ Rejeitar'}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="space-y-2">
            {presentes.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`bg-white rounded-2xl p-4 shadow-sm border ${
                  p.reservado_por ? 'border-green-200 bg-green-50/50' : 'border-gray-100'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-lg">{p.reservado_por ? '🎁' : '○'}</span>
                      <h3 className={`font-bubblegum text-base ${
                        p.reservado_por ? 'text-green-700' : 'text-gray-400'
                      }`}>
                        {p.nome}
                      </h3>
                    </div>
                    {p.reservado_por && (
                      <p className="text-sm text-gray-500 font-nunito mt-0.5 ml-7">
                        Reservado por <strong>{p.reservado_por}</strong>
                        {p.reservado_em && (
                          <> em {format(new Date(p.reservado_em), "dd/MM 'às' HH:mm", { locale: ptBR })}</>
                        )}
                      </p>
                    )}
                  </div>
                  {p.preco_estimado && (
                    <span className="flex-shrink-0 text-xs text-rosa font-semibold bg-rosa/10 px-2 py-1 rounded-full font-nunito">
                      {p.preco_estimado}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

/* ================================================================
   PAGE
   ================================================================ */
export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null)

  useEffect(() => {
    setAuthed(localStorage.getItem('admin_ok') === ADMIN_PWD)
  }, [])

  if (authed === null) return null // evita flash de login

  if (!authed) {
    return <LoginScreen onLogin={() => setAuthed(true)} />
  }

  return (
    <AdminDashboard
      onLogout={() => {
        localStorage.removeItem('admin_ok')
        setAuthed(false)
      }}
    />
  )
}
