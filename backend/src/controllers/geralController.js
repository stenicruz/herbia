import { pool } from '../config/database.js';

// --- LISTAR TODAS AS CULTURAS ---
// O usuário vê a lista de plantas que o sistema (AgroDetector) suporta
export const listarCulturas = async (req, res) => {
  try {
    // No Postgres, os dados vêm em result.rows
    const result = await pool.query('SELECT id, nome, imagem_url FROM culturas ORDER BY nome ASC');
    const culturas = result.rows;

    // Como as URLs já vêm completas do Supabase, apenas garantimos que não retornem null
    const culturasFormatadas = culturas.map(c => ({
      ...c,
      imagem_url: c.imagem_url || ''
    }));

    res.json(culturasFormatadas);
  } catch (err) {
    console.error("Erro ao listar culturas:", err.message);
    res.status(500).json({ error: 'Erro ao carregar o catálogo de culturas.' });
  }
};

// --- OBTER UMA DICA ALEATÓRIA (DINÂMICA) ---
// Utilizado para mostrar dicas de cultivo ou prevenção na Home do App
export const obterDicaDoDia = async (req, res) => {
  try {
    // O comando 'ORDER BY RANDOM()' é o padrão do PostgreSQL para sorteio
    const result = await pool.query('SELECT id, titulo, conteudo FROM dicas ORDER BY RANDOM() LIMIT 1');
    const dica = result.rows[0];

    if (!dica) {
      // Caso o admin ainda não tenha cadastrado dicas no painel
      return res.status(404).json({ error: 'Nenhuma dica cadastrada ainda.' });
    }

    res.json(dica);
  } catch (err) {
    console.error("Erro ao obter dica:", err.message);
    res.status(500).json({ error: 'Erro ao carregar a dica.' });
  }
};