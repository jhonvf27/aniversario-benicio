import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  let body: {
    nome?: string
    telefone?: string
    presenca?: boolean
    quantidade_adultos?: number
    quantidade_criancas?: number
    mensagem?: string
  }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const { nome, telefone, presenca = true, quantidade_adultos, quantidade_criancas, mensagem } = body

  if (!nome?.trim()) {
    return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 })
  }

  if (!telefone?.trim()) {
    return NextResponse.json({ error: 'Telefone é obrigatório' }, { status: 400 })
  }

  // Bloqueia duplicata pelo mesmo telefone
  const { data: existente } = await supabase
    .from('rsvp')
    .select('id, nome')
    .eq('telefone', telefone.trim())
    .maybeSingle()

  if (existente) {
    return NextResponse.json({ error: 'duplicate', nome: existente.nome }, { status: 409 })
  }

  const { data, error } = await supabase
    .from('rsvp')
    .insert({
      nome: nome.trim(),
      telefone: telefone.trim(),
      presenca,
      quantidade_adultos: presenca ? (Number(quantidade_adultos) || 1) : 0,
      quantidade_criancas: presenca ? (Number(quantidade_criancas) || 0) : 0,
      mensagem: mensagem?.trim() || null,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, rsvp: data })
}
