import { createClient } from '@supabase/supabase-js'

// Fallback vazio evita crash no build quando as env vars não estão definidas.
// Em produção, as vars DEVEM estar configuradas — sem elas nenhuma operação no banco funciona.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Presente = {
  id: string
  nome: string
  descricao: string | null
  imagem_url: string | null
  preco_estimado: string | null
  link_referencia: string | null
  reservado_por: string | null
  reservado_em: string | null
  created_at: string
}

export type Rsvp = {
  id: string
  nome: string
  telefone: string | null
  quantidade_adultos: number
  quantidade_criancas: number
  confirmado: boolean
  mensagem: string | null
  created_at: string
}
