import bcrypt from 'bcryptjs';
import setupDb from '../config/database.js';
import { HOST, PORT } from '../config/constants.js';

// --- ATUALIZAR NOME ---
export const atualizarNome = async (req, res) => {
  const { nome } = req.body;
  const { id } = req.params;

  if (parseInt(id) !== req.usuario_id) return res.status(403).json({ error: 'Acesso negado' });

  try {
    const db = await setupDb();
    await db.run('UPDATE usuarios SET nome = ? WHERE id = ?', [nome, req.usuario_id]);
    res.json({ sucesso: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar nome' });
  }
};

// --- UPLOAD FOTO DE PERFIL ---
export const atualizarFoto = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Foto obrigatória' });
  const { id } = req.params;

  if (parseInt(id) !== req.usuario_id) return res.status(403).json({ error: 'Acesso negado' });

  try {
    const db = await setupDb();
    const fotoPath = `/uploads/perfil/${req.file.filename}`;
    await db.run('UPDATE usuarios SET foto_perfil = ? WHERE id = ?', [fotoPath, req.usuario_id]);
    
    res.json({ foto_url: `http://${HOST}:${PORT}${fotoPath}` });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao salvar foto' });
  }
};

// --- ALTERAR SENHA ---
export const alterarSenha = async (req, res) => {
  const { id } = req.params;
  const { senhaAtual, novaSenha } = req.body;

  if (parseInt(id) !== req.usuario_id) return res.status(403).json({ error: 'Acesso negado' });

  try {
    const db = await setupDb();
    const user = await db.get('SELECT senha FROM usuarios WHERE id = ?', [req.usuario_id]);

    // Se o usuário TEM senha, ele PRECISA digitar a atual correta.
    if (user.senha) {
      const senhaCorreta = await bcrypt.compare(senhaAtual, user.senha);
      if (!senhaCorreta) {
        return res.status(401).json({ error: 'Senha atual incorreta.' });
      }
    } 
    // Se NÃO TEM senha (usuário Google), ele pode simplesmente definir a nova.
    
    const hash = await bcrypt.hash(novaSenha, 10);
    await db.run('UPDATE usuarios SET senha = ? WHERE id = ?', [hash, req.usuario_id]);
    
    res.json({ sucesso: true, mensagem: user.senha ? 'Senha alterada!' : 'Senha definida com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao processar senha' });
  }
};

// --- APAGAR CONTA ---
export const apagarConta = async (req, res) => {
  const { id } = req.params;
  const { senha } = req.body;

  if (parseInt(id) !== req.usuario_id) return res.status(403).json({ error: 'Acesso negado' });

  try {
    const db = await setupDb();
    const user = await db.get('SELECT senha FROM usuarios WHERE id = ?', [req.usuario_id]);

    // Se for conta Google não tem senha, se for local valida a senha
    if (user.senha && !(await bcrypt.compare(senha, user.senha))) {
      return res.status(401).json({ error: 'Senha incorreta.' });
    }

    await db.run('DELETE FROM sessoes WHERE usuario_id = ?', [req.usuario_id]);
    await db.run('DELETE FROM historico_analises WHERE usuario_id = ?', [req.usuario_id]);
    await db.run('DELETE FROM usuarios WHERE id = ?', [req.usuario_id]);
    res.json({ sucesso: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao apagar conta' });
  }
};