import React, { useState } from 'react';
import {
  AppBar, Toolbar, IconButton, Badge,
  InputBase, Box, Button,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import PixelCartLogo from './PixelCartLogo';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const [search, setSearch] = useState('');

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) navigate(`/search?q=${encodeURIComponent(search.trim())}`);
  }

  return (
    <AppBar position="sticky" elevation={0}>
      <Toolbar sx={{ gap: 2 }}>
        {/* Logo */}
        <Box sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => navigate('/')}>
          <PixelCartLogo size={32} showText />
        </Box>

        {/* Search */}
        <Box
          component="form"
          onSubmit={handleSearch}
          sx={{
            flex: 1, maxWidth: 440, mx: 'auto',
            display: 'flex', alignItems: 'center',
            bgcolor: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 2, px: 2, py: 0.5,
            '&:focus-within': { borderColor: 'primary.main' },
          }}
        >
          <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 20 }} />
          <InputBase
            placeholder="Search games…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ flex: 1, fontSize: 14 }}
          />
        </Box>

        <Box sx={{ flex: 1 }} />

        {/* Nav links */}
        <Button onClick={() => navigate('/')} sx={{ fontSize: 13, color: 'text.secondary' }}>Store</Button>
        <Button onClick={() => navigate('/brands')} sx={{ fontSize: 13, color: 'text.secondary' }}>Brands</Button>
        <Button onClick={() => navigate('/categories')} sx={{ fontSize: 13, color: 'text.secondary' }}>Categories</Button>
        <Button onClick={() => navigate('/orders')} sx={{ fontSize: 13, color: 'text.secondary' }}>Orders</Button>
        <Button variant="contained" color="primary" onClick={() => navigate('/register')} sx={{ fontSize: 13 }}>
          Sign Up
        </Button>

        <IconButton onClick={() => navigate('/profile')} sx={{ color: 'text.secondary' }}>
          <PersonIcon />
        </IconButton>
        <IconButton onClick={() => navigate('/cart')} sx={{ color: 'text.secondary' }}>
          <Badge badgeContent={itemCount} color="primary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
