import express from 'express';
import cors from 'cors';
import path from 'path';
import { pool } from './src/config/database.js'; // Importamos o pool em vez do setupDb

// Importar as Rotas
import authRoutes from './src/routes/authRoutes.js';
import plantRoutes from './src/routes/plantRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import geralRoutes from './src/routes/geralRoutes.js';

const app = express();
const PORT = process.env.PORT || 3333;
const HOST = '0.0.0.0';

// Middlewares
app.use(cors());
app.use(express.json());

// Log de requisições (Mantido conforme o teu original)
app.use((req, res, next) => {
  console.log(`📢 Recebi um ${req.method} na rota ${req.url}`);
  next();
});

// Servir arquivos estáticos (Imagens das plantas e perfis)
app.use('/uploads', express.static(path.resolve('uploads')));

// Ligar os módulos de rotas
app.use('/api/auth', authRoutes);
app.use('/api/plantas', plantRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api', geralRoutes);

// Função para Iniciar o Servidor
async function startServer() {
  try {
    console.log("⏳ Verificando conexão com o PostgreSQL...");
    
    // Tenta fazer uma query simples para validar a conexão
    await pool.query('SELECT NOW()'); 
    console.log("✅ Conexão com o banco de dados estabelecida com sucesso!");

    // Inicia o servidor Express
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀🌿 Servidor Herbia (PostgreSQL Mode) rodando em http://${HOST}:${PORT}`);
      console.log(`📡 Acesso local: http://localhost:${PORT}`);
    });

  } catch (err) {
    console.error("❌ Erro crítico ao iniciar o servidor (Falha no Banco de Dados):", err.message);
    process.exit(1); // Fecha o processo se a conexão falhar
  }
}

startServer();