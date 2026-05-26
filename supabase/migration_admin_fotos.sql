-- ============================================================
-- Migration: Admin + Galeria de Fotos
-- Execute no Supabase SQL Editor → New Query → Run
-- ============================================================

-- 1. Permitir que o admin leia todas as confirmações de presença
CREATE POLICY "Leitura pública de RSVP"
  ON rsvp FOR SELECT USING (true);

-- 2. Tabela de fotos do aniversário
CREATE TABLE IF NOT EXISTS fotos (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  nome_autor  TEXT        NOT NULL,
  url         TEXT        NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE fotos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Fotos — leitura pública"
  ON fotos FOR SELECT USING (true);

CREATE POLICY "Fotos — envio público"
  ON fotos FOR INSERT WITH CHECK (true);
