import axios from 'axios';

// Criando instância do Axios com configuração base
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptador de requisições
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('@App:token');
    console.log('Token encontrado:', token);
    
    if (token) {
      console.log('Adicionando token ao header:', `Bearer ${token}`);
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Erro no interceptador de requisição:', error);
    return Promise.reject(error);
  }
);

// Interceptador de respostas
api.interceptors.response.use(
  (response) => {
    console.log('Resposta recebida:', {
      status: response.status,
      headers: response.headers,
      data: response.data
    });
    return response;
  },
  (error) => {
    console.error('Erro na resposta:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    if (error.response?.status === 401) {
      console.log('Token inválido ou expirado, redirecionando para login');
      localStorage.removeItem('@App:token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 