import { useEffect, useState } from 'react';
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
  useTheme,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useProduct } from '../hooks/useProduct';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';
import { fallbackImageFor } from '../utils/placeholderImage';

export default function ProductDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const theme = useTheme();
  const FALLBACK_IMG = fallbackImageFor(theme.palette.mode);

  const { data, isLoading, isError } = useProduct(id);
  const product = data?.data;

  // Build the gallery: primary image first, then the rest.
  const images = product?.productImages ?? [];
  const gallery = [...images].sort((a, b) => Number(b.isPrimary) - Number(a.isPrimary));
  const [activeImage, setActiveImage] = useState(0);

  // Reset selection when navigating between products.
  useEffect(() => {
    setActiveImage(0);
  }, [id]);

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

  const activeUrl = gallery[activeImage]?.imageUrl ?? FALLBACK_IMG;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 3 }} variant="text">
        Back
      </Button>

      <Grid container spacing={6}>
        {/* Cover + thumbnail gallery */}
        <Grid item xs={12} md={5}>
          <Box
            component="img"
            src={activeUrl}
            alt={product.productName}
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.src = FALLBACK_IMG;
            }}
            sx={{
              width: '100%',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              objectFit: 'cover',
              aspectRatio: '16/9',
            }}
          />
          {gallery.length > 1 && (
            <Box sx={{ display: 'flex', gap: 1, mt: 1.5, flexWrap: 'wrap' }}>
              {gallery.map((img, i) => (
                <Box
                  key={img.id ?? i}
                  component="img"
                  src={img.imageUrl ?? FALLBACK_IMG}
                  alt={`${product.productName} screenshot ${i + 1}`}
                  onClick={() => setActiveImage(i)}
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                    e.currentTarget.src = FALLBACK_IMG;
                  }}
                  sx={{
                    width: 72,
                    height: 48,
                    objectFit: 'cover',
                    borderRadius: 1,
                    cursor: 'pointer',
                    border: '2px solid',
                    borderColor: i === activeImage ? 'secondary.main' : 'divider',
                    opacity: i === activeImage ? 1 : 0.7,
                    transition: 'opacity 150ms ease, border-color 150ms ease',
                    '&:hover': { opacity: 1 },
                  }}
                />
              ))}
            </Box>
          )}
        </Grid>

        {/* Details */}
        <Grid item xs={12} md={7}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 2.5 }}>
            {product.platform && (
              <Chip label={product.platform} size="small" variant="outlined" />
            )}
            {product.genre && <Chip label={product.genre} size="small" variant="outlined" />}
            {product.productType && (
              <Chip label={product.productType} size="small" variant="outlined" />
            )}
            <Chip
              label={product.status === 'ACTIVE' ? 'In stock' : product.status === 'OUT_OF_STOCK' ? 'Sold out' : product.status}
              size="small"
              variant="outlined"
              sx={{
                color:
                  product.status === 'ACTIVE'
                    ? 'success.main'
                    : product.status === 'OUT_OF_STOCK'
                    ? 'error.main'
                    : 'text.secondary',
                borderColor: 'currentColor',
              }}
            />
          </Box>

          <Typography
            variant="h2"
            sx={{ fontSize: { xs: 32, md: 44 }, lineHeight: 1.1, mb: 2 }}
          >
            {product.productName}
          </Typography>

          {product.developer && (
            <Typography variant="body2" color="text.secondary" mb={1.5}>
              {product.developer}
              {product.publisher && ` · ${product.publisher}`}
            </Typography>
          )}

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <Rating
              value={product.rating ?? 0}
              precision={0.1}
              size="small"
              readOnly
              aria-label={`Rated ${(product.rating ?? 0).toFixed(1)} out of 5`}
            />
            <Typography variant="caption" color="text.secondary">
              {product.rating?.toFixed(1)}
            </Typography>
          </Box>

          <Typography
            sx={{
              fontWeight: 700,
              fontSize: { xs: 28, md: 34 },
              letterSpacing: '-0.03em',
              my: 3,
            }}
          >
            {formatPrice(product.price)}
          </Typography>

          {product.description && (
            <Typography
              variant="body1"
              color="text.secondary"
              mb={4}
              sx={{ lineHeight: 1.8, maxWidth: 580 }}
            >
              {product.description}
            </Typography>
          )}

          <Button
            variant="contained"
            size="large"
            startIcon={<AddShoppingCartIcon />}
            onClick={handleAddToCart}
            disabled={product.status === 'OUT_OF_STOCK'}
            sx={{ px: 4, py: 1.4, fontSize: 14 }}
          >
            {product.status === 'OUT_OF_STOCK' ? 'Out of Stock' : 'Add to Cart'}
          </Button>

          <Divider sx={{ my: 4 }} />

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
