import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import setupDb from '../config/database.js';
import { HOST, PORT, IA_URL } from '../config/constants.js';

export const analisarPlanta = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Imagem obrigatória' });

  const filePath = req.file.path;
  let token = req.headers.authorization;
  if (token && token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }
  const db = await setupDb();

  try {
    // 1. Enviar para a IA (Flask)
    const formData = new FormData();
    formData.append('file', fs.createReadStream(filePath));

    const aiResponse = await axios.post(IA_URL, formData, {
      headers: formData.getHeaders(),
      timeout: 45000
    });

    // A IA retorna: { classe_id: "...", confianca: 0.98 }
    const { classe_id, confianca } = aiResponse.data;
    const confiancaPercent = Math.round(confianca * 100);

    // 2. Buscar informações detalhadas na Base de Dados
    const info = await db.get(`
      SELECT d.*, c.nome as planta_nome 
      FROM doencas d
      JOIN culturas c ON d.cultura_id = c.id
      WHERE TRIM(d.classe_ia) = ?`, 
      [classe_id]
    );

    // Se a IA retornar uma classe que não temos na BD
    const resultado = info || { 
      planta_nome: 'Desconhecido', 
      nome: 'Não identificado', 
      estado: 'N/A',
      descricao: 'Não conseguimos identificar esta planta ou doença.' 
    };

    const imagemUrl = `/uploads/analises/${req.file.filename}`;

    // 3. Se estiver logado, guarda AUTOMATICAMENTE no histórico
    if (token && token !== "null" && token !== "") {
      const session = await db.get('SELECT usuario_id FROM sessoes WHERE token = ?', [token]);
      
      if (session) {
        await db.run(
          `INSERT INTO historico_analises (
            usuario_id, planta, doenca, estado, precisao,
            descricao, prevencao, tratamento_caseiro, tratamento_convencional, imagem_url, classe_ia
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            session.usuario_id, resultado.planta_nome, resultado.nome, 
            resultado.estado, confiancaPercent, resultado.descricao, resultado.prevencao, 
            resultado.tratamento_caseiro, resultado.tratamento_convencional, 
            imagemUrl, classe_id
          ]
        );
      }else {
        console.log("Sessão não encontrada para o token fornecido.");
      }
    }

    // 4. Retorna tudo para o telemóvel (incluindo a precisão da IA)
    res.json({
      classe_ia: classe_id,
      planta: resultado.planta_nome,
      doenca: resultado.nome,
      estado: resultado.estado,
      descricao: resultado.descricao,
      prevencao: resultado.prevencao,
      caseiro: resultado.tratamento_caseiro,
      convencional: resultado.tratamento_convencional,
      precisao: confiancaPercent,
      imagem: `http://${HOST}:${PORT}${imagemUrl}`
    });

  } catch (err) {
    // Se der erro, apaga a foto para poupar espaço
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    console.error("Erro na análise:", err.message);
    res.status(500).json({ error: 'Erro na conexão com o servidor de IA' });
  }
};

// Funções de Histórico (Só para logados)
export const listarHistorico = async (req, res) => {
  const db = await setupDb();
  const analises = await db.all(
    'SELECT * FROM historico_analises WHERE usuario_id = ? ORDER BY criado_em DESC',
    [req.usuario_id]
  );
  res.json(analises);
};

export const deletarAnalise = async (req, res) => {
  const db = await setupDb();
  await db.run('DELETE FROM historico_analises WHERE id = ? AND usuario_id = ?', [req.params.id, req.usuario_id]);
  res.status(204).send();
};

// --- SALVAR ANÁLISE QUE FOI FEITA ANTES DO LOGIN ---
export const salvarAnalisePendente = async (req, res) => {
    const { 
        planta, doenca, estado, precisao, 
        descricao, prevencao, caseiro, convencional, imagem, classe_ia 
    } = req.body;

    try {
        const db = await setupDb();
        
        // O req.usuario_id vem do middleware 'auth'
        await db.run(
            `INSERT INTO historico_analises (
                usuario_id, planta, doenca, estado, precisao,
                descricao, prevencao, tratamento_caseiro, tratamento_convencional, imagem_url, classe_ia
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                req.usuario_id, planta, doenca, estado, precisao,
                descricao, prevencao, caseiro, convencional, imagem, classe_ia
            ]
        );

        res.status(201).json({ sucesso: true, mensagem: 'Análise salva no histórico!' });
    } catch (err) {
        console.error("Erro ao salvar análise pendente:", err.message);
        res.status(500).json({ error: 'Erro ao guardar análise no perfil.' });
    }
};