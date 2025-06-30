# Sistema de Gerenciamento de Produtos com IA

Este é um sistema full-stack que combina React (frontend) e Node.js (backend) para gerenciamento de produtos, com geração automática de descrições e categorias usando a API da OpenAI.

## Funcionalidades

- ✨ Cadastro simplificado de produtos (nome, preço e estoque)
- 🤖 Geração automática de descrições e categorias usando IA
- 🔍 Busca e filtragem de produtos
- 📱 Interface responsiva e moderna
- 🔒 Sistema de autenticação integrado

## Configuração do Projeto

### Pré-requisitos

- Node.js (versão 14 ou superior)
- NPM ou Yarn
- MongoDB instalado e rodando
- Chave de API da OpenAI

### Configuração do Backend

1. Na pasta raiz do projeto, crie um arquivo `.env` com:
```
OPENAI_API_KEY=sua-chave-aqui
MONGODB_URI=sua-uri-do-mongodb
JWT_SECRET=seu-segredo-jwt
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor:
```bash
npm run dev
```

O backend rodará na porta 3001.

### Configuração do Frontend

1. Navegue até a pasta do frontend:
```bash
cd frontend
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

O frontend rodará na porta 5173.

## ⚠️ Importante: Configuração da OpenAI

Para que o sistema funcione corretamente, você **precisa** configurar sua chave da API da OpenAI:

1. Acesse [OpenAI Platform](https://platform.openai.com/)
2. Crie uma conta ou faça login
3. Gere uma chave de API
4. Adicione a chave no arquivo `.env` do backend

Sem esta configuração, a geração automática de descrições e categorias não funcionará.

## Estrutura do Projeto

```
projeto/
├── src/                    # Backend
│   ├── controllers/        # Controladores da API
│   ├── models/            # Modelos do MongoDB
│   ├── services/          # Lógica de negócios
│   └── routes/            # Rotas da API
│
└── frontend/              # Frontend
    ├── src/
    │   ├── components/    # Componentes React
    │   ├── pages/        # Páginas da aplicação
    │   └── services/     # Serviços de API
    └── public/           # Arquivos estáticos
```

## Endpoints da API

- `POST /products` - Criar novo produto
- `GET /products` - Listar todos os produtos
- `GET /products/:id` - Buscar produto por ID
- `PUT /products/:id` - Atualizar produto
- `DELETE /products/:id` - Deletar produto
- `GET /products/search` - Buscar produtos por termo

## Tecnologias Utilizadas

- **Backend**:
  - Node.js
  - Express
  - TypeScript
  - MongoDB/Mongoose
  - OpenAI API

- **Frontend**:
  - React
  - TypeScript
  - Vite
  - Axios
  - Material-UI

## Testes

O projeto inclui testes automatizados. Para executá-los:

```bash
npm test
```

## Status do Projeto

✅ O projeto está completo e pronto para uso, necessitando apenas da configuração da chave da API da OpenAI para funcionar em sua totalidade. 