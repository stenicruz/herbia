import setupDb from '../config/database.js';
import bcrypt from 'bcryptjs';
import { HOST, PORT } from '../config/constants.js';

// --- DASHBOARD HOME ---
export const obterEstatisticasHome = async (req, res) => {
    try {
        const db = await setupDb();
        
        const stats = await db.get(`
            SELECT 
                (SELECT COUNT(*) FROM usuarios) as totalUsuarios,
                (SELECT COUNT(*) FROM usuarios WHERE ativo = 1) as ativos,
                (SELECT COUNT(*) FROM usuarios WHERE ativo = 0) as inativos,
                (SELECT COUNT(*) FROM usuarios WHERE tipo_usuario = 'admin') as totalAdmins,
                (SELECT COUNT(*) FROM historico_analises) as totalAnalises
            FROM usuarios LIMIT 1
        `);

        const recentes = await db.all(`
            SELECT h.*, u.nome as usuario_nome 
            FROM historico_analises h
            JOIN usuarios u ON h.usuario_id = u.id
            ORDER BY h.criado_em DESC LIMIT 5
        `);

        // Formatar imagens das análises recentes
        const recentesFormatados = recentes.map(r => ({
            ...r,
            imagem_url: r.imagem_url ? `http://${HOST}:${PORT}${r.imagem_url}` : ''
        }));

        res.json({ stats, recentes: recentesFormatados });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao carregar dashboard' });
    }
};

// --- HISTÓRICO GLOBAL COM FILTROS ---
export const listarHistoricoGlobal = async (req, res) => {
    const { cultura, estado, data } = req.query;
    // Adicionamos o JOIN para saber quem fez a análise
    let query = `SELECT h.*, u.nome as usuario_nome FROM historico_analises h JOIN usuarios u ON h.usuario_id = u.id WHERE 1=1`;
    const params = [];

    if (cultura) { query += ` AND h.planta = ?`; params.push(cultura); }
    if (estado) { query += ` AND h.estado = ?`; params.push(estado); }
    
    // Melhoria na data para garantir compatibilidade
    if (data) { 
        query += ` AND h.criado_em LIKE ?`; 
        params.push(`${data}%`); // O Android envia "2024-05-20", o LIKE busca tudo desse dia
    }

    query += ` ORDER BY h.criado_em DESC`;

    try {
        const db = await setupDb();
        const historico = await db.all(query, params);
        
        const formatado = historico.map(h => ({
            ...h,
            imagem_url: h.imagem_url ? `http://${HOST}:${PORT}${h.imagem_url}` : ''
        }));

        res.json(formatado);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao filtrar histórico' });
    }
};

// --- HISTÓRICO POR USUÁRIO ---
export const obterHistoricoPorUsuario = async (req, res) => {
    const { id } = req.params;
    try {
        const db = await setupDb();
        const analises = await db.all(
            `SELECT * FROM historico_analises WHERE usuario_id = ? ORDER BY criado_em DESC`, 
            [id]
        );

        const formatado = analises.map(a => ({
            ...a,
            imagem_url: a.imagem_url ? `http://${HOST}:${PORT}${a.imagem_url}` : ''
        }));

        res.json(formatado);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao buscar histórico' });
    }
};

// --- RESTANTES FUNÇÕES (DICAS, CULTURAS, DOENÇAS) ---
// (As tuas funções de criarDica, editarDica, eliminarDica, gerirUsuarios, 
// criarNovoAdmin, criarCultura e criarDoenca estão corretas, 
// apenas certifica-te que a imagem_url da cultura também leva o HOST/PORT na resposta se necessário)
































export const eliminarAnalise = async (req, res) => {
    const { id } = req.params;
    try {
        const db = await setupDb();
        await db.run('DELETE FROM historico_analises WHERE id = ?', [id]);
        res.json({ sucesso: true });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao eliminar análise' });
    }
};

export const criarDica = async (req, res) => {
    const { titulo, conteudo } = req.body;
    try {
        const db = await setupDb();
        await db.run('INSERT INTO dicas (titulo, conteudo, criado_por) VALUES (?, ?, ?)', 
            [titulo, conteudo, req.usuario_id]);
        res.status(201).json({ sucesso: true });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao criar dica' });
    }
};

export const editarDica = async (req, res) => {
    const { id } = req.params;
    const { titulo, conteudo } = req.body;
    try {
        const db = await setupDb();
        await db.run('UPDATE dicas SET titulo = ?, conteudo = ? WHERE id = ?', [titulo, conteudo, id]);
        res.json({ sucesso: true });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao editar dica' });
    }
};

export const eliminarDica = async (req, res) => {
    const { id } = req.params;
    try {
        const db = await setupDb();
        await db.run('DELETE FROM dicas WHERE id = ?', [id]);
        res.json({ sucesso: true });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao eliminar dica' });
    }
};


export const gerirUsuarios = async (req, res) => {
    const { busca, filtro } = req.query; // filtro: 'ativos', 'inativos', 'admins', 'usuario'
    let query = `SELECT id, nome, email, tipo_usuario, ativo FROM usuarios WHERE 1=1`;
    const params = [];

    if (busca) { 
        query += ` AND (nome LIKE ? OR email LIKE ?)`; 
        params.push(`%${busca}%`, `%${busca}%`); 
    }
    if (filtro === 'ativos') query += ` AND ativo = 1`;
    if (filtro === 'inativos') query += ` AND ativo = 0`;
    if (filtro === 'admins') query += ` AND tipo_usuario = 'admin'`;

    try {
        const db = await setupDb();
        const users = await db.all(query, params);
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao listar utilizadores' });
    }
};

export const criarNovoAdmin = async (req, res) => {
    const { nome, email, senha } = req.body;
    try {
        const db = await setupDb();
        const hash = await bcrypt.hash(senha, 10);
        await db.run(`
            INSERT INTO usuarios (nome, email, senha, tipo_usuario, email_verificado, ativo) 
            VALUES (?, ?, ?, 'admin', 1, 1)`, 
            [nome, email, hash]
        );
        res.status(201).json({ sucesso: true });
    } catch (err) {
        res.status(400).json({ error: 'E-mail já em uso ou dados inválidos.' });
    }
};


// Criar Cultura
export const criarCultura = async (req, res) => {
    const { nome } = req.body;
    const imagem_url = req.file ? `/uploads/culturas/${req.file.filename}` : null;
    try {
        const db = await setupDb();
        await db.run('INSERT INTO culturas (nome, imagem_url, criado_por) VALUES (?, ?, ?)', 
            [nome, imagem_url, req.usuario_id]);
        res.status(201).json({ sucesso: true });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao criar cultura' });
    }
};

// Editar Cultura
export const editarCultura = async (req, res) => {
    const { id } = req.params;
    const { nome } = req.body;
    const db = await setupDb();

    try {
        // Se uma nova imagem foi enviada, atualizamos o nome e a imagem
        if (req.file) {
            const imagem_url = `/uploads/culturas/${req.file.filename}`;
            await db.run('UPDATE culturas SET nome = ?, imagem_url = ? WHERE id = ?', [nome, imagem_url, id]);
        } else {
            // Se não enviou imagem, atualizamos apenas o nome
            await db.run('UPDATE culturas SET nome = ? WHERE id = ?', [nome, id]);
        }
        res.json({ sucesso: true });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao editar cultura' });
    }
};

// Eliminar Cultura (Cuidado: Isso apaga as doenças ligadas a ela devido ao CASCADE)
export const eliminarCultura = async (req, res) => {
    const { id } = req.params;
    try {
        const db = await setupDb();
        await db.run('DELETE FROM culturas WHERE id = ?', [id]);
        res.json({ sucesso: true });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao eliminar cultura' });
    }
};

// Criar Doença (Ligada à cultura)
export const criarDoenca = async (req, res) => {
    const { cultura_id, classe_ia, nome, estado, descricao, prevencao, tratamento_caseiro, tratamento_convencional } = req.body;
    try {
        const db = await setupDb();
        await db.run(`
            INSERT INTO doencas (cultura_id, classe_ia, nome, estado, descricao, prevencao, tratamento_caseiro, tratamento_convencional, criado_por)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [cultura_id, classe_ia, nome, estado, descricao, prevencao, tratamento_caseiro, tratamento_convencional, req.usuario_id]
        );
        res.status(201).json({ sucesso: true });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao registrar doença' });
    }
};

// Editar Doença
export const editarDoenca = async (req, res) => {
    const { id } = req.params;
    const { 
        nome, estado, descricao, prevencao, 
        tratamento_caseiro, tratamento_convencional 
    } = req.body;

    try {
        const db = await setupDb();
        await db.run(`
            UPDATE doencas 
            SET nome = ?, estado = ?, descricao = ?, prevencao = ?, 
                tratamento_caseiro = ?, tratamento_convencional = ?
            WHERE id = ?`,
            [nome, estado, descricao, prevencao, tratamento_caseiro, tratamento_convencional, id]
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
        const db = await setupDb();
        await db.run('DELETE FROM doencas WHERE id = ?', [id]);
        res.json({ sucesso: true });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao eliminar doença' });
    }
};