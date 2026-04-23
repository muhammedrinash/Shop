import React, { useEffect, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import API from '../services/api';
import ProductCard from '../Components/ProductCard';
import { Search } from 'lucide-react';

const Store = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [searchParams] = useSearchParams();
  const query = searchParams.get('search') || '';

  useEffect(() => {
    API.get("/products").then(res => setProducts(res.data)).catch(err => console.error("Failed to fetch products", err));
  }, []);

  const filteredProducts = products.filter(p => {
    if (!query) return true;
    const terms = query.toLowerCase().split(',').map(t => t.trim()).filter(Boolean);
    const name = p.name.toLowerCase();
    const cat = p.category ? p.category.toLowerCase() : '';
    return terms.some(term => name.includes(term) || cat.includes(term));
  });

  return (
    <div className="pt-28 pb-20 px-6 max-w-[1440px] mx-auto min-h-screen">
      <div className="mb-12">
        <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter uppercase">
          Premium <span className="text-premium-violet">Collection.</span>
        </h1>
        {query && (
          <p className="text-zinc-500 mt-4 flex items-center gap-2">
            <Search size={16} /> Showing results for <span className="text-white font-bold">"{query.split(',').join(', ')}"</span>
          </p>
        )}
      </div>

      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map(p => (
            <ProductCard key={p._id} product={p} addToCart={addToCart} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 bg-zinc-900 rounded-full flex items-center justify-center mb-6">
            <Search size={32} className="text-zinc-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">No products found</h2>
          <p className="text-zinc-500 max-w-md">We couldn't find anything matching "{query}". Try exploring our other premium collections.</p>
        </div>
      )}
    </div>
  );
};

export default Store;
