# 🌿 Herbia — Aplicação Mobile

Aplicação mobile do Herbia para deteção de doenças em plantas, construída com **React Native** e **Expo**.

---

## 📁 Estrutura

```
front/
├── assets/                  # Imagens, ícones e recursos estáticos
├── android/                 # Configurações nativas Android
├── src/
│   ├── components/          # Componentes reutilizáveis (inputs, botões, etc.)
│   ├── constants/           # Dados estáticos (ex: províncias de Angola)
│   ├── context/             # Contextos React (tema, etc.)
│   ├── hooks/               # Hooks personalizados
│   ├── navigation/          # Configuração de rotas (AppNavigator)
│   ├── screens/             # Ecrãs da aplicação
│   ├── services/            # Comunicação com o backend e serviços externos
│   └── styles/              # Tema e estilos globais
├── app.json                 # Configuração do Expo (inclui apiUrl)
├── eas.json                 # Configuração de build (EAS)
├── App.js                   # Ponto de entrada
├── index.js                 # Registo do componente raiz
└── package.json
```

---

## ⚙️ Pré-requisitos

- Node.js 18 ou superior
- npm
- Expo CLI (`npm install -g expo-cli`)
- Expo Go (no telemóvel) ou Android Emulator

---

## 🚀 Como correr localmente

**1. Entra na pasta do front**
```bash
cd front
```

**2. Instala as dependências**
```bash
npm install
```

**3. Configura a URL do backend**

Abre o ficheiro `app.json` e ajusta o valor de `apiUrl` conforme o teu caso:

```json
"extra": {
  "apiUrl": "http://10.0.2.2:3333"
}
```

| Situação | URL a usar |
|----------|-----------|
| Emulador Android | `http://10.0.2.2:3333` |
| Dispositivo físico | `http://SEU_IP_LOCAL:3333` |
| Backend hospedado | URL do servidor (ex: Render) |

> Para descobrir o teu IP local: `ip a` (Linux/Mac) ou `ipconfig` (Windows).

**4. Inicia a aplicação**
```bash
npx expo start
```

Depois, podes:
- Ler o QR Code com o **Expo Go** no telemóvel
- Pressionar `a` para abrir no emulador Android
- Pressionar `i` para abrir no simulador iOS

---

## ✅ Verificar se está a funcionar

Ao abrir a app deves ver o ecrã de **Splash** seguido do **Onboarding** (na primeira vez) ou do **Login**.

Se aparecer erro de conexão com o servidor, verifica se:
1. O backend está a correr (`node server.js` na pasta `backend/`)
2. O `apiUrl` no `app.json` está correto para o teu ambiente

---

## 🔗 Integração com o Backend

O front comunica com o backend através do ficheiro `src/services/api.js`. A URL base é lida automaticamente do `app.json`:

```js
import Constants from 'expo-constants';
const BASE_SERVER = Constants.expoConfig.extra.apiUrl;
```

Certifica-te de que o backend está a correr **antes** de iniciar o front.

---

## 📦 Build APK

Para gerar um APK de teste:

```bash
eas build --profile preview --platform android
```

> Requer conta no [Expo EAS](https://expo.dev) e o CLI configurado (`npm install -g eas-cli`).

---

## 🔑 Login com Google

O login social com Google usa o `webClientId` configurado em `src/services/authService.js`. Este valor é público e não precisa de ser alterado para testes locais — desde que as credenciais Google OAuth estejam corretamente configuradas no backend.