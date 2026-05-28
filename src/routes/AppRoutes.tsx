import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import ProductDetails from '../pages/ProductDetails';
import SearchResults from '../pages/SearchResults';
import Brands from '../pages/Brands';
import BrandDetail from '../pages/BrandDetail';
import Categories from '../pages/Categories';
import Cart from '../pages/Cart';
import Checkout from '../pages/Checkout';
import Register from '../pages/Register';
import Login from '../pages/Login';
import Orders from '../pages/Orders';
import OrderDetail from '../pages/OrderDetail';
import Profile from '../pages/Profile';
import ProtectedRoute from '../components/ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/search" element={<SearchResults />} />
      <Route path="/brands" element={<Brands />} />
      <Route path="/brands/:id" element={<BrandDetail />} />
      <Route path="/categories" element={<Categories />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/checkout"
        element={
          <ProtectedRoute>
            <Checkout />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders"
        element={
          <ProtectedRoute>
            <Orders />
          </ProtectedRoute>
        }
      />
      <Route
        path="/orders/:id"
        element={
          <ProtectedRoute>
            <OrderDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
