import setupDb from '../config/database.js';

export async function auth(req, res, next) {
  // 1. Pega o token enviado pelo App no Header
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  try {
    // CORREÇÃO AQUI: Remove a palavra 'Bearer ' (caso exista) para pegar o token puro
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.split(' ')[1] 
      : authHeader;

    const db = await setupDb();
    
    // 2. Procura a sessão correspondente ao token limpo
    const session = await db.get('SELECT * FROM sessoes WHERE token = ?', [token]);

    if (!session) {
      console.log("Token recebido mas não encontrado no banco:", token);
      return res.status(401).json({ error: 'Sessão expirada' });
    }

    // 3. Injeta o ID do usuário no objeto 'req'
    req.usuario_id = session.usuario_id;

    // 4. Autoriza a passagem
    next();
  } catch (error) {
    console.error("Erro no Middleware Auth:", error);
    res.status(500).json({ error: 'Erro interno na autenticação' });
  }
}