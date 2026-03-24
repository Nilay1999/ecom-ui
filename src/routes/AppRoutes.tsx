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
import Orders from '../pages/Orders';
import OrderDetail from '../pages/OrderDetail';
import Profile from '../pages/Profile';

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
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/register" element={<Register />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/orders/:id" element={<OrderDetail />} />
      <Route path="/profile" element={<Profile />} />
    </Routes>
  );
}
