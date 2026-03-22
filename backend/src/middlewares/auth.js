import setupDb from '../config/database.js';

export async function auth(req, res, next) {
  // 1. Pega o token enviado pelo App no Header
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  try {
    const db = await setupDb();
    
    // 2. Procura a sessão correspondente ao token
    const session = await db.get('SELECT * FROM sessoes WHERE token = ?', [token]);

    if (!session) {
      return res.status(401).json({ error: 'Sessão expirada' });
    }

    // 3. Injeta o ID do usuário no objeto 'req'
    // Isso permite que os próximos arquivos (controllers) saibam QUEM está logado
    req.usuario_id = session.usuario_id;

    // 4. Autoriza a passagem para a próxima função (o Controller)
    next();
  } catch (error) {
    console.error("Erro no Middleware Auth:", error);
    res.status(500).json({ error: 'Erro interno na autenticação' });
  }
}