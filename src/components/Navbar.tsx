import { useState } from 'react';
import {
  AppBar, Toolbar, IconButton, Badge, Box, Button,
  Drawer, List, ListItemButton, ListItemIcon, ListItemText, Divider,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingBagOutlined';
import PersonIcon from '@mui/icons-material/PersonOutline';
import DarkModeIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeIcon from '@mui/icons-material/LightModeOutlined';
import LogoutIcon from '@mui/icons-material/LogoutOutlined';
import LoginIcon from '@mui/icons-material/LoginOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import StorefrontIcon from '@mui/icons-material/StorefrontOutlined';
import BusinessIcon from '@mui/icons-material/BusinessOutlined';
import CategoryIcon from '@mui/icons-material/CategoryOutlined';
import ReceiptIcon from '@mui/icons-material/ReceiptLongOutlined';
import PixelCartLogo from './PixelCartLogo';
import SearchBar from './SearchBar';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useColorMode } from '../context/ColorModeContext';
import { useAuth } from '../context/AuthContext';

const NAV_LINKS = [
  { label: 'Store', path: '/', icon: <StorefrontIcon /> },
  { label: 'Brands', path: '/brands', icon: <BusinessIcon /> },
  { label: 'Categories', path: '/categories', icon: <CategoryIcon /> },
  { label: 'Orders', path: '/orders', icon: <ReceiptIcon /> },
];

export default function Navbar() {
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { mode, toggleColorMode } = useColorMode();
  const { isAuthenticated, logout } = useAuth();
  const [drawerOpen, setDrawerOpen] = useState(false);

  async function handleLogout() {
    setDrawerOpen(false);
    await logout();
    navigate('/');
  }

  function go(path: string) {
    setDrawerOpen(false);
    navigate(path);
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
      <Toolbar sx={{ gap: { xs: 1, md: 2 }, minHeight: { xs: 64, md: 72 } }}>
        {/* Mobile hamburger */}
        <IconButton
          edge="start"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open navigation menu"
          sx={{ color: 'text.primary', display: { xs: 'inline-flex', md: 'none' } }}
        >
          <MenuIcon />
        </IconButton>

        {/* Logo */}
        <Box
          sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          onClick={() => navigate('/')}
        >
          <PixelCartLogo size={30} showText />
        </Box>

        {/* Search — full search box on md+, hidden on xs (search lives in drawer/hero) */}
        <Box sx={{ flex: 1, display: { xs: 'none', sm: 'flex' }, justifyContent: 'center' }}>
          <SearchBar variant="pill" />
        </Box>

        <Box sx={{ flex: { xs: 1, sm: 0 } }} />

        {/* Desktop nav links */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
          {NAV_LINKS.map((link) => (
            <Button key={link.path} onClick={() => navigate(link.path)} sx={navLinkSx}>
              {link.label}
            </Button>
          ))}
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
        </Box>

        <IconButton
          onClick={toggleColorMode}
          sx={{ color: 'text.primary' }}
          size="small"
          aria-label={mode === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
        </IconButton>
        <IconButton
          onClick={() => navigate('/profile')}
          sx={{ color: 'text.primary' }}
          size="small"
          aria-label="View profile"
        >
          <PersonIcon />
        </IconButton>
        <IconButton
          onClick={() => navigate('/cart')}
          sx={{ color: 'text.primary' }}
          size="small"
          aria-label={`Cart, ${itemCount} item${itemCount === 1 ? '' : 's'}`}
        >
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

      {/* Mobile drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: 280 } }}
      >
        <Box sx={{ p: 2.5 }}>
          <PixelCartLogo size={28} showText />
        </Box>
        <Box sx={{ px: 2, pb: 1 }}>
          <SearchBar variant="pill" />
        </Box>
        <Divider sx={{ mt: 1 }} />
        <List>
          {NAV_LINKS.map((link) => (
            <ListItemButton key={link.path} onClick={() => go(link.path)}>
              <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>{link.icon}</ListItemIcon>
              <ListItemText primary={link.label} />
            </ListItemButton>
          ))}
          <ListItemButton onClick={() => go('/profile')}>
            <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}><PersonIcon /></ListItemIcon>
            <ListItemText primary="Profile" />
          </ListItemButton>
        </List>
        <Divider />
        <Box sx={{ p: 2 }}>
          {isAuthenticated ? (
            <Button
              fullWidth
              variant="outlined"
              startIcon={<LogoutIcon sx={{ fontSize: 16 }} />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          ) : (
            <Button
              fullWidth
              variant="contained"
              startIcon={<LoginIcon sx={{ fontSize: 16 }} />}
              onClick={() => go('/login')}
            >
              Sign In
            </Button>
          )}
        </Box>
      </Drawer>
    </AppBar>
  );
}
