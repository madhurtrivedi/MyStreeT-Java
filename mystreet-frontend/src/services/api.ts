import axios from 'axios';
import type { Product } from '../types';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const productService = {
  getAll: (params?: { brand?: string; size?: string }) =>
    api.get<Product[]>('/api/products', { params }).then((r) => r.data),

  getById: (id: string) =>
    api.get<Product>(`/api/products/${id}`).then((r) => r.data),
};

export default api;
