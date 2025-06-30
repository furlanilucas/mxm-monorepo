import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Alert, Container } from '@mui/material';
import api from '../services/api';
import { API_ENDPOINTS } from '../config/api';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
}

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormData>();
  const navigate = useNavigate();
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError('');
      setLoading(true);
      console.log('Enviando dados de registro:', { ...data, password: '***' });
      
      const response = await api.post(API_ENDPOINTS.AUTH.REGISTER, data);
      console.log('Resposta do registro:', response.data);
      
      if (response.data.token) {
        console.log('Token recebido, salvando...');
        localStorage.setItem('@App:token', response.data.token);
        localStorage.setItem('@App:user', JSON.stringify(response.data.user));
        
        const savedToken = localStorage.getItem('@App:token');
        console.log('Token salvo com sucesso:', savedToken ? 'Sim' : 'Não');
        
        navigate('/products');
      } else {
        console.error('Token não encontrado na resposta');
        setError('Erro no registro: token não recebido');
      }
    } catch (err: any) {
      console.error('Erro ao criar conta:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.message === 'Network Error') {
        setError('Erro de conexão com o servidor. Por favor, verifique se o servidor está rodando.');
      } else {
        setError('Erro ao criar conta. Por favor, tente novamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      py: 4
    }}>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          width: '100%',
          p: 3,
          borderRadius: 1,
          boxShadow: 1,
          bgcolor: 'background.paper'
        }}
      >
        <Typography variant="h4" component="h1" gutterBottom>
          Criar Conta
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          {...register('name', { required: 'Nome é obrigatório' })}
          label="Nome"
          fullWidth
          margin="normal"
          error={!!errors.name}
          helperText={errors.name?.message}
          disabled={loading}
        />

        <TextField
          {...register('email', { 
            required: 'Email é obrigatório',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Email inválido'
            }
          })}
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          error={!!errors.email}
          helperText={errors.email?.message}
          disabled={loading}
        />

        <TextField
          {...register('password', { 
            required: 'Senha é obrigatória',
            minLength: {
              value: 6,
              message: 'A senha deve ter no mínimo 6 caracteres'
            }
          })}
          label="Senha"
          type="password"
          fullWidth
          margin="normal"
          error={!!errors.password}
          helperText={errors.password?.message}
          disabled={loading}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          disabled={loading}
        >
          {loading ? 'Criando conta...' : 'Criar Conta'}
        </Button>

        <Button
          onClick={() => navigate('/login')}
          fullWidth
          sx={{ mt: 1 }}
          disabled={loading}
        >
          Já tem uma conta? Faça login
        </Button>
      </Box>
    </Container>
  );
} 