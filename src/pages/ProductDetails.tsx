import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Chip,
  Divider,
  Rating,
  Skeleton,
  Alert,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useProduct } from '../hooks/useProduct';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';

const FALLBACK_IMG = 'https://placehold.co/616x353/1c1f26/0070D1?text=Game';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const { data, isLoading, isError } = useProduct(id);
  const product = data?.data;

  function handleAddToCart() {
    if (!product) return;
    addItem({
      productId: product.id,
      productName: product.productName,
      price: product.price,
      imageUrl: product.productImages?.[0]?.imageUrl,
    });
  }

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Skeleton variant="rectangular" height={360} sx={{ borderRadius: 3 }} />
          </Grid>
          <Grid item xs={12} md={7}>
            <Skeleton variant="text" width="80%" height={48} />
            <Skeleton variant="text" width="40%" height={32} />
            <Skeleton variant="rectangular" height={120} sx={{ mt: 2, borderRadius: 2 }} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (isError || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Alert severity="error">Product not found.</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mt: 2 }}>
          Go Back
        </Button>
      </Container>
    );
  }

  const primaryImage =
    product.productImages?.find((img) => img.isPrimary)?.imageUrl ?? FALLBACK_IMG;

  const statusColor =
    product.status === 'ACTIVE' ? 'success' : product.status === 'OUT_OF_STOCK' ? 'error' : 'default';

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
        Back
      </Button>

      <Grid container spacing={5}>
        {/* Cover */}
        <Grid item xs={12} md={5}>
          <Box
            component="img"
            src={primaryImage}
            alt={product.productName}
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.src = FALLBACK_IMG;
            }}
            sx={{
              width: '100%',
              borderRadius: 3,
              border: '1px solid rgba(0,112,209,0.15)',
              objectFit: 'cover',
              aspectRatio: '16/9',
            }}
          />
        </Grid>

        {/* Details */}
        <Grid item xs={12} md={7}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 1 }}>
            {product.platform && (
              <Chip label={product.platform} size="small" variant="outlined" color="primary" />
            )}
            {product.genre && <Chip label={product.genre} size="small" variant="outlined" />}
            {product.productType && (
              <Chip
                label={product.productType}
                size="small"
                color={product.productType === 'DIGITAL' ? 'info' : 'default'}
              />
            )}
            <Chip label={product.status} size="small" color={statusColor as 'success' | 'error' | 'default'} />
          </Box>

          <Typography variant="h4" fontWeight={800} gutterBottom>
            {product.productName}
          </Typography>

          {product.developer && (
            <Typography variant="body2" color="text.secondary" mb={0.5}>
              Developer: <strong>{product.developer}</strong>
              {product.publisher && ` · Publisher: ${product.publisher}`}
            </Typography>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, my: 1 }}>
            <Rating value={product.rating ?? 0} precision={0.1} size="small" readOnly />
            <Typography variant="body2" color="text.secondary">
              {product.rating?.toFixed(1)}
            </Typography>
          </Box>

          <Typography variant="h3" color="primary" fontWeight={800} sx={{ my: 2 }}>
            {formatPrice(product.price)}
          </Typography>

          {product.description && (
            <Typography variant="body1" color="text.secondary" mb={3} sx={{ lineHeight: 1.8 }}>
              {product.description}
            </Typography>
          )}

          <Button
            variant="contained"
            size="large"
            startIcon={<AddShoppingCartIcon />}
            onClick={handleAddToCart}
            disabled={product.status === 'OUT_OF_STOCK'}
            sx={{ px: 4, py: 1.5, fontSize: 16 }}
          >
            {product.status === 'OUT_OF_STOCK' ? 'Out of Stock' : 'Add to Cart'}
          </Button>

          <Divider sx={{ my: 3 }} />

          <Table size="small">
            <TableBody>
              {product.esrbRating && (
                <TableRow>
                  <TableCell sx={{ color: 'text.secondary', border: 'none' }}>ESRB Rating</TableCell>
                  <TableCell sx={{ border: 'none' }}>{product.esrbRating}</TableCell>
                </TableRow>
              )}
              {product.releaseDate && (
                <TableRow>
                  <TableCell sx={{ color: 'text.secondary', border: 'none' }}>Release Date</TableCell>
                  <TableCell sx={{ border: 'none' }}>
                    {new Date(product.releaseDate).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              )}
              {product.region && (
                <TableRow>
                  <TableCell sx={{ color: 'text.secondary', border: 'none' }}>Region</TableCell>
                  <TableCell sx={{ border: 'none' }}>{product.region}</TableCell>
                </TableRow>
              )}
              {product.languageSupport && (
                <TableRow>
                  <TableCell sx={{ color: 'text.secondary', border: 'none' }}>Languages</TableCell>
                  <TableCell sx={{ border: 'none' }}>{product.languageSupport}</TableCell>
                </TableRow>
              )}
              {product.productType === 'DIGITAL' && product.digitalDownloadSize && (
                <TableRow>
                  <TableCell sx={{ color: 'text.secondary', border: 'none' }}>Download Size</TableCell>
                  <TableCell sx={{ border: 'none' }}>{product.digitalDownloadSize} GB</TableCell>
                </TableRow>
              )}
              {product.sku && (
                <TableRow>
                  <TableCell sx={{ color: 'text.secondary', border: 'none' }}>SKU</TableCell>
                  <TableCell sx={{ border: 'none' }}>{product.sku}</TableCell>
                </TableRow>
              )}
              <TableRow>
                <TableCell sx={{ color: 'text.secondary', border: 'none' }}>Stock</TableCell>
                <TableCell sx={{ border: 'none' }}>{product.stockQuantity} units</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Grid>
      </Grid>
    </Container>
  );
}
