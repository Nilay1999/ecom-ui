/**
 * Register page — fields mirror RegisterRequestDto (auth-service):
 *   email, password (min 8), firstName, lastName, phoneNumber (optional).
 * On success the user is logged in (tokens issued by /auth/register).
 * Profile extras (username/age/gender) are edited later on the Profile page.
 */
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
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { extractApiError } from '../utils/apiError';
import type { RegisterRequest } from '../types/auth';

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [form, setForm] = useState<RegisterRequest>({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phoneNumber: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(field: keyof RegisterRequest, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await register({ ...form, phoneNumber: form.phoneNumber || undefined });
      navigate('/', { replace: true });
    } catch (err) {
      setError(extractApiError(err, 'Registration failed. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3 }}>
          <PersonAddIcon color="primary" sx={{ fontSize: 32 }} />
          <Typography variant="h5" fontWeight={700}>
            Create Account
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
            onChange={(e) => handleChange('email', e.target.value)}
            inputProps={{ maxLength: 255 }}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Password"
            type="password"
            required
            fullWidth
            value={form.password}
            onChange={(e) => handleChange('password', e.target.value)}
            helperText="At least 8 characters"
            inputProps={{ minLength: 8 }}
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
            <TextField
              label="First Name"
              required
              fullWidth
              value={form.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
              inputProps={{ maxLength: 100 }}
            />
            <TextField
              label="Last Name"
              required
              fullWidth
              value={form.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
              inputProps={{ maxLength: 100 }}
            />
          </Box>

          <TextField
            label="Phone Number"
            fullWidth
            value={form.phoneNumber ?? ''}
            onChange={(e) => handleChange('phoneNumber', e.target.value)}
            sx={{ mb: 3 }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={submitting}
            startIcon={submitting ? <CircularProgress size={16} /> : <PersonAddIcon />}
          >
            {submitting ? 'Creating Account…' : 'Create Account'}
          </Button>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
          Already have an account?{' '}
          <MuiLink component={RouterLink} to="/login">
            Sign in
          </MuiLink>
        </Typography>
      </Paper>
    </Container>
  );
}
