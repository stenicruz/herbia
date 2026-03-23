import express from 'express';
import * as authController from '../controllers/authController.js';
import { auth } from '../middlewares/auth.js';

const router = express.Router();

// --- Rotas Públicas (Não precisam de token) ---

// Registro e Login Local
router.post('/registrar', authController.registrar);
router.post('/login', authController.login);

// Verificação de Email
router.post('/validar-email', authController.verificarEmailRegistro);
router.post('/validar-codigo', authController.validarCodigoRecuperacao);
router.post('/reenviar-codigo', authController.reenviarCodigo);

// Recuperação de Senha
router.post('/recuperar-senha', authController.recuperarSenha);
router.post('/redefinir-senha', authController.redefinirSenha);

// Login Social
router.post('/login-google', authController.loginGoogle);

// --- Rotas Privadas (Precisam do middleware 'auth') ---
router.post('/verificar-senha', auth, authController.verificarSenha);
// Buscar dados do próprio perfil (usado para refresh no App)
// Nota: o ':id' é validado dentro do controller para garantir que o user só vê o seu próprio ID
router.get('/usuarios/:id', auth, authController.buscarPerfil);

export default router;