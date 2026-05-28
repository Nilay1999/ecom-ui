import React, { useState } from 'react';
import {
  AppBar, Toolbar, IconButton, Badge,
  InputBase, Box, Button,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingBagOutlined';
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/PersonOutline';
import DarkModeIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeIcon from '@mui/icons-material/LightModeOutlined';
import LogoutIcon from '@mui/icons-material/LogoutOutlined';
import PixelCartLogo from './PixelCartLogo';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useColorMode } from '../context/ColorModeContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { mode, toggleColorMode } = useColorMode();
  const { isAuthenticated, logout } = useAuth();
  const [search, setSearch] = useState('');

  async function handleLogout() {
    await logout();
    navigate('/');
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (search.trim()) navigate(`/search?q=${encodeURIComponent(search.trim())}`);
  }

  const navLinkSx = {
    fontSize: 13,
    fontWeight: 500,
    color: 'text.primary',
    px: 1.5,
    '&:hover': { background: 'transparent', color: 'secondary.main' },
  };

  return (
    <AppBar position="sticky">
      <Toolbar sx={{ gap: 2, minHeight: { xs: 64, md: 72 } }}>
        {/* Logo */}
        <Box sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }} onClick={() => navigate('/')}>
          <PixelCartLogo size={30} showText />
        </Box>

        {/* Search */}
        <Box
          component="form"
          onSubmit={handleSearch}
          sx={{
            flex: 1, maxWidth: 420, mx: 'auto',
            display: 'flex', alignItems: 'center',
            bgcolor: 'action.hover',
            border: '1px solid',
            borderColor: 'transparent',
            borderRadius: 999,
            px: 2, py: 0.5,
            transition: 'background 150ms ease, border-color 150ms ease',
            '&:hover': { bgcolor: 'action.selected' },
            '&:focus-within': {
              bgcolor: 'background.paper',
              borderColor: 'divider',
            },
          }}
        >
          <SearchIcon sx={{ color: 'text.secondary', mr: 1, fontSize: 18 }} />
          <InputBase
            placeholder="Search games…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ flex: 1, fontSize: 13 }}
          />
        </Box>

        <Box sx={{ flex: 1 }} />

        {/* Nav links */}
        <Button onClick={() => navigate('/')} sx={navLinkSx}>Store</Button>
        <Button onClick={() => navigate('/brands')} sx={navLinkSx}>Brands</Button>
        <Button onClick={() => navigate('/categories')} sx={navLinkSx}>Categories</Button>
        <Button onClick={() => navigate('/orders')} sx={navLinkSx}>Orders</Button>
        {isAuthenticated ? (
          <Button
            variant="outlined"
            color="primary"
            onClick={handleLogout}
            startIcon={<LogoutIcon sx={{ fontSize: 16 }} />}
            sx={{ fontSize: 12, ml: 1 }}
          >
            Logout
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/login')}
            sx={{ fontSize: 12, ml: 1 }}
          >
            Sign In
          </Button>
        )}

        <IconButton
          onClick={toggleColorMode}
          sx={{ color: 'text.primary' }}
          size="small"
          aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
        <IconButton onClick={() => navigate('/profile')} sx={{ color: 'text.primary' }} size="small">
          <PersonIcon />
        </IconButton>
        <IconButton onClick={() => navigate('/cart')} sx={{ color: 'text.primary' }} size="small">
          <Badge
            badgeContent={itemCount}
            sx={{
              '& .MuiBadge-badge': {
                bgcolor: 'secondary.main',
                color: 'secondary.contrastText',
                fontWeight: 600,
                fontSize: 10,
                minWidth: 16,
                height: 16,
              },
            }}
          >
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}
