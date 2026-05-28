import { BrowserRouter } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Box } from '@mui/material';
import { queryClient } from './config/queryClient';
import { ColorModeProvider } from './context/ColorModeContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ColorModeProvider>
        <AuthProvider>
          <CartProvider>
            <BrowserRouter>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  minHeight: '100vh',
                  bgcolor: 'background.default',
                }}
              >
                <Navbar />
                <Box component="main" sx={{ flex: 1 }}>
                  <AppRoutes />
                </Box>
                <Footer />
              </Box>
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </ColorModeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
