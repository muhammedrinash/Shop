import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingCart, ChevronLeft, Star, Truck, RotateCcw, ShieldCheck, Package } from 'lucide-react';
import API from '../services/api';
import ProductCard from '../Components/ProductCard';

const SingleProduct = ({ addToCart }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const productRes = await API.get(`/products/${id}`);
        setProduct(productRes.data);
        const allRes = await API.get('/products');
        const others = allRes.data.filter(p => p._id !== id);
        setSuggestions(others.slice(0, 4));
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
    setAdded(false);
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 animate-pulse">
            <div className="bg-gray-100 rounded-2xl aspect-square" />
            <div className="space-y-4 py-4">
              <div className="h-4 bg-gray-100 rounded w-1/4" />
              <div className="h-8 bg-gray-100 rounded w-3/4" />
              <div className="h-8 bg-gray-100 rounded w-1/3" />
              <div className="h-24 bg-gray-100 rounded" />
              <div className="h-12 bg-gray-100 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Package size={48} className="text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">Product Not Found</h2>
          <Link to="/store" className="text-[#e63946] font-semibold hover:underline">← Back to Store</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-2 text-sm text-gray-500">
          <Link to="/" className="hover:text-[#e63946] transition-colors">Home</Link>
          <span>/</span>
          <Link to="/store" className="hover:text-[#e63946] transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-[#1a1a1a] font-medium truncate max-w-xs">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Back link */}
        <Link
          to="/store"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#e63946] transition-colors mb-8"
        >
          <ChevronLeft size={16} /> Back to Store
        </Link>

        {/* Product Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">

          {/* Image */}
          <div className="bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-center p-10 aspect-square">
            <img
              src={product.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"}
              alt={product.name}
              className="max-w-full max-h-full object-contain"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            {/* Category */}
            {product.category && (
              <span className="inline-block bg-gray-100 text-gray-600 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-4 w-fit">
                {product.category}
              </span>
            )}

            {/* Name */}
            <h1 className="text-3xl md:text-4xl font-extrabold text-[#1a1a1a] leading-tight mb-3">
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-0.5">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} size={14} fill={i <= 4 ? "#f59e0b" : "none"} className={i <= 4 ? "text-amber-400" : "text-gray-300"} />
                ))}
              </div>
              <span className="text-sm text-gray-500 font-medium">4.9 (128 reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-5">
              <span className="text-3xl font-extrabold text-[#1a1a1a]">${product.price?.toLocaleString()}</span>
              <span className="text-lg text-gray-400 line-through">${(product.price * 1.2).toFixed(0)}</span>
              <span className="text-sm font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Save 17%</span>
            </div>

            {/* Description */}
            <p className="text-gray-600 leading-relaxed mb-6">
              {product.description || "Experience premium quality with this carefully crafted product. Designed for those who appreciate the finer details in everyday life."}
            </p>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-6">
              <div className={`w-2.5 h-2.5 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
              <span className={`text-sm font-semibold ${product.stock > 0 ? 'text-green-700' : 'text-red-600'}`}>
                {product.stock > 0 ? `In Stock — ${product.stock} available` : 'Out of Stock'}
              </span>
            </div>

            {/* Add to cart */}
            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className={`w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2.5 transition-all duration-200 mb-3
                ${added
                  ? 'bg-green-600 text-white'
                  : product.stock === 0
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : 'bg-[#e63946] text-white hover:bg-red-700'
                }`}
            >
              <ShoppingCart size={20} />
              {added ? '✓ Added to Cart!' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>

            <Link
              to="/cart"
              className="w-full py-3.5 rounded-xl font-semibold text-sm text-center border-2 border-[#1a1a1a] text-[#1a1a1a] hover:bg-[#1a1a1a] hover:text-white transition-all duration-200 block"
            >
              View Cart
            </Link>

            {/* Guarantees */}
            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                { icon: <Truck size={16} />, text: 'Free Shipping' },
                { icon: <RotateCcw size={16} />, text: '30-Day Returns' },
                { icon: <ShieldCheck size={16} />, text: 'Secure Payment' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-1.5 p-3 bg-gray-50 rounded-xl border border-gray-100">
                  <span className="text-gray-500">{item.icon}</span>
                  <span className="text-xs text-gray-600 font-medium leading-snug">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* You Might Also Like */}
        {suggestions.length > 0 && (
          <div className="mt-16 pt-10 border-t border-gray-100">
            <h3 className="text-2xl font-bold text-[#1a1a1a] mb-6">You Might Also Like</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {suggestions.map(p => (
                <ProductCard key={p._id} product={p} addToCart={addToCart} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleProduct;