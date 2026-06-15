import { pool } from '../config/database.js';

export async function auth(req, res, next) {
  // Pega o token enviado pelo App no Header
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ error: 'Não autorizado' });
  }

  try {
    // Remove a palavra 'Bearer ' (caso exista) para pegar o token puro
    const token = authHeader.startsWith('Bearer ') 
      ? authHeader.split(' ')[1] 
      : authHeader;

    // No Postgres, usamos o pool.query e buscamos em result.rows[0]
    const result = await pool.query('SELECT * FROM sessoes WHERE token = $1', [token]);
    const session = result.rows[0];

    if (!session) {
      console.log("Token recebido mas não encontrado no banco:", token);
      return res.status(401).json({ error: 'Sessão expirada' });
    }

    // Injeta o ID do usuário no objeto 'req' para uso nos controllers
    req.usuario_id = session.usuario_id;

    // Autoriza a passagem para a próxima função (o controller)
    next();
  } catch (error) {
    console.error("Erro no Middleware Auth:", error);
    res.status(500).json({ error: 'Erro interno na autenticação' });
  }
}