import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#0070D1',
      light: '#3d9fe8',
      dark: '#004f9a',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#3d9fe8',
      contrastText: '#ffffff',
    },
    background: {
      default: '#111318',
      paper: '#1c1f26',
    },
    text: {
      primary: '#e6eaf2',
      secondary: '#7e8fa8',
    },
    divider: 'rgba(255,255,255,0.08)',
    error: { main: '#f04e5e' },
    success: { main: '#3dba6f' },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 700, letterSpacing: '-1px' },
    h2: { fontWeight: 700, letterSpacing: '-0.5px' },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#1c1f26',
          border: '1px solid rgba(255,255,255,0.07)',
          transition: 'border-color 0.2s, box-shadow 0.2s',
          '&:hover': {
            borderColor: 'rgba(0,112,209,0.5)',
            boxShadow: '0 4px 24px rgba(0,112,209,0.15)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { textTransform: 'none', fontWeight: 600, borderRadius: 8 },
        containedPrimary: {
          background: 'linear-gradient(135deg, #0070D1 0%, #004f9a 100%)',
          '&:hover': { background: 'linear-gradient(135deg, #3d9fe8 0%, #0070D1 100%)' },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#111318',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: 'none' },
      },
    },
    MuiChip: {
      styleOverrides: { root: { fontWeight: 600, borderRadius: 6 } },
    },
  },
});

export default theme;
