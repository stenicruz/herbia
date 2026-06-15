import { pool } from '../config/database.js';

export const verificarAdmin = async (req, res, next) => {
    try {
        // O req.usuario_id vem do middleware 'auth' que corre antes deste
        // No Postgres, usamos pool.query e o placeholder $1
        const result = await pool.query('SELECT tipo_usuario FROM usuarios WHERE id = $1', [req.usuario_id]);
        const user = result.rows[0];

        if (!user || user.tipo_usuario !== 'admin') {
            return res.status(403).json({ 
                error: 'Acesso Negado. Esta área é exclusiva para administradores.' 
            });
        }

        // Se for admin, permite continuar para o controlador
        next();
    } catch (err) {
        console.error("Erro no middleware verificarAdmin:", err.message);
        res.status(500).json({ error: 'Erro ao validar permissões de administrador.' });
    }
};