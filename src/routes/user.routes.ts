import { Router } from 'express';
import UserController from '../controllers/UserController';
import { authMiddleware } from '../middlewares/auth';

const userRoutes = Router();

userRoutes.post('/register', UserController.create);
userRoutes.post('/login', UserController.authenticate);

// Rotas autenticadas
userRoutes.use(authMiddleware);
userRoutes.get('/me', UserController.me);
userRoutes.put('/', UserController.update);

export default userRoutes; 