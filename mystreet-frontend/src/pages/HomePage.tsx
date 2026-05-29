import { Box, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import EastIcon from '@mui/icons-material/East';

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0a0a0a', color: '#fff', overflow: 'hidden' }}>
      <Container maxWidth="xl">
        <Box
          sx={{
            minHeight: 'calc(100vh - 72px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            position: 'relative',
            py: 10,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '10%',
              right: '-5%',
              width: '55%',
              height: '80%',
              background: 'radial-gradient(ellipse at center, rgba(255,80,0,0.08) 0%, transparent 70%)',
              pointerEvents: 'none',
            }}
          />

          <Typography
            sx={{
              fontFamily: '"Bebas Neue", sans-serif',
              fontSize: { xs: '4rem', md: '8rem', lg: '10rem' },
              lineHeight: 0.9,
              letterSpacing: '-2px',
              color: '#fff',
              mb: 1,
            }}
          >
            STEP
          </Typography>
          <Typography
            sx={{
              fontFamily: '"Bebas Neue", sans-serif',
              fontSize: { xs: '4rem', md: '8rem', lg: '10rem' },
              lineHeight: 0.9,
              letterSpacing: '-2px',
              color: 'transparent',
              WebkitTextStroke: '2px #ff5000',
              mb: 4,
            }}
          >
            INTO IT.
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: '#888',
              fontWeight: 400,
              maxWidth: 480,
              mb: 5,
              lineHeight: 1.7,
              fontSize: { xs: '1rem', md: '1.1rem' },
            }}
          >
            Premium sneakers. No noise. Browse our curated collection of the most coveted kicks — from classic staples to contemporary heat.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Button
              variant="contained"
              size="large"
              endIcon={<EastIcon />}
              onClick={() => navigate('/products')}
              sx={{
                bgcolor: '#ff5000',
                color: '#fff',
                fontWeight: 800,
                px: 4,
                py: 1.5,
                borderRadius: 1,
                textTransform: 'none',
                fontSize: '1rem',
                '&:hover': { bgcolor: '#e04500' },
              }}
            >
              Shop All Sneakers
            </Button>
          </Box>

          {/* Stats row */}
          <Box
            sx={{
              display: 'flex',
              gap: 5,
              mt: 10,
              pt: 5,
              borderTop: '1px solid #1e1e1e',
            }}
          >
            {[
              { val: '8+', label: 'Styles' },
              { val: '4+', label: 'Brands' },
              { val: '100%', label: 'Authentic' },
            ].map((s) => (
              <Box key={s.label}>
                <Typography
                  sx={{ fontFamily: '"Bebas Neue", sans-serif', fontSize: '2rem', color: '#ff5000' }}
                >
                  {s.val}
                </Typography>
                <Typography variant="caption" color="#555" sx={{ textTransform: 'uppercase', letterSpacing: 2 }}>
                  {s.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
