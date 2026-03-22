import express from 'express';
import cors from 'cors';
import path from 'path';
import setupDb from './src/config/database.js'; // Ajusta o caminho se necessário

// Importar as Rotas
import authRoutes from './src/routes/authRoutes.js';
import plantRoutes from './src/routes/plantRoutes.js';
import adminRoutes from './src/routes/adminRoutes.js';
import userRoutes from './src/routes/userRoutes.js';
import geralRoutes from './src/routes/geralRoutes.js';


const app = express();
const PORT = 3333;
const HOST = '192.168.0.104';

app.use(cors());
app.use(express.json());
app.use((req, res, next) => {
  console.log(`📢 Recebi um ${req.method} na rota ${req.url}`);
  next();
});
app.use('/uploads', express.static(path.resolve('uploads')));

// Ligar os módulos de rotas
app.use('/api/auth', authRoutes);
app.use('/api/plantas', plantRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api', geralRoutes);

async function startServer() {
  try {
    // 1. Força a ligação e criação das tabelas logo no início
    console.log("⏳ Inicializando base de dados...");
    await setupDb(); 
    console.log("✅ Base de dados pronta e tabelas verificadas!");

    // 2. Só depois de a BD estar OK é que ligamos o servidor
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀🌿 Servidor Herbia rodando em http://${HOST}:${PORT}`);
    });

  } catch (err) {
    console.error("❌ Erro crítico ao iniciar o servidor:", err);
    process.exit(1); // Fecha o processo se a BD falhar
  }
}
startServer();