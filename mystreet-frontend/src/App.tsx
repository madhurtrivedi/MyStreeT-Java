import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import ProductListPage from './pages/ProductListPage';
import ProductDetailPage from './pages/ProductDetailPage';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#ff5000' },
    background: { default: '#0a0a0a', paper: '#111' },
  },
  typography: {
    fontFamily: '"DM Sans", sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;700;800&display=swap');
        body { background: #0a0a0a; }
        * { box-sizing: border-box; }
      `,
    },
  },
});

export default function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <CartProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductListPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            {/* Sprint 2: /cart, /checkout, /auth/login, /auth/register */}
            {/* Sprint 3: /admin/products, /orders/confirmation */}
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </ThemeProvider>
  );
}
