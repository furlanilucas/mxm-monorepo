import Product, { IProduct } from '../models/Product';
import { AppError } from '../utils/AppError';
import OpenAIService from './OpenAIService';

interface ICreateProductDTO {
  name: string;
  price: number;
  stock?: number;
  description?: string;
  category?: string;
}

interface IUpdateProductDTO {
  name?: string;
  description?: string;
  price?: number;
  stock?: number;
  category?: string;
}

class ProductService {
  async create({ name, price, stock = 0 }: ICreateProductDTO) {
    try {
      // Gerar descrição e categoria usando OpenAI
      const aiGenerated = await OpenAIService.generateProductDetails(name);

      const productData: ICreateProductDTO = {
        name,
        price,
        stock,
        description: aiGenerated.description,
        category: aiGenerated.category
      };

      const product = await Product.create(productData);

      return product;
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Erro ao criar produto. Por favor, tente novamente.');
    }
  }

  async findAll() {
    const products = await Product.find().sort({ createdAt: -1 });
    return products;
  }

  async findById(id: string) {
    const product = await Product.findById(id);
    
    if (!product) {
      throw new AppError('Produto não encontrado', 404);
    }

    return product;
  }

  async update(id: string, data: Partial<IProduct>) {
    const product = await Product.findById(id);
    
    if (!product) {
      throw new AppError('Produto não encontrado', 404);
    }

    Object.assign(product, data);
    await product.save();

    return product;
  }

  async delete(id: string) {
    const product = await Product.findById(id);
    
    if (!product) {
      throw new AppError('Produto não encontrado', 404);
    }

    await product.deleteOne();
  }

  async findByCategory(category: string) {
    const products = await Product.find({ category });
    return products;
  }

  async search(query: string) {
    const products = await Product.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } }
      ]
    });
    return products;
  }
}

export default new ProductService(); 