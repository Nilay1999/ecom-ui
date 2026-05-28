import { useState } from 'react';
import {
  Box, Container, Typography, Grid, TextField, InputAdornment,
  FormControlLabel, Switch, MenuItem, Select, FormControl, InputLabel,
  Pagination, Alert, Chip, CircularProgress,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useSearchProducts } from '../hooks/useProducts';
import { formatPrice } from '../utils/formatPrice';

const SORT_OPTIONS = [
  { value: 'price', label: 'Price' },
  { value: 'rating', label: 'Rating' },
  { value: 'createdAt', label: 'Newest' },
];

const FALLBACK_IMG = 'https://placehold.co/616x353/f5f1ea/1c1a17?text=Game';

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [query, setQuery] = useState(searchParams.get('q') ?? '');
  const [inStock, setInStock] = useState(false);
  const [sort, setSort] = useState('createdAt');
  const [page, setPage] = useState(0);
  const limit = 12;

  const { data, isLoading, isError } = useSearchProducts(query, inStock, page, limit, sort);
  const results = data?.data?.content ?? [];
  const totalPages = data?.data?.totalPages ?? 1;

  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      {/* Search bar */}
      <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', mb: 4, alignItems: 'center' }}>
        <TextField
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(0); }}
          placeholder="Search games…"
          size="small"
          sx={{ flex: 1, minWidth: 240 }}
          InputProps={{
            startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
          }}
        />
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Sort by</InputLabel>
          <Select value={sort} label="Sort by" onChange={(e) => setSort(e.target.value)}>
            {SORT_OPTIONS.map((o) => <MenuItem key={o.value} value={o.value}>{o.label}</MenuItem>)}
          </Select>
        </FormControl>
        <FormControlLabel
          control={<Switch checked={inStock} onChange={(e) => setInStock(e.target.checked)} color="primary" />}
          label="In stock only"
        />
      </Box>

      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 2,
          mb: 4,
          pb: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Typography variant="h4" sx={{ fontSize: { xs: 24, md: 30 } }}>
          {query ? `Results for "${query}"` : 'Search Games'}
        </Typography>
        {data && (
          <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: '0.06em' }}>
            {data.data.totalElements} RESULTS
          </Typography>
        )}
        {isLoading && <CircularProgress size={16} sx={{ color: 'text.secondary' }} />}
      </Box>

      {isError && <Alert severity="error" sx={{ mb: 3 }}>Search failed. Make sure the backend is running.</Alert>}

      {!query && (
        <Typography color="text.secondary">Type something above to search.</Typography>
      )}

      <Grid container spacing={3}>
        {results.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
            <Box
              onClick={() => navigate(`/products/${product.id}`)}
              sx={(theme) => ({
                bgcolor: 'background.paper',
                border: '1px solid',
                borderColor: 'divider',
                borderRadius: 1,
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'border-color 200ms ease, transform 200ms ease, box-shadow 200ms ease',
                '&:hover': {
                  borderColor: 'text.secondary',
                  transform: 'translateY(-2px)',
                  boxShadow:
                    theme.palette.mode === 'dark'
                      ? '0 12px 32px -16px rgba(0,0,0,0.7)'
                      : '0 12px 32px -16px rgba(28,26,23,0.18)',
                },
              })}
            >
              <Box
                component="img"
                src={FALLBACK_IMG}
                alt={product.productName}
                sx={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }}
              />
              <Box sx={{ p: 2.5 }}>
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: 15,
                    letterSpacing: '-0.015em',
                    mb: 1,
                  }}
                  noWrap
                >
                  {product.productName}
                </Typography>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 1.5,
                    pt: 1.5,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: 16,
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {formatPrice(product.price)}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      fontSize: 10,
                      fontWeight: 600,
                      color:
                        product.status === 'ACTIVE'
                          ? 'success.main'
                          : product.status === 'OUT_OF_STOCK'
                          ? 'error.main'
                          : 'text.secondary',
                    }}
                  >
                    {product.status === 'ACTIVE' ? 'In stock' : product.status === 'OUT_OF_STOCK' ? 'Sold out' : product.status}
                  </Typography>
                </Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                  {product.stockQuantity} units
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <Pagination count={totalPages} page={page + 1} onChange={(_, v) => setPage(v - 1)} shape="rounded" />
        </Box>
      )}
    </Container>
  );
}
