# Frontend da Aplicação

Este é o frontend da aplicação, desenvolvido com React, TypeScript e Material-UI.

## Tecnologias Utilizadas

- React
- TypeScript
- Material-UI
- React Router DOM
- React Hook Form
- Axios
- React Toastify

## Estrutura do Projeto

```
src/
  ├── components/     # Componentes reutilizáveis
  ├── config/        # Configurações da aplicação
  ├── contexts/      # Contextos do React
  ├── pages/         # Páginas da aplicação
  ├── services/      # Serviços e integrações
  ├── types/         # Tipos TypeScript
  └── utils/         # Utilitários
```

## Funcionalidades

- Autenticação de usuários (login/registro)
- Gerenciamento de produtos (CRUD)
- Layout responsivo
- Feedback visual com toasts
- Proteção de rotas

## Como Executar

1. Instale as dependências:
```bash
npm install
```

2. Execute o projeto em modo de desenvolvimento:
```bash
npm run dev
```

3. Acesse a aplicação em `http://localhost:5173`

## Scripts Disponíveis

- `npm run dev`: Executa o projeto em modo de desenvolvimento
- `npm run build`: Gera a build de produção
- `npm run preview`: Executa a build de produção localmente
