import {
  Box,
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Button,
  Divider,
  Paper,
  Stack,
  TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';

export default function Cart() {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, totalAmount, clearCart } = useCart();

  if (items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <ShoppingCartIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
        <Typography variant="h5" color="text.secondary" gutterBottom>
          Your cart is empty
        </Typography>
        <Button variant="contained" onClick={() => navigate('/')} sx={{ mt: 2 }}>
          Browse Games
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" fontWeight={700} mb={4}>
        Shopping Cart
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: { md: '2fr 1fr' }, gap: 4 }}>
        {/* Items list */}
        <Paper sx={{ p: 0, overflow: 'hidden' }}>
          <List disablePadding>
            {items.map((item, idx) => (
              <Box key={item.productId}>
                {idx > 0 && <Divider />}
                <ListItem sx={{ py: 2, px: 3 }}>
                  <ListItemText
                    primary={
                      <Typography fontWeight={600}>{item.productName}</Typography>
                    }
                    secondary={
                      <Typography variant="body2" color="primary" fontWeight={700}>
                        {formatPrice(item.price)} each
                      </Typography>
                    }
                  />
                  <ListItemSecondaryAction sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton
                      size="small"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <TextField
                      value={item.quantity}
                      size="small"
                      inputProps={{ style: { textAlign: 'center', width: 32 } }}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val)) updateQuantity(item.productId, val);
                      }}
                      sx={{ width: 56 }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                    <Typography fontWeight={700} sx={{ minWidth: 80, textAlign: 'right' }}>
                      {formatPrice(item.price * item.quantity)}
                    </Typography>
                    <IconButton
                      edge="end"
                      color="error"
                      onClick={() => removeItem(item.productId)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              </Box>
            ))}
          </List>
        </Paper>

        {/* Order summary */}
        <Paper sx={{ p: 3, height: 'fit-content' }}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            Order Summary
          </Typography>
          <Divider sx={{ mb: 2 }} />

          <Stack spacing={1} mb={3}>
            {items.map((item) => (
              <Box key={item.productId} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: 180 }}>
                  {item.productName} × {item.quantity}
                </Typography>
                <Typography variant="body2">
                  {formatPrice(item.price * item.quantity)}
                </Typography>
              </Box>
            ))}
          </Stack>

          <Divider sx={{ mb: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Typography variant="h6" fontWeight={700}>
              Total
            </Typography>
            <Typography variant="h6" fontWeight={700} color="primary">
              {formatPrice(totalAmount)}
            </Typography>
          </Box>

          <Button
            variant="contained"
            fullWidth
            size="large"
            onClick={() => navigate('/checkout')}
            sx={{ mb: 1 }}
          >
            Proceed to Checkout
          </Button>
          <Button variant="text" color="error" fullWidth size="small" onClick={clearCart}>
            Clear Cart
          </Button>
        </Paper>
      </Box>
    </Container>
  );
}
