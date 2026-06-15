import { pool } from '../config/database.js';
import bcrypt from 'bcryptjs';
import { uploadToSupabase } from '../services/storageService.js';

// --- DASHBOARD HOME ---
export const obterEstatisticasHome = async (req, res) => {
    try {
        const statsQuery = await pool.query(`
            SELECT 
                (SELECT COUNT(*) FROM usuarios) as "totalUsuarios",
                (SELECT COUNT(*) FROM usuarios WHERE ativo = 1) as ativos,
                (SELECT COUNT(*) FROM usuarios WHERE ativo = 0) as inativos,
                (SELECT COUNT(*) FROM usuarios WHERE tipo_usuario = 'admin') as "totalAdmins",
                (SELECT COUNT(*) FROM historico_analises) as "totalAnalises"
        `);

        const perfilStatsQuery = await pool.query(`
            SELECT perfil_user, COUNT(*) as quantidade 
            FROM usuarios 
            GROUP BY perfil_user
        `);

        const provinciaStatsQuery = await pool.query(`
            SELECT provincia, COUNT(*) as quantidade 
            FROM usuarios 
            GROUP BY provincia
        `);

        const stats = statsQuery.rows[0];

        const recentesQuery = await pool.query(`
            SELECT h.*, u.nome as usuario_nome 
            FROM historico_analises h
            JOIN usuarios u ON h.usuario_id = u.id
            ORDER BY h.criado_em DESC LIMIT 5
        `);
        const recentes = recentesQuery.rows;

        // As URLs agora já vêm completas do Supabase ou são strings vazias
        const recentesFormatados = recentes.map(r => ({
            ...r,
            imagem_url: r.imagem_url || ''
        }));

        res.json({ 
            stats,
            perfilStats: perfilStatsQuery.rows, 
            provinciaStats: provinciaStatsQuery.rows,
            recentes: recentesFormatados });
    } catch (err) {
        console.error("Erro Dashboard:", err);
        res.status(500).json({ error: 'Erro ao carregar dashboard' });
    }
};

// --- HISTÓRICO GLOBAL COM FILTROS ---
export const listarHistoricoGlobal = async (req, res) => {
    const { cultura, estado, data } = req.query;
    let query = `SELECT h.*, u.nome as usuario_nome FROM historico_analises h JOIN usuarios u ON h.usuario_id = u.id WHERE 1=1`;
    const params = [];

    if (cultura) { 
        params.push(cultura); 
        query += ` AND h.planta = $${params.length}`; 
    }
    if (estado) { 
        params.push(estado); 
        query += ` AND h.estado = $${params.length}`; 
    }
    
    if (data) { 
        params.push(`${data}%`);
        // No Postgres usamos ::text para fazer LIKE em colunas de data
        query += ` AND h.criado_em::text LIKE $${params.length}`; 
    }

    query += ` ORDER BY h.criado_em DESC`;

    try {
        const result = await pool.query(query, params);
        const formatado = result.rows.map(h => ({
            ...h,
            imagem_url: h.imagem_url || ''
        }));

        res.json(formatado);
    } catch (err) {
        console.error("Erro Histórico Global:", err);
        res.status(500).json({ error: 'Erro ao filtrar histórico' });
    }
};

// --- HISTÓRICO POR USUÁRIO ---
export const obterHistoricoPorUsuario = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(
            `SELECT * FROM historico_analises WHERE usuario_id = $1 ORDER BY criado_em DESC`, 
            [id]
        );
        const formatado = result.rows.map(a => ({
            ...a,
            imagem_url: a.imagem_url || ''
        }));

        res.json(formatado);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar histórico do usuário' });
    }
};

// --- ELIMINAR ANÁLISE ---
export const eliminarAnalise = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM historico_analises WHERE id = $1', [id]);
        res.json({ sucesso: true });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao eliminar análise' });
    }
};

// --- MOSTRAR DICAS ---
export const listarDicas = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM dicas ORDER BY criado_em DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao carregar dicas' });
  }
};

// --- CRIAR DICAS ---
export const criarDica = async (req, res) => {
    const { titulo, conteudo } = req.body;
    try {
        await pool.query('INSERT INTO dicas (titulo, conteudo, criado_por) VALUES ($1, $2, $3)', 
            [titulo, conteudo, req.usuario_id]);
        res.status(201).json({ sucesso: true });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao criar dica' });
    }
};

// --- EDITAR DICA ---
export const editarDica = async (req, res) => {
    const { id } = req.params;
    const { titulo, conteudo } = req.body;
    try {
        await pool.query('UPDATE dicas SET titulo = $1, conteudo = $2 WHERE id = $3', [titulo, conteudo, id]);
        res.json({ sucesso: true });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao editar dica' });
    }
};

// --- ELIMINAR DICA ---
export const eliminarDica = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM dicas WHERE id = $1', [id]);
        res.json({ sucesso: true });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao eliminar dica' });
    }
};

// --- GERIR USUÁRIOS ---
export const gerirUsuarios = async (req, res) => {
    const { busca, filtro } = req.query;
    let query = `SELECT id, nome, email, tipo_usuario, ativo, foto_perfil, criado_em, perfil_user, provincia FROM usuarios WHERE 1=1`;
    const params = [];

    if (busca) { 
        params.push(`%${busca}%`); 
        query += ` AND (nome ILIKE $${params.length} OR email ILIKE $${params.length})`; 
    }
    if (filtro === 'ativos') query += ` AND ativo = 1`;
    if (filtro === 'inativos') query += ` AND ativo = 0`;
    if (filtro === 'admins') query += ` AND tipo_usuario = 'admin'`;

    query += ` ORDER BY criado_em DESC`;

    try {
        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao listar utilizadores' });
    }
};

// --- CRIAR ADMIN ---
export const criarNovoAdmin = async (req, res) => {
    const { nome, email, senha } = req.body;
    try {
        const senhaHash = await bcrypt.hash(senha, 10);
        await pool.query(
            `INSERT INTO usuarios (nome, email, senha, tipo_usuario, ativo, email_verificado) 
             VALUES ($1, $2, $3, 'admin', 1, 1)`, 
            [nome, email.toLowerCase(), senhaHash]
        );
        res.json({ sucesso: true });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao criar administrador' });
    }
};

// Atualizar status (Ativar/Desativar)
export const atualizarStatusUsuario = async (req, res) => {
    const { id } = req.params;
    const { ativo } = req.body; 
    try {
        await pool.query('UPDATE usuarios SET ativo = $1 WHERE id = $2', [ativo, id]);
        res.json({ sucesso: true });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao atualizar status' });
    }
};

// Eliminar usuário
export const eliminarUsuario = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM usuarios WHERE id = $1', [id]);
        res.json({ sucesso: true });
    } catch (err) {
        res.status(500).json({ error: 'Não é possível deletar: usuário possui registros vinculados.' });
    }
};

// Criar Cultura (Com Supabase Storage)
export const criarCultura = async (req, res) => {
    const { nome } = req.body;
    let imagem_url = null;

    try {
        if (req.file) {
            imagem_url = await uploadToSupabase(req.file, 'culturas');
        }

        await pool.query('INSERT INTO culturas (nome, imagem_url, criado_por) VALUES ($1, $2, $3)', 
            [nome, imagem_url, req.usuario_id]);
        res.status(201).json({ sucesso: true });
    } catch (err) {
        console.error("Erro ao criar cultura:", err);
        res.status(500).json({ error: 'Erro ao criar cultura' });
    }
};

// Editar Cultura (Com Supabase Storage)
export const editarCultura = async (req, res) => {
    const { id } = req.params;
    const { nome } = req.body;

    try {
        if (req.file) {
            const imagem_url = await uploadToSupabase(req.file, 'culturas');
            await pool.query('UPDATE culturas SET nome = $1, imagem_url = $2 WHERE id = $3', [nome, imagem_url, id]);
        } else {
            await pool.query('UPDATE culturas SET nome = $1 WHERE id = $2', [nome, id]);
        }
        res.json({ sucesso: true });
    } catch (err) {
        console.error("Erro ao editar cultura:", err);
        res.status(500).json({ error: 'Erro ao editar cultura' });
    }
};

// Eliminar Cultura
export const eliminarCultura = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM culturas WHERE id = $1', [id]);
        res.json({ sucesso: true });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao eliminar cultura' });
    }
};

// Listar as Culturas
export const listarCulturas = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM culturas ORDER BY nome ASC');
    const formatadas = result.rows.map(c => ({
        ...c,
        imagem_url: c.imagem_url || ''
    }));
    res.json(formatadas);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao carregar culturas' });
  }
};

// Criar Doença
export const criarDoenca = async (req, res) => {
    const { cultura_id, classe_ia, nome, estado, descricao, prevencao, tratamento_caseiro, tratamento_convencional } = req.body;
    try {
        await pool.query(`
            INSERT INTO doencas (cultura_id, classe_ia, nome, estado, descricao, prevencao, tratamento_caseiro, tratamento_convencional, criado_por)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
            [cultura_id, classe_ia, nome, estado, descricao, prevencao, tratamento_caseiro, tratamento_convencional, req.usuario_id]
        );
        res.status(201).json({ sucesso: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao registrar doença' });
    }
};

// Listar doenças
export const listarDoencas = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT d.*, c.nome as cultura_nome 
      FROM doencas d
      JOIN culturas c ON d.cultura_id = c.id
      ORDER BY c.nome ASC, d.nome ASC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao carregar doenças' });
  }
};

// Editar Doença
export const editarDoenca = async (req, res) => {
    const { id } = req.params;
    const { 
        cultura_id, classe_ia, nome, estado, descricao, 
        prevencao, tratamento_caseiro, tratamento_convencional 
    } = req.body;

    try {
        await pool.query(`
            UPDATE doencas 
            SET cultura_id = $1, classe_ia = $2, nome = $3, estado = $4, 
                descricao = $5, prevencao = $6, 
                tratamento_caseiro = $7, tratamento_convencional = $8
            WHERE id = $9`,
            [cultura_id, classe_ia, nome, estado, descricao, 
            prevencao, tratamento_caseiro, tratamento_convencional, id]
        );
        res.json({ sucesso: true });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao editar doença' });
    }
};

// Eliminar Doença
export const eliminarDoenca = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM doencas WHERE id = $1', [id]);
        res.json({ sucesso: true });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao eliminar doença' });
    }
};