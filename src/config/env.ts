import dotenv from 'dotenv';
import path from 'path';

// Carrega o .env apropriado baseado no ambiente
const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
const envPath = path.resolve(process.cwd(), envFile);

// Carrega as variáveis de ambiente
dotenv.config({ path: envPath });

export const env = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: parseInt(process.env.PORT || '3000', 10),
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/projeto',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',
  JWT_SECRET: process.env.JWT_SECRET || 'default_jwt_secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '1d'
} as const;

// Validação das variáveis obrigatórias
const requiredEnvs: (keyof typeof env)[] = ['JWT_SECRET'];
const missingEnvs = requiredEnvs.filter(key => !env[key]);

if (missingEnvs.length > 0) {
  throw new Error(`❌ Variáveis de ambiente obrigatórias não definidas: ${missingEnvs.join(', ')}`);
}

export default env; 