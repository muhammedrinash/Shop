import React from 'react';
import { ShoppingBag, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, addToCart }) => {
  return (
    <div className="group bg-zinc-900/40 border border-white/5 rounded-[2.5rem] p-6 transition-all duration-500 hover:border-premium-violet/50 hover:shadow-[0_0_50px_rgba(124,58,237,0.1)]">
      
      {/* Category Tag */}
      <div className="flex justify-between items-center mb-4">
         <span className="text-[9px] font-black uppercase tracking-[0.2em] bg-white/5 text-zinc-400 px-3 py-1 rounded-full">
           {product.category || 'Premium'}
         </span>
         <div className="flex items-center gap-1 text-amber-500 text-[10px] font-bold">
            <Star size={10} fill="currentColor" /> 4.9
         </div>
      </div>

      {/* Image Area */}
      <div className="h-60 flex items-center justify-center mb-6 relative overflow-hidden rounded-3xl">
        <Link to={`/product/${product._id}`} className="w-full h-full flex items-center justify-center">
          <img 
            src={product.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"} 
            className="max-h-full object-contain group-hover:scale-110 transition-transform duration-700"
          />
        </Link>
      </div>

      {/* Info */}
      <div className="mb-6">
        <h4 className="text-lg font-bold truncate">{product.name}</h4>
        <div className="flex justify-between items-center mt-2">
           <span className="text-2xl font-black">${product.price.toLocaleString()}</span>
           <span className="text-xs text-zinc-500 line-through">${(product.price * 1.2).toFixed(0)}</span>
        </div>
      </div>

      <button 
        onClick={() => addToCart(product)}
        className="w-full bg-white text-black font-bold py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-premium-violet hover:text-white transition-all active:scale-95"
      >
        <ShoppingBag size={18} />
        ADD TO BAG
      </button>
    </div>
  );
};

export default ProductCard;