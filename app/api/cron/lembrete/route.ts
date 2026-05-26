import { NextRequest, NextResponse } from 'next/server'
import { FESTA_CONFIG } from '@/lib/config'

export const dynamic = 'force-dynamic'

// Cron job: executa diariamente às 10h (configurado no vercel.json)
// Verifica se faltam exatamente 7 dias para a festa
// Se sim, retorna a lista de convidados confirmados com links WhatsApp prontos
// O admin pode ver o aviso no painel /admin

export async function GET(req: NextRequest) {
  // Verifica secret para evitar chamadas não autorizadas
  const secret = req.headers.get('x-cron-secret') || req.nextUrl.searchParams.get('secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const hoje = new Date()
  const dataFesta = new Date(`${FESTA_CONFIG.dataFesta}T${FESTA_CONFIG.horarioFesta}:00`)

  const diffMs = dataFesta.getTime() - hoje.getTime()
  const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (diffDias !== 7) {
    return NextResponse.json({
      ok: true,
      mensagem: `Faltam ${diffDias} dias para a festa. Lembretes serão ativados quando faltar 7 dias.`,
      diffDias,
    })
  }

  // Faltam 7 dias! Busca convidados
  const { createClient } = await import('@supabase/supabase-js')
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const { data: rsvps } = await client
    .from('rsvp')
    .select('id, nome, telefone')
    .not('telefone', 'is', null)

  const msgBase = encodeURIComponent(
    `Oi! 🎪✨\n\nLembrando que a festa do *${FESTA_CONFIG.nomeBebe}* está chegando!\n\n` +
    `📅 *Data:* ${FESTA_CONFIG.dataFesta.split('-').reverse().join('/')}\n` +
    `🕐 *Horário:* ${FESTA_CONFIG.horarioFesta}h\n` +
    `📍 *Local:* ${FESTA_CONFIG.localFesta}\n\n` +
    `Te esperamos! 🎉🎈`
  )

  const links = (rsvps || []).map((r: { nome: string; telefone: string }) => ({
    nome: r.nome,
    telefone: r.telefone,
    whatsapp: `https://wa.me/55${r.telefone.replace(/\D/g, '')}?text=${msgBase}`,
  }))

  return NextResponse.json({
    ok: true,
    mensagem: `🎉 Faltam 7 dias! Envie os lembretes para ${links.length} convidados.`,
    diffDias,
    convidados: links,
  })
}
