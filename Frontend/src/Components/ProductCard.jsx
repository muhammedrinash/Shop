import React from 'react';
import { ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product, addToCart }) => {
  return (
    <div className="group bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col">

      {/* Image */}
      <Link to={`/product/${product._id}`} className="block relative overflow-hidden bg-gray-50 aspect-square">
        <img
          src={product.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"}
          alt={product.name}
          className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
        />
        {/* Badge */}
        {product.category && (
          <span className="absolute top-3 left-3 bg-white border border-gray-200 text-gray-600 text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-full">
            {product.category}
          </span>
        )}
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-1 mb-1">
          <Star size={11} fill="#f59e0b" className="text-amber-400" />
          <span className="text-xs text-gray-500 font-medium">4.9</span>
        </div>

        <Link to={`/product/${product._id}`}>
          <h4 className="text-sm font-semibold text-gray-800 leading-snug hover:text-[#e63946] transition-colors line-clamp-2 mb-2">
            {product.name}
          </h4>
        </Link>

        <div className="mt-auto flex items-center justify-between pt-2">
          <div>
            <span className="text-lg font-bold text-[#1a1a1a]">${product.price.toLocaleString()}</span>
            <span className="text-xs text-gray-400 line-through ml-2">${(product.price * 1.2).toFixed(0)}</span>
          </div>
        </div>

        <button
          onClick={() => addToCart(product)}
          className="mt-3 w-full bg-[#1a1a1a] text-white text-sm font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 hover:bg-[#e63946] transition-colors duration-200"
        >
          <ShoppingCart size={15} />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;