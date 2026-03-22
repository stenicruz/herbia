import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Definir caminhos base
const __dirname = path.resolve();
const uploadsPath = path.join(__dirname, 'uploads');
const perfilPath = path.join(uploadsPath, 'perfil');
const analisesPath = path.join(uploadsPath, 'analises'); // Pasta para IA
const culturasPath = path.join(uploadsPath, 'culturas'); // Pasta para Admin

// Criar pastas se não existirem (Garante a estrutura completa)
[uploadsPath, perfilPath, analisesPath, culturasPath].forEach(pasta => {
    if (!fs.existsSync(pasta)) {
        fs.mkdirSync(pasta, { recursive: true });
    }
});

// 1. Configuração para Fotos das Análises (IA)
const storageAnalises = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/analises/');
    },
    filename: (req, file, cb) => {
        cb(null, `IA-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// 2. Configuração para Fotos de Perfil (Utilizadores)
const storagePerfil = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/perfil/');
    },
    filename: (req, file, cb) => {
        cb(null, `perfil-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// 3. Configuração para Fotos de Culturas (Admin)
const storageCulturas = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/culturas/');
    },
    filename: (req, file, cb) => {
        // Ex: cultura-tomate-17092024.jpg
        cb(null, `cultura-${Date.now()}${path.extname(file.originalname)}`);
    }
});

// Exportar os middlewares específicos
export const uploadAnalise = multer({ storage: storageAnalises });
export const uploadPerfil = multer({ storage: storagePerfil });
export const uploadCultura = multer({ storage: storageCulturas });