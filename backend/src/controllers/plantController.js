import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { pool } from '../config/database.js';
import { IA_URL } from '../config/constants.js';
import { uploadToSupabase } from '../services/storageService.js';

// --- Analisar Planta ---
export const analisarPlanta = async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Imagem obrigatória' });

    const filePath = path.resolve(req.file.path);

    let token = req.headers.authorization;
    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7, token.length);
    }

    // Coordenadas GPS enviadas pelo app (opcionais)
    // Virão como strings no multipart/form-data
    const latitude = req.body.latitude ? parseFloat(req.body.latitude) : null;
    const longitude = req.body.longitude ? parseFloat(req.body.longitude) : null;

    try {
        // 1. Enviar imagem para o servidor de IA
        const formData = new FormData();
        formData.append('file', fs.createReadStream(filePath));

        const aiResponse = await axios.post(IA_URL, formData, {
            headers: formData.getHeaders(),
            timeout: 90000
        });

        const { classe_id, confianca } = aiResponse.data;
        const confiancaPercent = Math.round(confianca * 100);

        // 2. Upload da imagem para o Supabase Storage
        const imagemUrlCloud = await uploadToSupabase(req.file, 'analises');

        // 3. Buscar informações da doença no Postgres
        const infoQuery = await pool.query(`
            SELECT d.*, c.nome as planta_nome
            FROM doencas d
            JOIN culturas c ON d.cultura_id = c.id
            WHERE TRIM(d.classe_ia) = $1`,
            [classe_id]
        );

        const info = infoQuery.rows[0];

        const resultado = info || {
            planta_nome: 'Desconhecido',
            nome: 'Não identificado',
            estado: 'N/A',
            descricao: 'Não conseguimos identificar esta planta ou doença nos nossos registos.'
        };

        // 4. Se estiver logado, guarda no histórico
        if (token && token !== "null" && token !== "") {
            const sessionQuery = await pool.query(
                'SELECT usuario_id FROM sessoes WHERE token = $1', [token]
            );
            const session = sessionQuery.rows[0];

            if (session) {
                // Tenta inserir com latitude e longitude.
                // Se as colunas ainda não existirem no banco, cai no fallback sem GPS.
                try {
                    await pool.query(
                        `INSERT INTO historico_analises (
                            usuario_id, planta, doenca, estado, precisao,
                            descricao, prevencao, tratamento_caseiro, tratamento_convencional,
                            imagem_url, classe_ia, latitude, longitude
                        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
                        [
                            session.usuario_id, resultado.planta_nome, resultado.nome,
                            resultado.estado, confiancaPercent, resultado.descricao,
                            resultado.prevencao, resultado.tratamento_caseiro,
                            resultado.tratamento_convencional, imagemUrlCloud,
                            classe_id, latitude, longitude
                        ]
                    );
                } catch (insertErr) {
                    // Fallback: colunas lat/lng ainda não existem — insere sem GPS
                    if (insertErr.message?.includes('latitude') || insertErr.message?.includes('longitude')) {
                        console.warn("⚠️ Colunas GPS ainda não existem no banco. A guardar sem coordenadas.");
                        await pool.query(
                            `INSERT INTO historico_analises (
                                usuario_id, planta, doenca, estado, precisao,
                                descricao, prevencao, tratamento_caseiro,
                                tratamento_convencional, imagem_url, classe_ia
                            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
                            [
                                session.usuario_id, resultado.planta_nome, resultado.nome,
                                resultado.estado, confiancaPercent, resultado.descricao,
                                resultado.prevencao, resultado.tratamento_caseiro,
                                resultado.tratamento_convencional, imagemUrlCloud, classe_id
                            ]
                        );
                    } else {
                        throw insertErr;
                    }
                }
            }
        }

        // 5. Apagar ficheiro temporário local
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

        // 6. Retornar resposta para o App
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
            imagem: imagemUrlCloud,
            // Devolve as coordenadas para o app saber que foram guardadas
            latitude: latitude,
            longitude: longitude,
        });

    } catch (err) {
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        console.error("Erro na análise:", err.message);
        res.status(500).json({ error: 'Erro ao processar análise ou conectar à IA' });
    }
};

// --- Funções de Histórico ---
export const listarHistorico = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM historico_analises WHERE usuario_id = $1 ORDER BY criado_em DESC',
            [req.usuario_id]
        );
        res.json(result.rows);
    } catch (err) {
        console.error("Erro ao listar histórico:", err.message);
        res.status(500).json({ error: 'Erro ao buscar histórico.' });
    }
};

// --- Deletar Análise ---
export const deletarAnalise = async (req, res) => {
    try {
        await pool.query(
            'DELETE FROM historico_analises WHERE id = $1 AND usuario_id = $2',
            [req.params.id, req.usuario_id]
        );
        res.status(204).send();
    } catch (err) {
        console.error("Erro ao deletar análise:", err.message);
        res.status(500).json({ error: 'Erro ao eliminar análise.' });
    }
};

// --- Salvar Análise Pendente ---
export const salvarAnalisePendente = async (req, res) => {
    const {
        planta, doenca, estado, precisao,
        descricao, prevencao, caseiro, convencional,
        imagem, classe_ia, latitude, longitude
    } = req.body;

    try {
        // Mesmo padrão: tenta com GPS, cai no fallback se colunas não existirem
        try {
            await pool.query(
                `INSERT INTO historico_analises (
                    usuario_id, planta, doenca, estado, precisao,
                    descricao, prevencao, tratamento_caseiro, tratamento_convencional,
                    imagem_url, classe_ia, latitude, longitude
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
                [
                    req.usuario_id, planta, doenca, estado, precisao,
                    descricao, prevencao, caseiro, convencional,
                    imagem, classe_ia, latitude || null, longitude || null
                ]
            );
        } catch (insertErr) {
            if (insertErr.message?.includes('latitude') || insertErr.message?.includes('longitude')) {
                console.warn("⚠️ Colunas GPS ainda não existem. A guardar pendente sem coordenadas.");
                await pool.query(
                    `INSERT INTO historico_analises (
                        usuario_id, planta, doenca, estado, precisao,
                        descricao, prevencao, tratamento_caseiro,
                        tratamento_convencional, imagem_url, classe_ia
                    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
                    [
                        req.usuario_id, planta, doenca, estado, precisao,
                        descricao, prevencao, caseiro, convencional, imagem, classe_ia
                    ]
                );
            } else {
                throw insertErr;
            }
        }

        res.status(201).json({ sucesso: true, mensagem: 'Análise salva no histórico!' });
    } catch (err) {
        console.error("Erro ao salvar análise pendente:", err.message);
        res.status(500).json({ error: 'Erro ao guardar análise no perfil.' });
    }
};
