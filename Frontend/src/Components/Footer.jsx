import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#1a1a1a] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-1 mb-3">
            <span className="text-xl font-extrabold tracking-tight">VILUXE</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#e63946] mb-3 ml-0.5"></span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Your one-stop shop for quality products at great prices.
          </p>
        </div>

        {/* Shop */}
        <div>
          <h4 className="font-bold text-sm uppercase tracking-wider mb-4">Shop</h4>
          <ul className="space-y-2">
            <li><Link to="/store?search=fashion" className="text-gray-400 text-sm hover:text-white transition-colors">Fashion</Link></li>
            <li><Link to="/store?search=electronic,tech" className="text-gray-400 text-sm hover:text-white transition-colors">Electronics</Link></li>
            <li><Link to="/store?search=accessory" className="text-gray-400 text-sm hover:text-white transition-colors">Accessories</Link></li>
          </ul>
        </div>

        {/* Help */}
        <div>
          <h4 className="font-bold text-sm uppercase tracking-wider mb-4">Help</h4>
          <ul className="space-y-2">
            <li><Link to="/orders" className="text-gray-400 text-sm hover:text-white transition-colors">Track Order</Link></li>
            <li><Link to="#" className="text-gray-400 text-sm hover:text-white transition-colors">Returns</Link></li>
            <li><Link to="#" className="text-gray-400 text-sm hover:text-white transition-colors">FAQ</Link></li>
            <li><Link to="#" className="text-gray-400 text-sm hover:text-white transition-colors">Contact Us</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-bold text-sm uppercase tracking-wider mb-4">Stay Updated</h4>
          <p className="text-gray-400 text-sm mb-3">Subscribe to get special offers and updates.</p>
          <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-gray-500"
            />
            <button type="submit" className="bg-[#e63946] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors">
              Go
            </button>
          </form>
        </div>
      </div>

      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} VILUXE. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="#" className="hover:text-gray-300 transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-gray-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
