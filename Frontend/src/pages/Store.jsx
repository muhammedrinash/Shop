import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import ProductCard from '../Components/ProductCard';
import { Search, SlidersHorizontal, X } from 'lucide-react';

const Store = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const query = searchParams.get('search') || '';
  const [localSearch, setLocalSearch] = useState(query);
  const [sortBy, setSortBy] = useState('default');

  useEffect(() => {
    setLoading(true);
    API.get("/products")
      .then(res => setProducts(res.data))
      .catch(err => console.error("Failed to fetch products", err))
      .finally(() => setLoading(false));
  }, []);

  const filteredProducts = products.filter(p => {
    const searchTerm = localSearch || query;
    if (!searchTerm) return true;
    const terms = searchTerm.toLowerCase().split(',').map(t => t.trim()).filter(Boolean);
    const name = p.name.toLowerCase();
    const cat = p.category ? p.category.toLowerCase() : '';
    return terms.some(term => name.includes(term) || cat.includes(term));
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <h1 className="text-3xl font-extrabold text-[#1a1a1a]">All Products</h1>
          <p className="text-gray-500 text-sm mt-1">
            {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''} found
            {(localSearch || query) && <span> for "<strong>{localSearch || query}</strong>"</span>}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search + Sort bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={localSearch}
              onChange={e => setLocalSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-10 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 transition-colors bg-white"
            />
            {localSearch && (
              <button onClick={() => setLocalSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-gray-500" />
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value)}
              className="border border-gray-200 rounded-lg text-sm px-3 py-2.5 focus:outline-none focus:border-gray-400 bg-white text-gray-700"
            >
              <option value="default">Sort: Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A–Z</option>
            </select>
          </div>
        </div>

        {/* Products grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-gray-100 rounded-xl aspect-square animate-pulse" />
            ))}
          </div>
        ) : sortedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {sortedProducts.map(p => (
              <ProductCard key={p._id} product={p} addToCart={addToCart} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Search size={24} className="text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-[#1a1a1a] mb-2">No products found</h2>
            <p className="text-gray-500 text-sm mb-6">
              We couldn't find anything matching "{localSearch || query}". Try a different search.
            </p>
            <button
              onClick={() => setLocalSearch('')}
              className="bg-[#1a1a1a] text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#e63946] transition-colors"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Store;
