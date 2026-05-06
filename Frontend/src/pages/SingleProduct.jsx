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
        setSuggestions(allRes.data.filter(p => p._id !== id).slice(0, 4));
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
            <div className="bg-slate-100 rounded-2xl aspect-square" />
            <div className="space-y-4 py-4">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-8 bg-slate-100 rounded" />)}
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
          <Package size={48} className="text-slate-200 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-700 mb-2">Product Not Found</h2>
          <Link to="/store" className="text-blue-600 font-semibold hover:underline">← Back to Store</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-slate-100 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-2 text-sm text-slate-500">
          <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/store" className="hover:text-blue-600 transition-colors">Shop</Link>
          <span>/</span>
          <span className="text-slate-900 font-medium truncate max-w-xs">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <Link to="/store" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600 transition-colors mb-8">
          <ChevronLeft size={16} /> Back to Store
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          {/* Image */}
          <div className="bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center p-10 aspect-square">
            <img src={product.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"}
              alt={product.name} className="max-w-full max-h-full object-contain" />
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center">
            {product.category && (
              <span className="inline-block bg-blue-50 text-blue-600 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-4 w-fit"
                style={{ border: '1px solid #bfdbfe' }}>
                {product.category}
              </span>
            )}

            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight mb-3">{product.name}</h1>

            <div className="flex items-center gap-2 mb-4">
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map(i => (
                  <Star key={i} size={14} fill={i <= 4 ? "#f59e0b" : "none"} className={i <= 4 ? "text-amber-400" : "text-slate-200"} />
                ))}
              </div>
              <span className="text-sm text-slate-400 font-medium">4.9 (128 reviews)</span>
            </div>

            <div className="flex items-baseline gap-3 mb-5">
              <span className="text-3xl font-extrabold text-slate-900">${product.price?.toLocaleString()}</span>
              <span className="text-lg text-slate-400 line-through">${(product.price * 1.2).toFixed(0)}</span>
              <span className="text-sm font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">Save 17%</span>
            </div>

            <p className="text-slate-600 leading-relaxed mb-6">
              {product.description || "Experience premium quality with this carefully crafted product. Designed for those who appreciate the finer details in everyday life."}
            </p>

            <div className="flex items-center gap-2 mb-6">
              <div className={`w-2.5 h-2.5 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-400'}`} />
              <span className={`text-sm font-semibold ${product.stock > 0 ? 'text-green-700' : 'text-red-500'}`}>
                {product.stock > 0 ? `In Stock — ${product.stock} available` : 'Out of Stock'}
              </span>
            </div>

            <button onClick={handleAddToCart} disabled={product.stock === 0}
              className="w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2.5 transition-all duration-200 mb-3 text-white"
              style={{
                backgroundColor: added ? '#16a34a' : product.stock === 0 ? '#e2e8f0' : '#2563eb',
                color: product.stock === 0 ? '#94a3b8' : 'white',
                cursor: product.stock === 0 ? 'not-allowed' : 'pointer'
              }}>
              <ShoppingCart size={20} />
              {added ? '✓ Added to Cart!' : product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>

            <Link to="/cart"
              className="w-full py-3.5 rounded-xl font-semibold text-sm text-center transition-all duration-200 block text-slate-800 hover:bg-slate-50"
              style={{ border: '2px solid #e2e8f0' }}>
              View Cart
            </Link>

            <div className="mt-8 grid grid-cols-3 gap-3">
              {[
                { icon: <Truck size={16} />, text: 'Free Shipping' },
                { icon: <RotateCcw size={16} />, text: '30-Day Returns' },
                { icon: <ShieldCheck size={16} />, text: 'Secure Payment' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-1.5 p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-blue-600">{item.icon}</span>
                  <span className="text-xs text-slate-500 font-medium leading-snug">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {suggestions.length > 0 && (
          <div className="mt-16 pt-10 border-t border-slate-100">
            <h3 className="text-2xl font-bold text-slate-900 mb-6">You Might Also Like</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {suggestions.map(p => <ProductCard key={p._id} product={p} addToCart={addToCart} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SingleProduct;