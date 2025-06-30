import { Request, Response } from 'express';
import UserService from '../services/UserService';

class UserController {
  async create(req: Request, res: Response): Promise<Response> {
    try {
      console.log('Recebendo requisição de registro:', { ...req.body, password: '***' });
      
      const { name, email, password } = req.body;
      const result = await UserService.create({
        name,
        email,
        password
      });

      console.log('Resultado do registro:', {
        userId: result.user.id,
        hasToken: !!result.token
      });

      return res.status(201).json(result);
    } catch (error) {
      console.error('Erro no controller de registro:', error);
      throw error;
    }
  }

  async authenticate(req: Request, res: Response): Promise<Response> {
    const { email, password } = req.body;

    const result = await UserService.authenticate(email, password);

    return res.json(result);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const userId = req.user.id;
    const { name, email, oldPassword, password } = req.body;

    const result = await UserService.update(userId, {
      name,
      email,
      oldPassword,
      password
    });

    return res.json(result);
  }

  async me(req: Request, res: Response): Promise<Response> {
    const userId = req.user.id;

    const user = await UserService.findById(userId);

    return res.json(user);
  }
}

export default new UserController();