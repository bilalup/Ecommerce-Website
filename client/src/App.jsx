import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/store';
import Header from './Components/Header';
import HomePage from './pages/HomePage';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Account from './pages/Account';
import About from './pages/About';
import { useEffect } from 'react';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts.';
import EditProduct from './pages/admin/EditProduct';
import AddProduct from './pages/admin/AddProduct';
import Users from './pages/admin/Users';
import EditUser from './pages/admin/EditUser';

// Protected Admin Route Component
const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, isCheckingAuth } = useAuthStore();
  
  if (isCheckingAuth) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!user?.isAdmin) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};


// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isCheckingAuth } = useAuthStore();
  
  if (isCheckingAuth) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Public Route Component (for authenticated users trying to access login/signup)
const PublicRoute = ({ children }) => {
  const { isAuthenticated, isCheckingAuth } = useAuthStore();
  
  if (isCheckingAuth) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

function App() {
  const { isCheckingAuth, initializeAuth, checkAdminAuth } = useAuthStore();
  useEffect(() => {
    initializeAuth();
    checkAdminAuth();
  }, [initializeAuth, checkAdminAuth]);

  if (isCheckingAuth) return <h1>Checking authentication...</h1>;

  const yearDate = new Date().getFullYear();

  // app
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:category" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/about" element={<About />} />
          
          {/* Authentication Routes */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/signup" element={
            <PublicRoute>
              <Signup />
            </PublicRoute>
          } />
          
          {/* Protected Routes */}
          <Route path="/cart" element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } />
          <Route path="/account" element={
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          } />
          
          {/* 404 Route */}
          <Route path="*" element={<Navigate to="/" replace />} />

          {/* Admin Dashboard Route */}
          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />
          <Route path="/admin/products" element={
            <AdminRoute>
              <AdminProducts />
            </AdminRoute>
          } />
          <Route path="/admin/products/add" element={
            <AdminRoute>
              <AddProduct />
            </AdminRoute>
          } />
          <Route path="/admin/products/edit/:id" element={
            <AdminRoute>
              <EditProduct />
            </AdminRoute>
          } />
          <Route path="/admin/users" element={
            <AdminRoute>
              <Users />
            </AdminRoute>
          } />
          <Route path="/admin/users/edit/:id" element={
            <AdminRoute>
              <EditUser />
            </AdminRoute>
          } />
        </Routes>
      </main>
      
      {/* Footer Component - You'll need to create this */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© {yearDate} Siraj Online Store. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;