import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, User, Menu, LogOut } from 'lucide-react';

const Navbar = ({ cartCount }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const storedUser = localStorage.getItem('viluxe_user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/store?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate(`/store`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('viluxe_token');
    localStorage.removeItem('viluxe_user');
    window.location.href = '/login';
  };

  return (
    <div className="fixed top-6 left-0 w-full z-50 flex justify-center px-4 pointer-events-none">
      <nav className="pointer-events-auto bg-black/40 backdrop-blur-3xl border border-white/10 rounded-full px-6 md:px-8 py-4 w-full max-w-5xl flex items-center justify-between shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)]">
        
        {/* Logo */}
        <Link to="/" className="text-xl font-black tracking-[0.2em] uppercase shrink-0 text-white">
          VILUXE<span className="text-premium-violet">.</span>
        </Link>

        {/* Center Links (Desktop) */}
        <div className="hidden md:flex items-center gap-10">
          <Link to="/" className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">Home</Link>
          <Link to="/store" className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">Shop</Link>
          <Link to="/orders" className="text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors">Orders</Link>
          {user?.isAdmin && (
            <Link to="/admin" className="text-xs font-black uppercase tracking-widest text-premium-violet hover:text-violet-400 transition-colors border-b border-premium-violet/40 pb-0.5">Admin</Link>
          )}
        </div>

        {/* Right Side - Search & Icons */}
        <div className="flex items-center gap-5 shrink-0">
          {/* Minimal Search */}
          <form onSubmit={handleSearch} className="hidden lg:flex items-center bg-white/5 border border-white/5 rounded-full px-4 py-2 focus-within:border-premium-violet/50 transition-colors">
            <Search className="text-zinc-500 w-4 h-4 mr-2" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..." 
              className="bg-transparent text-xs w-24 focus:w-32 transition-all focus:outline-none text-white placeholder:text-zinc-600"
            />
          </form>
          
          {/* Login / User */}
          {user ? (
            <div className="hidden md:flex items-center gap-3">
              <span className="text-xs font-bold text-zinc-300 uppercase tracking-widest">
                Hi, {user.name?.split(' ')[0]}
              </span>
              <button
                onClick={handleLogout}
                title="Sign Out"
                className="text-zinc-400 hover:text-red-400 transition-colors"
              >
                <LogOut size={18} strokeWidth={1.5} />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden md:flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-zinc-400 hover:text-white transition-colors"
            >
              <User size={16} strokeWidth={1.5} />
              Sign In
            </Link>
          )}

          <Link to="/cart" className="relative text-zinc-400 hover:text-white transition-colors">
            <ShoppingBag size={20} strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-premium-violet text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                {cartCount}
              </span>
            )}
          </Link>
          
          <Menu className="md:hidden text-zinc-400" size={24} strokeWidth={1.5} />
        </div>
      </nav>
    </div>
  );
};

export default Navbar;