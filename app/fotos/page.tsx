'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { FESTA_CONFIG } from '@/lib/config'

interface Foto {
  id: string
  nome_autor: string
  url: string
  created_at: string
}

// Mude para true no dia da festa para liberar o envio de fotos
const FOTOS_LIBERADAS = false

export default function FotosPage() {
  if (!FOTOS_LIBERADAS) {
    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
        style={{ background: 'linear-gradient(135deg, #FFF8F2 0%, #FFE8E0 50%, #E8F0FF 100%)' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          <div className="text-7xl mb-6 animate-bounce-gentle">📸</div>

          <h1 className="font-bubblegum text-4xl text-texto mb-3">
            Galeria de Fotos
          </h1>

          <div className="bg-white/80 backdrop-blur rounded-3xl p-8 shadow-xl border border-white/60 mb-8">
            <div className="text-5xl mb-4">🔒</div>
            <h2 className="font-bubblegum text-2xl text-rosa mb-3">
              Em breve!
            </h2>
            <p className="font-nunito text-gray-600 leading-relaxed">
              A galeria será liberada no dia da festa para que todos possam compartilhar os momentos especiais do aniversário do{' '}
              <strong className="text-rosa">{FESTA_CONFIG.nomeBebe}</strong>!
            </p>
            <div className="mt-5 pt-5 border-t border-gray-100 space-y-1 text-sm text-gray-500 font-nunito">
              <p>📅 {FESTA_CONFIG.dataFesta.split('-').reverse().join('/')}</p>
              <p>🕐 A partir das {FESTA_CONFIG.horarioFesta}h</p>
              <p>🏎️ {FESTA_CONFIG.temaBesta}</p>
            </div>
          </div>

          <Link href="/">
            <motion.span
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl
                font-nunito font-bold text-white shadow-lg
                bg-gradient-to-r from-rosa to-lilas"
              style={{ display: 'inline-flex' }}
            >
              ← Voltar ao convite
            </motion.span>
          </Link>
        </motion.div>
      </main>
    )
  }


  const [fotos, setFotos] = useState<Foto[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [nome, setNome] = useState('')
  const [preview, setPreview] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => { fetchFotos() }, [])

  async function fetchFotos() {
    setLoading(true)
    const { data } = await supabase
      .from('fotos')
      .select('*')
      .order('created_at', { ascending: false })
    setFotos((data as Foto[]) || [])
    setLoading(false)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    if (f.size > 8 * 1024 * 1024) {
      setErrorMsg('Foto muito grande (máx. 8 MB)')
      return
    }
    setFile(f)
    setErrorMsg('')
    const reader = new FileReader()
    reader.onload = (ev) => setPreview(ev.target?.result as string)
    reader.readAsDataURL(f)
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault()
    if (!file || !nome.trim()) return

    setUploading(true)
    setErrorMsg('')

    try {
      // Upload para Supabase Storage (bucket: fotos-festa)
      const ext = file.name.split('.').pop()
      const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

      const { error: uploadError } = await supabase.storage
        .from('fotos-festa')
        .upload(path, file, { cacheControl: '3600', upsert: false })

      if (uploadError) throw uploadError

      // Gera URL pública
      const { data: urlData } = supabase.storage
        .from('fotos-festa')
        .getPublicUrl(path)

      // Salva metadado na tabela fotos
      const { error: insertError } = await supabase.from('fotos').insert({
        nome_autor: nome.trim(),
        url: urlData.publicUrl,
      })

      if (insertError) throw insertError

      setStatus('success')
      setNome('')
      setFile(null)
      setPreview(null)
      if (fileRef.current) fileRef.current.value = ''
      fetchFotos()
    } catch (err) {
      console.error(err)
      setErrorMsg('Erro ao enviar foto. Tente novamente.')
      setStatus('error')
    } finally {
      setUploading(false)
    }
  }

  return (
    <main className="min-h-screen" style={{ background: 'var(--cor-fundo)' }}>

      {/* Header */}
      <header
        className="sticky top-0 z-40 px-4 py-4 backdrop-blur-md border-b border-white/60"
        style={{ background: 'rgba(255,249,245,0.92)' }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-rosa font-bold hover:opacity-70 transition-opacity">
            ← Voltar
          </Link>
          <span className="font-bubblegum text-lg text-texto hidden sm:block">
            📸 {FESTA_CONFIG.nomeBebe} — Galeria de Fotos
          </span>
          <Link
            href="/confirmar"
            className="text-sm font-bold text-white px-4 py-2 rounded-xl bg-gradient-to-r from-rosa to-lilas"
          >
            Confirmar presença
          </Link>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="font-bubblegum text-4xl md:text-6xl text-texto mb-3">
            📸 Galeria de Fotos
          </h1>
          <p className="font-nunito text-gray-500 text-lg">
            Compartilhe um momento especial com o{' '}
            <strong className="text-rosa">{FESTA_CONFIG.nomeBebe}</strong>!
          </p>
        </motion.div>

        {/* Formulário de upload */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-gray-100 mb-10 max-w-lg mx-auto"
        >
          <h2 className="font-bubblegum text-2xl text-texto mb-5 text-center">
            ✨ Enviar uma foto
          </h2>

          <AnimatePresence>
            {status === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-4 mb-4 bg-green-50 rounded-2xl"
              >
                <p className="text-3xl mb-1">🎉</p>
                <p className="font-nunito font-bold text-green-700">Foto enviada com sucesso!</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleUpload} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Seu nome <span className="text-rosa">*</span>
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                placeholder="Ex: Tia Carla"
                className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-base"
              />
            </div>

            {/* Área de seleção de foto */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">
                Foto <span className="text-rosa">*</span>
              </label>
              <div
                onClick={() => fileRef.current?.click()}
                className={`relative w-full rounded-2xl border-2 border-dashed cursor-pointer
                  flex flex-col items-center justify-center gap-2 transition-colors
                  ${preview ? 'border-rosa/40 bg-rosa/5 p-2' : 'border-gray-300 hover:border-rosa bg-gray-50 p-8'}`}
              >
                {preview ? (
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                    <Image src={preview} alt="preview" fill className="object-cover" />
                  </div>
                ) : (
                  <>
                    <span className="text-4xl">📷</span>
                    <p className="font-nunito text-sm text-gray-500 text-center">
                      Clique para escolher uma foto
                    </p>
                    <p className="font-nunito text-xs text-gray-400">JPG, PNG, HEIC — máx. 8 MB</p>
                  </>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              {preview && (
                <button
                  type="button"
                  onClick={() => { setPreview(null); setFile(null); if (fileRef.current) fileRef.current.value = '' }}
                  className="mt-1 text-xs text-gray-400 hover:text-rosa font-nunito"
                >
                  Trocar foto
                </button>
              )}
            </div>

            {errorMsg && (
              <p className="text-red-400 text-sm font-nunito text-center">{errorMsg}</p>
            )}

            <motion.button
              type="submit"
              disabled={!file || !nome.trim() || uploading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-2xl font-bubblegum text-xl text-white shadow-lg
                bg-gradient-to-r from-rosa to-lilas
                disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploading ? '⏳ Enviando...' : '📸 Enviar foto!'}
            </motion.button>
          </form>
        </motion.div>

        {/* Galeria */}
        {loading ? (
          <div className="flex flex-col items-center py-20 gap-3">
            <div className="text-5xl animate-bounce-gentle">📸</div>
            <p className="font-nunito text-gray-400">Carregando fotos...</p>
          </div>
        ) : fotos.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">🌟</p>
            <p className="font-nunito text-gray-400 text-lg">
              Seja o primeiro a enviar uma foto!
            </p>
          </div>
        ) : (
          <>
            <h2 className="font-bubblegum text-2xl text-texto mb-6 text-center">
              🖼️ {fotos.length} foto{fotos.length !== 1 ? 's' : ''} compartilhada{fotos.length !== 1 ? 's' : ''}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {fotos.map((foto, i) => (
                <motion.div
                  key={foto.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="relative aspect-square rounded-2xl overflow-hidden shadow-md group"
                >
                  <Image
                    src={foto.url}
                    alt={`Foto de ${foto.nome_autor}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent
                    opacity-0 group-hover:opacity-100 transition-opacity duration-200
                    flex items-end p-3"
                  >
                    <p className="text-white text-xs font-nunito font-bold truncate">
                      {foto.nome_autor}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  )
}
