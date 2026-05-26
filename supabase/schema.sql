-- ============================================================
-- Schema — Aniversário do Benício 🎂
-- Execute este SQL no Supabase: SQL Editor → New Query → Run
-- ============================================================

-- Tabela de presentes
CREATE TABLE presentes (
  id              UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  nome            TEXT        NOT NULL,
  descricao       TEXT,
  imagem_url      TEXT,
  preco_estimado  TEXT,
  link_referencia TEXT,
  reservado_por   TEXT        DEFAULT NULL,
  reservado_em    TIMESTAMPTZ DEFAULT NULL,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Tabela de confirmações de presença (RSVP)
CREATE TABLE rsvp (
  id                  UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  nome                TEXT        NOT NULL,
  telefone            TEXT,
  quantidade_adultos  INTEGER     DEFAULT 1,
  quantidade_criancas INTEGER     DEFAULT 0,
  confirmado          BOOLEAN     DEFAULT TRUE,
  mensagem            TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Row Level Security — acesso público (sem autenticação)
-- ============================================================

ALTER TABLE presentes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Leitura pública de presentes"
  ON presentes FOR SELECT USING (true);

CREATE POLICY "Reserva pública de presentes"
  ON presentes FOR UPDATE USING (true) WITH CHECK (true);

ALTER TABLE rsvp ENABLE ROW LEVEL SECURITY;

CREATE POLICY "RSVP público"
  ON rsvp FOR INSERT WITH CHECK (true);

-- ============================================================
-- Dados iniciais — Lista de presentes do Benício
-- PERSONALIZE OU ADICIONE ITENS AQUI!
-- ============================================================

INSERT INTO presentes (nome, descricao, preco_estimado, imagem_url) VALUES
(
  'Andador / Carrinho de Bebê',
  'Andador colorido para estimular os primeiros passos do Benício',
  'R$ 150 – 250',
  'https://placehold.co/400x300/FFD6E0/FF6B9D?text=🚗+Andador'
),
(
  'Kit Banho Premium',
  'Toalha de capuz, kit de higiene e esponja macias e seguras',
  'R$ 80 – 120',
  'https://placehold.co/400x300/D6F0FF/4DAEE5?text=🛁+Kit+Banho'
),
(
  'Livros Infantis (Kit 5)',
  'Livros táteis e de pano para estimular a leitura e a imaginação',
  'R$ 100 – 180',
  'https://placehold.co/400x300/D6FFE0/4ADE80?text=📚+Livros'
),
(
  'Brinquedo Sensorial',
  'Kit de brinquedos para estimulação sensorial — ideal para 0-2 anos',
  'R$ 120 – 200',
  'https://placehold.co/400x300/FFE8D6/FF9A4A?text=🧸+Sensorial'
),
(
  'Roupas (Tamanho 1-2 anos)',
  'Kit de roupas confortáveis para a fase de crescimento do Benício',
  'R$ 150 – 300',
  'https://placehold.co/400x300/F0D6FF/A855F7?text=👕+Roupas'
),
(
  'Cadeirão de Alimentação',
  'Cadeira de refeição dobrável, fácil de limpar e segura',
  'R$ 300 – 500',
  'https://placehold.co/400x300/FFD6D6/EF4444?text=🪑+Cadeirão'
),
(
  'Bola de Atividades Musical',
  'Bola colorida com sons e luzes para desenvolvimento motor',
  'R$ 60 – 100',
  'https://placehold.co/400x300/FFFBD6/EAB308?text=⚽+Bola'
),
(
  'Kit Fantoches de Dedo',
  'Fantoches fofos para contar histórias e estimular a imaginação',
  'R$ 50 – 90',
  'https://placehold.co/400x300/D6FFF6/14B8A6?text=🎭+Fantoches'
),
(
  'Tapete de Atividades',
  'Tapete macio com espelho, texturas e brinquedos suspensos',
  'R$ 200 – 350',
  'https://placehold.co/400x300/FFD6F0/EC4899?text=🏡+Tapete'
),
(
  'Vale Presente 💕',
  'Você escolhe o valor e a família do Benício escolhe o que precisar com mais carinho',
  'Qualquer valor',
  'https://placehold.co/400x300/E8D6FF/8B5CF6?text=🎁+Vale+Presente'
);

-- ============================================================
-- Habilitar Realtime (necessário para atualização em tempo real)
-- Execute no SQL Editor do Supabase:
-- ============================================================
-- ALTER PUBLICATION supabase_realtime ADD TABLE presentes;
