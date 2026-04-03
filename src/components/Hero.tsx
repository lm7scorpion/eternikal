import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Banner } from '../context/ProductContext';

interface HeroProps {
  banners: Banner[];
}

export function Hero({ banners }: HeroProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const activeBanners = banners.filter(b => b.isActive).sort((a, b) => a.order - b.order);

  const goToSlide = useCallback((index: number) => {
    if (isTransitioning || index === currentIndex) return;
    setIsTransitioning(true);
    setCurrentIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  }, [currentIndex, isTransitioning]);

  const nextSlide = useCallback(() => {
    if (activeBanners.length <= 1) return;
    const next = (currentIndex + 1) % activeBanners.length;
    goToSlide(next);
  }, [currentIndex, activeBanners.length, goToSlide]);

  const prevSlide = useCallback(() => {
    if (activeBanners.length <= 1) return;
    const prev = (currentIndex - 1 + activeBanners.length) % activeBanners.length;
    goToSlide(prev);
  }, [currentIndex, activeBanners.length, goToSlide]);

  // Auto-play cada 5 segundos
  useEffect(() => {
    if (activeBanners.length <= 1) return;
    const timer = setInterval(nextSlide, 5000);
    return () => clearInterval(timer);
  }, [nextSlide, activeBanners.length]);

  if (activeBanners.length === 0) {
    return (
      <div className="relative h-[42vh] md:h-[52vh] lg:h-[58vh] w-full bg-zinc-950 flex items-center justify-center">
        <p className="text-gray-500">No hay banners activos</p>
      </div>
    );
  }

  return (
    <div className="relative h-[38vh] md:h-[42vh] lg:h-[440px] w-full overflow-hidden">
      {/* Slides */}
      {activeBanners.map((banner, index) => (
        <div
          key={banner.id}
          className={`absolute inset-0 transition-opacity duration-500 ${
            index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {/* Imagen de fondo - Desktop */}
          <div className="absolute inset-0 hidden md:block bg-black">
            <img
              src={banner.imageDesktop}
              alt={banner.title}
              className="w-full h-full object-contain"
            />
          </div>

          {/* Imagen de fondo - Mobile */}
          <div className="absolute inset-0 md:hidden">
            <img
              src={banner.imageMobile}
              alt={banner.title}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Contenido */}
          <div className="absolute bottom-0 left-0 right-0 px-4 md:px-10 lg:px-12 pb-14 md:pb-16 lg:pb-20">
            <div className="max-w-2xl">
              {(banner.showTitle ?? true) && (
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-3 leading-tight">
                  {banner.title}
                </h1>
              )}
              
              {(banner.showSubtitle ?? true) && (
                <p className="text-white text-base md:text-lg mb-5 line-clamp-3 max-w-xl">
                  {banner.subtitle}
                </p>
              )}
              
              {(banner.showButton ?? true) && (
                <a
                  href={banner.buttonLink}
                  className="inline-flex items-center gap-2 text-white px-6 md:px-7 py-2.5 md:py-3 rounded-full font-semibold transition-all text-base md:text-lg hover:scale-105 hover:opacity-90"
                  style={{ backgroundColor: '#e91e8c' }}
                >
                  {banner.buttonText}
                </a>
              )}
            </div>
          </div>
        </div>
      ))}

      {/* Controles de navegación - Solo si hay más de 1 banner */}
      {activeBanners.length > 1 && (
        <>
          {/* Flechas laterales */}
          <button
            onClick={prevSlide}
            className="absolute left-2 md:left-3 top-1/2 -translate-y-1/2 z-20 p-1.5 md:p-2 text-white rounded-full transition-all hover:bg-white/10"
            aria-label="Anterior"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 md:right-3 top-1/2 -translate-y-1/2 z-20 p-1.5 md:p-2 text-white rounded-full transition-all hover:bg-white/10"
            aria-label="Siguiente"
          >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5" strokeWidth={2.5} />
          </button>

          {/* Indicadores (puntos) */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2 items-center">
            {activeBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'w-8' 
                    : 'w-3 bg-white/50 hover:bg-white/80'
                }`}
                style={index === currentIndex ? { backgroundColor: '#e91e8c' } : {}}
                aria-label={`Ir al slide ${index + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
