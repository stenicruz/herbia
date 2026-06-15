import bcrypt from 'bcryptjs';
import { pool } from '../config/database.js';
import { uploadToSupabase } from '../services/storageService.js';

// --- BUSCAR DADOS DO PERFIL ---
export const buscarPerfil = async (req, res) => {
    const { id } = req.params;

    // Segurança: O usuário só pode ver o próprio perfil
    if (parseInt(id) !== req.usuario_id) {
        return res.status(403).json({ error: 'Acesso negado' });
    }

    try {
        const result = await pool.query(
            `SELECT id, nome, email, auth_provider, foto_perfil, perfil_user, provincia,
            (CASE WHEN senha IS NULL OR senha = '' THEN 0 ELSE 1 END) as tem_senha 
            FROM usuarios WHERE id = $1`, 
            [req.usuario_id]
        );

        const user = result.rows[0];

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        res.json(user);
    } catch (err) {
        console.error("Erro ao buscar perfil:", err);
        res.status(500).json({ error: 'Erro ao buscar dados do usuário' });
    }
};

// --- ATUALIZAR DADOS DO PERFIL (Nome, Tipo de Usuário e Província) ---
export const atualizarPerfil = async (req, res) => {
    const { nome, perfil_user, provincia } = req.body;
    const { id } = req.params;

    // Segurança: O usuário só pode editar o próprio perfil
    if (parseInt(id) !== req.usuario_id) {
        return res.status(403).json({ error: 'Acesso negado' });
    }

    try {
        await pool.query(
            `UPDATE usuarios 
             SET nome = $1, perfil_user = $2, provincia = $3 
             WHERE id = $4`, 
            [nome, perfil_user, provincia, req.usuario_id]
        );
        
        res.json({ sucesso: true });
    } catch (err) {
        console.error("Erro ao atualizar perfil:", err);
        res.status(500).json({ error: 'Erro ao atualizar dados do perfil' });
    }
};

// --- UPLOAD FOTO DE PERFIL (Integrado com Supabase) ---
export const atualizarFoto = async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Foto obrigatória' });
    const { id } = req.params;

    if (parseInt(id) !== req.usuario_id) return res.status(403).json({ error: 'Acesso negado' });

    try {
        // Faz o upload para o bucket 'perfis' no Supabase
        const fotoUrl = await uploadToSupabase(req.file, 'perfil');
        
        await pool.query('UPDATE usuarios SET foto_perfil = $1 WHERE id = $2', [fotoUrl, req.usuario_id]);
        
        res.json({ foto_url: fotoUrl });
    } catch (err) {
        console.error("Erro no upload da foto:", err);
        res.status(500).json({ error: 'Erro ao salvar foto no servidor de nuvem' });
    }
};

// --- ALTERAR SENHA ---
export const alterarSenha = async (req, res) => {
    const { id } = req.params;
    const { senhaAtual, novaSenha } = req.body;

    if (parseInt(id) !== req.usuario_id) return res.status(403).json({ error: 'Acesso negado' });

    try {
        const result = await pool.query('SELECT senha FROM usuarios WHERE id = $1', [req.usuario_id]);
        const user = result.rows[0];

        // Se o usuário TEM senha (conta local), valida a atual
        if (user && user.senha) {
            const senhaCorreta = await bcrypt.compare(senhaAtual, user.senha);
            if (!senhaCorreta) {
                return res.status(400).json({ error: 'Senha atual incorreta.' });
            }
        } 
        
        const hash = await bcrypt.hash(novaSenha, 10);
        await pool.query('UPDATE usuarios SET senha = $1 WHERE id = $2', [hash, req.usuario_id]);
        
        res.json({ 
            sucesso: true, 
            mensagem: (user && user.senha) ? 'Senha alterada!' : 'Senha definida com sucesso!' 
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erro ao processar senha' });
    }
};

// --- APAGAR CONTA ---
export const apagarConta = async (req, res) => {
    const { id } = req.params;
    const { senha } = req.body;

    if (parseInt(id) !== req.usuario_id) {
        return res.status(403).json({ error: 'Acesso negado: ID divergente' });
    }

    try {
        const result = await pool.query('SELECT senha FROM usuarios WHERE id = $1', [req.usuario_id]);
        const user = result.rows[0];

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }

        // Validação de Senha (Apenas para contas que possuem senha definida)
        if (user.senha) {
            if (!senha) {
                return res.status(400).json({ error: 'Senha é obrigatória para excluir esta conta.' });
            }
            const senhaCorreta = await bcrypt.compare(senha, user.senha);
            if (!senhaCorreta) {
                return res.status(401).json({ error: 'Senha incorreta.' });
            }
        }

        // Exclusão manual das relações caso não tenha ON DELETE CASCADE no DB
        await pool.query('DELETE FROM sessoes WHERE usuario_id = $1', [req.usuario_id]);
        await pool.query('DELETE FROM historico_analises WHERE usuario_id = $1', [req.usuario_id]);
        
        // Finalmente deleta o usuário
        const deleteRes = await pool.query('DELETE FROM usuarios WHERE id = $1', [req.usuario_id]);

        if (deleteRes.rowCount > 0) {
            console.log(`✅ Usuário ${req.usuario_id} deletado.`);
            res.json({ sucesso: true });
        } else {
            res.status(404).json({ error: 'Não foi possível encontrar o usuário para eliminar.' });
        }

    } catch (err) {
        console.error("❌ Erro no apagarConta:", err);
        res.status(500).json({ error: 'Erro interno ao apagar conta. Verifique dependências no banco.' });
    }
};