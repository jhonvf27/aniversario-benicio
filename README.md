# 🎂 Aniversário do Benício — 1 Aninho!

Site de convite de aniversário infantil com lista de presentes em tempo real, RSVP e contador regressivo.

**Stack:** Next.js 14 · TypeScript · Tailwind CSS · Framer Motion · Supabase

---

## 🚀 Início rápido

### 1. Instalar dependências

```bash
cd aniversario-benicio
npm install
```

### 2. Configurar Supabase

#### 2.1 Criar conta e projeto
1. Acesse [supabase.com](https://supabase.com) → **Start your project**
2. Crie uma conta (gratuita)
3. Clique em **New Project**
4. Dê um nome (ex: `aniversario-benicio`) e escolha uma senha forte
5. Aguarde 1-2 minutos enquanto o projeto é criado

#### 2.2 Executar o schema SQL
1. No painel do Supabase, clique em **SQL Editor** (ícone de banco de dados) na barra lateral
2. Clique em **+ New Query**
3. Copie todo o conteúdo do arquivo `supabase/schema.sql`
4. Cole no editor e clique em **Run** (▶)
5. Você deve ver "Success. No rows returned"

#### 2.3 Habilitar Realtime (atualizações em tempo real)
1. Ainda no **SQL Editor**, execute:
   ```sql
   ALTER PUBLICATION supabase_realtime ADD TABLE presentes;
   ```

#### 2.4 Copiar as credenciais
1. Vá em **Project Settings** (engrenagem ⚙️) → **API**
2. Copie a **Project URL** e a **anon public key**

### 3. Configurar variáveis de ambiente

```bash
cp .env.local.example .env.local
```

Edite o `.env.local` com suas credenciais:
```
NEXT_PUBLIC_SUPABASE_URL=https://SEU_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciO...
```

### 4. Rodar localmente

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) 🎉

---

## 🎨 Personalizar o convite

Edite o arquivo `lib/config.ts`:

```typescript
export const FESTA_CONFIG = {
  nomeBebe: "Benício",           // ← Nome do bebê
  dataNascimento: "2025-05-25",  // ← Data de nascimento (AAAA-MM-DD)
  dataFesta: "2026-06-13",       // ← Data da festa (AAAA-MM-DD)
  horarioFesta: "15:00",         // ← Horário de início
  localFesta: "Rua das Flores, 123 — Bairro, Cidade/UF",
  linkMaps: "https://maps.google.com/?q=Seu+Endereço",
  mensagemPais: "Sua mensagem personalizada...",
  fotoBebe: "/foto-bebe.jpg",    // ← Ver instruções abaixo
}
```

### Adicionar foto do bebê

1. Renomeie a foto para `foto-bebe.jpg`
2. Coloque em `public/foto-bebe.jpg`
3. Reinicie o servidor

A foto deve ser quadrada (1:1) para melhor resultado na moldura circular.

### Personalizar a lista de presentes

Edite a seção `INSERT INTO presentes` no arquivo `supabase/schema.sql` e execute novamente no Supabase. Ou adicione diretamente pela interface do Supabase:
1. Vá em **Table Editor** → **presentes**
2. Clique em **Insert Row**

---

## ☁️ Deploy na Vercel

### Opção 1: Interface Web (recomendado)

1. Faça push do projeto para um repositório GitHub
2. Acesse [vercel.com](https://vercel.com) e clique em **Import Project**
3. Selecione o repositório
4. Em **Environment Variables**, adicione:
   - `NEXT_PUBLIC_SUPABASE_URL` → sua URL do Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` → sua chave anon
5. Clique em **Deploy**

### Opção 2: CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

Quando solicitado, adicione as variáveis de ambiente.

---

## 📁 Estrutura do projeto

```
aniversario-benicio/
├── app/
│   ├── layout.tsx          ← Fontes e metadata global
│   ├── page.tsx            ← Página principal do convite
│   ├── globals.css         ← Estilos, animações e variáveis CSS
│   ├── presentes/
│   │   └── page.tsx        ← Lista de presentes (com realtime)
│   ├── confirmar/
│   │   └── page.tsx        ← Confirmação de presença (RSVP)
│   └── api/
│       ├── presentes/      ← GET lista de presentes
│       ├── reservar/       ← POST reservar (proteção race condition)
│       └── rsvp/           ← POST confirmar presença
├── components/
│   ├── Countdown.tsx       ← Contador regressivo animado
│   ├── PresenteCard.tsx    ← Card com modal de reserva
│   ├── ConfettiEffect.tsx  ← Chuva de confetes
│   ├── FloatingBalloons.tsx← Balões subindo animados
│   └── RSVPForm.tsx        ← Formulário de presença
├── lib/
│   ├── config.ts           ← ⭐ PERSONALIZE AQUI
│   └── supabase.ts         ← Cliente Supabase
└── supabase/
    └── schema.sql          ← Schema do banco + dados iniciais
```

---

## ✅ Checklist antes de publicar

- [ ] Editei `lib/config.ts` com nome, data e local da festa corretos
- [ ] Adicionei `public/foto-bebe.jpg` com a foto do bebê
- [ ] Executei o `supabase/schema.sql` no Supabase
- [ ] Habilitei o Realtime (`ALTER PUBLICATION supabase_realtime ADD TABLE presentes`)
- [ ] Configurei as variáveis de ambiente (`.env.local` local e Vercel em produção)
- [ ] Personalizei a lista de presentes no Supabase
- [ ] Testei o fluxo: ver presentes → reservar → ver status atualizado
- [ ] Testei o RSVP até a mensagem de sucesso

---

## 🛡️ Proteção contra corrida (race condition)

A API de reserva usa `UPDATE WHERE reservado_por IS NULL`:

```sql
UPDATE presentes
SET reservado_por = $nome, reservado_em = NOW()
WHERE id = $id AND reservado_por IS NULL
```

Se duas pessoas clicarem ao mesmo tempo, apenas a primeira reserva. A segunda recebe status 409 e vê a mensagem "Alguém foi mais rápido! Escolha outro presente 😊".

---

## 🌈 Tecnologias

| Tecnologia | Uso |
|---|---|
| Next.js 14 (App Router) | Framework React |
| TypeScript | Tipagem |
| Tailwind CSS | Estilo utilitário |
| Framer Motion | Animações |
| Supabase | Banco PostgreSQL + Realtime |
| canvas-confetti | Chuva de confetes |
| date-fns | Cálculo do countdown |
| Google Fonts | Bubblegum Sans + Nunito |

---

Feito com ❤️ para o **Benício** — 1 Aninho! 🎂🎪
