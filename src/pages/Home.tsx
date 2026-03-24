import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Pagination,
  TextField,
  InputAdornment,
  Alert,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ProductCard from '../components/ProductCard';
import ProductGridSkeleton from '../components/LoadingSkeleton';
import { useProducts } from '../hooks/useProducts';

const PAGE_SIZE = 12;

export default function Home() {
  const [page, setPage] = useState(0);
  const [searchInput, setSearchInput] = useState('');

  const { data, isLoading, isError, refetch } = useProducts(page, PAGE_SIZE);
  const products = data?.data?.content ?? [];
  const totalPages = data?.data?.totalPages ?? 1;

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Hero */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0070D1 0%, #004f9a 100%)',
          py: { xs: 6, md: 10 },
          textAlign: 'center',
        }}
      >
        <Typography
          variant="h2"
          sx={{ fontWeight: 900, color: '#fff', mb: 1.5, fontSize: { xs: '2rem', md: '3.2rem' } }}
        >
          Your Gaming Universe
        </Typography>
        <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.75)', mb: 4 }}>
          Discover thousands of games across every platform
        </Typography>

        <Box sx={{ maxWidth: 480, mx: 'auto', px: 2 }}>
          <TextField
            fullWidth
            placeholder="Search games, platforms, genres…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: 'text.secondary' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              bgcolor: 'background.paper',
              borderRadius: 2,
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                '& fieldset': { border: 'none' },
              },
            }}
          />
        </Box>
      </Box>

      <Container maxWidth="xl" sx={{ py: 5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h5" fontWeight={700}>
            {searchInput ? `Results for "${searchInput}"` : 'Featured Games'}
          </Typography>
          {data && (
            <Typography variant="body2" color="text.secondary">
              {data.data.totalElements} games
            </Typography>
          )}
        </Box>

        {isError && (
          <Alert severity="error" action={<Button onClick={() => refetch()}>Retry</Button>} sx={{ mb: 3 }}>
            Failed to load products. Make sure the backend is running.
          </Alert>
        )}

        {isLoading ? (
          <ProductGridSkeleton count={PAGE_SIZE} />
        ) : (
          <Grid container spacing={3}>
            {products
              .filter((p) =>
                searchInput ? p.product.toLowerCase().includes(searchInput.toLowerCase()) : true,
              )
              .map((product) => (
                <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                  <ProductCard product={product} />
                </Grid>
              ))}
          </Grid>
        )}

        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
            <Pagination
              count={totalPages}
              page={page + 1}
              onChange={(_, value) => setPage(value - 1)}
              color="primary"
              shape="rounded"
            />
          </Box>
        )}
      </Container>
    </Box>
  );
}
