import UserService from '../../services/UserService';
import User from '../../models/User';
import { AppError } from '../../utils/AppError';

describe('UserService', () => {
  describe('create', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456'
      };

      const result = await UserService.create(userData);

      expect(result.user).toHaveProperty('id');
      expect(result.user.name).toBe(userData.name);
      expect(result.user.email).toBe(userData.email);
      expect(result).toHaveProperty('token');
    });

    it('should not create user with existing email', async () => {
      const userData = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456'
      };

      await UserService.create(userData);

      await expect(async () => {
        await UserService.create(userData);
      }).rejects.toThrow('Email já cadastrado');
    });
  });

  describe('authenticate', () => {
    it('should authenticate with valid credentials', async () => {
      const userData = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456'
      };

      await UserService.create(userData);

      const result = await UserService.authenticate(userData.email, userData.password);

      expect(result.user).toHaveProperty('id');
      expect(result.user.name).toBe(userData.name);
      expect(result.user.email).toBe(userData.email);
      expect(result).toHaveProperty('token');
    });

    it('should not authenticate with invalid email', async () => {
      await expect(async () => {
        await UserService.authenticate('wrong@example.com', '123456');
      }).rejects.toThrow(new AppError('Email ou senha incorretos', 401));
    });

    it('should not authenticate with invalid password', async () => {
      const userData = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456'
      };

      await UserService.create(userData);

      await expect(async () => {
        await UserService.authenticate(userData.email, 'wrong password');
      }).rejects.toThrow(new AppError('Email ou senha incorretos', 401));
    });
  });

  describe('update', () => {
    it('should update user data', async () => {
      const userData = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456'
      };

      const { user } = await UserService.create(userData);

      const updatedData = {
        name: 'John Updated',
        email: 'john.updated@example.com'
      };

      const result = await UserService.update(user.id, updatedData);

      expect(result.name).toBe(updatedData.name);
      expect(result.email).toBe(updatedData.email);
    });

    it('should update password with valid old password', async () => {
      const userData = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456'
      };

      const { user } = await UserService.create(userData);

      const updateData = {
        oldPassword: '123456',
        password: 'new password'
      };

      const result = await UserService.update(user.id, updateData);
      expect(result).toHaveProperty('id');
      expect(result.email).toBe(userData.email);

      // Verificar se a nova senha funciona
      const authResult = await UserService.authenticate(userData.email, 'new password');
      expect(authResult).toHaveProperty('token');
    });

    it('should not update password with invalid old password', async () => {
      const userData = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456'
      };

      const { user } = await UserService.create(userData);

      const updateData = {
        oldPassword: 'wrong password',
        password: 'new password'
      };

      await expect(async () => {
        await UserService.update(user.id, updateData);
      }).rejects.toThrow(new AppError('Senha atual incorreta'));
    });
  });
}); 