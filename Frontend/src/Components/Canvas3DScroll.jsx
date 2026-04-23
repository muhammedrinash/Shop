import React, { useRef, useEffect, useState } from 'react';

const Canvas3DScroll = () => {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [images, setImages] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [progress, setProgress] = useState(0);

  const frameCount = 147;
  
  // Apple's AirPods Pro sequence URL format
  const currentFrame = index => (
    `https://www.apple.com/105/media/us/airpods-pro/2019/1299e2f5_9206_4470_b28e_08307a42f19b/anim/sequence/large/01-hero-lightpass/${index.toString().padStart(4, '0')}.jpg`
  );

  const preloadImages = () => {
    const loadedImages = [];
    let loadedCount = 0;

    for (let i = 1; i <= frameCount; i++) {
      const img = new Image();
      img.src = currentFrame(i);
      img.onload = () => {
        loadedCount++;
        if (loadedCount === frameCount) {
          setLoaded(true);
        }
      };
      loadedImages.push(img);
    }
    setImages(loadedImages);
  };

  useEffect(() => {
    preloadImages();
  }, []);

  useEffect(() => {
    if (!loaded || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    
    // Set canvas dimensions to match the source images
    canvas.width = 1158;
    canvas.height = 770;

    const render = (index) => {
      if (images[index]) {
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(images[index], 0, 0);
      }
    };

    // Initial render
    render(0);

    const handleScroll = () => {
      if (!containerRef.current) return;
      
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      
      // Calculate how far we've scrolled within the container
      const scrollDistance = -rect.top;
      const totalScrollableDistance = rect.height - window.innerHeight;
      
      // Normalize to 0 - 1
      let scrollFraction = scrollDistance / totalScrollableDistance;
      
      // Clamp between 0 and 1
      scrollFraction = Math.max(0, Math.min(1, scrollFraction));
      setProgress(scrollFraction);

      const frameIndex = Math.min(
        frameCount - 1,
        Math.floor(scrollFraction * frameCount)
      );

      requestAnimationFrame(() => render(frameIndex));
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    // Trigger once to ensure correct state on mount
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [loaded, images]);

  return (
    <div ref={containerRef} className="h-[400vh] bg-[#050505] relative w-full z-10 border-y border-white/5 mt-32">
      <div className="sticky top-0 h-screen w-full flex flex-col items-center justify-center overflow-hidden">
        
        {/* Loading State */}
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center z-20 bg-[#050505]">
            <div className="text-premium-violet font-bold tracking-widest uppercase text-sm animate-pulse">
              Loading 3D Assets...
            </div>
          </div>
        )}

        {/* Text Overlay */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 text-center w-full px-6 transition-opacity duration-500 pointer-events-none" style={{ opacity: progress < 0.15 ? 1 - (progress * 6.6) : 0 }}>
          <span className="text-premium-violet font-bold tracking-[0.4em] uppercase mb-4 text-sm block">Interactive 3D Experience</span>
          <h2 className="text-5xl md:text-7xl font-black italic tracking-tighter mb-4">
            UNCOMPROMISED <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-600">ENGINEERING.</span>
          </h2>
          <p className="text-zinc-400 max-w-md mx-auto">Experience our products in full 3D detail. Scroll down to interact.</p>
        </div>

        {/* Canvas */}
        <canvas 
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover z-10"
          style={{ 
            // Invert to black background and apply grayscale for a pure black/white Noir aesthetic
            filter: 'invert(1) grayscale(100%) contrast(1.2)',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 1s ease-in-out',
            transform: `scale(${1 + (progress * 0.3)})` // Zoom from 1x to 1.3x over the scroll duration
          }}
        />

        {/* Ending Text */}
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 z-20 text-center w-full px-6 transition-opacity duration-500 pointer-events-auto" style={{ opacity: progress > 0.85 ? (progress - 0.85) * 6.6 : 0 }}>
          <h2 className="text-4xl md:text-6xl font-black italic tracking-tighter mb-6">
            THE PINNACLE OF <br /> DESIGN.
          </h2>
          <button className="bg-white text-black font-bold px-8 py-4 rounded-full hover:bg-premium-violet hover:text-white transition-all">
            SHOP EXCLUSIVES
          </button>
        </div>

      </div>
    </div>
  );
};

export default Canvas3DScroll;
