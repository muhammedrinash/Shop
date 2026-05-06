import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, User, Menu, X, LogOut, ChevronDown } from 'lucide-react';

const Navbar = ({ cartCount }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  const storedUser = localStorage.getItem('viluxe_user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/store?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate(`/store`);
    }
    setMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('viluxe_token');
    localStorage.removeItem('viluxe_user');
    window.location.href = '/login';
  };

  return (
    <>
      {/* Top announcement bar */}
      <div className="bg-[#1a1a1a] text-white text-center text-xs py-2 tracking-widest font-medium">
        FREE SHIPPING ON ORDERS OVER $50 &nbsp;|&nbsp; USE CODE: <span className="font-bold text-[#e63946]">WELCOME10</span>
      </div>

      {/* Main Navbar */}
      <header className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${scrolled ? 'shadow-md' : 'shadow-sm'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-1 shrink-0">
              <span className="text-2xl font-extrabold tracking-tight text-[#1a1a1a]">VILUXE</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#e63946] mb-3 ml-0.5"></span>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-8">
              <Link to="/" className="text-sm font-semibold text-gray-700 hover:text-[#e63946] transition-colors">Home</Link>
              <Link to="/store" className="text-sm font-semibold text-gray-700 hover:text-[#e63946] transition-colors">Shop</Link>
              <Link to="/orders" className="text-sm font-semibold text-gray-700 hover:text-[#e63946] transition-colors">Orders</Link>
              {user?.isAdmin && (
                <Link to="/admin" className="text-sm font-bold text-[#e63946] hover:text-red-700 transition-colors">Admin</Link>
              )}
            </nav>

            {/* Right: search + icons */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <form onSubmit={handleSearch} className="hidden lg:flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50 focus-within:border-gray-400 focus-within:bg-white transition-all">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="bg-transparent text-sm px-3 py-2 w-44 focus:outline-none text-gray-700 placeholder:text-gray-400"
                />
                <button type="submit" className="px-3 py-2 text-gray-500 hover:text-[#e63946] transition-colors">
                  <Search size={16} />
                </button>
              </form>

              {/* User — only show when logged in */}
              {user && (
                <div className="hidden md:flex items-center gap-3">
                  <span className="text-sm font-semibold text-gray-700">Hi, {user.name?.split(' ')[0]}</span>
                  <button
                    onClick={handleLogout}
                    title="Sign Out"
                    className="text-gray-500 hover:text-[#e63946] transition-colors"
                  >
                    <LogOut size={18} />
                  </button>
                </div>
              )}

              {/* Cart */}
              <Link to="/cart" className="relative text-gray-700 hover:text-[#e63946] transition-colors">
                <ShoppingBag size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#e63946] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile menu toggle */}
              <button
                className="md:hidden text-gray-700 hover:text-[#e63946] transition-colors"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 flex flex-col gap-4">
            <form onSubmit={handleSearch} className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="bg-transparent text-sm px-3 py-2 flex-1 focus:outline-none text-gray-700"
              />
              <button type="submit" className="px-3 py-2 text-gray-500">
                <Search size={16} />
              </button>
            </form>
            <Link to="/" className="text-sm font-semibold text-gray-700 py-1" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/store" className="text-sm font-semibold text-gray-700 py-1" onClick={() => setMenuOpen(false)}>Shop</Link>
            <Link to="/orders" className="text-sm font-semibold text-gray-700 py-1" onClick={() => setMenuOpen(false)}>Orders</Link>
            {user?.isAdmin && (
              <Link to="/admin" className="text-sm font-bold text-[#e63946] py-1" onClick={() => setMenuOpen(false)}>Admin</Link>
            )}
            {user && (
              <button onClick={handleLogout} className="text-left text-sm font-semibold text-gray-500 hover:text-[#e63946] py-1">
                Sign Out ({user.name?.split(' ')[0]})
              </button>
            )}
          </div>
        )}

        {/* Category nav row */}
        <div className="hidden md:block border-t border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-6 flex items-center gap-8 h-10">
            <Link to="/store?search=fashion,shirt" className="text-xs font-semibold text-gray-600 hover:text-[#e63946] uppercase tracking-wider transition-colors whitespace-nowrap">Fashion</Link>
            <Link to="/store?search=phone,laptop,tech,electronic" className="text-xs font-semibold text-gray-600 hover:text-[#e63946] uppercase tracking-wider transition-colors whitespace-nowrap">Electronics</Link>
            <Link to="/store?search=accessory,watch,ring" className="text-xs font-semibold text-gray-600 hover:text-[#e63946] uppercase tracking-wider transition-colors whitespace-nowrap">Accessories</Link>
            <span className="ml-auto text-xs font-bold text-[#e63946] uppercase tracking-wider">Sale</span>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;