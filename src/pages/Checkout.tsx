/**
 * Checkout page — places an order for the logged-in user.
 * Shipping/billing addresses are chosen from the user's saved addresses
 * (managed on the Profile page). Rendered behind ProtectedRoute.
 */
import { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Divider,
  Alert,
  MenuItem,
  TextField,
  CircularProgress,
  Stack,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { usePlaceOrder } from '../hooks/useOrders';
import { useUserAddresses } from '../hooks/useUsers';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/formatPrice';
import { extractApiError } from '../utils/apiError';
import type { CreateOrderRequest } from '../types/order';

const PAYMENT_METHODS = ['Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'Cash on Delivery'];

export default function Checkout() {
  const navigate = useNavigate();
  const { userId } = useAuth();
  const { items, totalAmount, clearCart } = useCart();
  const { data: addrData, isLoading: addrLoading } = useUserAddresses(userId ?? undefined);
  const placeOrder = usePlaceOrder();

  const addresses = addrData?.data ?? [];

  const [shippingAddressId, setShippingAddressId] = useState('');
  const [billingAddressId, setBillingAddressId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Default the selectors to the user's default (or first) address once loaded.
  useEffect(() => {
    if (addresses.length === 0) return;
    const preferred = addresses.find((a) => a.isDefault) ?? addresses[0];
    setShippingAddressId((prev) => prev || preferred.addressId);
    setBillingAddressId((prev) => prev || preferred.addressId);
  }, [addresses]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (items.length === 0) {
      setError('Your cart is empty.');
      return;
    }
    if (!userId || !shippingAddressId || !billingAddressId) {
      setError('Please select a shipping and billing address.');
      return;
    }

    const request: CreateOrderRequest = {
      userId,
      shippingAddressId,
      billingAddressId,
      paymentMethod,
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
    };

    try {
      await placeOrder.mutateAsync(request);
      clearCart();
      setSuccess(true);
    } catch (err) {
      setError(extractApiError(err, 'Failed to place order.'));
    }
  }

  if (success) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <Alert severity="success" sx={{ mb: 3 }}>
          Order placed successfully!
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
        <Stack spacing={3}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Shipping & Billing
            </Typography>

            {addrLoading ? (
              <CircularProgress size={20} />
            ) : addresses.length === 0 ? (
              <Box>
                <Alert severity="info" sx={{ mb: 2 }}>
                  You have no saved addresses. Add one before checking out.
                </Alert>
                <Button variant="outlined" onClick={() => navigate('/profile')}>
                  Manage Addresses
                </Button>
              </Box>
            ) : (
              <Stack spacing={2}>
                <TextField
                  select
                  label="Shipping Address"
                  fullWidth
                  value={shippingAddressId}
                  onChange={(e) => setShippingAddressId(e.target.value)}
                >
                  {addresses.map((a) => (
                    <MenuItem key={a.addressId} value={a.addressId}>
                      {a.addressLine1}, {a.city}, {a.state} — {a.pincode}
                      {a.isDefault ? ' (Default)' : ''}
                    </MenuItem>
                  ))}
                </TextField>
                <TextField
                  select
                  label="Billing Address"
                  fullWidth
                  value={billingAddressId}
                  onChange={(e) => setBillingAddressId(e.target.value)}
                >
                  {addresses.map((a) => (
                    <MenuItem key={a.addressId} value={a.addressId}>
                      {a.addressLine1}, {a.city}, {a.state} — {a.pincode}
                      {a.isDefault ? ' (Default)' : ''}
                    </MenuItem>
                  ))}
                </TextField>
              </Stack>
            )}
          </Paper>

          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" fontWeight={600} gutterBottom>
              Payment Method
            </Typography>
            <TextField
              select
              label="Payment Method"
              fullWidth
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
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
            disabled={placeOrder.isPending || addresses.length === 0}
            startIcon={placeOrder.isPending ? <CircularProgress size={16} /> : undefined}
          >
            {placeOrder.isPending ? 'Placing Order…' : 'Place Order'}
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}
