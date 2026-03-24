import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Typography, Box, Avatar, Chip, Grid, Button,
  Skeleton, Alert, Card, CardMedia, CardContent, CardActions,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StoreIcon from '@mui/icons-material/Store';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { useBrand } from '../hooks/useBrands';
import { useQuery } from '@tanstack/react-query';
import { getProductsByBrand } from '../api/brandService';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/formatPrice';

const FALLBACK_IMG = 'https://placehold.co/616x353/1c1f26/0070D1?text=Game';

export default function BrandDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const { data: brandData, isLoading: brandLoading, isError: brandError } = useBrand(id);
  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['brands', id, 'products'],
    queryFn: () => getProductsByBrand(id!),
    enabled: !!id,
  });

  const brand = brandData?.data;
  const products = productsData?.data ?? [];

  if (brandError) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Alert severity="error">Brand not found.</Alert>
        <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/brands')} sx={{ mt: 2 }}>Back to Brands</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/brands')} sx={{ mb: 3, color: 'text.secondary' }}>
        All Brands
      </Button>

      {/* Brand header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 5 }}>
        {brandLoading ? (
          <Skeleton variant="circular" width={80} height={80} />
        ) : (
          <Avatar src={brand?.logoUrl ?? undefined} sx={{ width: 80, height: 80, bgcolor: 'primary.dark' }}>
            <StoreIcon sx={{ fontSize: 40 }} />
          </Avatar>
        )}
        <Box>
          {brandLoading ? (
            <>
              <Skeleton width={200} height={40} />
              <Skeleton width={300} height={24} />
            </>
          ) : (
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5 }}>
                <Typography variant="h4" fontWeight={800}>{brand?.name}</Typography>
                <Chip label={brand?.active ? 'Active' : 'Inactive'} size="small" color={brand?.active ? 'success' : 'default'} />
              </Box>
              {brand?.description && (
                <Typography color="text.secondary" maxWidth={600}>{brand.description}</Typography>
              )}
            </>
          )}
        </Box>
      </Box>

      {/* Products */}
      <Typography variant="h5" fontWeight={700} mb={3}>
        Games by {brand?.name ?? '…'}
        {!productsLoading && <Chip label={products.length} size="small" sx={{ ml: 1 }} />}
      </Typography>

      {productsLoading ? (
        <Grid container spacing={3}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Grid item key={i} xs={12} sm={6} md={4} lg={3}>
              <Skeleton variant="rectangular" height={260} sx={{ borderRadius: 2 }} />
            </Grid>
          ))}
        </Grid>
      ) : products.length === 0 ? (
        <Typography color="text.secondary">No products found for this brand.</Typography>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4} lg={3}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
                onClick={() => navigate(`/products/${product.id}`)}>
                <CardMedia
                  component="img"
                  height="160"
                  image={product.productImages?.[0]?.imageUrl ?? FALLBACK_IMG}
                  alt={product.productName}
                  sx={{ objectFit: 'cover' }}
                  onError={(e: React.SyntheticEvent<HTMLImageElement>) => { e.currentTarget.src = FALLBACK_IMG; }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography fontWeight={700} noWrap gutterBottom>{product.productName}</Typography>
                  {product.platform && <Chip label={product.platform} size="small" variant="outlined" sx={{ mb: 1 }} />}
                  <Typography variant="h6" color="primary" fontWeight={700}>{formatPrice(product.price)}</Typography>
                </CardContent>
                <CardActions sx={{ px: 2, pb: 2, pt: 0 }}>
                  <Button
                    size="small" variant="contained" startIcon={<AddShoppingCartIcon />}
                    onClick={(e) => { e.stopPropagation(); addItem({ productId: product.id, productName: product.productName, price: product.price }); }}
                    disabled={product.status === 'OUT_OF_STOCK'}
                  >
                    {product.status === 'OUT_OF_STOCK' ? 'Out of Stock' : 'Add to Cart'}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
