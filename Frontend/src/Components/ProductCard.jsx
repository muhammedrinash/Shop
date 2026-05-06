import React from 'react';
import { ShoppingCart, Star, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, addToCart }) => {
  return (
    <div 
      className="group bg-white rounded-3xl overflow-hidden flex flex-col transition-all duration-500 hover:premium-shadow border border-slate-100 hover:border-blue-100 relative"
    >
      {/* Wishlist Button */}
      <button className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/80 backdrop-blur-md border border-slate-100 text-slate-400 hover:text-red-500 hover:scale-110 transition-all opacity-0 group-hover:opacity-100 translate-y-[-10px] group-hover:translate-y-0 shadow-sm">
        <Heart size={18} />
      </button>

      {/* Image Section */}
      <Link 
        to={`/product/${product._id}`}
        className="block relative overflow-hidden aspect-[4/5] bg-slate-50"
      >
        <img
          src={product.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"}
          alt={product.name}
          className="w-full h-full object-contain p-6 mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        
        {/* Category Badge */}
        {product.category && (
          <div className="absolute bottom-4 left-4">
            <span className="text-[10px] font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded-full bg-white text-slate-900 shadow-sm border border-slate-50">
              {product.category}
            </span>
          </div>
        )}

        {/* Quick View Overlay (Subtle) */}
        <div className="absolute inset-0 bg-slate-900/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      </Link>

      {/* Info Section */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 mb-2.5">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={12} fill={i < 4 ? "#f59e0b" : "none"} className={i < 4 ? "text-amber-400" : "text-slate-200"} />
            ))}
          </div>
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">4.9</span>
        </div>

        <Link to={`/product/${product._id}`} className="block mb-3">
          <h4 className="text-base font-bold text-slate-800 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
            {product.name}
          </h4>
        </Link>

        <div className="mt-auto pt-3 border-t border-slate-50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[11px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">Price</span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black text-slate-900">${product.price.toLocaleString()}</span>
              <span className="text-xs text-slate-300 line-through">${(product.price * 1.2).toFixed(0)}</span>
            </div>
          </div>

          <button
            onClick={() => addToCart(product)}
            className="p-3 rounded-2xl bg-slate-900 text-white hover:bg-blue-600 transition-all duration-300 shadow-lg shadow-slate-200 hover:shadow-blue-200 active:scale-90"
            title="Add to Cart"
          >
            <ShoppingCart size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;