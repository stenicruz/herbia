# 🤖 Documentação da API de Inteligência Artificial — Herbia

**Base URL:** `http://127.0.0.1:8000`  
**Framework:** FastAPI (Python)  
**Formato:** JSON  
**Autenticação:** Não requerida (uso interno — chamada apenas pelo servidor Node.js)

---

## Índice

1. [Visão Geral do Modelo](#1-visão-geral-do-modelo)
2. [Classes Suportadas](#2-classes-suportadas)
3. [Endpoints](#3-endpoints)
4. [Códigos de Resposta](#4-códigos-de-resposta)

---

## 1. Visão Geral do Modelo

| Propriedade | Detalhe |
|-------------|---------|
| Arquitetura | MobileNetV2 (adaptada) |
| Framework | PyTorch |
| Número de classes | 17 |
| Tamanho de entrada | 224 × 224 px (RGB) |
| Normalização | ImageNet (mean: `[0.485, 0.456, 0.406]`, std: `[0.229, 0.224, 0.225]`) |
| Threshold de confiança | 30% — abaixo disso retorna `"Desconhecido"` |
| Dispositivo de inferência | CPU |
| Ficheiro do modelo | `model/best_model.pth` |

**Culturas suportadas:** Batata, Mandioca, Milho, Tomate

---

## 2. Classes Suportadas

| ID | Classe | Planta | Estado |
|----|--------|--------|--------|
| 0 | `Batata__Ferrugem_Precoce` | Batata | Doente |
| 1 | `Batata__Ferrugem_Tardia` | Batata | Doente |
| 2 | `Batata__Saudavel` | Batata | Saudável |
| 3 | `Desconhecido` | — | — |
| 4 | `Mandioca__Bacteriose` | Mandioca | Doente |
| 5 | `Mandioca__Estria_Castanha` | Mandioca | Doente |
| 6 | `Mandioca__Mottle_Verde` | Mandioca | Doente |
| 7 | `Mandioca__Mosaico` | Mandioca | Doente |
| 8 | `Mandioca__Saudavel` | Mandioca | Saudável |
| 9 | `Milho__Doenca_Foliar` | Milho | Doente |
| 10 | `Milho__Ferrugem` | Milho | Doente |
| 11 | `Milho__Mancha_Cinzenta` | Milho | Doente |
| 12 | `Milho__Saudavel` | Milho | Saudável |
| 13 | `Tomate__Ferrugem_Precoce` | Tomate | Doente |
| 14 | `Tomate__Ferrugem_Tardia` | Tomate | Doente |
| 15 | `Tomate__Pinta_Bacteriana` | Tomate | Doente |
| 16 | `Tomate__Saudavel` | Tomate | Saudável |

---

## 3. Endpoints

---

### GET `/`
Verifica se o servidor de IA está online e se o modelo foi carregado corretamente.

**Autenticação:** Não requerida

**Resposta de sucesso `200` (modelo carregado):**
```json
{
  "status": "IA online",
  "modelo": "OK"
}
```

**Resposta quando o modelo falhou ao carregar:**
```json
{
  "status": "IA online",
  "modelo": "Erro"
}
```

---

### POST `/predict`
Recebe uma imagem de planta e retorna a classificação feita pelo modelo de IA.

**Autenticação:** Não requerida  
**Chamado por:** Servidor Node.js (`plantController.js`) após receber a imagem do utilizador.

**Body:** `multipart/form-data`
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `file` | File | Imagem da planta (obrigatório) |

> A imagem é redimensionada automaticamente para 224×224 px antes da inferência.

**Resposta de sucesso `200`:**
```json
{
  "doenca": "Tomate__Ferrugem_Tardia",
  "classe_id": "Tomate__Ferrugem_Tardia",
  "confianca": 0.9312,
  "planta": "Tomate",
  "saudavel": false,
  "top3": [
    { "classe": "Tomate__Ferrugem_Tardia", "prob": 0.9312 },
    { "classe": "Tomate__Ferrugem_Precoce", "prob": 0.0451 },
    { "classe": "Tomate__Pinta_Bacteriana", "prob": 0.0187 }
  ]
}
```

**Resposta quando a confiança está abaixo do threshold (< 30%):**
```json
{
  "doenca": "Desconhecido",
  "classe_id": "Desconhecido",
  "confianca": 0.1823,
  "planta": "Não identificada",
  "saudavel": false,
  "top3": [...]
}
```

**Descrição dos campos da resposta:**
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `doenca` | String | Classe prevista (usada como chave de busca na BD) |
| `classe_id` | String | Igual ao campo `doenca` (redundante para compatibilidade) |
| `confianca` | Float | Probabilidade da classe prevista (0.0 a 1.0) |
| `planta` | String | Nome da cultura identificada |
| `saudavel` | Boolean | `true` se a planta for saudável, `false` caso contrário |
| `top3` | Array | As 3 classes mais prováveis com as suas probabilidades |

**Resposta de erro `500` (modelo offline):**
```json
{ "error": "Modelo offline" }
```

**Resposta de erro `500` (falha no processamento):**
```json
{ "error": "descrição do erro interno" }
```

---

## 4. Códigos de Resposta

| Código | Significado |
|--------|-------------|
| `200` | Inferência realizada com sucesso |
| `500` | Modelo não carregado ou erro no processamento da imagem |
