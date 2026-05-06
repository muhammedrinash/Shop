import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, LogOut, User as UserIcon } from 'lucide-react';

const Navbar = ({ cartCount }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  const storedUser = localStorage.getItem('viluxe_user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
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
      {/* Premium Announcement Bar */}
      <div className="bg-slate-900 text-white text-[11px] py-2 px-6 flex justify-between items-center tracking-[0.1em] font-bold uppercase relative z-[60]">
        <div className="hidden sm:block">EST. 2024</div>
        <div className="mx-auto sm:mx-0">FREE WORLDWIDE SHIPPING OVER $150</div>
        <div className="hidden sm:flex gap-4">
          <Link to="#" className="hover:text-blue-400 transition-colors">SUPPORT</Link>
          <Link to="#" className="hover:text-blue-400 transition-colors">TRACKING</Link>
        </div>
      </div>

      {/* Main Navbar */}
      <header 
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled ? 'py-3 glass premium-shadow' : 'py-6 bg-white border-b border-slate-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          
          {/* Mobile Menu Toggle (Left) */}
          <button 
            className="md:hidden text-slate-900 hover:text-blue-600 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo (Center on Mobile, Left on Desktop) */}
          <Link to="/" className="flex items-center gap-1.5 absolute left-1/2 -translate-x-1/2 md:static md:translate-x-0 group">
            <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-all duration-300">
              <span className="text-white font-black text-lg">V</span>
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900 flex items-center">
              VIL<span className="text-blue-600">UXE</span>
            </span>
          </Link>

          {/* Desktop Nav Links (Center) */}
          <nav className="hidden md:flex items-center gap-10">
            {[['/', 'HOME'], ['/store', 'COLLECTIONS'], ['/orders', 'ORDERS']].map(([to, label]) => (
              <Link 
                key={to} 
                to={to}
                className="text-[12px] font-bold tracking-[0.15em] text-slate-500 hover:text-blue-600 transition-all relative group py-2"
              >
                {label}
                <span className="absolute bottom-0 left-0 w-0 h-[2px] bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-5 sm:gap-7">
            {/* Search (Desktop Only) */}
            <form onSubmit={handleSearch} className="hidden lg:flex items-center relative group">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search catalog..."
                className="bg-slate-50 text-[13px] font-medium pl-10 pr-4 py-2.5 rounded-full w-48 focus:w-64 focus:bg-white focus:ring-2 focus:ring-blue-100 transition-all border border-transparent focus:border-blue-200 outline-none"
              />
              <Search size={16} className="absolute left-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            </form>

            {/* Account */}
            <div className="flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3 group relative">
                  <button className="flex items-center gap-2 py-1.5 px-3 rounded-full hover:bg-slate-50 transition-all">
                    <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
                      <UserIcon size={18} />
                    </div>
                    <span className="hidden sm:block text-[13px] font-bold text-slate-700">{user.name?.split(' ')[0]}</span>
                  </button>
                  <button onClick={handleLogout} className="text-slate-400 hover:text-red-500 transition-colors">
                    <LogOut size={20} />
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login"
                  className="hidden sm:flex items-center gap-2 text-[13px] font-bold py-2.5 px-6 rounded-full bg-slate-900 text-white hover:bg-blue-600 transition-all premium-shadow active:scale-95"
                >
                  LOGIN
                </Link>
              )}
            </div>

            {/* Cart */}
            <Link to="/cart" className="relative group p-2 rounded-full hover:bg-slate-50 transition-all">
              <ShoppingBag size={24} className="text-slate-900 group-hover:text-blue-600 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-black border-2 border-white animate-premium-fade">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Sidebar Menu */}
        <div 
          className={`fixed inset-0 z-[100] transition-all duration-500 md:hidden ${
            menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setMenuOpen(false)}></div>
          <div 
            className={`absolute top-0 left-0 h-full w-4/5 max-w-sm bg-white shadow-2xl transition-transform duration-500 transform ${
              menuOpen ? 'translate-x-0' : '-translate-x-full'
            }`}
          >
            <div className="p-8 h-full flex flex-col">
              <div className="flex justify-between items-center mb-12">
                <span className="text-2xl font-black tracking-tighter">VIL<span className="text-blue-600">UXE</span></span>
                <button onClick={() => setMenuOpen(false)} className="p-2 bg-slate-50 rounded-full text-slate-400">
                  <X size={20} />
                </button>
              </div>

              <nav className="flex flex-col gap-8 flex-1">
                {[['/', 'HOME'], ['/store', 'COLLECTIONS'], ['/orders', 'MY ORDERS']].map(([to, label]) => (
                  <Link 
                    key={to} 
                    to={to} 
                    className="text-2xl font-black text-slate-900 hover:text-blue-600 transition-all flex items-center justify-between group"
                    onClick={() => setMenuOpen(false)}
                  >
                    {label}
                    <ChevronRight size={24} className="text-slate-200 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ))}
              </nav>

              <div className="pt-8 border-t border-slate-100">
                {!user && (
                  <Link 
                    to="/login" 
                    className="w-full py-4 bg-slate-900 text-white rounded-xl text-center font-bold tracking-[0.1em] block mb-4"
                    onClick={() => setMenuOpen(false)}
                  >
                    LOGIN / REGISTER
                  </Link>
                )}
                <div className="flex justify-center gap-6 text-slate-400">
                  <Link to="#" className="text-sm font-medium">Privacy</Link>
                  <Link to="#" className="text-sm font-medium">Terms</Link>
                  <Link to="#" className="text-sm font-medium">Contact</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

const ChevronRight = ({ className, size }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="m9 18 6-6-6-6"/>
  </svg>
);

export default Navbar;