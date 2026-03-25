import express from 'express';
import * as plantController from '../controllers/plantController.js';
import { auth } from '../middlewares/auth.js';
import { uploadAnalise } from '../config/multer.js';

const router = express.Router();

// --- Rotas de Análise ---

//Rota pública: qualquer pessoa (logada ou não) pode analisar.
router.post('/analisar', uploadAnalise.single('imagem'), plantController.analisarPlanta);

//Rota privada: usada pelo APK após o login para guardar uma análise que foi feita enquanto o utilizador ainda era anónimo.
router.post('/salvar-pendente', auth, plantController.salvarAnalisePendente);

// --- Rotas de Histórico ---

//Retorna todas as análises do utilizador logado.
router.get('/historico', auth, plantController.listarHistorico);

//Remove uma análise específica. O 'auth' garante que ninguém apaga dados alheios.
router.delete('/historico/:id', auth, plantController.deletarAnalise);

export default router;