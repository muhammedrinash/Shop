import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-auto" style={{ backgroundColor: '#1e293b', color: '#cbd5e1' }}>
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-1 mb-3">
            <span className="text-xl font-extrabold tracking-tight text-white">VIL</span>
            <span className="text-xl font-extrabold tracking-tight" style={{ color: '#60a5fa' }}>UXE</span>
            <span className="w-1.5 h-1.5 rounded-full mb-3 ml-0.5" style={{ backgroundColor: '#2563eb' }}></span>
          </div>
          <p className="text-sm leading-relaxed text-slate-400">
            Your one-stop shop for quality products at great prices.
          </p>
        </div>

        {/* Shop */}
        <div>
          <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-white">Shop</h4>
          <ul className="space-y-2">
            {[['Fashion', '/store?search=fashion'], ['Electronics', '/store?search=electronic,tech'], ['Accessories', '/store?search=accessory']].map(([label, to]) => (
              <li key={to}>
                <Link to={to} className="text-sm text-slate-400 hover:text-blue-400 transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Help */}
        <div>
          <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-white">Help</h4>
          <ul className="space-y-2">
            {[['Track Order', '/orders'], ['Returns', '#'], ['FAQ', '#'], ['Contact Us', '#']].map(([label, to]) => (
              <li key={label}>
                <Link to={to} className="text-sm text-slate-400 hover:text-blue-400 transition-colors">{label}</Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h4 className="font-bold text-sm uppercase tracking-wider mb-4 text-white">Stay Updated</h4>
          <p className="text-sm text-slate-400 mb-3">Subscribe to get special offers and updates.</p>
          <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ backgroundColor: '#334155', border: '1px solid #475569', color: '#e2e8f0' }}
            />
            <button type="submit"
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-colors"
              style={{ backgroundColor: '#2563eb' }}>
              Go
            </button>
          </form>
        </div>
      </div>

      <div style={{ borderTop: '1px solid #334155' }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} VILUXE. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="#" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
