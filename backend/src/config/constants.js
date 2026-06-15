import dotenv from 'dotenv';
dotenv.config();

// Enquanto estás a testar no Wi-Fi de casa/escritório:
export const HOST = '0.0.0.0'; 
export const PORT = process.env.PORT || 3333;

// Configuração da IA (Servidor Flask/Python local)
export const IA_URL = process.env.IA_URL || 'https://miltonbernardo-herbia.hf.space/predict';

// Configurações Supabase (Puxando do .env que configuraste)
export const SUPABASE_URL = process.env.SUPABASE_URL;
export const SUPABASE_KEY = process.env.SUPABASE_KEY;