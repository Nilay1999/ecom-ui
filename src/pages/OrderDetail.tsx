import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Button, Chip, Paper, Divider,
  Table, TableBody, TableCell, TableHead, TableRow, Skeleton, Alert, Grid,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useOrder, useCancelOrder } from '../hooks/useOrders';
import { formatPrice } from '../utils/formatPrice';
import type { OrderStatus } from '../types/order';

const STATUS_COLOR: Record<OrderStatus, 'default' | 'info' | 'warning' | 'success' | 'error' | 'primary'> = {
  PENDING: 'warning', CONFIRMED: 'info', PROCESSING: 'primary',
  SHIPPED: 'info', DELIVERED: 'success', CANCELLED: 'error',
};

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useOrder(id);
  const cancelOrder = useCancelOrder();
  const order = data?.data;

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Skeleton width={200} height={40} sx={{ mb: 3 }} />
        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2, mb: 2 }} />
        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
      </Container>
    );
  }

  if (isError || !order) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Alert severity="error">Order not found.</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/orders')} sx={{ mt: 2 }}>Back to Orders</Button>
      </Container>
    );
  }

  const canCancel = order.orderStatus === 'PENDING' || order.orderStatus === 'CONFIRMED';

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/orders')} sx={{ mb: 3, color: 'text.secondary' }}>
        All Orders
      </Button>

      {/* Order header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 2, mb: 4 }}>
        <Box>
          <Typography variant="h4" fontWeight={800}>Order #{order.orderNumber}</Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <Chip label={order.orderStatus} color={STATUS_COLOR[order.orderStatus]} sx={{ fontWeight: 700, fontSize: 14, px: 1 }} />
          {canCancel && (
            <Button
              variant="outlined" color="error" size="small"
              disabled={cancelOrder.isPending}
              onClick={() => cancelOrder.mutate(order.id, { onSuccess: () => navigate('/orders') })}
            >
              Cancel Order
            </Button>
          )}
        </Box>
      </Box>

      <Grid container spacing={3}>
        {/* Order items */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 0, overflow: 'hidden' }}>
            <Box sx={{ px: 3, py: 2, borderBottom: '1px solid', borderColor: 'divider' }}>
              <Typography fontWeight={700}>Items ({order.items.length})</Typography>
            </Box>
            <Table>
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
                  <TableRow
                    key={item.id}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/products/${item.productId}`)}
                  >
                    <TableCell>
                      <Typography fontWeight={600}>{item.productName}</Typography>
                    </TableCell>
                    <TableCell align="right">{item.quantity}</TableCell>
                    <TableCell align="right">{formatPrice(item.priceAtPurchase)}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>{formatPrice(item.subtotal)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </Grid>

        {/* Order summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography fontWeight={700} gutterBottom>Order Summary</Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography color="text.secondary">Subtotal</Typography>
              <Typography>{formatPrice(order.totalAmount)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography color="text.secondary">Shipping</Typography>
              <Typography color="success.main">Free</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography fontWeight={700}>Total</Typography>
              <Typography fontWeight={700} color="primary">{formatPrice(order.totalAmount)}</Typography>
            </Box>

            <Divider sx={{ my: 2 }} />
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>Payment Method</Typography>
            <Typography fontWeight={600}>{order.paymentMethod}</Typography>

            <Divider sx={{ my: 2 }} />
            <Typography variant="caption" color="text.secondary" display="block" gutterBottom>Last Updated</Typography>
            <Typography variant="body2">{new Date(order.updatedAt).toLocaleString()}</Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}
