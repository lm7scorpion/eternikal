import { useState } from 'react';
import { Product } from '../data/products';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onClick: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative flex-shrink-0 cursor-pointer group card-product-size"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Contenedor imagen - RATIO 3:4 */}
      <div
        className="relative aspect-[3/4] rounded-md overflow-hidden"
        style={{ backgroundColor: 'var(--bg-card)' }}
      >
        {/* Imagen principal */}
        <img
          src={product.image}
          alt={product.name}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out ${
            product.hoverImage && isHovered ? 'md:opacity-0' : 'opacity-100'
          }`}
        />

        {/* Imagen Hover — solo desktop, solo si existe */}
        {product.hoverImage && (
          <img
            src={product.hoverImage}
            alt={`${product.name} - detalle`}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ease-in-out hidden md:block ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Badge (Más Vendido, Nuevo, Oferta…) */}
        {product.badge && (
          <span className="absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-0.5 rounded-full z-10" style={{ backgroundColor: '#e91e8c' }}>
            {product.badge}
          </span>
        )}

        {/* Precio en la esquina inferior derecha */}
        <div className="absolute bottom-2 right-2 text-white text-sm font-bold px-2 py-1 rounded-full z-10" style={{ backgroundColor: '#25D366' }}>
          S/ {product.price.toFixed(0)}
        </div>
      </div>

      {/* Nombre y precio tachado debajo */}
      <div className="mt-2 px-1">
        <h3
          className="text-sm font-medium truncate transition-colors"
          style={{ color: 'var(--text-primary)' }}
        >
          {product.name}
        </h3>
        <div className="flex items-center gap-1.5 mt-0.5">
          {/* Estrella SVG verde */}
          <svg className="w-3 h-3 fill-green-400 flex-shrink-0" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
          <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
            {product.rating}
          </span>
          {product.originalPrice && (
            <span className="text-xs line-through ml-1" style={{ color: 'var(--text-muted)' }}>
              S/ {product.originalPrice.toFixed(0)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
