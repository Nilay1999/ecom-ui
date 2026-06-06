import { Box, Typography } from '@mui/material';
import type { ReactNode } from 'react';

interface Props {
  /** Small uppercase eyebrow above the title. */
  eyebrow?: string;
  title: string;
  subtitle?: string;
  /** Optional right-aligned content (e.g. result count, actions). */
  trailing?: ReactNode;
}

/**
 * Consistent editorial page header used across list/detail pages so
 * spacing, scale, and the eyebrow treatment don't drift page to page.
 */
export default function PageHeader({ eyebrow, title, subtitle, trailing }: Props) {
  return (
    <Box
      sx={{
        mb: { xs: 4, md: 5 },
        pb: 3,
        borderBottom: '1px solid',
        borderColor: 'divider',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        gap: 2,
        flexWrap: 'wrap',
      }}
    >
      <Box sx={{ minWidth: 0 }}>
        {eyebrow && (
          <Typography
            variant="caption"
            sx={{
              textTransform: 'uppercase',
              letterSpacing: '0.18em',
              fontWeight: 600,
              color: 'secondary.main',
              fontSize: 11,
              display: 'block',
            }}
          >
            {eyebrow}
          </Typography>
        )}
        <Typography variant="h3" sx={{ mt: eyebrow ? 1.5 : 0, mb: subtitle ? 1 : 0, fontSize: { xs: 28, md: 40 } }}>
          {title}
        </Typography>
        {subtitle && (
          <Typography color="text.secondary" sx={{ maxWidth: 560 }}>
            {subtitle}
          </Typography>
        )}
      </Box>
      {trailing && <Box sx={{ flexShrink: 0 }}>{trailing}</Box>}
    </Box>
  );
}
