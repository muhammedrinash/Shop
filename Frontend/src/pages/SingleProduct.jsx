import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, ChevronLeft } from 'lucide-react';
import API from '../services/api';
import ProductCard from '../Components/ProductCard';

const SingleProduct = ({ addToCart }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Get single product
        const productRes = await API.get(`/products/${id}`);
        setProduct(productRes.data);

        // Get all products
        const allRes = await API.get('/products');

        // IMPORTANT FIX: use _id (not id)
        const otherProducts = allRes.data.filter(
          (p) => p._id !== id
        );

        setSuggestions(otherProducts.slice(0, 4));
      } catch (err) {
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="pt-32 pb-20 text-center text-white min-h-screen">
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-32 pb-20 text-center text-white min-h-screen">
        Product not found.
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-[1440px] mx-auto min-h-screen text-white">
      
      <Link
        to="/store"
        className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8"
      >
        <ChevronLeft size={20} /> Back to Store
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        
        {/* Image */}
        <div className="bg-zinc-900/40 border border-white/5 rounded-[3rem] p-12 flex items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-tr from-premium-violet/20 to-transparent opacity-50" />

          <img
            src={
              product?.image ||
              "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"
            }
            alt={product?.name}
            className="w-full max-h-[500px] object-contain relative z-10"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col justify-center">
          
          <span className="text-premium-violet font-bold tracking-[0.2em] uppercase text-sm mb-4">
            {product?.category || 'Premium Collection'}
          </span>

          <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-6">
            {product?.name}
          </h1>

          <div className="text-3xl font-black mb-8">
            ${product?.price?.toLocaleString()}
          </div>

          <div className="mb-10 text-zinc-400 leading-relaxed text-lg">
            {product?.description ||
              "Experience the pinnacle of design and functionality."}
          </div>

          {/* Stock */}
          <div className="mb-10">
            <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-4">
              Stock Status
            </h3>

            <div className="flex items-center gap-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  product?.stock > 0 ? 'bg-emerald-500' : 'bg-red-500'
                }`}
              />

              <span className="font-medium">
                {product?.stock > 0
                  ? `${product.stock} Available in Stock`
                  : 'Out of Stock'}
              </span>
            </div>
          </div>

          <button
            onClick={() => addToCart(product)}
            disabled={product?.stock === 0}
            className="w-full bg-white text-black font-black py-5 rounded-full flex items-center justify-center gap-3 hover:bg-premium-violet hover:text-white transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed text-lg"
          >
            <ShoppingBag size={24} />
            {product?.stock > 0 ? 'ADD TO BAG' : 'OUT OF STOCK'}
          </button>

        </div>
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="mt-32">
          <h3 className="text-3xl font-bold tracking-tight italic mb-10">
            You Might Also Like
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {suggestions.map((p) => (
              <ProductCard
                key={p._id}
                product={p}
                addToCart={addToCart}
              />
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default SingleProduct;