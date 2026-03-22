import express from 'express';
import * as userController from '../controllers/userController.js';
import { auth } from '../middlewares/auth.js';
import { uploadPerfil } from '../config/multer.js';

const router = express.Router();

// Todas as rotas de utilizador exigem login (auth)
router.put('/:id', auth, userController.atualizarNome);
router.put('/:id/foto', auth, uploadPerfil.single('foto'), userController.atualizarFoto);
router.put('/:id/senha', auth, userController.alterarSenha);
router.delete('/:id/conta', auth, userController.apagarConta);

export default router;