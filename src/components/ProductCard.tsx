import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  Chip,
  Box,
  Rating,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';
import type { PaginatedProduct } from '../types/product';

const FALLBACK_IMG = 'https://placehold.co/616x353/1c1f26/0070D1?text=Game';

interface Props {
  product: PaginatedProduct;
}

export default function ProductCard({ product }: Props) {
  const navigate = useNavigate();
  const { addItem } = useCart();

  function handleAddToCart(e: React.MouseEvent) {
    e.stopPropagation();
    addItem({ productId: product.id, productName: product.product, price: product.price });
  }

  return (
    <Card
      sx={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
      onClick={() => navigate(`/products/${product.id}`)}
    >
      <CardMedia
        component="img"
        height="180"
        image={product.imageUrl ?? FALLBACK_IMG}
        alt={product.product}
        sx={{ objectFit: 'cover' }}
        onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
          e.currentTarget.src = FALLBACK_IMG;
        }}
      />
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Typography variant="subtitle1" fontWeight={700} noWrap gutterBottom>
          {product.product}
        </Typography>
        {product.brandname && (
          <Typography variant="caption" color="text.secondary" display="block" mb={0.5}>
            {product.brandname}
          </Typography>
        )}
        {product.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              mb: 1,
            }}
          >
            {product.description}
          </Typography>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
          <Rating value={product.rating} precision={0.1} size="small" readOnly />
          <Typography variant="caption" color="text.secondary">
            {product.rating?.toFixed(1)}
          </Typography>
        </Box>
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2, pt: 0, justifyContent: 'space-between' }}>
        <Chip
          label={formatPrice(product.price)}
          color="primary"
          size="small"
          sx={{ fontWeight: 700, fontSize: 13 }}
        />
        <Button size="small" variant="contained" startIcon={<ShoppingCartIcon />} onClick={handleAddToCart}>
          Add
        </Button>
      </CardActions>
    </Card>
  );
}
