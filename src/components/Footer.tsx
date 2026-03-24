import { Box, Typography, Divider } from '@mui/material';
import SportsEsportsIcon from '@mui/icons-material/SportsEsports';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{ mt: 'auto', py: 4, px: 3, bgcolor: 'background.paper' }}
    >
      <Divider sx={{ mb: 3 }} />
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, justifyContent: 'center', mb: 1 }}>
        <SportsEsportsIcon sx={{ color: 'primary.main', fontSize: 20 }} />
        <Typography variant="body2" color="text.secondary">
          PixelCart — Your Gaming Universe
        </Typography>
      </Box>
      <Typography variant="caption" color="text.disabled" display="block" textAlign="center">
        &copy; {new Date().getFullYear()} PixelCart. All rights reserved.
      </Typography>
    </Box>
  );
}
