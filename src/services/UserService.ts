import User from '../models/User';
import { AppError } from '../utils/AppError';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';

interface ICreateUserDTO {
  name: string;
  email: string;
  password: string;
}

interface IUpdateUserDTO {
  name?: string;
  email?: string;
  oldPassword?: string;
  password?: string;
}

interface IAuthResponse {
  user: {
    id: string;
    name: string;
    email: string;
  };
  token: string;
}

class UserService {
  async create({ name, email, password }: ICreateUserDTO) {
    try {
      console.log('Criando usuário:', { name, email });
      
      const user = await User.create({
        name,
        email,
        password
      });

      console.log('Usuário criado:', user._id.toString());
      
      const token = this.generateToken(user._id);
      console.log('Token gerado:', token ? 'Sim' : 'Não');

      const response = {
        user: {
          id: user._id.toString(),
          name: user.name,
          email: user.email
        },
        token
      };

      console.log('Resposta preparada:', { ...response, token: token ? 'Token presente' : 'Token ausente' });
      return response;
      
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      if (error.message.includes('Email já está em uso')) {
        throw new AppError('Email já cadastrado');
      }
      throw error;
    }
  }

  async authenticate(email: string, password: string): Promise<IAuthResponse> {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      throw new AppError('Email ou senha incorretos', 401);
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      throw new AppError('Email ou senha incorretos', 401);
    }

    const token = this.generateToken(user._id);

    return {
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email
      },
      token
    };
  }

  async findById(id: string) {
    const user = await User.findById(id);

    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email
    };
  }

  async update(userId: string, data: IUpdateUserDTO) {
    const user = await User.findById(userId).select('+password');

    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    if (data.email && data.email !== user.email) {
      const userWithEmail = await User.findOne({ email: data.email });
      if (userWithEmail) {
        throw new AppError('Email já está em uso');
      }
    }

    if (data.password && data.oldPassword) {
      const isMatch = await user.matchPassword(data.oldPassword);
      if (!isMatch) {
        throw new AppError('Senha atual incorreta');
      }
    }

    if (data.name) user.name = data.name;
    if (data.email) user.email = data.email;
    if (data.password) user.password = data.password;

    await user.save();

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email
    };
  }

  private generateToken(userId: Types.ObjectId): string {
    const secret = process.env.JWT_SECRET || 'default_secret_key_123456789';
    console.log('Gerando token com secret:', secret ? 'Secret configurada' : 'Usando default');
    
    try {
      const token = jwt.sign({ id: userId.toString() }, secret, {
        expiresIn: '30d'
      });
      console.log('Token gerado com sucesso');
      return token;
    } catch (error) {
      console.error('Erro ao gerar token:', error);
      throw new AppError('Erro ao gerar token de autenticação');
    }
  }
}

export default new UserService(); 