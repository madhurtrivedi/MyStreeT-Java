import {
  Box,
  Chip,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ToastNotification from '../components/ToastNotification';
import { productService } from '../services/api';
import type { Product } from '../types';

const BRANDS = ['All', 'Nike', 'Adidas', 'New Balance', 'Puma', 'Reebok', 'Converse'];
const SIZES = ['All', '6', '7', '8', '9', '10', '11', '12'];

export default function ProductListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const [toast, setToast] = useState<{
    message: string;
    severity?: 'success' | 'info' | 'warning' | 'error';
  } | null>(() => {
    const state = location.state as { toast?: { message: string; severity?: 'success' | 'info' | 'warning' | 'error' } } | null;
    return state?.toast ?? null;
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const brand = searchParams.get('brand') || 'All';
  const size = searchParams.get('size') || 'All';

  useEffect(() => {
    setLoading(true);
    setError('');
    const params: Record<string, string> = {};
    if (brand !== 'All') params.brand = brand;
    if (size !== 'All') params.size = size;

    productService
      .getAll(params.brand, params.size)
      .then((res) => setProducts(res.data as Product[]))
      .catch(() => setError('Failed to load products. Server might be down.'))
      .finally(() => setLoading(false));
  }, [brand, size]);

  const setFilter = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value === 'All') next.delete(key);
    else next.set(key, value);
    setSearchParams(next);
  };

  return (
    <Box sx={{ bgcolor: '#0a0a0a', minHeight: '100vh', color: '#fff', py: 6 }}>
      <ToastNotification
        open={!!toast}
        message={toast?.message ?? ''}
        severity={toast?.severity}
        onClose={() => setToast(null)}
      />
      <Container maxWidth="xl">
        {/* Header */}
        <Box sx={{ mb: 5 }}>
          <Typography
            sx={{
              fontFamily: '"Bebas Neue", sans-serif',
              fontSize: { xs: '2.5rem', md: '4rem' },
              letterSpacing: '-1px',
              lineHeight: 1,
              mb: 1,
            }}
          >
            All Sneakers
          </Typography>
          <Typography color="#555" variant="body2">
            {loading ? '...' : `${products.length} styles`}
          </Typography>
        </Box>

        {/* Filters */}
        <Box sx={{ display: 'flex', gap: 2, mb: 5, flexWrap: 'wrap', alignItems: 'center' }}>
          <Typography variant="body2" color="#666" sx={{ mr: 1 }}>
            Filter:
          </Typography>

          {/* Brand chips */}
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {BRANDS.map((b) => (
              <Chip
                key={b}
                label={b}
                onClick={() => setFilter('brand', b)}
                sx={{
                  bgcolor: brand === b ? '#ff5000' : '#111',
                  color: brand === b ? '#fff' : '#888',
                  border: '1px solid',
                  borderColor: brand === b ? '#ff5000' : '#222',
                  fontWeight: brand === b ? 700 : 400,
                  '&:hover': { bgcolor: brand === b ? '#e04500' : '#1a1a1a' },
                  cursor: 'pointer',
                }}
              />
            ))}
          </Box>

          {/* Size select */}
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel sx={{ color: '#666' }}>Size</InputLabel>
            <Select
              value={size}
              label="Size"
              onChange={(e) => setFilter('size', e.target.value)}
              sx={{
                color: '#fff',
                '& .MuiOutlinedInput-notchedOutline': { borderColor: '#222' },
                '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#444' },
                '& .MuiSvgIcon-root': { color: '#666' },
              }}
              MenuProps={{ PaperProps: { sx: { bgcolor: '#111', color: '#fff' } } }}
            >
              {SIZES.map((s) => (
                <MenuItem key={s} value={s} sx={{ '&:hover': { bgcolor: '#1e1e1e' } }}>
                  {s === 'All' ? 'All Sizes' : `US ${s}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Content */}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
            <CircularProgress sx={{ color: '#ff5000' }} />
          </Box>
        )}

        {error && (
          <Box
            sx={{
              p: 4,
              border: '1px solid #ff5000',
              borderRadius: 2,
              bgcolor: 'rgba(255,80,0,0.05)',
              color: '#ff5000',
              textAlign: 'center',
            }}
          >
            <Typography>{error}</Typography>
          </Box>
        )}

        {!loading && !error && products.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 10, color: '#555' }}>
            <Typography variant="h5">No products found</Typography>
            <Typography variant="body2" sx={{ mt: 1 }}>
              Try changing your filters
            </Typography>
          </Box>
        )}

        {!loading && !error && products.length > 0 && (
          <Grid container spacing={2.5}>
            {products.map((p) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={p.id}>
                <ProductCard product={p} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
}
