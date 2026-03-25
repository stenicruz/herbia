import express from 'express';
import * as geralController from '../controllers/geralController.js';

const router = express.Router();

// Retorna a lista de todas as culturas (nome e imagem) para o catálogo
router.get('/culturas', geralController.listarCulturas);

//Retorna uma única dica aleatória para exibir na Home do utilizador
router.get('/dica-dinamica', geralController.obterDicaDoDia);

export default router;