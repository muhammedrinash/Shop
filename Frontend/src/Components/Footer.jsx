import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#050505] border-t border-white/5 py-12 mt-auto">
      <div className="max-w-[1440px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        
        <div className="flex flex-col items-center md:items-start">
          <Link to="/" className="text-xl font-black tracking-[0.2em] uppercase text-white mb-2">
            VILUXE<span className="text-premium-violet">.</span>
          </Link>
          <p className="text-zinc-500 text-sm">Elevating your everyday lifestyle.</p>
        </div>

        <div className="flex items-center gap-8 text-sm font-bold uppercase tracking-widest text-zinc-400">
          <Link to="/store" className="hover:text-white transition-colors">Shop</Link>
          <Link to="#" className="hover:text-white transition-colors">About</Link>
          <Link to="#" className="hover:text-white transition-colors">Contact</Link>
        </div>

      </div>
      
      <div className="max-w-[1440px] mx-auto px-6 mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-600">
        <p>&copy; {new Date().getFullYear()} VILUXE. All rights reserved.</p>
        <div className="flex gap-4">
          <Link to="#" className="hover:text-zinc-400 transition-colors">Privacy Policy</Link>
          <Link to="#" className="hover:text-zinc-400 transition-colors">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
