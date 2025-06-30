import mongoose from 'mongoose';
import Product from '../../models/Product';

describe('Product Model Test', () => {
  it('should create & save product successfully', async () => {
    const validProduct = {
      name: 'Test Product',
      description: 'Test Description',
      price: 99.99,
      stock: 10
    };

    const savedProduct = await Product.create(validProduct);
    expect(savedProduct._id).toBeDefined();
    expect(savedProduct.name).toBe(validProduct.name);
    expect(savedProduct.description).toBe(validProduct.description);
    expect(savedProduct.price).toBe(validProduct.price);
    expect(savedProduct.stock).toBe(validProduct.stock);
  });

  it('should fail to save product without required fields', async () => {
    const productWithoutRequiredField = new Product({ name: 'Test Product' });
    let err;
    try {
      await productWithoutRequiredField.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.description).toBeDefined();
    expect(err.errors.price).toBeDefined();
    expect(err.errors.stock).toBeDefined();
  });

  it('should fail to save product with invalid price', async () => {
    const productWithInvalidPrice = {
      name: 'Test Product',
      description: 'Test Description',
      price: -10,
      stock: 10
    };

    let err;
    try {
      await Product.create(productWithInvalidPrice);
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.price).toBeDefined();
  });

  it('should fail to save product with invalid stock', async () => {
    const productWithInvalidStock = {
      name: 'Test Product',
      description: 'Test Description',
      price: 99.99,
      stock: -1
    };

    let err;
    try {
      await Product.create(productWithInvalidStock);
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.stock).toBeDefined();
  });
}); 