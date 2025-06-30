import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import 'express-async-errors';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';
import { corsMiddleware } from './middlewares/cors';

const app = express();

// CORS (deve ser o primeiro middleware)
app.use(corsMiddleware);

// Segurança
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  // Permitir o CORS com credenciais
  crossOriginEmbedderPolicy: false
}));

// Compressão de resposta
app.use(compression());

// Parse do corpo da requisição
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas
app.use('/api', routes);

// Tratamento de erros
app.use(errorHandler);

export default app; 