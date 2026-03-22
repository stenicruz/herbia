import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import setupDb from '../config/database.js';
import { OAuth2Client } from 'google-auth-library';
import { sendEmail } from '../config/mailer.js';
import { HOST, PORT } from '../config/constants.js';

// Configuração do Google Client (Coloca aqui!)
const googleClient = new OAuth2Client('691168137852-d8n5v7st68kojqntlu1t7b5cuf15dvp9.apps.googleusercontent.com');

// --- REGISTAR ---
export const registrar = async (req, res) => {
  console.log("📍 RECEBI UM PEDIDO DE REGISTRO!");
  console.log("Dados recebidos:", req.body);
  const { nome, email, senha } = req.body;
  const db = await setupDb();
  const hash = await bcrypt.hash(senha, 10);
  const codigo = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    // 1. Salva na BD primeiro
    await db.run(
      `INSERT INTO usuarios (nome, email, senha, email_verificado, token_email, tipo_usuario, ativo)
       VALUES (?, ?, ?, 0, ?, 'usuario', 1)`,
      [nome, email, hash, codigo]
    );
    console.log("✅ [DB] Usuário inserido!");

    // 2. Tenta enviar o e-mail num bloco separado para não quebrar o registro
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
      // Aqui o registro continua, pois o user já está no SQLite!
    }

    res.status(201).json({ sucesso: true });

  } catch (err) {
    console.log("🚨 [ERRO NO REGISTRO]:");
    console.error(err);
    
    // Diferenciar erro de email repetido de erro de servidor
    const msg = err.message.includes('UNIQUE') 
      ? 'Este e-mail já está em uso.' 
      : 'Erro ao criar conta no servidor.';
      
    res.status(400).json({ error: msg });
  }
};

// --- LOGIN ---
export const login = async (req, res) => {
  const db = await setupDb();
  const user = await db.get('SELECT * FROM usuarios WHERE email = ?', [req.body.email]);

  if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });

  if (!user.senha) {
    return res.status(400).json({ 
      error: 'Esta conta foi criada com Google. Use o botão "Continuar com Google" para entrar.' 
    });
  }
  if (!user.email_verificado) {
    return res.status(403).json({ 
      error: 'EMAIL_NOT_VERIFIED', // Usamos um código fixo para o Frontend identificar
      message: 'Email não verificado. Verifique o seu email.',
      email: user.email // Importante para a navegação no telemóvel
    });
  }

  if (!await bcrypt.compare(req.body.senha, user.senha)) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  if (user.ativo === 0) {
    return res.status(403).json({ error: 'Esta conta foi desativada pelo administrador.' });
  }

  if (!user.email_verificado) {
    return res.status(403).json({ error: 'Email não verificado. Verifique o seu email.' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  await db.run('INSERT INTO sessoes (usuario_id, token) VALUES (?, ?)', [user.id, token]);

  res.json({
    token,
    user: {
      id: user.id,
      nome: user.nome,
      email: user.email,
      role: user.tipo_usuario || 'usuario',
      ativo: user.ativo ?? 1,
      foto_perfil: user.foto_perfil ? `http://${HOST}:${PORT}${user.foto_perfil}` : ''
    }
  });
};

// --- LOGIN GOOGLE ---
export const loginGoogle = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ error: "Token não fornecido" });
  }

  try {
    
    const ticket = await googleClient.verifyIdToken({
        idToken: token,
        audience: '691168137852-d8n5v7st68kojqntlu1t7b5cuf15dvp9.apps.googleusercontent.com',
    });
    
    const payload = ticket.getPayload();

    if (!payload.email) {
      return res.status(401).json({ error: "Token do Google inválido ou expirado" });
    }

    const { sub: google_id, email, name, picture } = payload;
    const db = await setupDb();

    // 2. Procurar se o utilizador já existe (pelo ID do Google ou pelo Email)
    let user = await db.get(
      'SELECT * FROM usuarios WHERE google_id = ? OR email = ?',
      [google_id, email]
    );

    if (!user) {
      // 3. Se não existe, cria conta (já verificada pois vem do Google)
      const result = await db.run(
        `INSERT INTO usuarios (nome, email, google_id, foto_perfil, auth_provider, tipo_usuario, ativo, email_verificado)
        VALUES (?, ?, ?, ?, 'google', 'usuario', 1, 1)`,
        [name, email, google_id, picture]
      );
      console.log("----------------------------");
console.log("USUÁRIO INSERIDO COM SUCESSO!");
console.log("ID GERADO:", result.lastID);
console.log("----------------------------");
      user = await db.get('SELECT * FROM usuarios WHERE id = ?', [result.lastID]);
    } else {
      // 4. Se existe mas não tinha Google ID (criou com email/senha antes), atualiza
      if (!user.google_id) {
        await db.run(
          'UPDATE usuarios SET google_id = ?, foto_perfil = ?, auth_provider = ? WHERE id = ?',
          [google_id, picture, 'google', user.id]
        );
        user = await db.get('SELECT * FROM usuarios WHERE id = ?', [user.id]);
      }
    }

    // 5. Verificar se a conta está banida
    if (user.ativo === 0) {
      return res.status(403).json({ 
        error: "Esta conta foi desativada pelo administrador.",
        code: "ACCOUNT_BANNED" 
      });
    }

    // 6. Criar Sessão
    const sessionToken = crypto.randomBytes(32).toString('hex');
    await db.run('INSERT INTO sessoes (usuario_id, token) VALUES (?, ?)', [user.id, sessionToken]);

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
    console.error("Erro no Google Login:", error);
    res.status(500).json({ error: "Erro ao processar Google Login" });
  }
};

// --- 1. VERIFICAR EMAIL (Para novos cadastros) ---
export const verificarEmailRegistro = async (req, res) => {
  const { email, codigo } = req.body;
  const db = await setupDb();
  
  const user = await db.get('SELECT * FROM usuarios WHERE email = ? AND token_email = ?', [email, codigo]);
  
  if (user) {
    // ATIVA A CONTA e limpa o código
    await db.run('UPDATE usuarios SET email_verificado = 1, token_email = NULL WHERE email = ?', [email]);
    res.json({ sucesso: true, message: 'Conta ativada com sucesso!' });
  } else {
    res.status(400).json({ error: 'Código de ativação incorreto.' });
  }
};

// --- 2. VALIDAR CÓDIGO RECUPERAÇÃO (Apenas checagem) ---
export const validarCodigoRecuperacao = async (req, res) => {
  const { email, codigo } = req.body;
  const db = await setupDb();
  
  const user = await db.get('SELECT * FROM usuarios WHERE email = ? AND token_email = ?', [email, codigo]);
  
  if (user) {
    // NÃO limpa o token ainda e NÃO mexe no email_verificado
    // Apenas confirma que o código está certo para o utilizador avançar de tela
    res.json({ sucesso: true, message: 'Código validado.' });
  } else {
    res.status(400).json({ error: 'Código de recuperação inválido.' });
  }
};

// --- REENVIAR CÓDIGO ---
export const reenviarCodigo = async (req, res) => {
  const { email, motivo } = req.body; // Adicionamos 'motivo' para saber se é registro ou recuperação
  const db = await setupDb();
  const user = await db.get('SELECT * FROM usuarios WHERE email = ?', [email]);

  if (!user) return res.status(404).json({ error: 'Email não encontrado.' });

  // Só bloqueamos se o motivo NÃO for recuperação e o email já estiver verificado
  if (motivo !== 'recuperacao' && user.email_verificado) {
    return res.status(400).json({ error: 'Este email já foi verificado e a conta está ativa.' });
  }

  const codigo = Math.floor(100000 + Math.random() * 900000).toString();
  await db.run('UPDATE usuarios SET token_email = ? WHERE email = ?', [codigo, email]);

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

// --- RECUPERAR SENHA (ESQUECI SENHA) ---
export const recuperarSenha = async (req, res) => {
  const { email } = req.body;
  const db = await setupDb();
  const user = await db.get('SELECT * FROM usuarios WHERE email = ?', [email]);
  if (!user) return res.status(404).json({ error: 'Email não encontrado.' });

  const codigo = Math.floor(100000 + Math.random() * 900000).toString();
  await db.run('UPDATE usuarios SET token_email = ? WHERE email = ?', [codigo, email]);

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
  const db = await setupDb();
  const user = await db.get('SELECT * FROM usuarios WHERE email = ? AND token_email = ?', [email, String(codigo)]);
  
  if (!user) return res.status(400).json({ error: 'Código inválido ou expirado.' });

  const hash = await bcrypt.hash(novaSenha, 10);
  await db.run('UPDATE usuarios SET senha = ?, token_email = NULL WHERE email = ?', [hash, email]);
  res.json({ sucesso: true });
};


export const buscarPerfil = async (req, res) => {
  try {
    const db = await setupDb();
    
    // Verificação de segurança: um usuário só pode buscar seus próprios dados
    if (parseInt(req.params.id) !== req.usuario_id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const user = await db.get(
      'SELECT id, nome, email, foto_perfil, tipo_usuario, ativo FROM usuarios WHERE id = ?', 
      [req.params.id]
    );

    if (user) {
      let fotoUrl = user.foto_perfil || '';
      if (fotoUrl.startsWith('/uploads')) {
        fotoUrl = `http://${HOST}:${PORT}${fotoUrl}`;
      }

      res.json({
        id: user.id,
        nome: user.nome,
        email: user.email,
        role: user.tipo_usuario || 'usuario',
        ativo: user.ativo,
        foto_perfil: fotoUrl
      });
    } else {
      res.status(404).json({ error: 'Usuário não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
};