import { Link } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';
import { useState } from 'react';
import webLogo from '../assets/webLogo.png';
import { useAuthStore, useCartStore } from '../store/store';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuthStore();
  const { items } = useCartStore();

  function handleLogout() {
    logout();
  }

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="bg-gradient-to-br from-purple-950 via-purple-900 to-purple-950 shadow-2xl w-full text-white p-1 fixed top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={webLogo} alt="Siraj Store" className="w-16 h-16 mr-2" />
          <h1 className="text-xl md:text-2xl font-bold hidden sm:block">
            Bilal Online Store
          </h1>
        </Link>

        {/* Mobile Menu Button */}
        
        <button 
          className="md:hidden text-white text-2xl"
          onClick={toggleMenu}
        >
          {menuOpen ? <HiX /> : <HiMenu />}
        </button>


        {/* Navigation Links (Desktop) */}
        <nav className="hidden md:flex space-x-8">
          <Link to="/" className="hover:text-purple-300 transition">Home</Link>
          <Link to="/products" className="hover:text-purple-300 transition">Products</Link>
          <Link to="/products/t-shirts" className="hover:text-purple-300 transition">T-Shirts</Link>
          <Link to="/products/jeans" className="hover:text-purple-300 transition">Jeans</Link>
          <Link to="/products/shoes" className="hover:text-purple-300 transition">Shoes</Link>
          <Link to="/about" className="hover:text-purple-300 transition">About</Link>
        </nav>

        {/* Auth & Cart (Desktop) */}
        <div className="hidden md:flex items-center space-x-6">
          {isAuthenticated ? (
            <div className="flex items-center space-x-4">
              <Link to="/account" className="hover:text-purple-300">
                {user?.name}
              </Link>
              <button 
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex space-x-4">
              <Link to="/login" className="hover:text-purple-300">Login</Link>
              <Link to="/signup" className="hover:text-purple-300">Signup</Link>
            </div>
          )}
          
          <Link to="/cart" className="relative hover:text-gray-300 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
              <path fillRule="evenodd" d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 0 0 4.25 22.5h15.5a1.875 1.875 0 0 0 1.865-2.071l-1.263-12a1.875 1.875 0 0 0-1.865-1.679H16.5V6a4.5 4.5 0 1 0-9 0ZM12 3a3 3 0 0 0-3 3v.75h6V6a3 3 0 0 0-3-3Zm-3 8.25a3 3 0 1 0 6 0v-.75a.75.75 0 0 1 1.5 0v.75a4.5 4.5 0 1 1-9 0v-.75a.75.75 0 0 1 1.5 0v.75Z" clipRule="evenodd" />
            </svg>
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {items.reduce((total, item) => total + item.quantity, 0)}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-purple-900 mt-4 py-4 px-4 rounded-lg">
          <nav className="flex flex-col space-y-4">
            <Link to="/" className="hover:text-purple-300">Home</Link>
            <Link to="/products" className="hover:text-purple-300">Products</Link>
            <Link to="/products/t-shirts" className="hover:text-purple-300">T-Shirts</Link>
            <Link to="/products/jeans" className="hover:text-purple-300">Jeans</Link>
            <Link to="/products/shoes" className="hover:text-purple-300">Shoes</Link>
            <Link to="/about" className="hover:text-purple-300">About</Link>

            
            
            <div className="border-t border-purple-700 pt-4 mt-4">
              {isAuthenticated ? (
                <div className="flex flex-col space-y-3">
                  <Link to="/account" className="hover:text-purple-300">
                    My Account
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="bg-red-600 hover:bg-red-700 px-3 py-2 rounded transition text-left"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col space-y-3">
                  <Link to="/login" className="hover:text-purple-300">Login</Link>
                  <Link to="/signup" className="hover:text-purple-300">Signup</Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;