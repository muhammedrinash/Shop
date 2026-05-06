import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import ProductCard from '../Components/ProductCard';
import { ChevronRight, Truck, ShieldCheck, RotateCcw, Headphones } from 'lucide-react';

const Home = ({ addToCart }) => {
  const [products, setProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    API.get("/products").then(res => setProducts(res.data));
  }, []);

  const heroSlides = [
    {
      tag: "New Arrivals",
      title: "Fresh Styles for Every Season",
      subtitle: "Discover curated collections handpicked just for you",
      cta: "Shop Now",
      bg: "#f5f5f0",
      image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1470&auto=format&fit=crop",
    },
    {
      tag: "Electronics",
      title: "Next-Gen Tech at Your Fingertips",
      subtitle: "The latest gadgets and devices, all in one place",
      cta: "Explore Tech",
      bg: "#f0f4f8",
      image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=1470&auto=format&fit=crop",
    },
    {
      tag: "Accessories",
      title: "Complete Your Look",
      subtitle: "Premium accessories that elevate any outfit",
      cta: "Shop Accessories",
      bg: "#fdf6f0",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1470&auto=format&fit=crop",
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const categories = [
    { name: 'Fashion', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=600', link: '/store?search=shirt,pant,fashion' },
    { name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=600', link: '/store?search=phone,laptop,electronic,tech' },
    { name: 'Accessories', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600', link: '/store?search=accessory,watch,ring' },
  ];

  const features = [
    { icon: <Truck size={24} />, title: 'Free Shipping', desc: 'On orders over $50' },
    { icon: <RotateCcw size={24} />, title: 'Easy Returns', desc: '30-day return policy' },
    { icon: <ShieldCheck size={24} />, title: 'Secure Payment', desc: '100% safe checkout' },
    { icon: <Headphones size={24} />, title: '24/7 Support', desc: 'Always here to help' },
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Slider */}
      <section className="relative overflow-hidden" style={{ backgroundColor: heroSlides[currentSlide].bg, transition: 'background-color 0.8s ease' }}>
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-20 flex flex-col md:flex-row items-center gap-10 min-h-[420px]">
          {/* Text */}
          <div className="flex-1 z-10">
            <span className="inline-block bg-[#e63946] text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              {heroSlides[currentSlide].tag}
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#1a1a1a] leading-tight mb-4">
              {heroSlides[currentSlide].title}
            </h1>
            <p className="text-gray-500 text-lg mb-8 max-w-md">
              {heroSlides[currentSlide].subtitle}
            </p>
            <Link
              to="/store"
              className="inline-flex items-center gap-2 bg-[#1a1a1a] text-white px-7 py-3.5 rounded-lg font-semibold text-sm hover:bg-[#e63946] transition-colors duration-200"
            >
              {heroSlides[currentSlide].cta} <ChevronRight size={16} />
            </Link>
          </div>
          {/* Image */}
          <div className="flex-1 flex justify-center">
            <img
              src={heroSlides[currentSlide].image}
              alt="hero"
              className="w-full max-w-sm md:max-w-md rounded-2xl object-cover shadow-xl"
              style={{ maxHeight: '340px', transition: 'opacity 0.5s ease' }}
            />
          </div>
        </div>
        {/* Slide dots */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-2 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-6 bg-[#e63946]' : 'w-2 bg-gray-400'}`}
            />
          ))}
        </div>
      </section>

      {/* Features bar */}
      <section className="border-y border-gray-100 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="text-[#e63946]">{f.icon}</div>
              <div>
                <p className="text-sm font-bold text-[#1a1a1a]">{f.title}</p>
                <p className="text-xs text-gray-500">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Shop by Category */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-[#1a1a1a]">Shop by Category</h2>
          <Link to="/store" className="text-sm font-semibold text-[#e63946] hover:underline flex items-center gap-1">
            All Categories <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {categories.map((cat, i) => (
            <Link key={i} to={cat.link} className="group relative rounded-xl overflow-hidden aspect-square bg-gray-100 block">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent flex items-end p-4">
                <span className="text-white font-bold text-base">{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trending Products */}
      <section className="max-w-7xl mx-auto px-6 pb-14">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#1a1a1a]">Trending Now</h2>
            <p className="text-sm text-gray-500 mt-1">Our most popular products this week</p>
          </div>
          <Link to="/store" className="text-sm font-semibold text-[#e63946] hover:underline flex items-center gap-1">
            View All <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.slice(0, 8).map(p => (
            <ProductCard key={p._id} product={p} addToCart={addToCart} />
          ))}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="max-w-7xl mx-auto px-6 pb-14">
        <div className="bg-[#1a1a1a] rounded-2xl overflow-hidden flex flex-col md:flex-row items-center">
          <div className="flex-1 p-10 md:p-14">
            <span className="text-[#e63946] text-xs font-bold uppercase tracking-widest">Limited Offer</span>
            <h3 className="text-3xl md:text-4xl font-extrabold text-white mt-2 mb-4 leading-tight">
              Get 20% Off<br />Your First Order
            </h3>
            <p className="text-gray-400 text-sm mb-6 max-w-sm">
              Sign up today and receive an exclusive discount on your first purchase. No strings attached.
            </p>
            <Link to="/register" className="inline-flex items-center gap-2 bg-[#e63946] text-white px-6 py-3 rounded-lg font-semibold text-sm hover:bg-red-700 transition-colors">
              Claim Offer <ChevronRight size={15} />
            </Link>
          </div>
          <div className="hidden md:block flex-1">
            <img
              src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=700&auto=format&fit=crop"
              alt="Promo"
              className="w-full h-64 md:h-80 object-cover"
            />
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="bg-gray-50 border-t border-gray-100 py-14">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <h3 className="text-2xl font-bold text-[#1a1a1a] mb-2">Stay in the Loop</h3>
          <p className="text-gray-500 text-sm mb-6">Get the latest deals, new arrivals, and style inspiration — right to your inbox.</p>
          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email address"
              className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-gray-500 transition-colors"
            />
            <button type="submit" className="bg-[#e63946] text-white px-6 py-3 rounded-lg text-sm font-bold hover:bg-red-700 transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </section>

    </div>
  );
};

export default Home;