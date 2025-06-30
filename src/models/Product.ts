import mongoose from 'mongoose';

export interface IProduct {
  name: string;
  description: string;
  price: number;
  stock: number;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new mongoose.Schema<IProduct>({
  name: {
    type: String,
    required: [true, 'Por favor, informe o nome do produto']
  },
  description: {
    type: String,
    required: [true, 'Por favor, informe a descrição do produto']
  },
  price: {
    type: Number,
    required: [true, 'Por favor, informe o preço do produto'],
    min: [0, 'O preço não pode ser negativo']
  },
  stock: {
    type: Number,
    required: [true, 'Por favor, informe o estoque do produto'],
    min: [0, 'O estoque não pode ser negativo']
  },
  category: {
    type: String,
    required: false
  }
}, {
  timestamps: true
});

const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product; 