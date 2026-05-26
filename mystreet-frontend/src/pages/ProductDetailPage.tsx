import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  Snackbar,
  Alert,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { productService } from '../services/api';
import type { Product } from '../types';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [snackOpen, setSnackOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    productService
      .getById(id)
      .then((p) => {
        setProduct(p);
        // Auto-select first size
        const sizes = p.sizesCsv.split(',').map((s) => s.trim());
        if (sizes.length > 0) setSelectedSize(sizes[0]);
      })
      .catch(() => setError('Product not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product || !selectedSize) return;
    addToCart(product, selectedSize);
    setSnackOpen(true);
  };

  if (loading) {
    return (
      <Box sx={{ bgcolor: '#0a0a0a', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress sx={{ color: '#ff5000' }} />
      </Box>
    );
  }

  if (error || !product) {
    return (
      <Box sx={{ bgcolor: '#0a0a0a', minHeight: '100vh', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h5" color="#ff5000">{error || 'Product not found'}</Typography>
          <Button onClick={() => navigate('/products')} sx={{ mt: 2, color: '#aaa' }}>
            Back to shop
          </Button>
        </Box>
      </Box>
    );
  }

  const sizes = product.sizesCsv.split(',').map((s) => s.trim());

  return (
    <Box sx={{ bgcolor: '#0a0a0a', minHeight: '100vh', color: '#fff', py: 6 }}>
      <Container maxWidth="lg">
        {/* Back button */}
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/products')}
          sx={{ color: '#666', textTransform: 'none', mb: 4, '&:hover': { color: '#fff' } }}
        >
          Back to all sneakers
        </Button>

        <Grid container spacing={6}>
          {/* Image */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                border: '1px solid #1e1e1e',
                bgcolor: '#111',
                aspectRatio: '1',
              }}
            >
              <img
                src={product.imageUrl}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </Box>
          </Grid>

          {/* Details */}
          <Grid item xs={12} md={6}>
            <Chip
              label={product.brand}
              sx={{ bgcolor: '#ff5000', color: '#fff', fontWeight: 700, fontSize: '0.75rem', mb: 2 }}
            />

            <Typography
              sx={{
                fontFamily: '"Bebas Neue", sans-serif',
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                lineHeight: 1,
                letterSpacing: '-0.5px',
                mb: 1,
              }}
            >
              {product.name}
            </Typography>

            <Typography variant="h4" fontWeight={800} color="#ff5000" sx={{ mb: 3 }}>
              ${product.price.toFixed(2)}
            </Typography>

            <Typography color="#888" sx={{ mb: 4, lineHeight: 1.8 }}>
              {product.description}
            </Typography>

            <Divider sx={{ borderColor: '#1e1e1e', mb: 3 }} />

            {/* Size Selector */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="body2" color="#666" sx={{ mb: 1.5, textTransform: 'uppercase', letterSpacing: 1.5, fontSize: '0.75rem' }}>
                Select Size (US)
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                {sizes.map((s) => (
                  <Box
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    sx={{
                      width: 52,
                      height: 52,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: '1px solid',
                      borderColor: selectedSize === s ? '#ff5000' : '#222',
                      borderRadius: 1,
                      cursor: 'pointer',
                      bgcolor: selectedSize === s ? 'rgba(255,80,0,0.1)' : 'transparent',
                      color: selectedSize === s ? '#ff5000' : '#888',
                      fontWeight: selectedSize === s ? 700 : 400,
                      transition: 'all 0.15s',
                      '&:hover': { borderColor: '#555', color: '#fff' },
                    }}
                  >
                    {s}
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Stock */}
            <Typography variant="body2" color={product.stockQty > 10 ? '#4caf50' : '#ff9800'} sx={{ mb: 3 }}>
              {product.stockQty > 10 ? '✓ In Stock' : `Only ${product.stockQty} left!`}
            </Typography>

            {/* Add to Cart */}
            <Button
              variant="contained"
              fullWidth
              size="large"
              disabled={!selectedSize}
              onClick={handleAddToCart}
              sx={{
                bgcolor: '#ff5000',
                color: '#fff',
                fontWeight: 800,
                py: 1.8,
                borderRadius: 1,
                textTransform: 'none',
                fontSize: '1rem',
                letterSpacing: '0.5px',
                '&:hover': { bgcolor: '#e04500' },
                '&.Mui-disabled': { bgcolor: '#222', color: '#444' },
              }}
            >
              Add to Cart — US {selectedSize}
            </Button>
          </Grid>
        </Grid>
      </Container>

      <Snackbar
        open={snackOpen}
        autoHideDuration={2500}
        onClose={() => setSnackOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity="success" sx={{ bgcolor: '#1a1a1a', color: '#fff', border: '1px solid #333' }}>
          Added to cart!
        </Alert>
      </Snackbar>
    </Box>
  );
}
