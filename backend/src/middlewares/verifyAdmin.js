import setupDb from '../config/database.js';

export const verificarAdmin = async (req, res, next) => {
    try {
        const db = await setupDb();
        
        // O req.usuario_id vem do middleware 'auth' que corre antes deste
        const user = await db.get('SELECT tipo_usuario FROM usuarios WHERE id = ?', [req.usuario_id]);

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