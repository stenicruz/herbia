import express from 'express';
import * as adminController from '../controllers/adminController.js';
import { auth } from '../middlewares/auth.js';
import { verificarAdmin } from '../middlewares/verifyAdmin.js';
import { uploadCultura } from '../config/multer.js'; 

const router = express.Router();

// --- DASHBOARD E ESTATÍSTICAS ---
router.get('/home', auth, verificarAdmin, adminController.obterEstatisticasHome);

// --- GESTÃO DE UTILIZADORES ---
router.get('/usuarios', auth, verificarAdmin, adminController.gerirUsuarios);
router.post('/usuarios/admin', auth, verificarAdmin, adminController.criarNovoAdmin);
router.get('/usuarios/:id/historico', auth, verificarAdmin, adminController.obterHistoricoPorUsuario);

// --- GESTÃO DO HISTÓRICO GLOBAL (FILTROS) ---
router.get('/historico', auth, verificarAdmin, adminController.listarHistoricoGlobal);
router.delete('/historico/:id', auth, verificarAdmin, adminController.eliminarAnalise);

// --- GESTÃO DE DICAS (HOME DO USER) ---
router.get('/dicas', auth, verificarAdmin, adminController.listarDicas);
router.post('/dicas', auth, verificarAdmin, adminController.criarDica);
router.put('/dicas/:id', auth, verificarAdmin, adminController.editarDica);
router.delete('/dicas/:id', auth, verificarAdmin, adminController.eliminarDica);

// --- CATÁLOGO AGRÍCOLA (CULTURAS) ---
// Usamos o middleware uploadCultura para lidar com a imagem da planta
router.get('/culturas', auth, verificarAdmin, adminController.listarCulturas);
router.post('/culturas', auth, verificarAdmin, uploadCultura.single('imagem'), adminController.criarCultura);
router.put('/culturas/:id', auth, verificarAdmin, uploadCultura.single('imagem'), adminController.editarCultura);
router.delete('/culturas/:id', auth, verificarAdmin, adminController.eliminarCultura);

// --- GESTÃO DE DOENÇAS ---
router.get('/doencas', auth, verificarAdmin, adminController.listarDoencas);
router.post('/doencas', auth, verificarAdmin, adminController.criarDoenca);
router.put('/doencas/:id', auth, verificarAdmin, adminController.editarDoenca);
router.delete('/doencas/:id', auth, verificarAdmin, adminController.eliminarDoenca);

export default router;