import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

let mongod: MongoMemoryServer;

// Conectar ao banco de dados de teste antes de todos os testes
beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  await mongoose.connect(uri);
});

// Limpar todos os dados e coleções antes de cada teste
beforeEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
});

// Desconectar e parar o servidor após todos os testes
afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongod.stop();
});

// Adicionar um teste dummy para evitar o erro do Jest
describe('Test Setup', () => {
  it('should setup test environment correctly', () => {
    expect(true).toBe(true);
  });
}); 