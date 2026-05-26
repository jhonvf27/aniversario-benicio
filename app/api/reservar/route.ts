import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  let body: { presenteId?: string; nome?: string; whatsapp?: string }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const { presenteId, nome, whatsapp } = body

  if (!presenteId || !nome?.trim()) {
    return NextResponse.json({ error: 'presenteId e nome são obrigatórios' }, { status: 400 })
  }

  // Proteção contra race condition:
  // Só atualiza se reservado_por ainda for NULL (WHERE reservado_por IS NULL)
  const { data, error } = await supabase
    .from('presentes')
    .update({
      reservado_por: nome.trim(),
      reservado_em: new Date().toISOString(),
      // Armazenamos whatsapp somente se fornecido (campo extra, opcional)
    })
    .eq('id', presenteId)
    .is('reservado_por', null)  // <-- proteção contra corrida
    .select()
    .single()

  if (error || !data) {
    // Se nenhuma linha foi atualizada, o presente já estava reservado
    return NextResponse.json({ error: 'Presente já foi reservado' }, { status: 409 })
  }

  return NextResponse.json({ success: true, presente: data })
}
