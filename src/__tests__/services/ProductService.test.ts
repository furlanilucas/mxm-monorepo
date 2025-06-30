import ProductService from '../../services/ProductService';
import { AppError } from '../../utils/AppError';
import { Types } from 'mongoose';

describe('ProductService', () => {
  describe('create', () => {
    it('should create a new product', async () => {
      const productData = {
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        stock: 10
      };

      const product = await ProductService.create(productData);

      expect(product).toHaveProperty('id');
      expect(product.name).toBe(productData.name);
      expect(product.description).toBe(productData.description);
      expect(product.price).toBe(productData.price);
      expect(product.stock).toBe(productData.stock);
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const productData = {
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        stock: 10
      };

      await ProductService.create(productData);
      await ProductService.create({
        ...productData,
        name: 'Test Product 2'
      });

      const products = await ProductService.findAll();

      expect(Array.isArray(products)).toBe(true);
      expect(products.length).toBe(2);
      expect(products[0]).toHaveProperty('id');
      expect(products[1]).toHaveProperty('id');
    });
  });

  describe('findById', () => {
    it('should find product by id', async () => {
      const productData = {
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        stock: 10
      };

      const createdProduct = await ProductService.create(productData);
      const foundProduct = await ProductService.findById(createdProduct.id);

      expect(foundProduct).toHaveProperty('id');
      expect(foundProduct.name).toBe(productData.name);
    });

    it('should throw error if product not found', async () => {
      const fakeId = new Types.ObjectId().toString();

      await expect(async () => {
        await ProductService.findById(fakeId);
      }).rejects.toThrow(new AppError('Produto não encontrado', 404));
    });
  });

  describe('update', () => {
    it('should update product', async () => {
      const productData = {
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        stock: 10
      };

      const product = await ProductService.create(productData);

      const updateData = {
        name: 'Updated Product',
        price: 149.99
      };

      const updatedProduct = await ProductService.update(product.id, updateData);

      expect(updatedProduct.name).toBe(updateData.name);
      expect(updatedProduct.price).toBe(updateData.price);
      expect(updatedProduct.description).toBe(productData.description);
      expect(updatedProduct.stock).toBe(productData.stock);
    });

    it('should throw error if product not found', async () => {
      const fakeId = new Types.ObjectId().toString();

      await expect(async () => {
        await ProductService.update(fakeId, { name: 'Updated' });
      }).rejects.toThrow(new AppError('Produto não encontrado', 404));
    });
  });

  describe('delete', () => {
    it('should delete product', async () => {
      const productData = {
        name: 'Test Product',
        description: 'Test Description',
        price: 99.99,
        stock: 10
      };

      const product = await ProductService.create(productData);
      await ProductService.delete(product.id);

      await expect(async () => {
        await ProductService.findById(product.id);
      }).rejects.toThrow(new AppError('Produto não encontrado', 404));
    });

    it('should throw error if product not found', async () => {
      const fakeId = new Types.ObjectId().toString();

      await expect(async () => {
        await ProductService.delete(fakeId);
      }).rejects.toThrow(new AppError('Produto não encontrado', 404));
    });
  });
}); 