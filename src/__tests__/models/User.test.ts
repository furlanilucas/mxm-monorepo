import mongoose from 'mongoose';
import User from '../../models/User';

describe('User Model Test', () => {
  // Teste de criação de usuário com dados válidos
  it('should create & save user successfully', async () => {
    const validUser = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    };

    const savedUser = await User.create(validUser);
    
    // Verificar se o usuário foi salvo
    expect(savedUser._id).toBeDefined();
    expect(savedUser.name).toBe(validUser.name);
    expect(savedUser.email).toBe(validUser.email);
    // A senha deve estar criptografada
    expect(savedUser.password).not.toBe(validUser.password);
  });

  // Teste de validação de email único
  it('should fail to save user with existing email', async () => {
    const userData = {
      name: 'John Doe',
      email: 'johndoe@example.com',
      password: '123456'
    };

    await User.create(userData);

    const userWithExistingEmail = {
      name: 'Jane Doe',
      email: 'johndoe@example.com',
      password: '123456'
    };

    await expect(async () => {
      await User.create(userWithExistingEmail);
    }).rejects.toThrow('Email já está em uso');
  });

  // Teste de validação de campos obrigatórios
  it('should fail to save user without required fields', async () => {
    const userWithoutRequiredField = new User({ name: 'John Doe' });
    let err;
    try {
      await userWithoutRequiredField.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });

  // Teste do método de verificação de senha
  it('should match password correctly', async () => {
    const password = '123456';
    const user = await User.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password
    });

    const foundUser = await User.findById(user._id).select('+password');
    const isMatch = await foundUser!.matchPassword(password);
    expect(isMatch).toBe(true);

    const isNotMatch = await foundUser!.matchPassword('wrong password');
    expect(isNotMatch).toBe(false);
  });
}); 