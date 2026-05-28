/**
 * Profile page — covers:
 *   GET  /api/users/:id
 *   PATCH /api/users/profile  (UpdateUserProfileDto)
 *   Full address CRUD under /api/users/:userId/addresses
 */
import { useState } from 'react';
import {
  Container, Typography, Box, Grid, Paper, TextField, Button, MenuItem,
  Divider, Chip, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, Alert, Skeleton, CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import HomeIcon from '@mui/icons-material/Home';
import StarIcon from '@mui/icons-material/Star';
import { useUser, useUpdateProfile, useUserAddresses, useAddAddress, useDeleteAddress, useSetDefaultAddress } from '../hooks/useUsers';
import { useAuth } from '../context/AuthContext';
import type { Gender, AddressRequest } from '../types/user';

const GENDERS: { value: Gender; label: string }[] = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
  { value: 'OTHER', label: 'Other' },
];

const EMPTY_ADDRESS: AddressRequest = {
  addressLine1: '', addressLine2: '', city: '', state: '', country: 'India', pincode: '', isDefault: false,
};

export default function Profile() {
  const { userId } = useAuth();
  const { data: userData, isLoading: userLoading } = useUser(userId ?? undefined);
  const { data: addrData, isLoading: addrLoading } = useUserAddresses(userId ?? undefined);
  const updateProfile = useUpdateProfile();
  const addAddress = useAddAddress(userId ?? '');
  const deleteAddress = useDeleteAddress(userId ?? '');
  const setDefault = useSetDefaultAddress(userId ?? '');

  const user = userData?.data;
  const addresses = addrData?.data ?? [];

  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ firstName: '', lastName: '', age: '', gender: '' as Gender | '' });
  const [addrDialog, setAddrDialog] = useState(false);
  const [addrForm, setAddrForm] = useState<AddressRequest>(EMPTY_ADDRESS);
  const [profileError, setProfileError] = useState<string | null>(null);

  function openProfileEdit() {
    if (!user) return;
    setProfileForm({ firstName: user.firstName, lastName: user.lastName ?? '', age: user.age ? String(user.age) : '', gender: user.gender ?? '' });
    setEditingProfile(true);
  }

  async function handleProfileSave() {
    if (!user) return;
    setProfileError(null);
    try {
      await updateProfile.mutateAsync({
        userId: user.userId,
        firstName: profileForm.firstName || undefined,
        lastName: profileForm.lastName || undefined,
        age: profileForm.age ? parseInt(profileForm.age) : undefined,
        gender: (profileForm.gender as Gender) || undefined,
      });
      setEditingProfile(false);
    } catch {
      setProfileError('Failed to update profile.');
    }
  }

  async function handleAddAddress() {
    try {
      await addAddress.mutateAsync(addrForm);
      setAddrDialog(false);
      setAddrForm(EMPTY_ADDRESS);
    } catch { /* handled by mutation */ }
  }

  if (!userId) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h5" color="text.secondary" gutterBottom>Sign in to view your profile</Typography>
        <Button variant="contained" href="/register">Create Account</Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" fontWeight={700} mb={4}>My Profile</Typography>

      <Grid container spacing={4}>
        {/* Profile info */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={700}>Account Info</Typography>
              {!editingProfile && (
                <IconButton size="small" onClick={openProfileEdit}><EditIcon fontSize="small" /></IconButton>
              )}
            </Box>
            <Divider sx={{ mb: 3 }} />

            {userLoading ? (
              Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} height={40} sx={{ mb: 1 }} />)
            ) : editingProfile ? (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {profileError && <Alert severity="error">{profileError}</Alert>}
                <TextField label="First Name" value={profileForm.firstName} onChange={(e) => setProfileForm((p) => ({ ...p, firstName: e.target.value }))} fullWidth />
                <TextField label="Last Name" value={profileForm.lastName} onChange={(e) => setProfileForm((p) => ({ ...p, lastName: e.target.value }))} fullWidth />
                <TextField label="Age" type="number" value={profileForm.age} onChange={(e) => setProfileForm((p) => ({ ...p, age: e.target.value }))} fullWidth />
                <TextField select label="Gender" value={profileForm.gender} onChange={(e) => setProfileForm((p) => ({ ...p, gender: e.target.value as Gender }))} fullWidth>
                  <MenuItem value="">Prefer not to say</MenuItem>
                  {GENDERS.map((g) => <MenuItem key={g.value} value={g.value}>{g.label}</MenuItem>)}
                </TextField>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button variant="contained" onClick={handleProfileSave} disabled={updateProfile.isPending}
                    startIcon={updateProfile.isPending ? <CircularProgress size={16} /> : undefined}>Save</Button>
                  <Button onClick={() => setEditingProfile(false)}>Cancel</Button>
                </Box>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {[
                  { label: 'Name', value: `${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim() },
                  { label: 'Username', value: `@${user?.username}` },
                  { label: 'Email', value: user?.email },
                  { label: 'Age', value: user?.age ? String(user.age) : '—' },
                  { label: 'Gender', value: user?.gender ?? '—' },
                ].map(({ label, value }) => (
                  <Box key={label}>
                    <Typography variant="caption" color="text.secondary">{label}</Typography>
                    <Typography fontWeight={600}>{value}</Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Addresses */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" fontWeight={700}>Saved Addresses</Typography>
              <Button size="small" variant="outlined" startIcon={<AddIcon />} onClick={() => setAddrDialog(true)}>Add</Button>
            </Box>
            <Divider sx={{ mb: 3 }} />

            {addrLoading ? (
              Array.from({ length: 2 }).map((_, i) => <Skeleton key={i} height={100} sx={{ mb: 1, borderRadius: 2 }} />)
            ) : addresses.length === 0 ? (
              <Typography color="text.secondary">No saved addresses.</Typography>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {addresses.map((addr) => (
                  <Box key={addr.addressId} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, p: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 0.5 }}>
                        <HomeIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                        {addr.isDefault && <Chip icon={<StarIcon />} label="Default" size="small" color="primary" />}
                      </Box>
                      <Box sx={{ display: 'flex', gap: 0.5 }}>
                        {!addr.isDefault && (
                          <Button size="small" onClick={() => setDefault.mutate(addr.addressId)}>Set Default</Button>
                        )}
                        <IconButton size="small" color="error" onClick={() => deleteAddress.mutate(addr.addressId)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                    <Typography variant="body2">{addr.addressLine1}</Typography>
                    {addr.addressLine2 && <Typography variant="body2">{addr.addressLine2}</Typography>}
                    <Typography variant="body2" color="text.secondary">
                      {addr.city}, {addr.state} — {addr.pincode}, {addr.country}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>

      {/* Add address dialog */}
      <Dialog open={addrDialog} onClose={() => setAddrDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Address</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <TextField label="Address Line 1" required fullWidth value={addrForm.addressLine1} onChange={(e) => setAddrForm((p) => ({ ...p, addressLine1: e.target.value }))} />
          <TextField label="Address Line 2" fullWidth value={addrForm.addressLine2 ?? ''} onChange={(e) => setAddrForm((p) => ({ ...p, addressLine2: e.target.value }))} />
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField label="City" required value={addrForm.city} onChange={(e) => setAddrForm((p) => ({ ...p, city: e.target.value }))} />
            <TextField label="State" required value={addrForm.state} onChange={(e) => setAddrForm((p) => ({ ...p, state: e.target.value }))} />
            <TextField label="Country" required value={addrForm.country} onChange={(e) => setAddrForm((p) => ({ ...p, country: e.target.value }))} />
            <TextField label="Pincode" required value={addrForm.pincode} onChange={(e) => setAddrForm((p) => ({ ...p, pincode: e.target.value }))} />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setAddrDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddAddress} disabled={addAddress.isPending}>
            {addAddress.isPending ? <CircularProgress size={16} /> : 'Save Address'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
