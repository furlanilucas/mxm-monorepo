import request from 'supertest';
import app from '../../app';
import User from '../../models/User';

describe('UserController', () => {
  describe('POST /api/users/register', () => {
    it('should create a new user', async () => {
      const userData = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456'
      };

      const response = await request(app)
        .post('/api/users/register')
        .send(userData);

      expect(response.status).toBe(201);
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.name).toBe(userData.name);
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body).toHaveProperty('token');
    });

    it('should not create user with existing email', async () => {
      const userData = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456'
      };

      await request(app)
        .post('/api/users/register')
        .send(userData);

      const response = await request(app)
        .post('/api/users/register')
        .send(userData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'Email já cadastrado');
    });
  });

  describe('POST /api/users/login', () => {
    it('should authenticate user with valid credentials', async () => {
      const userData = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456'
      };

      await request(app)
        .post('/api/users/register')
        .send(userData);

      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: userData.email,
          password: userData.password
        });

      expect(response.status).toBe(200);
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body).toHaveProperty('token');
    });

    it('should not authenticate with invalid credentials', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: 'wrong@example.com',
          password: '123456'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Email ou senha incorretos');
    });
  });

  describe('GET /api/users/me', () => {
    it('should get user profile with valid token', async () => {
      const userData = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456'
      };

      const registerResponse = await request(app)
        .post('/api/users/register')
        .send(userData);

      const token = registerResponse.body.token;

      const response = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body.email).toBe(userData.email);
    });

    it('should not get profile without token', async () => {
      const response = await request(app)
        .get('/api/users/me');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Token não fornecido');
    });
  });

  describe('PUT /api/users', () => {
    it('should update user profile', async () => {
      const userData = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456'
      };

      const registerResponse = await request(app)
        .post('/api/users/register')
        .send(userData);

      const token = registerResponse.body.token;

      const updateData = {
        name: 'John Updated',
        email: 'john.updated@example.com'
      };

      const response = await request(app)
        .put('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updateData.name);
      expect(response.body.email).toBe(updateData.email);
    });

    it('should update password with valid old password', async () => {
      const userData = {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456'
      };

      const registerResponse = await request(app)
        .post('/api/users/register')
        .send(userData);

      const token = registerResponse.body.token;

      const updateData = {
        oldPassword: '123456',
        password: 'new password'
      };

      const response = await request(app)
        .put('/api/users')
        .set('Authorization', `Bearer ${token}`)
        .send(updateData);

      expect(response.status).toBe(200);

      // Tentar login com nova senha
      const loginResponse = await request(app)
        .post('/api/users/login')
        .send({
          email: userData.email,
          password: 'new password'
        });

      expect(loginResponse.status).toBe(200);
      expect(loginResponse.body).toHaveProperty('token');
    });
  });
}); 