import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Product } from '../data/products';
import { ProductCard } from './ProductCard';

interface ProductRowProps {
  title: string;
  products: Product[];
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
}

export function ProductRow({ title, products, onAddToCart, onProductClick }: ProductRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const checkScrollButtons = () => {
    if (rowRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = rowRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const scrollAmount = direction === 'left' ? -800 : 800;
      rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(checkScrollButtons, 300);
    }
  };

  return (
    <div className="relative group py-4">
      {/* Título de la fila */}
      <h2 className="text-lg md:text-xl font-semibold mb-4 px-4 md:px-12 transition-colors cursor-pointer flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
        <span className="w-1 h-6 rounded-full inline-block mr-1" style={{ backgroundColor: '#e91e8c' }}></span>
        {title}
        <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: '#25D366' }} />
      </h2>

      {/* Contenedor con flechas */}
      <div className="relative">
        {/* Flecha izquierda */}
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 z-20 w-16 flex items-center justify-start pl-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(to right, var(--bg-primary), transparent)' }}
          >
            <div className="bg-black/50 hover:bg-black/80 rounded-full p-2 transition-colors">
              <ChevronLeft className="w-8 h-8 text-white" />
            </div>
          </button>
        )}

        {/* Flecha derecha */}
        {showRightArrow && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-0 z-20 w-16 flex items-center justify-end pr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: 'linear-gradient(to left, var(--bg-primary), transparent)' }}
          >
            <div className="bg-black/50 hover:bg-black/80 rounded-full p-2 transition-colors">
              <ChevronRight className="w-8 h-8 text-white" />
            </div>
          </button>
        )}

        {/* Carrusel de productos */}
        <div
          ref={rowRef}
          onScroll={checkScrollButtons}
          className="flex gap-3 md:gap-4 overflow-x-auto scrollbar-hide px-4 md:px-12 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onClick={() => onProductClick(product)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
