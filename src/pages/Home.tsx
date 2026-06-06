import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Pagination,
  Alert,
  Button,
} from '@mui/material';
import ProductCard from '../components/ProductCard';
import ProductGridSkeleton from '../components/LoadingSkeleton';
import EmptyState from '../components/EmptyState';
import SearchBar from '../components/SearchBar';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';
import { useProducts } from '../hooks/useProducts';

const PAGE_SIZE = 12;

export default function Home() {
  const [page, setPage] = useState(0);

  const { data, isLoading, isError, refetch } = useProducts(page, PAGE_SIZE);
  const products = data?.data?.content ?? [];
  const totalPages = data?.data?.totalPages ?? 1;

  return (
    <Box sx={{ minHeight: '100vh' }}>
      {/* Hero — editorial */}
      <Container maxWidth="xl" sx={{ pt: { xs: 6, md: 10 }, pb: { xs: 5, md: 8 } }}>
        <Box sx={{ maxWidth: 760 }}>
          <Typography
            variant="caption"
            sx={{
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              fontWeight: 600,
              color: 'secondary.main',
              fontSize: 11,
              display: 'block',
              mb: 2,
            }}
          >
            Vol. {new Date().getFullYear()} — Curated for players
          </Typography>
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2.4rem', md: '4.2rem' },
              lineHeight: 1.05,
              mb: 3,
            }}
          >
            A quieter way to discover&nbsp;great games.
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ fontSize: { xs: 15, md: 17 }, maxWidth: 560, mb: 4 }}
          >
            Browse a thoughtfully edited catalog across PC, console and handheld — each title chosen for craft, not noise.
          </Typography>

          <SearchBar variant="field" placeholder="Search games, platforms, genres…" />
        </Box>
      </Container>

      <Container maxWidth="xl" sx={{ pb: 8 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            mb: 4,
            pb: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Typography variant="h4" sx={{ fontSize: { xs: 24, md: 30 } }}>
            Featured Games
          </Typography>
          {data && (
            <Typography variant="caption" color="text.secondary" sx={{ letterSpacing: '0.06em' }}>
              {data.data.totalElements} TITLES
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
        ) : products.length === 0 && !isError ? (
          <EmptyState
            icon={<SportsEsportsIcon />}
            title="No games available yet"
            description="The catalog is empty right now. Check back soon for new titles."
          />
        ) : (
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        )}

        {totalPages > 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <Pagination
              count={totalPages}
              page={page + 1}
              onChange={(_, value) => setPage(value - 1)}
              shape="rounded"
            />
          </Box>
        )}
      </Container>
    </Box>
  );
}
