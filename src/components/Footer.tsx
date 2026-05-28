import { Box, Typography, Divider, Container } from '@mui/material';

export default function Footer() {
  return (
    <Box component="footer" sx={{ mt: 'auto', pt: 6, pb: 4, bgcolor: 'background.default' }}>
      <Container maxWidth="xl">
        <Divider sx={{ mb: 4 }} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
          }}
        >
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: 15,
              letterSpacing: '-0.02em',
            }}
          >
            PixelCart
          </Typography>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ letterSpacing: '0.04em' }}
          >
            &copy; {new Date().getFullYear()} — A curated gaming storefront.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
