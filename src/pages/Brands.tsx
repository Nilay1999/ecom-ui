import {
  Container, Typography, Grid, Box, Avatar,
  Skeleton, Alert, Pagination,
} from '@mui/material';
import StoreIcon from '@mui/icons-material/Store';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBrands } from '../hooks/useBrands';
import PageHeader from '../components/PageHeader';
import EmptyState from '../components/EmptyState';

export default function Brands() {
  const [page, setPage] = useState(0);
  const { data, isLoading, isError } = useBrands(page, 18);
  const brands = data?.data?.content ?? [];
  const totalPages = data?.data?.totalPages ?? 1;
  const navigate = useNavigate();

  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <PageHeader
        eyebrow="Publishers & Studios"
        title="Brands"
        subtitle="Browse games by the publishers and studios that made them — from indie labels to global houses."
      />

      {isError && <Alert severity="error" sx={{ mb: 3 }}>Failed to load brands.</Alert>}

      {!isLoading && !isError && brands.length === 0 ? (
        <EmptyState
          icon={<StoreIcon />}
          title="No brands yet"
          description="There are no publishers or studios to show right now. Explore the full catalog instead."
          actionLabel="Browse Games"
          onAction={() => navigate('/')}
        />
      ) : (
      <Grid container spacing={3}>
        {isLoading
          ? Array.from({ length: 12 }).map((_, i) => (
              <Grid item key={i} xs={12} sm={6} md={4} lg={3}>
                <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 1 }} />
              </Grid>
            ))
          : brands.map((brand) => (
              <Grid item key={brand.id} xs={12} sm={6} md={4} lg={3}>
                <Box
                  onClick={() => navigate(`/brands/${brand.id}`)}
                  sx={{
                    bgcolor: 'background.paper',
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 1,
                    p: 3,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    transition: 'border-color 200ms ease, transform 200ms ease',
                    '&:hover': { borderColor: 'text.secondary', transform: 'translateY(-2px)' },
                  }}
                >
                  <Avatar
                    src={brand.logoUrl ?? undefined}
                    sx={{
                      bgcolor: 'action.selected',
                      color: 'text.primary',
                      width: 48,
                      height: 48,
                    }}
                  >
                    <StoreIcon />
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: 15,
                        letterSpacing: '-0.015em',
                      }}
                      noWrap
                    >
                      {brand.name}
                    </Typography>
                    {brand.description && (
                      <Typography variant="caption" color="text.secondary" sx={{
                        display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      }}>
                        {brand.description}
                      </Typography>
                    )}
                  </Box>
                </Box>
              </Grid>
            ))}
      </Grid>
      )}

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <Pagination count={totalPages} page={page + 1} onChange={(_, v) => setPage(v - 1)} shape="rounded" />
        </Box>
      )}
    </Container>
  );
}
