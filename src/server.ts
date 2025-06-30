import './config/env'; // Deve ser o primeiro import
import express from 'express';
import connectDB from './config/database';
import routes from './routes';
import { errorHandler } from './middlewares/errorHandler';
import mongoose from 'mongoose';
import env from './config/env';
import { corsMiddleware } from './middlewares/cors';

const app = express();

// Conectar ao MongoDB
connectDB();

// CORS deve ser o primeiro middleware
app.use(corsMiddleware);

app.use(express.json());

// Rotas
app.use('/api', routes);

// Middleware de erro
app.use(errorHandler);

mongoose.connect(env.MONGODB_URI)
  .then(() => {
    console.log('📦 Conectado ao MongoDB');
    
    app.listen(env.PORT, () => {
      console.log(`🚀 Servidor rodando em http://localhost:${env.PORT}`);
      console.log('👋 CORS habilitado para:');
      console.log(`   - ${env.CORS_ORIGIN}`);
    });
  })
  .catch((error) => {
    console.error('❌ Erro ao conectar ao MongoDB:', error);
    process.exit(1);
  }); 