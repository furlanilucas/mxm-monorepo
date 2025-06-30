import request from 'supertest';
import app from '../../app';
import UserService from '../../services/UserService';

describe('ProductController', () => {
  let authToken: string;

  beforeEach(async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: '123456'
    };

    const { token } = await UserService.create(userData);
    authToken = token;
  });

  describe('GET /api/products', () => {
    it('should list all products', async () => {
      const response = await request(app)
        .get('/api/products');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /api/products/:id', () => {
    it('should get product by id', async () => {
      const productData = {
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        stock: 10
      };

      const createResponse = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(productData);

      const response = await request(app)
        .get(`/api/products/${createResponse.body.id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(productData.name);
    });

    it('should return 404 for non-existent product', async () => {
      const response = await request(app)
        .get('/api/products/000000000000000000000000');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Produto não encontrado');
    });
  });

  describe('POST /api/products', () => {
    it('should create a new product', async () => {
      const productData = {
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        stock: 10
      };

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(productData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(productData.name);
      expect(response.body.description).toBe(productData.description);
      expect(response.body.price).toBe(productData.price);
      expect(response.body.stock).toBe(productData.stock);
    });

    it('should not create product without authentication', async () => {
      const productData = {
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        stock: 10
      };

      const response = await request(app)
        .post('/api/products')
        .send(productData);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Token não fornecido');
    });

    it('should not create product with invalid data', async () => {
      const invalidProduct = {
        name: 'Test Product',
        description: 'Test Description',
        price: -10,
        stock: -1
      };

      const response = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidProduct);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });
  });

  describe('PUT /api/products/:id', () => {
    it('should update product', async () => {
      const productData = {
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        stock: 10
      };

      const createResponse = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(productData);

      const updateData = {
        name: 'Updated Product',
        price: 149.99
      };

      const response = await request(app)
        .put(`/api/products/${createResponse.body.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.name).toBe(updateData.name);
      expect(response.body.price).toBe(updateData.price);
      expect(response.body.description).toBe(productData.description);
    });

    it('should not update product without authentication', async () => {
      const response = await request(app)
        .put('/api/products/000000000000000000000000')
        .send({ name: 'Updated' });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Token não fornecido');
    });

    it('should not update non-existent product', async () => {
      const response = await request(app)
        .put('/api/products/000000000000000000000000')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Updated' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Produto não encontrado');
    });
  });

  describe('DELETE /api/products/:id', () => {
    it('should delete product', async () => {
      const productData = {
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        stock: 10
      };

      const createResponse = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(productData);

      const response = await request(app)
        .delete(`/api/products/${createResponse.body.id}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(204);

      const getResponse = await request(app)
        .get(`/api/products/${createResponse.body.id}`);
      expect(getResponse.status).toBe(404);
    });

    it('should not delete product without authentication', async () => {
      const response = await request(app)
        .delete('/api/products/000000000000000000000000');

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Token não fornecido');
    });

    it('should not delete non-existent product', async () => {
      const response = await request(app)
        .delete('/api/products/000000000000000000000000')
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Produto não encontrado');
    });
  });
}); 