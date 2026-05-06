import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import ProductCard from '../Components/ProductCard';
import { ChevronRight, ArrowRight, Play, Sparkles, ShieldCheck, Zap, Globe } from 'lucide-react';

const Home = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    API.get("/products").then(res => setProducts(res.data));
  }, []);

  const heroSlides = [
    { 
      tag: "Spring '24 Collection", 
      title: "Elevate Your Lifestyle", 
      subtitle: "Experience the perfect blend of innovation and elegance with our curated premium selection.", 
      cta: "EXPLORE NOW", 
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1470&auto=format&fit=crop" 
    },
    { 
      tag: "Tech Excellence", 
      title: "Precision Reimagined", 
      subtitle: "Uncompromising performance meets minimalist design in our latest electronic series.", 
      cta: "VIEW TECH", 
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1470&auto=format&fit=crop" 
    },
    { 
      tag: "Masterfully Crafted", 
      title: "Detail In Every Piece", 
      subtitle: "Accessories designed to stand the test of time, made with the finest materials known to man.", 
      cta: "SHOP LUXE", 
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1470&auto=format&fit=crop" 
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide(prev => (prev + 1) % heroSlides.length), 6000);
    return () => clearInterval(timer);
  }, []);

  const categories = [
    { name: 'FASHION', count: '124 Products', image: '/fashion_category_premium_1778063524221.png', link: '/store?search=shirt,pant,fashion' },
    { name: 'ELECTRONICS', count: '86 Products', image: '/electronics_category_premium_1778063541713.png', link: '/store?search=phone,laptop,electronic,tech' },
    { name: 'ACCESSORIES', count: '52 Products', image: '/accessories_category_premium_1778063564332.png', link: '/store?search=accessory,watch,ring' },
  ];

  const features = [
    { icon: <Globe size={20} />, title: 'GLOBAL DELIVERY', desc: 'Ships to 120+ countries' },
    { icon: <Zap size={20} />, title: 'EXPRESS SERVICE', desc: 'Next day delivery available' },
    { icon: <ShieldCheck size={20} />, title: 'SECURE PAYMENTS', desc: 'AES-256 encrypted' },
    { icon: <Sparkles size={20} />, title: 'PREMIUM QUALITY', desc: 'Hand-inspected items' },
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* Cinematic Hero Slider */}
      <section className="relative h-[85vh] min-h-[600px] flex items-center overflow-hidden bg-slate-900">
        {/* Background Image with Ken Burns Effect */}
        <div className="absolute inset-0 z-0">
          <img 
            src={heroSlides[currentSlide].image} 
            alt="hero" 
            className="w-full h-full object-cover opacity-60 scale-110 transition-all duration-[6000ms] ease-out"
            key={currentSlide}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full relative z-10">
          <div className="max-w-2xl animate-premium-fade" key={`text-${currentSlide}`}>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-10 h-[1px] bg-blue-500"></span>
              <span className="text-blue-400 text-[12px] font-black uppercase tracking-[0.4em]">{heroSlides[currentSlide].tag}</span>
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] mb-8 tracking-tighter">
              {heroSlides[currentSlide].title}
            </h1>
            <p className="text-slate-300 text-lg md:text-xl mb-12 max-w-lg leading-relaxed font-medium">
              {heroSlides[currentSlide].subtitle}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/store"
                className="btn-premium btn-md btn-primary group"
              >
                {heroSlides[currentSlide].cta} <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <button className="btn-premium btn-md btn-outline text-white !border-white/20 !bg-white/10 backdrop-blur-md hover:!bg-white/20">
                <Play size={14} fill="white" /> WATCH FILM
              </button>
            </div>
          </div>
        </div>

        {/* Slide Progress Dots */}
        <div className="absolute bottom-12 right-12 flex items-center gap-6 z-20">
          {heroSlides.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCurrentSlide(i)}
              className="group flex flex-col items-end gap-2"
            >
              <span className={`text-[11px] font-black tracking-tighter transition-all ${i === currentSlide ? 'text-white' : 'text-slate-500'}`}>0{i+1}</span>
              <div 
                className={`h-[3px] rounded-full transition-all duration-700 ${i === currentSlide ? 'w-16 bg-blue-500' : 'w-8 bg-slate-700 group-hover:bg-slate-500'}`} 
              />
            </button>
          ))}
        </div>
      </section>

      {/* Feature Highlight Bar */}
      <section className="border-b border-slate-100 bg-white relative z-10 -mt-10 mx-6 lg:mx-12 rounded-3xl premium-shadow">
        <div className="max-w-7xl mx-auto px-10 py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {features.map((f, i) => (
            <div key={i} className="flex items-start gap-5 group">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-900 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                {f.icon}
              </div>
              <div>
                <p className="text-[12px] font-black text-slate-900 tracking-wider mb-1">{f.title}</p>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Shop by Category Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-lg">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-4">Curated Selections</h2>
            <p className="text-slate-500 font-medium">Browse through our hand-picked categories designed for those who seek the extraordinary in every day.</p>
          </div>
          <Link to="/store" className="text-sm font-black text-blue-600 hover:text-slate-900 flex items-center gap-2 group tracking-widest uppercase">
            EXPLORE COLLECTIONS <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat, i) => (
            <Link key={i} to={cat.link} className="group relative rounded-[32px] overflow-hidden aspect-[4/3] bg-slate-100 block">
              <img src={cat.image} alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1000ms] ease-out" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <span className="text-blue-400 text-[10px] font-black tracking-[0.3em] mb-2">{cat.count}</span>
                <h3 className="text-2xl font-black text-white tracking-tighter group-hover:-translate-y-1 transition-transform">{cat.name}</h3>
                <div className="w-0 h-[2px] bg-white group-hover:w-12 transition-all duration-500 mt-2"></div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Products Grid */}
      <section className="bg-slate-50 py-32">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div>
              <div className="flex items-center gap-2 text-blue-600 font-black text-[11px] tracking-[0.3em] mb-4 uppercase">
                <Sparkles size={14} /> NEW ARRIVALS
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">Trending Now</h2>
            </div>
            <Link to="/store" className="text-sm font-black text-blue-600 hover:text-slate-900 flex items-center gap-2 group tracking-widest uppercase">
              VIEW ALL CATALOG <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.slice(0, 8).map(p => (
              <ProductCard key={p._id} product={p} addToCart={addToCart} />
            ))}
          </div>
        </div>
      </section>

      {/* Premium Experience Section (Extra) */}
      <section className="max-w-7xl mx-auto px-6 lg:px-12 py-32">
        <div className="bg-slate-900 rounded-[50px] overflow-hidden flex flex-col lg:flex-row items-center relative">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600/10 skew-x-12 translate-x-32"></div>
          <div className="flex-1 p-12 md:p-20 relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tighter leading-none mb-8">
              Experience the<br />
              <span className="text-blue-500">Viluxe Difference</span>
            </h2>
            <div className="space-y-8 mb-12">
              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-500 shrink-0">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h4 className="text-white font-black text-[14px] tracking-wider mb-2">LIFETIME ASSURANCE</h4>
                  <p className="text-slate-400 text-sm leading-relaxed font-medium">Every product in our catalog comes with a guarantee of authenticity and a 2-year warranty.</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-500 shrink-0">
                  <Globe size={24} />
                </div>
                <div>
                  <h4 className="text-white font-black text-[14px] tracking-wider mb-2">CULTURAL CURATION</h4>
                  <p className="text-slate-400 text-sm leading-relaxed font-medium">We source from independent creators and top-tier manufacturers globally to bring you unique finds.</p>
                </div>
              </div>
            </div>
            <Link to="/register"
              className="btn-premium btn-md bg-white text-slate-900 hover:bg-blue-600 hover:text-white"
            >
              JOIN THE CIRCLE <ArrowRight size={16} />
            </Link>
          </div>
          <div className="flex-1 w-full lg:w-auto h-80 lg:h-[600px] relative">
            <img 
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=700&auto=format&fit=crop" 
              alt="Experience" 
              className="w-full h-full object-cover lg:rounded-l-[50px]" 
            />
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-white py-32 border-t border-slate-50">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="text-blue-600 font-black text-[11px] tracking-[0.4em] mb-6 uppercase">NEWSLETTER</div>
          <h3 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter mb-8">Stay Ahead of the Curve</h3>
          <p className="text-slate-500 font-medium mb-12 text-lg">Receive early access to collections, exclusive events, and the latest in lifestyle innovation.</p>
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <input 
              type="email" 
              placeholder="YOUR EMAIL ADDRESS" 
              className="flex-1 bg-slate-50 border border-slate-100 rounded-full px-8 py-5 text-sm font-bold tracking-widest focus:outline-none focus:ring-4 focus:ring-blue-100 focus:bg-white transition-all text-center sm:text-left" 
            />
            <button type="submit"
              className="btn-premium btn-sm btn-primary"
            >
              SUBSCRIBE
            </button>
          </form>
        </div>
      </section>

    </div>
  );
};

export default Home;