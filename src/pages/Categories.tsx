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
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Box sx={{ mb: 5, pb: 3, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography
          variant="caption"
          sx={{ textTransform: 'uppercase', letterSpacing: '0.18em', fontWeight: 600, color: 'secondary.main', fontSize: 11 }}
        >
          Index
        </Typography>
        <Typography variant="h3" sx={{ mt: 1.5, mb: 1, fontSize: { xs: 30, md: 40 } }}>Categories</Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 560 }}>
          Browse all game genres and platforms.
        </Typography>
      </Box>

      {isError && <Alert severity="error" sx={{ mb: 3 }}>Failed to load categories.</Alert>}

      {isLoading ? (
        <Grid container spacing={2}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Grid item key={i} xs={12} sm={6}>
              <Skeleton variant="rectangular" height={56} sx={{ borderRadius: 1 }} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {categories.map((cat) => (
            cat.subCategories?.length > 0 ? (
              <Accordion
                key={cat.id}
                disableGutters
                sx={{
                  bgcolor: 'background.paper',
                  border: '1px solid',
                  borderColor: 'divider',
                  '&:before': { display: 'none' },
                  borderRadius: '6px !important',
                  overflow: 'hidden',
                }}
              >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <CategoryIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                    <Typography
                      sx={{
                        fontWeight: 600,
                        fontSize: 15,
                        letterSpacing: '-0.015em',
                      }}
                    >
                      {cat.name}
                    </Typography>
                    <Chip label={cat.subCategories.length} size="small" variant="outlined" />
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
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1,
                  px: 3, py: 1.8,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  transition: 'border-color 200ms ease',
                  '&:hover': { borderColor: 'text.secondary' },
                }}
              >
                <CategoryIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                <Typography
                  sx={{
                    fontWeight: 600,
                    fontSize: 15,
                    letterSpacing: '-0.015em',
                  }}
                >
                  {cat.name}
                </Typography>
              </Box>
            )
          ))}
        </Box>
      )}

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
          <Pagination count={totalPages} page={page + 1} onChange={(_, v) => setPage(v - 1)} shape="rounded" />
        </Box>
      )}
    </Container>
  );
}
