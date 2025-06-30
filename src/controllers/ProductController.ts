import { Request, Response } from 'express';
import ProductService from '../services/ProductService';
import { AppError } from '../utils/AppError';

class ProductController {
  async index(req: Request, res: Response): Promise<Response> {
    const products = await ProductService.findAll();
    return res.json(products);
  }

  async show(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const product = await ProductService.findById(id);
    return res.json(product);
  }

  async create(req: Request, res: Response): Promise<Response> {
    const { name, price, stock = 0 } = req.body;

    if (price < 0) {
      throw new AppError('O preço não pode ser negativo', 400);
    }

    if (stock < 0) {
      throw new AppError('O estoque não pode ser negativo', 400);
    }

    const product = await ProductService.create({
      name,
      price,
      stock
    });

    return res.status(201).json(product);
  }

  async update(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { name, description, price, stock, category } = req.body;

    if (price && price < 0) {
      throw new AppError('O preço não pode ser negativo', 400);
    }

    if (stock && stock < 0) {
      throw new AppError('O estoque não pode ser negativo', 400);
    }

    const product = await ProductService.update(id, {
      name,
      description,
      price,
      stock,
      category
    });

    return res.json(product);
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    await ProductService.delete(id);

    return res.status(204).send();
  }

  async findByCategory(request: Request, response: Response) {
    const { category } = request.params;
    const products = await ProductService.findByCategory(category);
    return response.json(products);
  }

  async search(request: Request, response: Response) {
    const { q } = request.query;
    const products = await ProductService.search(q as string);
    return response.json(products);
  }
}

export default new ProductController(); 