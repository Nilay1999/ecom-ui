import { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  Divider,
  Link as MuiLink,
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import { useNavigate, useLocation, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { extractApiError } from '../utils/apiError';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const redirectTo = (location.state as { from?: string } | null)?.from ?? '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(form);
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(extractApiError(err, 'Invalid email or password.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <LoginIcon color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h5" fontWeight={700}>
            Sign In
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Email"
            type="email"
            required
            fullWidth
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Password"
            type="password"
            required
            fullWidth
            value={form.password}
            onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
            sx={{ mb: 3 }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={16} /> : <LoginIcon />}
          >
            {submitting ? 'Signing In…' : 'Sign In'}
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
          New to PixelCart?{' '}
          <MuiLink component={RouterLink} to="/register">
            Create an account
          </MuiLink>
        </Typography>
      </Paper>
    </Container>
  );
}
