import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import type { Product } from '../types';

interface Props {
  product: Product;
}

export default function ProductCard({ product }: Props) {
  const navigate = useNavigate();

  return (
    <Card
      elevation={0}
      sx={{
        bgcolor: '#111',
        border: '1px solid #1e1e1e',
        borderRadius: 2,
        transition: 'all 0.2s ease',
        '&:hover': {
          borderColor: '#444',
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
        },
      }}
    >
      <CardActionArea onClick={() => navigate(`/products/${product.id}`)}>
        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
          <CardMedia
            component="img"
            height="220"
            image={product.imageUrl}
            alt={product.name}
            sx={{ objectFit: 'cover', transition: 'transform 0.3s ease', '&:hover': { transform: 'scale(1.04)' } }}
          />
          <Chip
            label={product.brand}
            size="small"
            sx={{
              position: 'absolute',
              top: 10,
              left: 10,
              bgcolor: 'rgba(0,0,0,0.75)',
              color: '#fff',
              fontSize: '0.7rem',
              fontWeight: 700,
              backdropFilter: 'blur(4px)',
              border: '1px solid #333',
            }}
          />
        </Box>

        <CardContent sx={{ px: 2, py: 1.5 }}>
          <Typography
            variant="subtitle1"
            fontWeight={700}
            color="#fff"
            noWrap
            sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '1.1rem', letterSpacing: '0.5px' }}
          >
            {product.name}
          </Typography>
          <Typography variant="body2" color="#888" sx={{ mb: 1, fontSize: '0.75rem' }}>
            {product.sizesCsv.split(',').length} sizes available
          </Typography>
          <Typography variant="h6" fontWeight={800} color="#e8e8e8">
            ${product.price.toFixed(2)}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
