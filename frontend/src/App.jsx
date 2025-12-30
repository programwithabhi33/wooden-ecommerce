import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Cart from './pages/Cart'
import Profile from './pages/Profile'
import OrderDetails from './pages/OrderDetails'

function App() {
  return (
    <div className="min-h-screen bg-primary-50 text-gray-800">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/order/:id" element={<OrderDetails />} />
      </Routes>
    </div>
  )
}

export default App
