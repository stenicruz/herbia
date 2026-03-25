# 🌿 Documentação da API — Herbia

**Base URL:** `http://192.168.0.104:3333`  
**Formato:** JSON  
**Autenticação:** Token via header `Authorization: Bearer <token>`

---

## Índice

1. [Autenticação](#1-autenticação)
2. [Plantas & Análises](#2-plantas--análises)
3. [Utilizadores](#3-utilizadores)
4. [Geral (Público)](#4-geral-público)
5. [Admin](#5-admin)
6. [Códigos de Resposta](#6-códigos-de-resposta)

---

## 1. Autenticação

> Base: `/api/auth`

---

### POST `/api/auth/registrar`
Cria uma nova conta de utilizador. Envia um código de verificação por e-mail.

**Autenticação:** Não requerida

**Body (JSON):**
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "minhasenha123"
}
```

**Resposta de sucesso `201`:**
```json
{ "sucesso": true }
```

**Resposta de erro `400`:**
```json
{ "error": "Este e-mail já está em uso." }
```

---

### POST `/api/auth/login`
Autentica um utilizador e retorna um token de sessão.

**Autenticação:** Não requerida

**Body (JSON):**
```json
{
  "email": "joao@email.com",
  "senha": "minhasenha123"
}
```

**Resposta de sucesso `200`:**
```json
{
  "token": "abc123...",
  "user": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com",
    "role": "usuario",
    "ativo": 1,
    "foto_perfil": ""
  }
}
```

**Respostas de erro:**
| Código | Mensagem |
|--------|----------|
| `401` | Credenciais inválidas |
| `403` | `EMAIL_NOT_VERIFIED` — Email não verificado |
| `403` | Conta desativada pelo administrador |
| `400` | Conta criada com Google — usar login social |

---

### POST `/api/auth/login-google`
Autentica ou regista um utilizador via conta Google.

**Autenticação:** Não requerida

**Body (JSON):**
```json
{
  "token": "<id_token_do_google>"
}
```

**Resposta de sucesso `200`:**
```json
{
  "success": true,
  "token": "abc123...",
  "user": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@gmail.com",
    "role": "usuario",
    "ativo": 1,
    "foto_perfil": "https://..."
  }
}
```

---

### POST `/api/auth/validar-email`
Ativa a conta do utilizador com o código recebido por e-mail após o registo.

**Autenticação:** Não requerida

**Body (JSON):**
```json
{
  "email": "joao@email.com",
  "codigo": "482910"
}
```

**Resposta de sucesso `200`:**
```json
{ "sucesso": true, "message": "Conta ativada com sucesso!" }
```

---

### POST `/api/auth/validar-codigo`
Valida o código de recuperação de senha (apenas verificação, sem alterar nada).

**Autenticação:** Não requerida

**Body (JSON):**
```json
{
  "email": "joao@email.com",
  "codigo": "391827"
}
```

**Resposta de sucesso `200`:**
```json
{ "sucesso": true, "message": "Código validado." }
```

---

### POST `/api/auth/reenviar-codigo`
Reenvia um novo código de verificação ou recuperação por e-mail.

**Autenticação:** Não requerida

**Body (JSON):**
```json
{
  "email": "joao@email.com",
  "motivo": "recuperacao"
}
```
> `motivo` pode ser `"recuperacao"` ou omitido (para reenvio de ativação).

**Resposta de sucesso `200`:**
```json
{ "sucesso": true }
```

---

### POST `/api/auth/recuperar-senha`
Inicia o fluxo de recuperação de senha — envia código por e-mail.

**Autenticação:** Não requerida

**Body (JSON):**
```json
{
  "email": "joao@email.com"
}
```

**Resposta de sucesso `200`:**
```json
{ "sucesso": true }
```

---

### POST `/api/auth/redefinir-senha`
Redefine a senha com o código de recuperação validado.

**Autenticação:** Não requerida

**Body (JSON):**
```json
{
  "email": "joao@email.com",
  "codigo": "391827",
  "novaSenha": "novasenha456"
}
```

**Resposta de sucesso `200`:**
```json
{ "sucesso": true }
```

---

### POST `/api/auth/verificar-senha`
Verifica se a senha atual do utilizador está correta (usado antes de ações sensíveis).

**Autenticação:** ✅ Requerida

**Body (JSON):**
```json
{
  "senha": "minhasenha123"
}
```

**Resposta de sucesso `200`:**
```json
{ "sucesso": true }
```

**Resposta de erro `400`:**
```json
{ "error": "Senha incorreta." }
```

---

### GET `/api/auth/usuarios/:id`
Retorna os dados do perfil do utilizador autenticado.

**Autenticação:** ✅ Requerida  
**Restrição:** Só pode aceder ao próprio perfil.

**Resposta de sucesso `200`:**
```json
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@email.com",
  "role": "usuario",
  "ativo": 1,
  "foto_perfil": "/uploads/perfil/perfil-123.jpg"
}
```

---

## 2. Plantas & Análises

> Base: `/api/plantas`

---

### POST `/api/plantas/analisar`
Envia uma imagem de planta para análise pela IA. Se o utilizador estiver autenticado, o resultado é guardado automaticamente no histórico.

**Autenticação:** Opcional (se autenticado, guarda no histórico)

**Body:** `multipart/form-data`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `imagem` | File | Foto da planta (obrigatório) |

**Resposta de sucesso `200`:**
```json
{
  "classe_ia": "tomato_early_blight",
  "planta": "Tomate",
  "doenca": "Pinta Preta",
  "estado": "Doente",
  "descricao": "Doença fúngica que afeta...",
  "prevencao": "Evitar excesso de humidade...",
  "caseiro": "Calda bordalesa...",
  "convencional": "Fungicida à base de cobre...",
  "precisao": 94,
  "imagem": "/uploads/analises/IA-1714000000000.jpg"
}
```

---

### POST `/api/plantas/salvar-pendente`
Guarda no histórico uma análise que foi feita antes do utilizador fazer login.

**Autenticação:** ✅ Requerida

**Body (JSON):**
```json
{
  "planta": "Tomate",
  "doenca": "Pinta Preta",
  "estado": "Doente",
  "precisao": 94,
  "descricao": "...",
  "prevencao": "...",
  "caseiro": "...",
  "convencional": "...",
  "imagem": "/uploads/analises/IA-123.jpg",
  "classe_ia": "tomato_early_blight"
}
```

**Resposta de sucesso `201`:**
```json
{ "sucesso": true, "mensagem": "Análise salva no histórico!" }
```

---

### GET `/api/plantas/historico`
Lista todas as análises do utilizador autenticado, ordenadas da mais recente para a mais antiga.

**Autenticação:** ✅ Requerida

**Resposta de sucesso `200`:**
```json
[
  {
    "id": 12,
    "usuario_id": 1,
    "planta": "Tomate",
    "doenca": "Pinta Preta",
    "estado": "Doente",
    "precisao": 94,
    "descricao": "...",
    "prevencao": "...",
    "tratamento_caseiro": "...",
    "tratamento_convencional": "...",
    "classe_ia": "tomato_early_blight",
    "imagem_url": "/uploads/analises/IA-123.jpg",
    "criado_em": "2024-05-20 14:30:00"
  }
]
```

---

### DELETE `/api/plantas/historico/:id`
Remove uma análise específica do histórico do utilizador.

**Autenticação:** ✅ Requerida  
**Restrição:** Só pode eliminar registos do próprio utilizador.

**Parâmetros de URL:**
| Parâmetro | Descrição |
|-----------|-----------|
| `id` | ID da análise |

**Resposta de sucesso `204`:** *(sem corpo)*

---

## 3. Utilizadores

> Base: `/api/usuarios`  
> Todas as rotas requerem autenticação e o utilizador só pode gerir os seus próprios dados.

---

### GET `/api/usuarios/:id`
Retorna os dados do perfil, incluindo se tem senha definida e o tipo de autenticação.

**Autenticação:** ✅ Requerida

**Resposta de sucesso `200`:**
```json
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@email.com",
  "auth_provider": "local",
  "tem_senha": 1
}
```

---

### PUT `/api/usuarios/:id`
Atualiza o nome do utilizador.

**Autenticação:** ✅ Requerida

**Body (JSON):**
```json
{
  "nome": "João Ferreira"
}
```

**Resposta de sucesso `200`:**
```json
{ "sucesso": true }
```

---

### PUT `/api/usuarios/:id/foto`
Atualiza a foto de perfil do utilizador.

**Autenticação:** ✅ Requerida

**Body:** `multipart/form-data`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `foto` | File | Nova foto de perfil |

**Resposta de sucesso `200`:**
```json
{ "foto_url": "/uploads/perfil/perfil-1714000000000.jpg" }
```

---

### PUT `/api/usuarios/:id/senha`
Altera a senha do utilizador. Para contas Google sem senha, define uma nova diretamente.

**Autenticação:** ✅ Requerida

**Body (JSON):**
```json
{
  "senhaAtual": "minhasenha123",
  "novaSenha": "novasenha456"
}
```
> `senhaAtual` é dispensável para contas Google que ainda não têm senha definida.

**Resposta de sucesso `200`:**
```json
{ "sucesso": true, "mensagem": "Senha alterada!" }
```

---

### DELETE `/api/usuarios/:id/conta`
Elimina permanentemente a conta e todos os dados associados (sessões e histórico).

**Autenticação:** ✅ Requerida

**Body (JSON):**
```json
{
  "senha": "minhasenha123"
}
```
> `senha` é obrigatória apenas para contas locais.

**Resposta de sucesso `200`:**
```json
{ "sucesso": true }
```

---

## 4. Geral (Público)

> Base: `/api`  
> Rotas públicas, sem autenticação.

---

### GET `/api/culturas`
Lista todas as culturas (plantas) disponíveis no sistema, com nome e imagem.

**Autenticação:** Não requerida

**Resposta de sucesso `200`:**
```json
[
  {
    "id": 1,
    "nome": "Tomate",
    "imagem_url": "/uploads/culturas/cultura-123.jpg"
  },
  {
    "id": 2,
    "nome": "Milho",
    "imagem_url": "/uploads/culturas/cultura-456.jpg"
  }
]
```

---

### GET `/api/dica-dinamica`
Retorna uma dica agrícola aleatória para exibir na home do utilizador.

**Autenticação:** Não requerida

**Resposta de sucesso `200`:**
```json
{
  "id": 3,
  "titulo": "Rega eficiente",
  "conteudo": "Regar as plantas de manhã cedo reduz a evaporação..."
}
```

**Resposta de erro `404`:**
```json
{ "error": "Nenhuma dica cadastrada ainda." }
```

---

## 5. Admin

> Base: `/api/admin`  
> Todas as rotas requerem autenticação (`Authorization: Bearer <token>`) e que o utilizador seja do tipo `admin`.

---

### GET `/api/admin/home`
Retorna estatísticas gerais do dashboard e as 5 análises mais recentes.

**Resposta de sucesso `200`:**
```json
{
  "stats": {
    "totalUsuarios": 120,
    "ativos": 110,
    "inativos": 10,
    "totalAdmins": 2,
    "totalAnalises": 543
  },
  "recentes": [
    {
      "id": 543,
      "planta": "Tomate",
      "doenca": "Pinta Preta",
      "usuario_nome": "Maria Santos",
      "criado_em": "2024-05-20 14:30:00"
    }
  ]
}
```

---

### GET `/api/admin/usuarios`
Lista todos os utilizadores com suporte a pesquisa e filtros.

**Query Params (opcionais):**
| Parâmetro | Valores | Descrição |
|-----------|---------|-----------|
| `busca` | texto | Filtra por nome ou email |
| `filtro` | `ativos`, `inativos`, `admins` | Filtra por estado ou tipo |

**Resposta de sucesso `200`:** Array de utilizadores.

---

### POST `/api/admin/usuarios/admin`
Cria uma nova conta de administrador.

**Body (JSON):**
```json
{
  "nome": "Admin Novo",
  "email": "admin@herbia.com",
  "senha": "senha_segura"
}
```

**Resposta de sucesso `200`:**
```json
{ "sucesso": true }
```

---

### GET `/api/admin/usuarios/:id/historico`
Retorna o histórico de análises de um utilizador específico.

**Resposta de sucesso `200`:** Array de análises do utilizador.

---

### PUT `/api/admin/usuarios/:id/status`
Ativa ou desativa a conta de um utilizador.

**Body (JSON):**
```json
{
  "ativo": 0
}
```
> `1` para ativar, `0` para desativar.

**Resposta de sucesso `200`:**
```json
{ "sucesso": true }
```

---

### DELETE `/api/admin/usuarios/:id`
Elimina um utilizador do sistema.

**Resposta de sucesso `200`:**
```json
{ "sucesso": true }
```

---

### GET `/api/admin/historico`
Lista o histórico global de todas as análises com suporte a filtros.

**Query Params (opcionais):**
| Parâmetro | Exemplo | Descrição |
|-----------|---------|-----------|
| `cultura` | `Tomate` | Filtra por planta |
| `estado` | `Doente` | Filtra por estado |
| `data` | `2024-05-20` | Filtra por data (formato YYYY-MM-DD) |

**Resposta de sucesso `200`:** Array de análises com o campo `usuario_nome` incluído.

---

### DELETE `/api/admin/historico/:id`
Elimina uma análise específica do histórico global.

**Resposta de sucesso `200`:**
```json
{ "sucesso": true }
```

---

### GET `/api/admin/dicas`
Lista todas as dicas cadastradas.

**Resposta de sucesso `200`:** Array de dicas.

---

### POST `/api/admin/dicas`
Cria uma nova dica.

**Body (JSON):**
```json
{
  "titulo": "Controlo de pragas",
  "conteudo": "Inspecionar as plantas regularmente..."
}
```

**Resposta de sucesso `201`:**
```json
{ "sucesso": true }
```

---

### PUT `/api/admin/dicas/:id`
Edita uma dica existente.

**Body (JSON):**
```json
{
  "titulo": "Título atualizado",
  "conteudo": "Conteúdo atualizado..."
}
```

**Resposta de sucesso `200`:**
```json
{ "sucesso": true }
```

---

### DELETE `/api/admin/dicas/:id`
Elimina uma dica.

**Resposta de sucesso `200`:**
```json
{ "sucesso": true }
```

---

### GET `/api/admin/culturas`
Lista todas as culturas com todos os seus campos.

**Resposta de sucesso `200`:** Array de culturas.

---

### POST `/api/admin/culturas`
Cria uma nova cultura com imagem opcional.

**Body:** `multipart/form-data`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `nome` | String | Nome da cultura (obrigatório) |
| `imagem` | File | Imagem da cultura (opcional) |

**Resposta de sucesso `201`:**
```json
{ "sucesso": true }
```

---

### PUT `/api/admin/culturas/:id`
Edita uma cultura existente. Se uma nova imagem for enviada, substitui a anterior.

**Body:** `multipart/form-data`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `nome` | String | Novo nome |
| `imagem` | File | Nova imagem (opcional) |

**Resposta de sucesso `200`:**
```json
{ "sucesso": true }
```

---

### DELETE `/api/admin/culturas/:id`
Elimina uma cultura. ⚠️ Elimina também todas as doenças associadas (CASCADE).

**Resposta de sucesso `200`:**
```json
{ "sucesso": true }
```

---

### GET `/api/admin/doencas`
Lista todas as doenças com o nome da cultura associada.

**Resposta de sucesso `200`:** Array de doenças com o campo `cultura_nome` incluído.

---

### POST `/api/admin/doencas`
Cria uma nova doença associada a uma cultura.

**Body (JSON):**
```json
{
  "cultura_id": 1,
  "classe_ia": "tomato_early_blight",
  "nome": "Pinta Preta",
  "estado": "Doente",
  "descricao": "Doença fúngica causada por...",
  "prevencao": "Evitar excesso de humidade...",
  "tratamento_caseiro": "Calda bordalesa...",
  "tratamento_convencional": "Fungicida à base de cobre..."
}
```

**Resposta de sucesso `201`:**
```json
{ "sucesso": true }
```

---

### PUT `/api/admin/doencas/:id`
Edita uma doença existente. Aceita os mesmos campos do POST.

**Resposta de sucesso `200`:**
```json
{ "sucesso": true }
```

---

### DELETE `/api/admin/doencas/:id`
Elimina uma doença.

**Resposta de sucesso `200`:**
```json
{ "sucesso": true }
```

---

## 6. Códigos de Resposta

| Código | Significado |
|--------|-------------|
| `200` | Sucesso |
| `201` | Criado com sucesso |
| `204` | Sucesso sem conteúdo (ex: delete) |
| `400` | Dados inválidos ou em falta |
| `401` | Não autenticado / credenciais inválidas |
| `403` | Acesso negado (sem permissão) |
| `404` | Recurso não encontrado |
| `500` | Erro interno do servidor |
