import { Box, Typography, Button } from '@mui/material';
import type { ReactNode } from 'react';

interface Props {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * Shared empty-state block (icon + message + optional CTA) so every
 * list page handles "nothing here" the same way the Cart does.
 */
export default function EmptyState({ icon, title, description, actionLabel, onAction }: Props) {
  return (
    <Box sx={{ textAlign: 'center', py: 8, px: 2 }}>
      {icon && (
        <Box sx={{ color: 'text.disabled', mb: 2, '& svg': { fontSize: 64 } }}>{icon}</Box>
      )}
      <Typography variant="h6" color="text.secondary" gutterBottom>
        {title}
      </Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 380, mx: 'auto', mb: 3 }}>
          {description}
        </Typography>
      )}
      {actionLabel && onAction && (
        <Button variant="contained" onClick={onAction} sx={{ mt: description ? 0 : 2 }}>
          {actionLabel}
        </Button>
      )}
    </Box>
  );
}
