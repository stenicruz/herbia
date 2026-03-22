import express from 'express';
import * as geralController from '../controllers/geralController.js';

const router = express.Router();

/**
 * @route   GET /api/culturas
 * @desc    Retorna a lista de todas as culturas (nome e imagem) para o catálogo
 * @access  Público
 */
router.get('/culturas', geralController.listarCulturas);

/**
 * @route   GET /api/dica-dinamica
 * @desc    Retorna uma única dica aleatória para exibir na Home do utilizador
 * @access  Público
 */
router.get('/dica-dinamica', geralController.obterDicaDoDia);

export default router;