import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  CircularProgress,
  Alert,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon } from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import api from '../services/api';
import { API_ENDPOINTS } from '../config/api';
import { useAuth } from '../contexts/AuthContext';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
}

interface ProductFormData {
  name: string;
  price: number;
  stock?: number;
}

export default function Products() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<ProductFormData>();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await api.get(API_ENDPOINTS.PRODUCTS.LIST);
      setProducts(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao buscar produtos.';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Erro ao buscar produtos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpen = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setValue('name', product.name);
      setValue('price', product.price);
      setValue('stock', product.stock);
    } else {
      setEditingProduct(null);
      reset();
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingProduct(null);
    reset();
  };

  const handleDelete = async (id: string) => {
    try {
      setLoading(true);
      setError('');
      await api.delete(`${API_ENDPOINTS.PRODUCTS.DELETE(id)}`);
      toast.success('Produto excluído com sucesso!');
      fetchProducts();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao excluir produto.';
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Erro ao excluir produto:', err);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: ProductFormData) => {
    try {
      setLoading(true);
      setError('');
      
      if (editingProduct) {
        await api.put(`${API_ENDPOINTS.PRODUCTS.UPDATE(editingProduct.id)}`, data);
        toast.success('Produto atualizado com sucesso!');
      } else {
        await api.post(API_ENDPOINTS.PRODUCTS.CREATE, data);
        toast.success('Produto criado com sucesso! A descrição e categoria foram geradas automaticamente.');
      }
      handleClose();
      fetchProducts();
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 
        (editingProduct ? 'Erro ao atualizar produto.' : 'Erro ao criar produto.');
      setError(errorMessage);
      toast.error(errorMessage);
      console.error('Erro ao salvar produto:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="warning">
          Você precisa estar logado para acessar esta página.
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">Produtos</Typography>
        <Button variant="contained" onClick={() => handleOpen()} disabled={loading}>
          Novo Produto
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {loading && !open ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <Box>
                      <Typography variant="h6">{product.name}</Typography>
                      <Typography color="textSecondary" gutterBottom>
                        {product.category}
                      </Typography>
                    </Box>
                    <Box>
                      <IconButton size="small" onClick={() => handleOpen(product)} disabled={loading}>
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDelete(product.id)} disabled={loading}>
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ mt: 1, minHeight: '60px' }}>
                    {product.description}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                    <Typography variant="h6">
                      R$ {product.price.toFixed(2)}
                    </Typography>
                    <Typography color="textSecondary" variant="body2">
                      Estoque: {product.stock}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editingProduct ? 'Editar Produto' : 'Novo Produto'}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <TextField
              fullWidth
              label="Nome"
              margin="normal"
              {...register('name', { required: 'Nome é obrigatório' })}
              error={!!errors.name}
              helperText={errors.name?.message}
              disabled={loading}
            />

            <TextField
              fullWidth
              label="Preço"
              margin="normal"
              type="number"
              inputProps={{ step: '0.01' }}
              {...register('price', { 
                required: 'Preço é obrigatório',
                min: { value: 0, message: 'O preço não pode ser negativo' }
              })}
              error={!!errors.price}
              helperText={errors.price?.message}
              disabled={loading}
            />

            <TextField
              fullWidth
              label="Estoque"
              margin="normal"
              type="number"
              {...register('stock', { 
                min: { value: 0, message: 'O estoque não pode ser negativo' }
              })}
              error={!!errors.stock}
              helperText={errors.stock?.message}
              disabled={loading}
            />

            {!editingProduct && (
              <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
                A descrição e categoria serão geradas automaticamente com base no nome do produto.
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" disabled={loading}>
              {loading ? (
                <CircularProgress size={24} />
              ) : editingProduct ? (
                'Salvar'
              ) : (
                'Criar'
              )}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
} 