import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { HiUser, HiMenu, HiX } from 'react-icons/hi';
import webLogo from '../assets/webLogo.png';
import { useAuthStore, useCartStore } from '../store/store';

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [cartBounce, setCartBounce] = useState(false);

  const { isAuthenticated, logout } = useAuthStore();
  const { items } = useCartStore();

  const location = useLocation();
  const accountRef = useRef();

  // ✅ MUST define before useRef
  const cartCount = items.reduce((t, i) => t + i.quantity, 0);
  const prevCount = useRef(cartCount);

  useEffect(() => {
    setMenuOpen(false);
    setAccountOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (cartCount > prevCount.current) {
      setCartBounce(true);
      setTimeout(() => setCartBounce(false), 400);
    }
    prevCount.current = cartCount;
  }, [cartCount]);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <header className="bg-gradient-to-br from-purple-950 via-purple-900 to-purple-950 shadow-2xl w-full text-white p-1 fixed top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">

        {/* LOGO */}
        <Link to="/" className="flex items-center">
          <img src={webLogo} alt="logo" className="w-16 h-16 mr-2" />
          <h1 className="hidden sm:block text-xl font-bold">
            Bilal Online Store
          </h1>
        </Link>

        {/* MOBILE TOP RIGHT */}
        <div className="flex items-center space-x-4 md:hidden">

          {/* ✅ YOUR ORIGINAL CART ICON (UNCHANGED) */}
          <Link
            to="/cart"
            className={`relative flex items-center transition-transform duration-300 ${
              cartBounce ? 'scale-110' : ''
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 0 0 4.25 22.5h15.5a1.875 1.875 0 0 0 1.865-2.071l-1.263-12a1.875 1.875 0 0 0-1.865-1.679H16.5V6a4.5 4.5 0 1 0-9 0ZM12 3a3 3 0 0 0-3 3v.75h6V6a3 3 0 0 0-3-3Zm-3 8.25a3 3 0 1 0 6 0v-.75a.75.75 0 0 1 1.5 0v.75a4.5 4.5 0 1 1-9 0v-.75a.75.75 0 0 1 1.5 0v.75Z"
                clipRule="evenodd"
              />
            </svg>

            {/* Badge */}
            {cartCount > 0 && (
              <span
                className={`absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full transition-all duration-300 ${
                  cartBounce ? 'animate-bounce' : ''
                }`}
              >
                {cartCount}
              </span>
            )}
          </Link>

          {/* MENU */}
          <button onClick={toggleMenu} className="text-2xl">
            {menuOpen ? <HiX /> : <HiMenu />}
          </button>
        </div>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex space-x-8">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/products/t-shirts">T-Shirts</Link>
          <Link to="/products/jeans">Jeans</Link>
          <Link to="/products/shoes">Shoes</Link>
        </nav>

        {/* DESKTOP RIGHT */}
        <div className="hidden md:flex items-center space-x-6">

          {/* SAME CART ICON */}
          <Link
            to="/cart"
            className={`relative flex items-center transition-transform duration-300 ${
              cartBounce ? 'scale-110' : ''
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
            >
              <path
                fillRule="evenodd"
                d="M7.5 6v.75H5.513c-.96 0-1.764.724-1.865 1.679l-1.263 12A1.875 1.875 0 0 0 4.25 22.5h15.5a1.875 1.875 0 0 0 1.865-2.071l-1.263-12a1.875 1.875 0 0 0-1.865-1.679H16.5V6a4.5 4.5 0 1 0-9 0ZM12 3a3 3 0 0 0-3 3v.75h6V6a3 3 0 0 0-3-3Zm-3 8.25a3 3 0 1 0 6 0v-.75a.75.75 0 0 1 1.5 0v.75a4.5 4.5 0 1 1-9 0v-.75a.75.75 0 0 1 1.5 0v.75Z"
                clipRule="evenodd"
              />
            </svg>

            {cartCount > 0 && (
              <span
                className={`absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full transition-all duration-300 ${
                  cartBounce ? 'animate-bounce' : ''
                }`}
              >
                {cartCount}
              </span>
            )}
          </Link>

          {/* USER */}
          {isAuthenticated ? (
            <div className="relative" ref={accountRef}>
              <button
                onClick={() => setAccountOpen(!accountOpen)}
                className="text-2xl"
              >
                <HiUser />
              </button>

              {accountOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-purple-800 rounded shadow-lg py-2">
                  <Link to="/account" className="block px-4 py-2 hover:bg-purple-700">
                    My Account
                  </Link>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 hover:bg-purple-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex space-x-4">
              <Link to="/login">Login</Link>
              <Link to="/signup">Signup</Link>
            </div>
          )}
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden bg-purple-900 mt-2 mx-3 rounded-xl shadow-lg overflow-hidden">
          
          {/* NAV LINKS */}
          <div className="flex flex-col">
            <Link className="px-5 py-3 hover:bg-purple-800 transition" to="/">
              Home
            </Link>
            <Link className="px-5 py-3 hover:bg-purple-800 transition" to="/products">
              Products
            </Link>
            <Link className="px-5 py-3 hover:bg-purple-800 transition" to="/products/t-shirts">
              T-Shirts
            </Link>
            <Link className="px-5 py-3 hover:bg-purple-800 transition" to="/products/jeans">
              Jeans
            </Link>
            <Link className="px-5 py-3 hover:bg-purple-800 transition" to="/products/shoes">
              Shoes
            </Link>
          </div>

          {/* DIVIDER */}
          <div className="border-t border-purple-700" />

          {/* AUTH SECTION */}
          <div className="flex flex-col">
            {isAuthenticated ? (
              <>
                <Link className="px-5 py-3 hover:bg-purple-800 transition" to="/account">
                  My Account
                </Link>
                <button
                  onClick={logout}
                  className="text-left px-5 py-3  transition bg-red-500 hover:bg-red-700 text-white w-min rounded-2xl"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link className="px-5 py-3 hover:bg-purple-800 transition" to="/login">
                  Login
                </Link>
                <Link className="px-5 py-3 hover:bg-purple-800 transition" to="/signup">
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;