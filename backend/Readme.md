# 🌿 Herbia — Backend

Servidor principal da aplicação Herbia, responsável pela autenticação, gestão de utilizadores, análise de plantas e comunicação com o serviço de IA.

**Stack:** Node.js · Express · PostgreSQL (Supabase)

---

## 📁 Estrutura

```
backend/
├── src/
│   ├── config/
│   │   ├── constants.js      # Variáveis globais e configurações
│   │   ├── database.js       # Conexão com o PostgreSQL (Supabase)
│   │   ├── mailer.js         # Serviço de email (Brevo)
│   │   └── multer.js         # Upload de ficheiros
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── geralController.js
│   │   ├── plantController.js
│   │   └── userController.js
│   ├── middlewares/
│   │   ├── auth.js           # Verificação de sessão
│   │   └── verifyAdmin.js    # Verificação de permissões de admin
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── geralRoutes.js
│   │   ├── plantRoutes.js
│   │   └── userRoutes.js
│   └── services/
│       └── storageService.js # Upload para o Supabase Storage
├── .env                      # Variáveis de ambiente (não incluído no repo)
├── .env.example              # Modelo das variáveis necessárias
├── package.json
└── server.js                 # Ponto de entrada
```

---

## ⚙️ Pré-requisitos

- Node.js 18 ou superior
- npm
- Conta no [Supabase](https://supabase.com) com projeto criado
- Conta no [Brevo](https://brevo.com) para envio de emails
- Credenciais Google OAuth (para login social)

---

## 🚀 Como correr localmente

**1. Entra na pasta do backend**
```bash
cd backend
```

**2. Instala as dependências**
```bash
npm install
```

**3. Configura as variáveis de ambiente**
```bash
cp .env.example .env
```

Abre o ficheiro `.env` e preenche todos os valores. Consulta a secção [Variáveis de Ambiente](#variáveis-de-ambiente) abaixo.

**4. Inicia o servidor**
```bash
node server.js
```

Ou com hot-reload durante desenvolvimento:
```bash
nodemon server.js
```

O servidor ficará disponível em `http://localhost:3333`.

---

## ✅ Verificar se está a funcionar

Ao iniciar, deves ver no terminal:

```
⏳ Verificando conexão com o PostgreSQL...
✅ Conexão com o banco de dados estabelecida com sucesso!
🚀🌿 Servidor Herbia rodando em http://0.0.0.0:3333
```

Se aparecer erro de conexão com a base de dados, verifica o `DATABASE_URL` no `.env`.

---

## 🔑 Variáveis de Ambiente

| Variável | Descrição | Obrigatória |
|----------|-----------|-------------|
| `PORT` | Porta do servidor (padrão: 3333) | Não |
| `DATABASE_URL` | Connection string do Supabase (PostgreSQL) | ✅ Sim |
| `SUPABASE_URL` | URL do projeto Supabase | ✅ Sim |
| `SUPABASE_KEY` | Chave anon/service do Supabase | ✅ Sim |
| `GOOGLE_CLIENT_ID` | Client ID Google OAuth (verificação de token) | ✅ Sim |
| `GOOGLE_CLIENT_ID_WEB` | Client ID Google para Web | ✅ Sim |
| `GOOGLE_CLIENT_ID_ANDROID` | Client ID Google para Android | ✅ Sim |
| `BREVO_API_KEY` | Chave API do Brevo para envio de emails | ✅ Sim |
| `IA_URL` | URL do serviço de IA | Não |

> **Nota sobre `IA_URL`:** Se não definires esta variável, o backend usa automaticamente o serviço hospedado no Hugging Face. Define-a como `http://127.0.0.1:8000/predict` se quiseres usar o `ia_service` localmente.

### Onde encontrar cada valor

**Supabase (`DATABASE_URL`, `SUPABASE_URL`, `SUPABASE_KEY`):**
Acede ao teu projeto em [supabase.com](https://supabase.com) → Settings → Database / API.

**Google OAuth (`GOOGLE_CLIENT_ID_*`):**
Acede à [Google Cloud Console](https://console.cloud.google.com) → APIs & Services → Credentials.

**Brevo (`BREVO_API_KEY`):**
Acede à tua conta em [brevo.com](https://brevo.com) → Settings → API Keys.

---

## 🔗 Integração com o ia_service

Por padrão, o backend comunica com o serviço de IA hospedado no Hugging Face. Para usar o `ia_service` localmente, define no `.env`:

```env
IA_URL=http://127.0.0.1:8000/predict
```

E certifica-te de que o `ia_service` está a correr **antes** de iniciar o backend.

---

## 📡 Rotas disponíveis

| Prefixo | Ficheiro | Descrição |
|---------|----------|-----------|
| `/api/auth` | authRoutes.js | Registo, login, verificação de email, recuperação de senha |
| `/api/plantas` | plantRoutes.js | Análise de plantas e histórico |
| `/api/admin` | adminRoutes.js | Gestão de utilizadores, dicas, culturas e doenças |
| `/api/usuarios` | userRoutes.js | Perfil do utilizador |
| `/api` | geralRoutes.js | Culturas e dica dinâmica (rotas públicas) |

Para documentação completa da API, consulta o ficheiro `API_Herbia.md`.