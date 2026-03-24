/**
 * Checkout page — form fields mirror CreateOrderRequestDto exactly.
 * Uses usePlaceOrder() mutation; userId/addressId are stubbed until auth is wired.
 */
import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  Divider,
  Alert,
  MenuItem,
  CircularProgress,
  Stack,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { usePlaceOrder } from '../hooks/useOrders';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';
import type { CreateOrderRequest } from '../types/order';

const PAYMENT_METHODS = ['Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'Cash on Delivery'];

export default function Checkout() {
  const navigate = useNavigate();
  const { items, totalAmount, clearCart } = useCart();
  const placeOrder = usePlaceOrder();

  // Form state — mirrors CreateOrderRequestDto
  const [form, setForm] = useState({
    userId: '',          // UUID — populated from AuthContext in real flow
    shippingAddressId: '',  // UUID of selected address
    billingAddressId: '',
    paymentMethod: 'UPI',
    // Address fields (UI convenience — in real flow, user picks from saved addresses)
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    country: 'India',
    pincode: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (items.length === 0) {
      setError('Your cart is empty.');
      return;
    }

    // TODO: replace stub UUIDs with real IDs from auth / address selection
    const request: CreateOrderRequest = {
      userId: form.userId || '00000000-0000-0000-0000-000000000001',
      shippingAddressId: form.shippingAddressId || '00000000-0000-0000-0000-000000000002',
      billingAddressId: form.billingAddressId || '00000000-0000-0000-0000-000000000002',
      paymentMethod: form.paymentMethod,
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
    };

    try {
      await placeOrder.mutateAsync(request);
      clearCart();
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to place order.');
    }
  }

  if (success) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <Alert severity="success" sx={{ mb: 3 }}>
          Order placed successfully! 🎮
        </Alert>
        <Button variant="contained" onClick={() => navigate('/orders')}>
          View Orders
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" fontWeight={700} mb={4}>
        Checkout
      </Typography>

      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ display: 'grid', gridTemplateColumns: { md: '2fr 1fr' }, gap: 4 }}
      >
        {/* Shipping form */}
        <Stack spacing={3}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Shipping Address
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Address Line 1"
                  required
                  fullWidth
                  value={form.addressLine1}
                  onChange={(e) => handleChange('addressLine1', e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Address Line 2"
                  fullWidth
                  value={form.addressLine2}
                  onChange={(e) => handleChange('addressLine2', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="City"
                  required
                  fullWidth
                  value={form.city}
                  onChange={(e) => handleChange('city', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="State"
                  required
                  fullWidth
                  value={form.state}
                  onChange={(e) => handleChange('state', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Country"
                  required
                  fullWidth
                  value={form.country}
                  onChange={(e) => handleChange('country', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Pincode"
                  required
                  fullWidth
                  value={form.pincode}
                  onChange={(e) => handleChange('pincode', e.target.value)}
                />
              </Grid>
            </Grid>
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Payment Method
            </Typography>
            <TextField
              select
              label="Payment Method"
              fullWidth
              value={form.paymentMethod}
              onChange={(e) => handleChange('paymentMethod', e.target.value)}
            >
              {PAYMENT_METHODS.map((m) => (
                <MenuItem key={m} value={m}>
                  {m}
                </MenuItem>
              ))}
            </TextField>
          </Paper>
        </Stack>

        {/* Order summary */}
        <Paper sx={{ p: 3, height: 'fit-content' }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Order Summary
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Stack spacing={1} mb={3}>
            {items.map((item) => (
              <Box key={item.productId} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 160 }}>
                  {item.productName} × {item.quantity}
                </Typography>
                <Typography variant="body2">{formatPrice(item.price * item.quantity)}</Typography>
              </Box>
            ))}
          </Stack>

          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography fontWeight={700}>Total</Typography>
            <Typography fontWeight={700} color="primary">
              {formatPrice(totalAmount)}
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={placeOrder.isPending}
            startIcon={placeOrder.isPending ? <CircularProgress size={16} /> : undefined}
          >
            {placeOrder.isPending ? 'Placing Order…' : 'Place Order'}
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}
