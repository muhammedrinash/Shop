import React from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, addToCart }) => {
  return (
    <div className="group bg-white rounded-xl overflow-hidden flex flex-col transition-all duration-300 hover:shadow-lg"
      style={{ border: '1px solid #e2e8f0' }}>

      {/* Image */}
      <Link to={`/product/${product._id}`}
        className="block relative overflow-hidden aspect-square"
        style={{ backgroundColor: '#f8fafc' }}>
        <img
          src={product.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"}
          alt={product.name}
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
        />
        {product.category && (
          <span className="absolute top-3 left-3 text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full bg-white text-blue-600"
            style={{ border: '1px solid #bfdbfe' }}>
            {product.category}
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-1 mb-1">
          <Star size={11} fill="#f59e0b" className="text-amber-400" />
          <span className="text-xs text-slate-400 font-medium">4.9</span>
        </div>

        <Link to={`/product/${product._id}`}>
          <h4 className="text-sm font-semibold text-slate-800 leading-snug hover:text-blue-600 transition-colors line-clamp-2 mb-2">
            {product.name}
          </h4>
        </Link>

        <div className="mt-auto flex items-center justify-between pt-2">
          <div>
            <span className="text-lg font-bold text-slate-900">${product.price.toLocaleString()}</span>
            <span className="text-xs text-slate-400 line-through ml-2">${(product.price * 1.2).toFixed(0)}</span>
          </div>
        </div>

        <button
          onClick={() => addToCart(product)}
          className="mt-3 w-full text-white text-sm font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors duration-200"
          style={{ backgroundColor: '#2563eb' }}
          onMouseEnter={e => e.currentTarget.style.backgroundColor = '#1d4ed8'}
          onMouseLeave={e => e.currentTarget.style.backgroundColor = '#2563eb'}>
          <ShoppingCart size={15} />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;