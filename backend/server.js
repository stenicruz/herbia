import express from 'express';
import cors from 'cors';
import path from 'path';

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
app.use('/uploads', express.static(path.resolve('uploads')));

// Ligar os módulos de rotas
app.use('/api/auth', authRoutes);
app.use('/api/plantas', plantRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/usuarios', userRoutes);
app.use('/api', geralRoutes);

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀🌿 Servidor Herbia rodando em http://${HOST}:${PORT}`);
});