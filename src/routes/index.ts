import { Router } from 'express';
import userRoutes from './user.routes';
import productRoutes from './product.routes';
import { corsMiddleware } from '../middlewares/cors';

const routes = Router();

// Aplicar CORS em todas as rotas
routes.use(corsMiddleware);

routes.use('/users', userRoutes);
routes.use('/products', productRoutes);

export default routes; 