import cors from 'cors';
import { CorsOptions } from 'cors';
import env from '../config/env';

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Permitir requisições sem origin (como apps mobile ou Postman)
    if (!origin) {
      return callback(null, true);
    }

    const allowedOrigins = [env.CORS_ORIGIN];
    
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Não permitido pelo CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin'
  ],
  exposedHeaders: ['Set-Cookie'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  maxAge: 86400 // 24 horas
};

export const corsMiddleware = cors(corsOptions); 