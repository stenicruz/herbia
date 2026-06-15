import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { pool } from '../config/database.js';
import { OAuth2Client } from 'google-auth-library';
import { sendEmail } from '../config/mailer.js';
import { uploadToSupabase } from '../services/storageService.js';

// Configuração do Google Client
// Substitui a linha antiga por esta:
// No topo do arquivo, apaga a string fixa e usa o .env
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
// --- REGISTAR ---
export const registrar = async (req, res) => {
    console.log("RECEBI UM PEDIDO DE REGISTRO!");
    console.log("Dados recebidos:", req.body);
    const { nome, email, senha } = req.body;
    const hash = await bcrypt.hash(senha, 10);
    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    
    let fotoUrl = ''; 

    try {
        // Lógica de Upload (Nova)
        if (req.file) {
            console.log("⏳ [STORAGE] Fazendo upload para Supabase...");
            fotoUrl = await uploadToSupabase(req.file, 'perfil');
            console.log("✅ [STORAGE] URL gerada:", fotoUrl);
        }

        // Inserção no Postgres (Atualizada com foto_perfil)
        await pool.query(
            `INSERT INTO usuarios (nome, email, senha, email_verificado, token_email, tipo_usuario, ativo, foto_perfil)
             VALUES ($1, $2, $3, 0, $4, 'usuario', 1, $5)`,
            [nome, email.toLowerCase(), hash, codigo, fotoUrl]
        );
        console.log("✅ [DB] Usuário inserido!");

        try {
            console.log("⏳ [MAIL] Enviando para:", email);
            await sendEmail(
                email,
                'Confirma o teu e-mail 🌿',
                `<div style="text-align: center;"><h1>Código: ${codigo}</h1></div>`
            );
            console.log("✅ [MAIL] Enviado com sucesso!");
        } catch (mailError) {
            console.error("⚠️ [MAIL] Falha no envio:", mailError.message);
        }
        res.status(201).json({ sucesso: true });

    } catch (err) {
        console.log("🚨 [ERRO NO REGISTRO]:");
        console.error(err);
        
        const msg = err.message.toLowerCase().includes('unique') 
            ? 'Este e-mail já está em uso.' 
            : 'Erro ao criar conta no servidor.';
            
        res.status(400).json({ error: msg });
    }
};

// --- LOGIN ---
export const login = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [req.body.email.toLowerCase()]);
        const user = result.rows[0];

        if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });

        if (!user.senha) {
            return res.status(400).json({ 
                error: 'Esta conta foi criada com Google. Use o botão "Continuar com Google" para entrar.' 
            });
        }

        if (!user.email_verificado) {
            return res.status(403).json({ 
                error: 'EMAIL_NOT_VERIFIED', 
                message: 'Email não verificado. Verifique o seu email.',
                email: user.email
            });
        }

        if (!await bcrypt.compare(req.body.senha, user.senha)) {
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        if (user.ativo === 0) {
            return res.status(403).json({ error: 'Esta conta foi desativada pelo administrador.' });
        }

        const token = crypto.randomBytes(32).toString('hex');
        await pool.query('INSERT INTO sessoes (usuario_id, token) VALUES ($1, $2)', [user.id, token]);

        res.json({
            token,
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email,
                role: user.tipo_usuario || 'usuario',
                ativo: user.ativo ?? 1,
                foto_perfil: user.foto_perfil || ''
            }
        });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao processar login' });
    }
};

// --- LOGIN GOOGLE ---
export const loginGoogle = async (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: "Token não fornecido" });

    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: token,
            audience: [
                process.env.GOOGLE_CLIENT_ID_WEB,
                process.env.GOOGLE_CLIENT_ID_ANDROID
            ],
        });
        
        const payload = ticket.getPayload();
        if (!payload.email) return res.status(401).json({ error: "Token do Google inválido" });

        const { sub: google_id, email, name, picture } = payload;

        let result = await pool.query(
            'SELECT * FROM usuarios WHERE google_id = $1 OR email = $2',
            [google_id, email.toLowerCase()]
        );
        let user = result.rows[0];

        if (!user) {
            const insertResult = await pool.query(
                `INSERT INTO usuarios (nome, email, google_id, foto_perfil, auth_provider, tipo_usuario, ativo, email_verificado)
                 VALUES ($1, $2, $3, $4, 'google', 'usuario', 1, 1) RETURNING *`,
                [name, email.toLowerCase(), google_id, picture]
            );
            user = insertResult.rows[0];
            console.log("USUÁRIO INSERIDO COM SUCESSO! ID:", user.id);
        } else if (!user.google_id) {
            const updateResult = await pool.query(
                'UPDATE usuarios SET google_id = $1, foto_perfil = $2, auth_provider = $3 WHERE id = $4 RETURNING *',
                [google_id, picture, 'google', user.id]
            );
            user = updateResult.rows[0];
        }

        if (user.ativo === 0) {
            return res.status(403).json({ 
                error: "Esta conta foi desativada pelo administrador.",
                code: "ACCOUNT_BANNED" 
            });
        }

        const sessionToken = crypto.randomBytes(32).toString('hex');
        await pool.query('INSERT INTO sessoes (usuario_id, token) VALUES ($1, $2)', [user.id, sessionToken]);

        res.json({
            success: true,
            token: sessionToken,
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email,
                role: user.tipo_usuario || 'usuario',
                ativo: user.ativo,
                foto_perfil: user.foto_perfil || ''
            }
        });
    } catch (error) {
        console.error("Erro no Google Login:", error.message);
        res.status(500).json({ error: error.message || "Erro ao processar Google Login" });
    }
};

// --- VERIFICAR EMAIL (Registro) ---
export const verificarEmailRegistro = async (req, res) => {
    const { email, codigo } = req.body;
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1 AND token_email = $2', [email.toLowerCase(), codigo]);
    
    if (result.rows.length > 0) {
        await pool.query('UPDATE usuarios SET email_verificado = 1, token_email = NULL WHERE email = $1', [email.toLowerCase()]);
        res.json({ sucesso: true, message: 'Conta ativada com sucesso!' });
    } else {
        res.status(400).json({ error: 'Código de ativação incorreto.' });
    }
};

// --- VALIDAR CÓDIGO RECUPERAÇÃO ---
export const validarCodigoRecuperacao = async (req, res) => {
    const { email, codigo } = req.body;
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1 AND token_email = $2', [email.toLowerCase(), codigo]);
    
    if (result.rows.length > 0) {
        res.json({ sucesso: true, message: 'Código validado.' });
    } else {
        res.status(400).json({ error: 'Código de recuperação inválido.' });
    }
};

// --- REENVIAR CÓDIGO ---
export const reenviarCodigo = async (req, res) => {
    const { email, motivo } = req.body;
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email.toLowerCase()]);
    const user = result.rows[0];

    if (!user) return res.status(404).json({ error: 'Email não encontrado.' });

    if (motivo !== 'recuperacao' && user.email_verificado) {
        return res.status(400).json({ error: 'Este email já foi verificado e a conta está ativa.' });
    }

    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    await pool.query('UPDATE usuarios SET token_email = $1 WHERE email = $2', [codigo, email.toLowerCase()]);

    await sendEmail(
        email,
        'Novo código de verificação 🌿',
        `<div style="font-family: sans-serif; text-align: center;">
            <h2>Seu novo código é:</h2>
            <h1 style="color: #47e426; font-size: 40px;">${codigo}</h1>
            <p>Este código expira em breve.</p>
        </div>`
    );

    res.json({ sucesso: true });
};

// --- RECUPERAR SENHA ---
export const recuperarSenha = async (req, res) => {
    const { email } = req.body;
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1', [email.toLowerCase()]);
    const user = result.rows[0];
    if (!user) return res.status(404).json({ error: 'Email não encontrado.' });

    const codigo = Math.floor(100000 + Math.random() * 900000).toString();
    await pool.query('UPDATE usuarios SET token_email = $1 WHERE email = $2', [codigo, email.toLowerCase()]);

    await sendEmail(
        email,
        'Recuperação de palavra-passe 🌿',
        `<div style="text-align:center;font-family:sans-serif;">
            <h2 style="color:#2e7d32;">Herbia</h2>
            <p>Use este código para redefinir a sua palavra-passe:</p>
            <h1 style="letter-spacing:10px;color:#333;">${codigo}</h1>
            <p style="color:#999;font-size:12px;">Este código expira em 15 minutos.</p>
        </div>`
    );

    res.json({ sucesso: true });
};

// --- REDEFINIR SENHA ---
export const redefinirSenha = async (req, res) => {
    const { email, codigo, novaSenha } = req.body;
    const result = await pool.query('SELECT * FROM usuarios WHERE email = $1 AND token_email = $2', [email.toLowerCase(), String(codigo)]);
    
    if (result.rows.length === 0) return res.status(400).json({ error: 'Código inválido ou expirado.' });

    const hash = await bcrypt.hash(novaSenha, 10);
    await pool.query('UPDATE usuarios SET senha = $1, token_email = NULL WHERE email = $2', [hash, email.toLowerCase()]);
    res.json({ sucesso: true });
};

// --- BUSCAR DADOS DO PERFIL ---
export const buscarPerfil = async (req, res) => {
    try {
        if (parseInt(req.params.id) !== req.usuario_id) {
            return res.status(403).json({ error: 'Acesso negado' });
        }

        const result = await pool.query(
            'SELECT id, nome, email, foto_perfil, tipo_usuario, ativo FROM usuarios WHERE id = $1', 
            [req.params.id]
        );
        const user = result.rows[0];

        if (user) {
            res.json({
                id: user.id,
                nome: user.nome,
                email: user.email,
                role: user.tipo_usuario || 'usuario',
                ativo: user.ativo,
                foto_perfil: user.foto_perfil || ''
            });
        } else {
            res.status(404).json({ error: 'Usuário não encontrado' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
};

// --- VERIFICAR SENHA ACTUAL ---
export const verificarSenha = async (req, res) => {
    const { senha } = req.body;
    try {
        const result = await pool.query('SELECT senha FROM usuarios WHERE id = $1', [req.usuario_id]);
        const user = result.rows[0];

        if (!user || !user.senha) {
            return res.status(400).json({ error: 'Esta conta não tem senha definida.' });
        }

        const senhaCorreta = await bcrypt.compare(senha, user.senha);
        if (!senhaCorreta) {
            return res.status(400).json({ error: 'Senha incorreta.' });
        }

        res.json({ sucesso: true });
    } catch (err) {
        res.status(500).json({ error: 'Erro ao verificar senha.' });
    }
};