import {
  AppBar,
  Badge,
  Box,
  Button,
  Container,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { totalItems } = useCart();

  return (
    <AppBar position="sticky" elevation={0} sx={{ bgcolor: '#0a0a0a', borderBottom: '1px solid #222' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ py: 1 }}>
          {/* Logo */}
          <Typography
            variant="h5"
            fontWeight={900}
            letterSpacing="-0.5px"
            sx={{ cursor: 'pointer', flexGrow: 1, fontFamily: '"Bebas Neue", sans-serif', fontSize: '1.8rem' }}
            onClick={() => navigate('/')}
          >
            MyStreeT
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <Button
              onClick={() => navigate('/products')}
              sx={{ color: '#aaa', textTransform: 'none', fontWeight: 500, '&:hover': { color: '#fff' } }}
            >
              Shop
            </Button>

            <IconButton onClick={() => navigate('/cart')} sx={{ color: '#fff' }}>
              <Badge badgeContent={totalItems} color="error">
                <ShoppingCartIcon />
              </Badge>
            </IconButton>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
