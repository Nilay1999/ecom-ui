import { useState } from 'react';
import {
  Container, Typography, Box, Grid, Chip, Skeleton, Alert,
  Accordion, AccordionSummary, AccordionDetails, Pagination,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CategoryIcon from '@mui/icons-material/Category';
import { useNavigate } from 'react-router-dom';
import { useCategoryTree } from '../hooks/useCategories';

export default function Categories() {
  const [page, setPage] = useState(0);
  const { data, isLoading, isError } = useCategoryTree(page, 20);
  const categories = data?.data?.content ?? [];
  const totalPages = data?.data?.totalPages ?? 1;
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" fontWeight={700} mb={1}>Categories</Typography>
      <Typography color="text.secondary" mb={4}>Browse all game genres and platforms</Typography>

      {isError && <Alert severity="error" sx={{ mb: 3 }}>Failed to load categories.</Alert>}

      {isLoading ? (
        <Grid container spacing={2}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Grid item key={i} xs={12} sm={6}>
              <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {categories.map((cat) => (
            cat.subCategories?.length > 0 ? (
              <Accordion key={cat.id} disableGutters sx={{ bgcolor: 'background.paper', border: '1px solid rgba(255,255,255,0.07)', '&:before': { display: 'none' }, borderRadius: '10px !important', overflow: 'hidden' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <CategoryIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                    <Typography fontWeight={600}>{cat.name}</Typography>
                    <Chip label={cat.subCategories.length} size="small" color="primary" variant="outlined" />
                  </Box>
                </AccordionSummary>
                <AccordionDetails sx={{ pt: 0 }}>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, pl: 4 }}>
                    {cat.subCategories.map((sub) => (
                      <Chip
                        key={sub.id}
                        label={sub.name}
                        clickable
                        onClick={() => navigate(`/?category=${sub.slug}`)}
                        variant="outlined"
                        size="small"
                      />
                    ))}
                  </Box>
                </AccordionDetails>
              </Accordion>
            ) : (
              <Box
                key={cat.id}
                onClick={() => navigate(`/?category=${cat.slug}`)}
                sx={{
                  bgcolor: 'background.paper',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 2,
                  px: 3, py: 1.8,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  transition: 'border-color 0.2s',
                  '&:hover': { borderColor: 'rgba(0,112,209,0.5)' },
                }}
              >
                <CategoryIcon sx={{ color: 'primary.main', fontSize: 20 }} />
                <Typography fontWeight={600}>{cat.name}</Typography>
              </Box>
            )
          ))}
        </Box>
      )}

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <Pagination count={totalPages} page={page + 1} onChange={(_, v) => setPage(v - 1)} color="primary" shape="rounded" />
        </Box>
      )}
    </Container>
  );
}
