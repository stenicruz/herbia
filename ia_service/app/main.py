import os
import io
import numpy as np
import torch
import torch.nn as nn
import torchvision.models as models
from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse
from PIL import Image

app = FastAPI()

# ==========================
# CAMINHOS DOS FICHEIROS
# ==========================
CURRENT_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(CURRENT_DIR, "model")
MODEL_PATH = os.path.join(MODEL_DIR, "best_model.pth")


# ==========================
# ARQUITETURA EXATA (PyTorch)
# ==========================
class PlantMobileNet(nn.Module):
    def __init__(self, num_classes=17):
        super(PlantMobileNet, self).__init__()
        # MobileNetV2 base
        base = models.mobilenet_v2(weights=None)
        self.features = base.features
        self.avgpool = nn.AdaptiveAvgPool2d((1, 1))
        
        # Classifier exato como definido no treino
        self.classifier = nn.Sequential(
            nn.Dropout(0.35),
            nn.Linear(1280, 512),
            nn.ReLU(inplace=True),
            nn.BatchNorm1d(512),
            nn.Dropout(0.25),
            nn.Linear(512, 128),
            nn.ReLU(inplace=True),
            nn.BatchNorm1d(128),
            nn.Dropout(0.1),
            nn.Linear(128, num_classes)
        )

    def forward(self, x):
        x = self.features(x)
        x = self.avgpool(x)
        x = torch.flatten(x, 1)
        x = self.classifier(x)
        return x


# ==========================
# CARREGAR MODELO
# ==========================
model = None
DEVICE = torch.device('cpu')

try:
    if not os.path.exists(MODEL_PATH):
        print(f"❌ ERRO: Modelo não encontrado em {MODEL_PATH}")
    else:
        # Carregamento do checkpoint PyTorch
        checkpoint = torch.load(MODEL_PATH, map_location=DEVICE)
        model = PlantMobileNet(num_classes=17)
        
        # Tenta carregar state_dict (comum em ficheiros .pth)
        if 'model_state_dict' in checkpoint:
            model.load_state_dict(checkpoint['model_state_dict'])
        else:
            model.load_state_dict(checkpoint)
            
        model.eval()
        print("✅ MODELO PYTORCH CARREGADO")

        # Teste de sanidade
        with torch.no_grad():
            teste = torch.randn(1, 3, 224, 224)
            out = model(teste)
            preds_teste = torch.softmax(out, dim=1).numpy()[0]
            print(f"📊 Teste - max prob: {np.max(preds_teste):.4f}")

except Exception as e:
    print(f"❌ ERRO AO CARREGAR: {e}")
    model = None


# ==========================
# NORMALIZAÇÃO (ImageNet)
# ==========================
MEAN = np.array([0.485, 0.456, 0.406], dtype=np.float32)
STD = np.array([0.229, 0.224, 0.225], dtype=np.float32)


CLASSES = [
    "Batata__Ferrugem_Precoce",    # 0
    "Batata__Ferrugem_Tardia",     # 1
    "Batata__Saudavel",            # 2
    "Desconhecido",                # 3
    "Mandioca__Bacteriose",        # 4
    "Mandioca__Estria_Castanha",   # 5
    "Mandioca__Mottle_Verde",      # 6
    "Mandioca__Mosaico",           # 7
    "Mandioca__Saudavel",          # 8
    "Milho__Doenca_Foliar",        # 9
    "Milho__Ferrugem",             # 10
    "Milho__Mancha_Cinzenta",      # 11
    "Milho__Saudavel",             # 12
    "Tomate__Ferrugem_Precoce",    # 13
    "Tomate__Ferrugem_Tardia",     # 14
    "Tomate__Pinta_Bacteriana",    # 15
    "Tomate__Saudavel",            # 16
]

# Threshold de confiança
CONFIDENCE_THRESHOLD = 0.60


def extrair_planta(classe):
    if classe.startswith("Tomate"):
        return "Tomate"
    elif classe.startswith("Milho"):
        return "Milho"
    elif classe.startswith("Batata"):
        return "Batata"
    elif classe.startswith("Mandioca"):
        return "Mandioca"
    elif classe == "Desconhecido":
        return "Não identificada"
    return "Outra"


def extrair_doenca(classe):
    """Extrai o nome da doença a partir do nome da classe."""
    parts = classe.split("__")
    if len(parts) < 2:
        return classe
    return parts[1].replace("_", " ")


@app.get("/")
def health():
    return {"status": "IA online", "modelo": "OK" if model else "Erro"}


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if model is None:
        return JSONResponse(status_code=500, content={"error": "Modelo offline"})

    try:
        content = await file.read()
        image = Image.open(io.BytesIO(content)).convert("RGB")
        image = image.resize((224, 224))

        # Normalização ImageNet
        img_array = np.array(image).astype(np.float32) / 255.0
        img_array = (img_array - MEAN) / STD

        # Conversão para Tensor PyTorch (Batch, Channel, Height, Width)
        img_tensor = torch.from_numpy(img_array).permute(2, 0, 1).unsqueeze(0)

        print(f"\n📊 Valor médio após normalização: {np.mean(img_array):.4f}")

        # Inferência PyTorch
        with torch.no_grad():
            logits = model(img_tensor)
            preds = torch.softmax(logits, dim=1).numpy()[0]

        # TOP 3
        top3_idx = np.argsort(preds)[-3:][::-1]
        print("🔍 TOP 3 classes:")
        for i, idx_cls in enumerate(top3_idx):
            print(f"   {i+1}. {CLASSES[idx_cls]} : {preds[idx_cls]:.4f}")
        print(f"📊 Soma das probabilidades: {np.sum(preds):.4f}")

        idx = int(np.argmax(preds))
        conf = float(preds[idx])
        resultado = CLASSES[idx]
        # Esta é a chave exata: ex "Tomate__Ferrugem_Tardia"

        print(f"➡️ Classe detectada: {resultado} | confiança: {conf:.4f}")

        # Threshold de segurança
        if conf < CONFIDENCE_THRESHOLD:
            resultado = "Desconhecido"

        planta = extrair_planta(resultado)
        saudavel = "saudavel" in resultado.lower()

        # Retornamos 'resultado' (a chave do mapeamento) no campo 'doenca'
        # Isso garante que o Node.js faça: mapeamentoIA["Tomate__Ferrugem_Tardia"]
        return {
            "doenca":    resultado, 
            "classe_id": resultado,
            "confianca": round(conf, 4),
            "planta":    planta,
            "saudavel":  saudavel,
            "top3": [
                {"classe": CLASSES[i], "prob": round(float(preds[i]), 4)}
                for i in top3_idx
            ]
        }

    except Exception as e:
        print(f"❌ ERRO: {e}")
        return JSONResponse(status_code=500, content={"error": str(e)})

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
