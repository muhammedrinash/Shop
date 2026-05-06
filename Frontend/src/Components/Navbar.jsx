import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, LogOut } from 'lucide-react';

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
    if (searchQuery.trim()) navigate(`/store?search=${encodeURIComponent(searchQuery.trim())}`);
    else navigate('/store');
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
      <div className="text-center text-xs py-2 tracking-widest font-semibold"
        style={{ backgroundColor: '#1d4ed8', color: '#bfdbfe' }}>
        FREE SHIPPING ON ORDERS OVER $50 &nbsp;|&nbsp; USE CODE:{' '}
        <span className="font-bold text-white">WELCOME10</span>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-50 bg-white transition-shadow duration-300"
        style={{
          borderBottom: '1px solid #e2e8f0',
          boxShadow: scrolled ? '0 2px 16px rgba(37,99,235,0.08)' : '0 1px 3px rgba(0,0,0,0.04)'
        }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-1 shrink-0">
              <span className="text-2xl font-extrabold tracking-tight" style={{ color: '#1e293b' }}>VIL</span>
              <span className="text-2xl font-extrabold tracking-tight" style={{ color: '#2563eb' }}>UXE</span>
              <span className="w-1.5 h-1.5 rounded-full mb-3 ml-0.5" style={{ backgroundColor: '#2563eb' }}></span>
            </Link>

            {/* Desktop Nav Links */}
            <nav className="hidden md:flex items-center gap-8">
              {[['/', 'Home'], ['/store', 'Shop'], ['/orders', 'Orders']].map(([to, label]) => (
                <Link key={to} to={to}
                  className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors">
                  {label}
                </Link>
              ))}
              {user?.isAdmin && (
                <Link to="/admin" className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors">Admin</Link>
              )}
            </nav>

            {/* Right: search + icons */}
            <div className="flex items-center gap-4">
              {/* Search */}
              <form onSubmit={handleSearch}
                className="hidden lg:flex items-center rounded-lg overflow-hidden transition-all focus-within:ring-2 focus-within:ring-blue-200"
                style={{ border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="bg-transparent text-sm px-3 py-2 w-44 focus:outline-none text-slate-700"
                />
                <button type="submit" className="px-3 py-2 text-slate-400 hover:text-blue-600 transition-colors">
                  <Search size={16} />
                </button>
              </form>

              {/* User */}
              {user ? (
                <div className="hidden md:flex items-center gap-3">
                  <span className="text-sm font-semibold text-slate-700">Hi, {user.name?.split(' ')[0]}</span>
                  <button onClick={handleLogout} title="Sign Out"
                    className="text-slate-400 hover:text-blue-600 transition-colors">
                    <LogOut size={18} />
                  </button>
                </div>
              ) : (
                <Link to="/login"
                  className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-lg transition-colors text-white"
                  style={{ backgroundColor: '#2563eb' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1d4ed8'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2563eb'}>
                  Login
                </Link>
              )}

              {/* Cart */}
              <Link to="/cart" className="relative text-slate-600 hover:text-blue-600 transition-colors">
                <ShoppingBag size={22} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold"
                    style={{ backgroundColor: '#2563eb' }}>
                    {cartCount}
                  </span>
                )}
              </Link>

              {/* Mobile menu toggle */}
              <button className="md:hidden text-slate-600 hover:text-blue-600 transition-colors"
                onClick={() => setMenuOpen(!menuOpen)}>
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden px-4 py-4 flex flex-col gap-4 border-t border-slate-100 bg-white">
            <form onSubmit={handleSearch}
              className="flex items-center rounded-lg overflow-hidden"
              style={{ border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="bg-transparent text-sm px-3 py-2 flex-1 focus:outline-none text-slate-700"
              />
              <button type="submit" className="px-3 py-2 text-slate-400">
                <Search size={16} />
              </button>
            </form>
            {[['/', 'Home'], ['/store', 'Shop'], ['/orders', 'Orders']].map(([to, label]) => (
              <Link key={to} to={to} className="text-sm font-semibold text-slate-700 py-1"
                onClick={() => setMenuOpen(false)}>{label}</Link>
            ))}
            {user?.isAdmin && (
              <Link to="/admin" className="text-sm font-bold text-blue-600 py-1"
                onClick={() => setMenuOpen(false)}>Admin</Link>
            )}
            {user ? (
              <button onClick={handleLogout} className="text-left text-sm font-semibold text-slate-500 hover:text-blue-600 py-1">
                Sign Out ({user.name?.split(' ')[0]})
              </button>
            ) : (
              <Link to="/login"
                className="text-sm font-semibold text-white px-4 py-2 rounded-lg text-center"
                style={{ backgroundColor: '#2563eb' }}
                onClick={() => setMenuOpen(false)}>Login</Link>
            )}
          </div>
        )}

        {/* Category nav row */}
        <div className="hidden md:block border-t border-slate-100 bg-white">
          <div className="max-w-7xl mx-auto px-6 flex items-center gap-8 h-10">
            {[
              ['/store?search=fashion,shirt', 'Fashion'],
              ['/store?search=phone,laptop,tech,electronic', 'Electronics'],
              ['/store?search=accessory,watch,ring', 'Accessories'],
            ].map(([to, label]) => (
              <Link key={to} to={to}
                className="text-xs font-semibold text-slate-500 hover:text-blue-600 uppercase tracking-wider transition-colors whitespace-nowrap">
                {label}
              </Link>
            ))}
            <span className="ml-auto text-xs font-bold text-blue-600 uppercase tracking-wider">Sale</span>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;