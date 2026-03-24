import { Grid, Skeleton, Card, CardContent } from '@mui/material';

interface Props {
  count?: number;
}

export default function ProductGridSkeleton({ count = 12 }: Props) {
  return (
    <Grid container spacing={3}>
      {Array.from({ length: count }).map((_, i) => (
        <Grid item key={i} xs={12} sm={6} md={4} lg={3}>
          <Card>
            <Skeleton variant="rectangular" height={160} />
            <CardContent>
              <Skeleton variant="text" width="80%" height={24} />
              <Skeleton variant="text" width="50%" height={18} />
              <Skeleton variant="text" width="90%" height={18} />
              <Skeleton variant="text" width="90%" height={18} />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
}
