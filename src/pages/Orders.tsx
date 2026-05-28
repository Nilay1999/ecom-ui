/**
 * Orders page — shows paginated orders for the logged-in user.
 * Rendered behind ProtectedRoute, so userId is always present.
 */
import {
  Container,
  Typography,
  Box,
  Paper,
  Chip,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Skeleton,
  Alert,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useNavigate } from 'react-router-dom';
import { useOrdersByUser } from '../hooks/useOrders';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/formatPrice';
import type { OrderStatus } from '../types/order';

const STATUS_COLOR: Record<OrderStatus, 'default' | 'info' | 'warning' | 'success' | 'error' | 'primary'> = {
  PENDING: 'warning',
  CONFIRMED: 'info',
  PROCESSING: 'primary',
  SHIPPED: 'info',
  DELIVERED: 'success',
  CANCELLED: 'error',
};

export default function Orders() {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const { data, isLoading, isError } = useOrdersByUser(userId ?? undefined);
  const orders = data?.data?.content ?? [];

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" fontWeight={700} mb={4}>
        My Orders
      </Typography>

      {isError && (
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load orders.
        </Alert>
      )}

      {isLoading && (
        <Stack spacing={2}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} variant="rectangular" height={80} sx={{ borderRadius: 2 }} />
          ))}
        </Stack>
      )}

      {!isLoading && orders.length === 0 && (
        <Paper sx={{ p: 5, textAlign: 'center' }}>
          <Typography color="text.secondary">No orders yet.</Typography>
        </Paper>
      )}

      <Stack spacing={2}>
        {orders.map((order) => (
          <Accordion key={order.id} sx={{ backgroundImage: 'none' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1, flexWrap: 'wrap' }}>
                <Typography fontWeight={700} sx={{ minWidth: 160, cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
                  onClick={(e) => { e.stopPropagation(); navigate(`/orders/${order.id}`); }}>
                  #{order.orderNumber} <OpenInNewIcon sx={{ fontSize: 14, ml: 0.5, verticalAlign: 'middle' }} />
                </Typography>
                <Chip
                  label={order.orderStatus}
                  size="small"
                  color={STATUS_COLOR[order.orderStatus]}
                />
                <Typography color="text.secondary" variant="body2">
                  {new Date(order.createdAt).toLocaleDateString()}
                </Typography>
                <Typography fontWeight={700} color="primary" sx={{ ml: 'auto' }}>
                  {formatPrice(order.totalAmount)}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Divider sx={{ mb: 2 }} />
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Product</TableCell>
                    <TableCell align="right">Qty</TableCell>
                    <TableCell align="right">Unit Price</TableCell>
                    <TableCell align="right">Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.productName}</TableCell>
                      <TableCell align="right">{item.quantity}</TableCell>
                      <TableCell align="right">{formatPrice(item.priceAtPurchase)}</TableCell>
                      <TableCell align="right">{formatPrice(item.subtotal)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Typography fontWeight={700}>
                  Total: {formatPrice(order.totalAmount)}
                </Typography>
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Stack>
    </Container>
  );
}
