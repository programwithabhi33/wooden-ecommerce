import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Cart from './pages/Cart'
import Profile from './pages/Profile'
import OrderDetails from './pages/OrderDetails'
import ProductDetails from './pages/ProductDetails'
import AdminRoute from './components/AdminRoute'
import ProductList from './pages/admin/ProductList'
import ProductEdit from './pages/admin/ProductEdit'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/search/:keyword" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetails />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/order/:id" element={<OrderDetails />} />

      <Route path="/admin" element={<AdminRoute />}>
        <Route path="productlist" element={<ProductList />} />
        <Route path="product/:id/edit" element={<ProductEdit />} />
      </Route>
    </Routes>
  )
}

export default App
