import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Footer from './Components/Footer';
import ProtectedRoute from './Components/ProtectedRoute';
import AdminRoute from './Components/AdminRoute';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Store from './pages/Store';
import SingleProduct from './pages/SingleProduct';
import OrderStatus from './pages/OrderStatus';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import API from '../services/api';

// Wrapper to hide Navbar/Footer on auth pages
const Layout = ({ cart, addToCart, removeFromCart, clearCart }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <>
      {!isAuthPage && !isAdminPage && <Navbar cartCount={cart.length} />}
      <main className="bg-[#050505] min-h-screen flex flex-col">
        <Routes>
          {/* Public auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Admin route */}
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

          {/* Protected routes — require login */}
          <Route path="/" element={<ProtectedRoute><Home addToCart={addToCart} /></ProtectedRoute>} />
          <Route path="/store" element={<ProtectedRoute><Store addToCart={addToCart} /></ProtectedRoute>} />
          <Route path="/product/:id" element={<ProtectedRoute><SingleProduct addToCart={addToCart} /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrderStatus /></ProtectedRoute>} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart
                  cart={cart}
                  removeFromCart={removeFromCart}
                  clearCart={clearCart}
                />
              </ProtectedRoute>
            }
          />
        </Routes>
        {!isAuthPage && !isAdminPage && <Footer />}
      </main>
    </>
  );
};

function App() {
  const [cart, setCart] = useState([]);
  const [cartId, setCartId] = useState(localStorage.getItem('cartId'));

  useEffect(() => {
    let currentCartId = cartId;
    if (!currentCartId) {
      currentCartId = 'cart_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('cartId', currentCartId);
      setCartId(currentCartId);
    }

    API.get(`/carts/${currentCartId}`)
      .then((res) => {
        if (res.data && res.data.items) {
          setCart(res.data.items);
        }
      })
      .catch((err) => console.error("Error fetching cart:", err));
  }, []);

  const syncCartWithDB = (newCart) => {
    setCart(newCart);
    if (cartId) {
      API.post(`/carts/${cartId}`, { items: newCart })
        .catch(err => console.error("Error syncing cart:", err));
    }
  };

  const addToCart = (product) => {
    const exists = cart.find((item) => item._id === product._id);
    if (exists) {
      alert("Item already in your bag!");
    } else {
      syncCartWithDB([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    syncCartWithDB(cart.filter((item) => item._id !== id));
  };

  const clearCart = () => syncCartWithDB([]);

  return (
    <BrowserRouter>
      <Layout
        cart={cart}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
      />
    </BrowserRouter>
  );
}

export default App;