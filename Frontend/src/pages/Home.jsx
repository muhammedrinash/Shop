import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import ProductCard from '../Components/ProductCard';
import { ChevronRight, Sparkles, Watch, Shirt, Home as HomeIcon, Smartphone, Truck, ShieldCheck, Headphones } from 'lucide-react';

const categories = [
  { name: 'Electronics', icon: <Smartphone />, color: 'from-blue-500' },
  { name: 'Fashion', icon: <Shirt />, color: 'from-fuchsia-500' },
  { name: 'Accessories', icon: <Watch />, color: 'from-violet-500' },
  { name: 'Home Decor', icon: <HomeIcon />, color: 'from-emerald-500' },
  { name: 'Exclusives', icon: <Sparkles />, color: 'from-amber-500' },
];

const Home = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollRef = useRef(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    API.get("/products").then(res => setProducts(res.data));
    
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-scroll logic for products
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer || products.length === 0) return;

    const scrollInterval = setInterval(() => {
      if (scrollContainer.scrollLeft + scrollContainer.clientWidth >= scrollContainer.scrollWidth - 10) {
        scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollContainer.scrollBy({ left: 352, behavior: 'smooth' }); // 320px width + 32px gap
      }
    }, 3000);

    return () => clearInterval(scrollInterval);
  }, [products]);

  const heroSlides = [
    {
      subtitle: "Season Drop 2024",
      title: <>ELEVATE <br /> YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-600">LIFESTYLE.</span></>,
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=100&w=3840&auto=format&fit=crop",
      cta: "EXPLORE COLLECTION",
    },
    {
      subtitle: "The Noir Collection",
      title: <>DARK. <br /> MYSTERIOUS. <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-600">ELEGANT.</span></>,
      image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=100&w=3840&auto=format&fit=crop",
      cta: "SHOP NOIR",
    },
    {
      subtitle: "Next Gen Tech",
      title: <>FUTURE <br /> IS <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-600">NOW.</span></>,
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=100&w=3840&auto=format&fit=crop",
      cta: "DISCOVER TECH",
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="pt-32 bg-[#050505] min-h-screen pb-20">
      
      {/* Premium Hero Sliding Banner */}
      <section className="px-6 pb-10 max-w-[1440px] mx-auto">
        <div className="relative h-[380px] w-full rounded-[3rem] overflow-hidden group">
          {heroSlides.map((slide, index) => (
            <div 
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
            >
              <img 
                src={slide.image} 
                className="w-full h-full object-cover transition-transform duration-[10000ms] ease-linear"
                alt={slide.subtitle}
                style={{ transform: index === currentSlide ? 'scale(1.05)' : 'scale(1)' }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent flex flex-col justify-center px-16">
                <span className="text-premium-violet font-bold tracking-[0.4em] uppercase mb-4 text-sm">
                  {slide.subtitle}
                </span>
                <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter leading-none mb-8">
                  {slide.title}
                </h2>
                <Link to="/store" className="bg-white text-black font-black px-10 py-5 rounded-full w-fit hover:bg-premium-violet hover:text-white transition-all flex items-center gap-3">
                  {slide.cta} <ChevronRight size={20} />
                </Link>
              </div>
            </div>
          ))}
          
          {/* Slider Indicators */}
          <div className="absolute bottom-8 left-16 z-20 flex gap-3">
            {heroSlides.map((_, index) => (
              <button 
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-500 ${index === currentSlide ? 'w-10 bg-premium-violet' : 'w-2 bg-white/30 hover:bg-white/50'}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Product Grid */}
      <section className="px-6 max-w-[1440px] mx-auto mt-10">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h3 className="text-3xl font-bold tracking-tight italic">Trending Now</h3>
            <p className="text-zinc-500 text-sm mt-2 uppercase tracking-widest">Handpicked for you</p>
          </div>
          <Link to="/store" className="text-premium-violet font-bold text-sm border-b border-premium-violet pb-1">VIEW ALL</Link>
        </div>

        <div 
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-8 -mx-6 px-6 md:mx-0 md:px-0"
        >
          {products.slice(0, 8).map(p => (
            <div key={p._id} className="min-w-[280px] md:min-w-[320px] snap-start shrink-0">
              <ProductCard product={p} addToCart={addToCart} />
            </div>
          ))}
        </div>
      </section>

      {/* 4. Featured Collection / Exclusive Drop */}
      <section className="px-6 max-w-[1440px] mx-auto mt-32">
        <div className="bg-zinc-900/40 border border-white/5 rounded-[3rem] overflow-hidden flex flex-col lg:flex-row items-center">
          <div className="p-12 lg:p-20 lg:w-1/2 flex flex-col justify-center relative">
            <div className="absolute top-0 left-0 w-32 h-32 bg-premium-violet/20 blur-[100px] rounded-full" />
            <span className="text-premium-violet font-bold tracking-[0.3em] uppercase text-xs mb-4">Limited Edition</span>
            <h2 className="text-5xl font-black italic tracking-tighter mb-6">THE NOIR <br/> COLLECTION</h2>
            <p className="text-zinc-400 text-lg mb-10 leading-relaxed max-w-md">
              Discover our most exclusive lineup of premium accessories and apparel, designed for those who appreciate the finer things in life. Dark, mysterious, and undeniably sophisticated.
            </p>
            <Link to="/store" className="border border-white text-white font-bold px-8 py-4 rounded-full w-fit hover:bg-white hover:text-black transition-all flex items-center gap-3">
              SHOP NOIR <ChevronRight size={18} />
            </Link>
          </div>
          <div className="w-full lg:w-1/2 h-[400px] lg:h-[600px] overflow-hidden relative">
            <img 
              src="https://images.unsplash.com/photo-1523170335258-f5ed11844a49?q=100&w=3840&auto=format&fit=crop" 
              className="w-full h-[130%] absolute -top-[15%] left-0 object-cover object-center will-change-transform"
              alt="The Noir Collection"
              style={{ transform: `translateY(${scrollY * 0.15}px)` }}
            />
          </div>
        </div>
      </section>

      {/* 5. Premium Guarantees */}
      <section className="px-6 max-w-[1440px] mx-auto mt-32 mb-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-black border border-white/5 p-10 rounded-[2rem] flex flex-col items-center text-center hover:border-white/10 transition-colors">
            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-6 text-white">
              <Truck size={28} />
            </div>
            <h4 className="text-xl font-bold mb-3">Global Delivery</h4>
            <p className="text-zinc-500 text-sm">Complimentary express shipping on all premium orders worldwide.</p>
          </div>
          <div className="bg-black border border-white/5 p-10 rounded-[2rem] flex flex-col items-center text-center hover:border-white/10 transition-colors">
            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-6 text-white">
              <ShieldCheck size={28} />
            </div>
            <h4 className="text-xl font-bold mb-3">Secure Payment</h4>
            <p className="text-zinc-500 text-sm">Your transactions are protected with military-grade encryption.</p>
          </div>
          <div className="bg-black border border-white/5 p-10 rounded-[2rem] flex flex-col items-center text-center hover:border-white/10 transition-colors">
            <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mb-6 text-white">
              <Headphones size={28} />
            </div>
            <h4 className="text-xl font-bold mb-3">24/7 Concierge</h4>
            <p className="text-zinc-500 text-sm">Dedicated VIP support team available around the clock.</p>
          </div>
        </div>
      </section>

      {/* 6. Shop By Category */}
      <section className="px-6 max-w-[1440px] mx-auto mt-32">
        <h3 className="text-3xl font-bold tracking-tight italic mb-12 text-center">Curated Departments</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link to="/store?search=shirt,pant,fashion" className="relative h-[400px] rounded-[2rem] overflow-hidden group cursor-pointer block">
            <img src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Fashion" />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <h4 className="text-2xl font-black tracking-widest uppercase">Fashion</h4>
            </div>
          </Link>
          <Link to="/store?search=phone,laptop,electronic,tech" className="relative h-[400px] rounded-[2rem] overflow-hidden group cursor-pointer block">
            <img src="https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=2070" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Tech" />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <h4 className="text-2xl font-black tracking-widest uppercase">Tech</h4>
            </div>
          </Link>
          <Link to="/store?search=decor,home" className="relative h-[400px] rounded-[2rem] overflow-hidden group cursor-pointer block">
            <img src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?q=80&w=1932" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Home Decor" />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <h4 className="text-2xl font-black tracking-widest uppercase">Decor</h4>
            </div>
          </Link>
          <Link to="/store?search=accessory,watch,ring" className="relative h-[400px] rounded-[2rem] overflow-hidden group cursor-pointer block">
            <img src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Accessories" />
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <h4 className="text-2xl font-black tracking-widest uppercase">Accessories</h4>
            </div>
          </Link>
        </div>
      </section>

      {/* 7. VIP Newsletter */}
      <section className="px-6 max-w-[1000px] mx-auto mt-32 mb-20">
        <div className="bg-zinc-900/60 border border-white/10 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-premium-violet/20 blur-[120px] rounded-full pointer-events-none" />
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black italic tracking-tighter mb-4">JOIN THE INNER CIRCLE</h2>
            <p className="text-zinc-400 mb-10 max-w-lg mx-auto">Subscribe to receive exclusive access to limited drops, private sales, and personalized premium recommendations.</p>
            <form className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Enter your email address" className="flex-grow bg-black border border-white/10 rounded-full px-6 py-4 text-sm focus:outline-none focus:border-premium-violet/50 transition-colors text-white" />
              <button className="bg-white text-black font-bold px-8 py-4 rounded-full hover:bg-premium-violet hover:text-white transition-colors">SUBSCRIBE</button>
            </form>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;