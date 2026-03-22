import express from 'express';
import * as userController from '../controllers/userController.js';
import { auth } from '../middlewares/auth.js';
import { uploadPerfil } from '../config/multer.js';

const router = express.Router();


// BUSCAR PERFIL (Para visualizar Nome, Email, Foto e Role)
router.get('/:id', auth, userController.buscarPerfil);

// ATUALIZAR NOME
router.put('/:id', auth, userController.atualizarNome);

// ATUALIZAR FOTO DE PERFIL
router.put('/:id/foto', auth, uploadPerfil.single('foto'), userController.atualizarFoto);

// ALTERAR SENHA
router.put('/:id/senha', auth, userController.alterarSenha);

// APAGAR CONTA
router.delete('/:id/conta', auth, userController.apagarConta);

export default router;