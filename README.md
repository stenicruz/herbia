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
- 📊 **Painel admin** — estatísticas de uso e mapa de ocorrências por região

---

## Arquitectura

```
herbia/
├── mobile/           # React Native + Expo
│   ├── screens/      # Ecrãs da aplicação
│   ├── components/   # Componentes reutilizáveis
│   └── services/     # Chamadas à API
│
├── api/              # Node.js + Express (API principal)
│   ├── routes/
│   ├── controllers/
│   └── middlewares/
│
├── ai-service/       # FastAPI + PyTorch (inferência do modelo)
│   ├── model/        # Modelo MobileNetV2 treinado
│   └── routes/
│
└── database/         # Migrations PostgreSQL (Supabase)
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
| Relatórios | react-native-pdf |
| Localização | expo-location |
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

### 2. API Node.js

```bash
cd api
npm install
cp .env.example .env
npm run dev
```

### 3. Serviço de IA

```bash
cd ai-service
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 4. Aplicação mobile

```bash
cd mobile
npm install
npx expo start
```

---

## Variáveis de ambiente

```env
# api/.env
DATABASE_URL=your_supabase_connection_string
JWT_SECRET=your_jwt_secret
AI_SERVICE_URL=http://localhost:8000
PORT=3000
```

---

## Modelo de IA

| Parâmetro | Valor |
|---|---|
| Arquitectura | MobileNetV2 |
| Framework | PyTorch |
| Técnica | Transfer learning |
| Input | Imagem RGB 224×224 |
| Output | Classe da doença + score de confiança |

---

## API

A API REST expõe **37 endpoints** documentados, organizados em 5 grupos:

| Grupo | Descrição |
|---|---|
| `/auth` | Login, registo, refresh de token |
| `/detections` | CRUD de detecções |
| `/reports` | Geração e exportação de PDFs |
| `/admin` | Gestão de utilizadores e estatísticas |
| `/geo` | Dados geográficos por região |

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
