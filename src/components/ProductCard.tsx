import {
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  Box,
  Rating,
} from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';
import type { PaginatedProduct } from '../types/product';

const FALLBACK_IMG = 'https://placehold.co/616x353/f5f1ea/1c1a17?text=Game';

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
      sx={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer', overflow: 'hidden' }}
      onClick={() => navigate(`/products/${product.id}`)}
    >
      <Box sx={{ position: 'relative', overflow: 'hidden' }}>
        <CardMedia
          component="img"
          height="200"
          image={product.imageUrl ?? FALLBACK_IMG}
          alt={product.product}
          sx={{
            objectFit: 'cover',
            transition: 'transform 400ms ease',
            '.MuiCard-root:hover &': { transform: 'scale(1.04)' },
          }}
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            e.currentTarget.src = FALLBACK_IMG;
          }}
        />
      </Box>
      <CardContent sx={{ flexGrow: 1, pb: 1, pt: 2.5 }}>
        {product.brandname && (
          <Typography
            variant="caption"
            color="text.secondary"
            display="block"
            mb={0.75}
            sx={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: 10, fontWeight: 600 }}
          >
            {product.brandname}
          </Typography>
        )}
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            fontSize: 16,
            lineHeight: 1.3,
            letterSpacing: '-0.015em',
            mb: 1,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.5em',
          }}
        >
          {product.product}
        </Typography>
        {product.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              mb: 1.5,
              fontSize: 13,
              lineHeight: 1.55,
            }}
          >
            {product.description}
          </Typography>
        )}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mt: 1 }}>
          <Rating value={product.rating} precision={0.1} size="small" readOnly />
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
            {product.rating?.toFixed(1)}
          </Typography>
        </Box>
      </CardContent>
      <CardActions
        sx={{
          px: 2,
          pb: 2,
          pt: 1,
          justifyContent: 'space-between',
          alignItems: 'baseline',
          borderTop: '1px solid',
          borderColor: 'divider',
          mt: 1,
        }}
      >
        <Typography
          sx={{
            fontWeight: 700,
            fontSize: 17,
            letterSpacing: '-0.02em',
          }}
        >
          {formatPrice(product.price)}
        </Typography>
        <Button
          size="small"
          variant="text"
          endIcon={<ArrowForwardIcon sx={{ fontSize: '14px !important' }} />}
          onClick={handleAddToCart}
          sx={{ fontSize: 12, fontWeight: 600, px: 1 }}
        >
          Add
        </Button>
      </CardActions>
    </Card>
  );
}
