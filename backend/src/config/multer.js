import multer from 'multer';
import path from 'path';
import fs from 'fs';

const __dirname = path.resolve();
const uploadsPath = path.join(__dirname, 'uploads');
const pastas = [
    uploadsPath, 
    path.join(uploadsPath, 'perfil'), 
    path.join(uploadsPath, 'analises'), 
    path.join(uploadsPath, 'culturas')
];

// Garante que as pastas existem no servidor
pastas.forEach(pasta => {
    if (!fs.existsSync(pasta)) fs.mkdirSync(pasta, { recursive: true });
});

const criarStorage = (subpasta, prefixo) => multer.diskStorage({
    destination: (req, file, cb) => {
        // USAR O CAMINHO ABSOLUTO AQUI (uploadsPath + subpasta)
        const destinoReal = path.join(uploadsPath, subpasta);
        cb(null, destinoReal);
    },
    filename: (req, file, cb) => {
        // Mantemos o prefixo e o timestamp
        cb(null, `${prefixo}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

export const uploadAnalise = multer({ 
    storage: criarStorage('analises', 'IA'),
    limits: { fileSize: 10 * 1024 * 1024 } 
});

export const uploadPerfil = multer({ storage: criarStorage('perfil', 'perfil') });
export const uploadCultura = multer({ storage: criarStorage('culturas', 'cultura') });