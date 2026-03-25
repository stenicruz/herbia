import setupDb from '../config/database.js';
import { HOST, PORT } from '../config/constants.js';

// --- LISTAR TODAS AS CULTURAS ---
// O usuário vê a lista de plantas que o sistema suporta
export const listarCulturas = async (req, res) => {
  try {
    const db = await setupDb();
    const culturas = await db.all('SELECT id, nome, imagem_url FROM culturas ORDER BY nome ASC');

    // Ajustar o URL da imagem para o Android conseguir carregar
    const culturasFormatadas = culturas.map(c => ({
      ...c,
      imagem_url: c.imagem_url  || ''
    }));

    res.json(culturasFormatadas);
  } catch (err) {
    console.error("Erro ao listar culturas:", err.message);
    res.status(500).json({ error: 'Erro ao carregar o catálogo de culturas.' });
  }
};

// --- OBTER UMA DICA ALEATÓRIA (DINÂMICA) ---
// Cada vez que chamamos esta rota, vem uma dica diferente
export const obterDicaDoDia = async (req, res) => {
  try {
    const db = await setupDb();
    
    // O comando 'ORDER BY RANDOM() LIMIT 1' é a magia para ser dinâmico no SQLite
    const dica = await db.get('SELECT id, titulo, conteudo FROM dicas ORDER BY RANDOM() LIMIT 1');

    if (!dica) {
      return res.status(404).json({ error: 'Nenhuma dica cadastrada ainda.' });
    }

    res.json(dica);
  } catch (err) {
    console.error("Erro ao obter dica:", err.message);
    res.status(500).json({ error: 'Erro ao carregar a dica.' });
  }
};
