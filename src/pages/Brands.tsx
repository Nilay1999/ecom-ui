import {
  Container, Typography, Grid, Box, Chip, Avatar,
  Skeleton, Alert, Pagination,
} from '@mui/material';
import StoreIcon from '@mui/icons-material/Store';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBrands } from '../hooks/useBrands';

export default function Brands() {
  const [page, setPage] = useState(0);
  const { data, isLoading, isError } = useBrands(page, 18);
  const brands = data?.data?.content ?? [];
  const totalPages = data?.data?.totalPages ?? 1;
  const navigate = useNavigate();

  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      <Typography variant="h4" fontWeight={700} mb={1}>Brands</Typography>
      <Typography color="text.secondary" mb={4}>Browse games by publisher & developer</Typography>

      {isError && <Alert severity="error" sx={{ mb: 3 }}>Failed to load brands.</Alert>}

      <Grid container spacing={3}>
        {isLoading
          ? Array.from({ length: 12 }).map((_, i) => (
              <Grid item key={i} xs={12} sm={6} md={4} lg={3}>
                <Skeleton variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
              </Grid>
            ))
          : brands.map((brand) => (
              <Grid item key={brand.id} xs={12} sm={6} md={4} lg={3}>
                <Box
                  onClick={() => navigate(`/brands/${brand.id}`)}
                  sx={{
                    bgcolor: 'background.paper',
                    border: '1px solid rgba(255,255,255,0.07)',
                    borderRadius: 2,
                    p: 3,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    transition: 'border-color 0.2s, box-shadow 0.2s',
                    '&:hover': { borderColor: 'rgba(0,112,209,0.5)', boxShadow: '0 4px 20px rgba(0,112,209,0.12)' },
                  }}
                >
                  <Avatar src={brand.logoUrl ?? undefined} sx={{ bgcolor: 'primary.dark', width: 48, height: 48 }}>
                    <StoreIcon />
                  </Avatar>
                  <Box sx={{ minWidth: 0 }}>
                    <Typography fontWeight={700} noWrap>{brand.name}</Typography>
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

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <Pagination count={totalPages} page={page + 1} onChange={(_, v) => setPage(v - 1)} color="primary" shape="rounded" />
        </Box>
      )}
    </Container>
  );
}
