import pkg from 'pg';
const { Pool } = pkg;
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Obrigatório para o Supabase
  }
});

const setupDb = async () => {
  try {
    const res = await pool.query('SELECT NOW()');
    console.log("✅ Conexão estabelecida com o Pooler do Supabase!");
    return pool;
  } catch (err) {
    console.error("❌ Erro ao conectar ao Pooler:", err.message);
    throw err;
  }
};

export { pool };
export default setupDb;