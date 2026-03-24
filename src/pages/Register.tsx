/**
 * Register page — form fields mirror CreateUserRequestDto exactly:
 *   email (@NotBlank, @Email, max 255)
 *   firstName (@NotBlank, max 100)
 *   lastName (optional, max 100)
 *   username (@NotBlank, max 100)
 *   age (optional int)
 *   gender (optional: MALE | FEMALE | OTHER)
 */
import { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  MenuItem,
  Paper,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useNavigate } from 'react-router-dom';
import { useCreateUser } from '../hooks/useUsers';
import type { CreateUserRequest, Gender } from '../types/user';

const GENDERS: { value: Gender; label: string }[] = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' },
];

export default function Register() {
  const navigate = useNavigate();
  const createUser = useCreateUser();

  const [form, setForm] = useState<CreateUserRequest>({
    email: '',
    firstName: '',
    lastName: '',
    username: '',
    age: undefined,
    gender: undefined,
  });
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleChange(field: keyof CreateUserRequest, value: string | number | undefined) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await createUser.mutateAsync(form);
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed. Please try again.');
    }
  }

  if (success) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <Alert severity="success" sx={{ mb: 3 }}>
          Account created successfully! Welcome to PixelCart 🎮
        </Alert>
        <Button variant="contained" onClick={() => navigate('/')}>
          Start Shopping
        </Button>
      </Container>
    );
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
              fullWidth
              value={form.lastName ?? ''}
              onChange={(e) => handleChange('lastName', e.target.value)}
              inputProps={{ maxLength: 100 }}
            />
          </Box>

          <TextField
            label="Username"
            required
            fullWidth
            value={form.username}
            onChange={(e) => handleChange('username', e.target.value)}
            inputProps={{ maxLength: 100 }}
            sx={{ mb: 2 }}
          />

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 3 }}>
            <TextField
              label="Age"
              type="number"
              fullWidth
              value={form.age ?? ''}
              onChange={(e) =>
                handleChange('age', e.target.value ? parseInt(e.target.value) : undefined)
              }
              inputProps={{ min: 1, max: 120 }}
            />
            <TextField
              select
              label="Gender"
              fullWidth
              value={form.gender ?? ''}
              onChange={(e) => handleChange('gender', e.target.value as Gender | undefined)}
            >
              <MenuItem value="">Prefer not to say</MenuItem>
              {GENDERS.map((g) => (
                <MenuItem key={g.value} value={g.value}>
                  {g.label}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            disabled={createUser.isPending}
            startIcon={createUser.isPending ? <CircularProgress size={16} /> : <PersonAddIcon />}
          >
            {createUser.isPending ? 'Creating Account…' : 'Create Account'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
