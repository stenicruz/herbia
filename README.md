<div align="center">

# 🌿 Herbia

**Detecção inteligente de doenças em plantas**

[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev)
[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev)
[![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)](https://pytorch.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org)

> Projecto de Aptidão Profissional (PAP) — ITEL, Angola 🇦🇴

</div>

---

## Sobre o projecto

**Herbia** é uma aplicação mobile que permite identificar doenças em plantas através da câmara do telemóvel. O utilizador fotografa uma folha e recebe em segundos um diagnóstico gerado por inteligência artificial, junto com informações sobre a doença e recomendações de tratamento.

Desenvolvido como Projecto de Aptidão Profissional no curso Técnico de Informática do ITEL.

---

## Funcionalidades

- 📸 **Detecção por câmara** — captura e análise de imagem em tempo real
- 🤖 **IA embarcada** — modelo MobileNetV2 treinado com transfer learning
- 📍 **Dados geográficos** — registo de GPS em cada detecção
- 📄 **Relatórios PDF** — exportação de histórico para utilizadores e admins
- 👤 **Autenticação** — sistema com roles (utilizador / administrador)
- 🌐 **Modo offline** — análises guardadas localmente com sincronização automática
- 📊 **Painel admin** — estatísticas de uso e mapa de ocorrências por região

---

## Arquitectura

```
herbia/
├── front/            # React Native + Expo
│   ├── src/
│   │   ├── screens/      # Ecrãs da aplicação
│   │   ├── components/   # Componentes reutilizáveis
│   │   ├── services/     # Chamadas à API
│   │   └── navigation/   # Configuração de rotas
│   └── app.json          # Configuração do Expo (inclui apiUrl)
│
├── backend/          # Node.js + Express (API principal)
│   ├── src/
│   │   ├── routes/
│   │   ├── controllers/
│   │   └── middlewares/
│   └── server.js
│
└── ia_service/       # FastAPI + PyTorch (inferência do modelo)
    └── app/
        ├── model/    # Modelo MobileNetV2 treinado
        └── main.py
```

---

## Stack tecnológica

| Camada | Tecnologia |
|---|---|
| Mobile | React Native, Expo |
| API principal | Node.js, Express |
| Serviço de IA | FastAPI, Python |
| Modelo de IA | PyTorch, MobileNetV2 |
| Base de dados | PostgreSQL, Supabase |
| Storage | Supabase Storage |
| Email | Brevo |
| Auth social | Google OAuth |
| Testes de carga | Artillery |

---

## Como correr o projecto localmente

### Pré-requisitos

- Node.js 18+
- Python 3.10+
- Expo CLI (`npm install -g expo-cli`)
- Conta no [Supabase](https://supabase.com)

### 1. Clonar o repositório

```bash
git clone https://github.com/stenicruz/herbia.git
cd herbia
```

### 2. Serviço de IA

```bash
cd ia_service
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### 3. Backend Node.js

```bash
cd backend
npm install
cp .env.example .env
node server.js
```

### 4. Aplicação mobile

```bash
cd front
npm install
npx expo start
```

> ⚠️ A ordem importa: inicia sempre o `ia_service` e o `backend` antes do `front`.

---

## Variáveis de ambiente

```env
# backend/.env
DATABASE_URL=            # Connection string do Supabase (PostgreSQL)
SUPABASE_URL=            # URL do projeto Supabase
SUPABASE_KEY=            # Chave anon/service do Supabase
GOOGLE_CLIENT_ID=        # Client ID Google OAuth (verificação de token)
GOOGLE_CLIENT_ID_WEB=    # Client ID Google para Web
GOOGLE_CLIENT_ID_ANDROID= # Client ID Google para Android
BREVO_API_KEY=           # Chave API do Brevo para envio de emails
PORT=3333                # Porta do servidor (opcional)
IA_URL=                  # URL do serviço de IA (opcional)
```

Consulta o [`backend/README.md`](./backend/README.md) para instruções detalhadas sobre como obter cada valor.

---

## Modelo de IA

| Parâmetro | Valor |
|---|---|
| Arquitectura | MobileNetV2 (adaptada) |
| Framework | PyTorch |
| Técnica | Transfer learning |
| Input | Imagem RGB 224×224 |
| Classes | 17 (4 culturas × doenças + Desconhecido) |
| Threshold | 50% de confiança mínima |
| Output | Classe da doença + score de confiança + top 3 |

**Culturas suportadas:** Batata, Mandioca, Milho, Tomate

---

## API

A API REST está organizada em 5 grupos de rotas:

| Grupo | Prefixo | Descrição |
|---|---|---|
| Auth | `/api/auth` | Login, registo, verificação de email, recuperação de senha |
| Plantas | `/api/plantas` | Análise de imagens e histórico |
| Admin | `/api/admin` | Gestão de utilizadores, dicas, culturas e doenças |
| Utilizadores | `/api/usuarios` | Perfil, foto e senha |
| Geral | `/api` | Culturas e dica dinâmica (rotas públicas) |

---

## Autores

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/stenicruz">
        <img src="https://github.com/stenicruz.png" width="80px" style="border-radius:50%"/><br/>
        <sub><b>Sténio Cruz</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/MiltonBernardo0">
        <img src="https://github.com/MiltonBernardo0.png" width="80px" style="border-radius:50%"/><br/>
        <sub><b>Milton Bernardo</b></sub>
      </a>
    </td>
  </tr>
</table>

---

<div align="center">

Desenvolvido com 💚 em Angola 🇦🇴

</div>
exit code 0
Done
