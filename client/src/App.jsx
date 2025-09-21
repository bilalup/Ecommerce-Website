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

  if (isCheckingAuth) return (
  <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
    <div className="flex items-center space-x-3">
      <svg
        aria-hidden="true"
        role="status"
        className="w-6 h-6 text-blue-600 animate-spin"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 
          50 100.591C22.3858 100.591 0 78.2051 
          0 50.5908C0 22.9766 22.3858 0.59082 
          50 0.59082C77.6142 0.59082 100 22.9766 
          100 50.5908ZM9.08144 50.5908C9.08144 
          73.1895 27.4013 91.5094 50 91.5094C72.5987 
          91.5094 90.9186 73.1895 90.9186 
          50.5908C90.9186 27.9921 72.5987 
          9.67226 50 9.67226C27.4013 9.67226 
          9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 
          38.4038 97.8624 35.9116 97.0079 
          33.5539C95.2932 28.8227 92.871 
          24.3692 89.8167 20.348C85.8452 
          15.1192 80.8826 10.7238 75.2124 
          7.41289C69.5422 4.10194 63.2754 
          1.94025 56.7698 1.05124C51.7666 
          0.367541 46.6976 0.446843 41.7345 
          1.27873C39.2613 1.69328 37.813 
          4.19778 38.4501 6.62326C39.0873 
          9.04874 41.5694 10.4717 44.0505 
          10.1071C47.8511 9.54855 51.7191 
          9.52689 55.5402 10.0491C60.8642 
          10.7766 65.9928 12.5457 70.6331 
          15.2552C75.2735 17.9648 79.3347 
          21.5619 82.5849 25.841C84.9175 
          28.9121 86.7997 32.2913 88.1811 
          35.8758C89.083 38.2158 91.5421 
          39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span className="text-2xl font-extrabold text-gray-700 dark:text-gray-200">
        Loading
      </span>
    </div>
  </div>
);


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
          <p>© {yearDate} Bilal Online Store. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;