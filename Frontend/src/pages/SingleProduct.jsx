import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShoppingCart, ChevronLeft, Star, Truck, RotateCcw, 
  ShieldCheck, Package, Heart, Share2, Info, 
  Settings, ArrowRight, CheckCircle2 
} from 'lucide-react';
import API from '../services/api';
import ProductCard from '../Components/ProductCard';

const SingleProduct = ({ addToCart }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

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
    window.scrollTo(0, 0);
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const tabs = [
    { id: 'description', label: 'PRODUCT STORY', icon: <Info size={16} /> },
    { id: 'specs', label: 'SPECIFICATIONS', icon: <Settings size={16} /> },
    { id: 'shipping', label: 'DELIVERY & RETURNS', icon: <Truck size={16} /> },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <div className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 animate-pulse">
            <div className="bg-slate-50 rounded-[40px] aspect-square" />
            <div className="space-y-8 py-10">
              <div className="h-4 w-24 bg-slate-100 rounded-full" />
              <div className="h-16 w-full bg-slate-100 rounded-2xl" />
              <div className="h-32 w-full bg-slate-100 rounded-2xl" />
              <div className="h-16 w-48 bg-slate-100 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
        <div className="w-24 h-24 bg-slate-50 rounded-[30px] flex items-center justify-center text-slate-200 mb-8">
          <Package size={48} />
        </div>
        <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-4">Product Not Found</h2>
        <p className="text-slate-500 mb-10 text-center max-w-sm">The item you are looking for might have been moved or is no longer available.</p>
        <Link to="/store" className="bg-slate-900 text-white px-10 py-4 rounded-full font-black text-sm tracking-widest hover:bg-blue-600 transition-all flex items-center gap-2 group">
          <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> BACK TO STORE
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-32">
      {/* Cinematic Breadcrumb */}
      <div className="bg-slate-50 border-b border-slate-100 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 py-4 flex items-center justify-between text-[11px] font-black tracking-[0.2em] text-slate-400 uppercase">
          <div className="flex items-center gap-3">
            <Link to="/" className="hover:text-blue-600 transition-colors">HOME</Link>
            <span className="text-slate-200">/</span>
            <Link to="/store" className="hover:text-blue-600 transition-colors">COLLECTIONS</Link>
            <span className="text-slate-200">/</span>
            <span className="text-slate-900 truncate max-w-[150px]">{product.name}</span>
          </div>
          <div className="hidden md:flex items-center gap-6">
            <button className="flex items-center gap-2 hover:text-slate-900 transition-colors"><Share2 size={14} /> SHARE</button>
            <button className="flex items-center gap-2 hover:text-red-500 transition-colors"><Heart size={14} /> WISHLIST</button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 xl:gap-24">
          
          {/* Main Image Section */}
          <div className="space-y-6">
            <div className="bg-slate-50 border border-slate-100 rounded-[40px] flex items-center justify-center p-12 aspect-square relative group overflow-hidden">
              <img 
                src={product.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"}
                alt={product.name} 
                className="max-w-full max-h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-700" 
              />
              <div className="absolute top-8 left-8">
                <span className="bg-white/80 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black tracking-[0.2em] border border-slate-100 shadow-sm">
                  PREMIUM QUALITY
                </span>
              </div>
            </div>
            {/* Gallery Thumbnails (Static Placeholder) */}
            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-square bg-slate-50 border border-slate-100 rounded-2xl cursor-pointer hover:border-blue-300 transition-all overflow-hidden flex items-center justify-center p-3">
                   <img 
                    src={product.image} 
                    alt="thumb" 
                    className={`max-w-full max-h-full object-contain mix-blend-multiply ${i !== 0 ? 'opacity-40 grayscale' : ''}`} 
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Product Detail Info Section */}
          <div className="flex flex-col pt-4">
            {product.category && (
              <span className="text-blue-600 text-[11px] font-black tracking-[0.4em] mb-4 uppercase">
                {product.category} COLLECTION
              </span>
            )}

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tighter leading-[1.1] mb-6">
              {product.name}
            </h1>

            <div className="flex items-center gap-4 mb-8 pb-8 border-b border-slate-100">
              <div className="flex items-center gap-1 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < 4 ? "#2563eb" : "none"} className={i < 4 ? "text-blue-600" : "text-slate-200"} />
                  ))}
                </div>
                <span className="text-xs font-black text-slate-900 ml-1">4.9</span>
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest underline cursor-pointer hover:text-blue-600">128 Verified Reviews</span>
            </div>

            <div className="flex items-center gap-5 mb-10">
              <div className="flex flex-col">
                <span className="text-4xl font-black text-slate-900 tracking-tighter">${product.price?.toLocaleString()}</span>
                <span className="text-sm font-bold text-slate-300 line-through tracking-widest">${(product.price * 1.2).toFixed(0)}</span>
              </div>
              <div className="h-12 w-[1px] bg-slate-100"></div>
              <div className="flex flex-col">
                <span className="text-green-600 text-[11px] font-black tracking-widest uppercase mb-1">Limited Offer</span>
                <span className="text-sm font-bold text-slate-900">FREE OVERNIGHT SHIPPING</span>
              </div>
            </div>

            <p className="text-slate-500 text-lg leading-relaxed font-medium mb-10">
              {product.description || "Designed for those who demand excellence, this piece combines artisanal craftsmanship with modern innovation to create something truly extraordinary."}
            </p>

            <div className="space-y-4 mb-12">
              <button 
                onClick={handleAddToCart} 
                disabled={product.stock === 0}
                className={`w-full py-6 rounded-full font-black text-[15px] tracking-[0.2em] flex items-center justify-center gap-4 transition-all duration-300 premium-shadow ${
                  added ? 'bg-green-600 text-white' : product.stock === 0 ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-blue-600 active:scale-95'
                }`}
              >
                <ShoppingCart size={22} strokeWidth={2.5} />
                {added ? 'ADDED TO BAG' : product.stock === 0 ? 'OUT OF STOCK' : 'ADD TO SHOPPING BAG'}
              </button>
              
              <div className="flex items-center justify-center gap-3 py-4 bg-blue-50/50 rounded-2xl border border-blue-100 text-blue-700">
                <ShieldCheck size={18} />
                <span className="text-[11px] font-black tracking-widest uppercase">Verified Authentic & Insured Delivery</span>
              </div>
            </div>

            {/* Feature Highlights (Small Icons) */}
            <div className="grid grid-cols-2 gap-4 pb-8 border-b border-slate-100">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><RotateCcw size={18} /></div>
                  <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">30-Day Returns</span>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400"><Truck size={18} /></div>
                  <span className="text-[10px] font-black tracking-widest text-slate-500 uppercase">Express Global</span>
               </div>
            </div>
          </div>
        </div>

        {/* ─── EXTRA DESCRIPTION SECTION (TABBED) ─── */}
        <div className="mt-32">
          {/* Tab Navigation */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-12 mb-16 border-b border-slate-100">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 pb-6 text-[12px] font-black tracking-[0.2em] transition-all relative ${
                  activeTab === tab.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-900'
                }`}
              >
                {tab.icon}
                {tab.label}
                {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-[3px] bg-blue-600 animate-premium-fade" />}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="max-w-4xl mx-auto animate-premium-fade" key={activeTab}>
            {activeTab === 'description' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <h3 className="text-3xl font-black text-slate-900 tracking-tighter">The Vision Behind</h3>
                  <p className="text-slate-500 font-medium leading-relaxed">
                    Crafted with an obsessive attention to detail, this product represents the pinnacle of our design philosophy. We've combined sustainable sourcing with state-of-the-art manufacturing to deliver a piece that isn't just functional—it's an experience.
                  </p>
                  <ul className="space-y-4">
                    {[
                      'Hand-selected premium materials',
                      'Ergonomic design for maximum comfort',
                      'Rigorously tested for lifelong durability'
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                        <CheckCircle2 size={18} className="text-blue-600" /> {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="bg-slate-50 rounded-[30px] p-8">
                  <div className="text-[10px] font-black text-blue-600 tracking-[0.3em] mb-4 uppercase">CURATOR'S NOTE</div>
                  <p className="text-slate-800 font-bold italic leading-relaxed">
                    "When we first prototyped this item, the goal was to challenge the status quo of modern manufacturing. We wanted to bring back the feeling of artisanal quality while embracing the future of lifestyle tech."
                  </p>
                  <div className="mt-6 flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-900 rounded-full"></div>
                    <div>
                      <div className="text-[11px] font-black text-slate-900">MARCUS VILUXE</div>
                      <div className="text-[10px] font-bold text-slate-400">Chief Designer</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="bg-slate-50 rounded-[40px] p-10 md:p-16">
                <h3 className="text-3xl font-black text-slate-900 tracking-tighter mb-10">Technical Mastery</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-8">
                  {[
                    { label: 'Weight', value: '1.2 kg / 2.6 lbs' },
                    { label: 'Dimensions', value: '45cm x 30cm x 15cm' },
                    { label: 'Material', value: 'High-Grade Aerospace Composite' },
                    { label: 'Components', value: 'Assembled in Zurich, Switzerland' },
                    { label: 'Battery Life', value: 'N/A (Analog Core)' },
                    { label: 'Warranty', value: 'Lifetime Limited Guarantee' },
                  ].map((spec, i) => (
                    <div key={i} className="flex justify-between items-center border-b border-slate-200 pb-4">
                      <span className="text-[11px] font-black text-slate-400 tracking-widest uppercase">{spec.label}</span>
                      <span className="text-sm font-bold text-slate-900">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  { title: 'Standard Delivery', time: '3-5 Business Days', price: 'FREE', icon: <Globe size={24} /> },
                  { title: 'Express Courier', time: '1-2 Business Days', price: '$25.00', icon: <Zap size={24} /> },
                  { title: 'Return Policy', time: '30-Day Window', price: 'EASY RETURNS', icon: <RotateCcw size={24} /> },
                ].map((option, i) => (
                  <div key={i} className="bg-white border border-slate-100 p-8 rounded-[30px] flex flex-col items-center text-center premium-shadow">
                    <div className="w-16 h-16 bg-blue-50 rounded-[20px] flex items-center justify-center text-blue-600 mb-6">
                      {option.icon}
                    </div>
                    <h4 className="text-slate-900 font-black text-[14px] tracking-wider mb-2 uppercase">{option.title}</h4>
                    <p className="text-slate-400 text-xs font-bold mb-4">{option.time}</p>
                    <span className="mt-auto text-blue-600 font-black text-sm">{option.price}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* You Might Also Like Section */}
        {suggestions.length > 0 && (
          <div className="mt-40">
            <div className="flex items-center justify-between mb-16">
              <h3 className="text-4xl font-black text-slate-900 tracking-tighter">You Might Also Like</h3>
              <Link to="/store" className="text-sm font-black text-blue-600 hover:text-slate-900 flex items-center gap-2 group tracking-widest uppercase">
                ALL PRODUCTS <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {suggestions.map(p => <ProductCard key={p._id} product={p} addToCart={addToCart} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Zap = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
  </svg>
);

const Globe = ({ size, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20"/><path d="M12 2a14.5 14.5 0 0 1 0 20"/><path d="M2 12h20"/>
  </svg>
);

export default SingleProduct;