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

const FALLBACK_IMG = 'https://placehold.co/616x353/1c1f26/0070D1?text=Game';

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
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Typography variant="h5" fontWeight={700}>
          {query ? `Results for "${query}"` : 'Search Games'}
        </Typography>
        {data && <Chip label={`${data.data.totalElements} results`} size="small" color="primary" variant="outlined" />}
        {isLoading && <CircularProgress size={20} />}
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
              sx={{
                bgcolor: 'background.paper',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 2,
                overflow: 'hidden',
                cursor: 'pointer',
                transition: 'border-color 0.2s, box-shadow 0.2s',
                '&:hover': { borderColor: 'rgba(0,112,209,0.5)', boxShadow: '0 4px 24px rgba(0,112,209,0.15)' },
              }}
            >
              <Box
                component="img"
                src={FALLBACK_IMG}
                alt={product.productName}
                sx={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }}
              />
              <Box sx={{ p: 2 }}>
                <Typography fontWeight={700} noWrap gutterBottom>{product.productName}</Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                  <Typography color="primary" fontWeight={700}>{formatPrice(product.price)}</Typography>
                  <Chip
                    label={product.status}
                    size="small"
                    color={product.status === 'ACTIVE' ? 'success' : product.status === 'OUT_OF_STOCK' ? 'error' : 'default'}
                  />
                </Box>
                <Typography variant="caption" color="text.secondary">{product.stockQuantity} in stock</Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <Pagination count={totalPages} page={page + 1} onChange={(_, v) => setPage(v - 1)} color="primary" shape="rounded" />
        </Box>
      )}
    </Container>
  );
}
