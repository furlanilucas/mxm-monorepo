import { Router } from 'express';
import ProductController from '../controllers/ProductController';
import { authMiddleware } from '../middlewares/auth';

const productRoutes = Router();

// Rotas públicas
productRoutes.get('/', ProductController.index);
productRoutes.get('/search', ProductController.search);
productRoutes.get('/category/:category', ProductController.findByCategory);
productRoutes.get('/:id', ProductController.show);

// Rotas autenticadas
productRoutes.use(authMiddleware);
productRoutes.post('/', ProductController.create);
productRoutes.put('/:id', ProductController.update);
productRoutes.delete('/:id', ProductController.delete);

export default productRoutes; 