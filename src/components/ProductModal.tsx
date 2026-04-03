import { X, ShoppingCart, Truck, Shield, Clock, CreditCard, Facebook, Share2, CalendarDays, Check } from 'lucide-react';
import { useState, useContext } from 'react';
import { ProductContext } from '../context/ProductContext';
import { Product } from '../data/products';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, qty: number) => void;
  cartCount?: number;
  onOpenCart?: () => void;
}

// Ícono X (Twitter/X)
const XIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.253 5.622 5.911-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

// Ícono WhatsApp
const WhatsAppIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

// Ícono Instagram
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
  </svg>
);

export function ProductModal({ product, isOpen, onClose, onAddToCart, cartCount = 0, onOpenCart }: ProductModalProps) {
  const context = useContext(ProductContext);
  const whatsappNumber = context?.storeConfig?.whatsappNumber || '51999888777';
  const productPage = context?.storeConfig?.productPage;
  const showBadge = productPage?.showBadgeOnImage ?? true;
  const features = productPage?.features || [
    { id: 1, icon: 'truck', text: 'Envío el mismo día', color: '#22c55e', enabled: true },
    { id: 2, icon: 'shield', text: 'Garantía de frescura', color: '#818cf8', enabled: true },
    { id: 3, icon: 'clock', text: 'Atención 24/7', color: '#c084fc', enabled: true },
  ];
  const paymentBadges = productPage?.paymentBadges || [];
  const [showToast, setShowToast] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [currentImage, setCurrentImage] = useState<'main' | 'hover'>('main');
  const [selectedDateOption, setSelectedDateOption] = useState<'today' | 'tomorrow' | 'custom'>('today');
  const [customDeliveryDate, setCustomDeliveryDate] = useState('');
  const [selectedTimeRange, setSelectedTimeRange] = useState<'morning' | 'afternoon'>('morning');

  if (!isOpen || !product) return null;

  const handleAddToCart = () => {
    onAddToCart(product, 1);
    // Mostrar toast con transición suave
    setShowToast(true);
    setTimeout(() => setToastVisible(true), 10); // pequeño delay para activar transición
    // Desaparecer suavemente a los 3 segundos
    setTimeout(() => setToastVisible(false), 3000);
    setTimeout(() => setShowToast(false), 3500); // remover del DOM después de la transición
  };

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(
      `¡Hola! Quiero comprar:\n\n🌸 *${product.name}*\n💰 Precio: S/ ${product.price.toFixed(2)}\n\n¿Está disponible?`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${msg}`, '_blank');
  };

  const discountPercentage = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0;

  const images = [
    product.image,
    ...(product.hoverImage ? [product.hoverImage] : []),
  ];

  const activeImage = currentImage === 'hover' && product.hoverImage ? product.hoverImage : product.image;

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = encodeURIComponent(`¡Mira este arreglo floral! ${product.name} - S/ ${product.price.toFixed(2)}`);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center md:items-center"
      style={{ padding: '0' }}
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

      {/* Contenedor principal del modal */}
      <div
        className="relative w-full h-full md:h-auto md:rounded-2xl md:max-w-[1229px] md:max-h-[80vh] shadow-2xl flex flex-col md:flex-row overflow-y-auto md:overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-modal)',
          border: '1px solid var(--border-color)',
          marginTop: '0',
          overscrollBehavior: 'contain',
          filter: toastVisible ? 'blur(4px)' : 'blur(0px)',
          transition: 'filter 0.4s ease',
        }}
      >
        {/* ── COLUMNA IZQUIERDA: Miniaturas + Imagen ── */}
        <div
          className="relative w-full md:w-[45%] flex-shrink-0 flex flex-col md:flex-row md:self-start md:sticky md:top-0"
          style={{ backgroundColor: 'var(--bg-card)' }}
        >


          {/* Imagen principal + badge + flechas */}
          <div className="relative flex-1">
            {/* Badge — controlado desde el panel admin */}
            {showBadge && product.badge && (
              <span
                className="absolute top-4 left-4 z-10 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg"
                style={{ backgroundColor: 'var(--accent)' }}
              >
                {product.badge}
              </span>
            )}

            {/* Imagen principal — ratio fijo 3:4 */}
            <div className="relative w-full overflow-hidden" style={{ aspectRatio: '3/4' }}>
              <img
                src={activeImage}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover transition-all duration-500"
              />

              {/* Flechas si hay imagen hover */}
              {product.hoverImage && (
                <>
                  <button
                    onClick={() => setCurrentImage('main')}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-opacity"
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      color: '#fff',
                      opacity: currentImage === 'hover' ? 1 : 0.4
                    }}
                  >
                    ‹
                  </button>
                  <button
                    onClick={() => setCurrentImage('hover')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center shadow-lg transition-opacity"
                    style={{
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      color: '#fff',
                      opacity: currentImage === 'main' ? 1 : 0.4
                    }}
                  >
                    ›
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Puntitos — DENTRO de la imagen en desktop, debajo en móvil */}
          {images.length > 1 && (
            <>
              {/* Desktop: puntitos encima de la imagen (absolute abajo centro) */}
              <div className="hidden md:flex absolute bottom-4 left-0 right-0 flex-row gap-2 justify-center z-20">
                {images.map((_, i) => {
                  const isActive = i === 0 ? currentImage === 'main' : currentImage === 'hover';
                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i === 0 ? 'main' : 'hover')}
                      className="rounded-full transition-all duration-300 focus:outline-none"
                      style={{
                        width: isActive ? '24px' : '10px',
                        height: '10px',
                        backgroundColor: isActive ? 'var(--accent)' : 'rgba(255,255,255,0.6)',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.4)',
                      }}
                    />
                  );
                })}
              </div>
              {/* Móvil: puntitos debajo de la imagen */}
              <div className="flex md:hidden flex-row gap-2 justify-center py-3" style={{ borderTop: '1px solid var(--border-color)' }}>
                {images.map((_, i) => {
                  const isActive = i === 0 ? currentImage === 'main' : currentImage === 'hover';
                  return (
                    <button
                      key={i}
                      onClick={() => setCurrentImage(i === 0 ? 'main' : 'hover')}
                      className="rounded-full transition-all duration-300 focus:outline-none"
                      style={{
                        width: isActive ? '22px' : '8px',
                        height: '8px',
                        backgroundColor: isActive ? 'var(--accent)' : 'var(--text-muted)',
                        opacity: isActive ? 1 : 0.5,
                      }}
                    />
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* ── COLUMNA DERECHA: Información ── */}
        <div className="flex-1 md:overflow-y-auto md:max-h-[80vh]">
          {/* Botón cerrar — fixed en móvil, absolute en desktop */}
          <button
            onClick={onClose}
            className="fixed md:absolute top-3 right-3 z-[200] w-9 h-9 rounded-full flex items-center justify-center transition-colors shadow-md"
            style={{ backgroundColor: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
          >
            <X className="w-5 h-5" />
          </button>

          <div className="p-5 md:p-7 flex flex-col gap-4">

            {/* Categoría */}
            <span className="text-xs font-bold uppercase tracking-widest" style={{ color: '#e91e8c' }}>
              {product.category}
            </span>

            {/* Título */}
            <h2 className="text-2xl md:text-3xl font-bold leading-tight pr-8" style={{ color: 'var(--text-primary)' }}>
              {product.name}
            </h2>

            {/* Precio */}
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl font-bold" style={{ color: '#e91e8c' }}>
                S/. {product.price.toFixed(2)}
              </span>
              {product.originalPrice && (
                <>
                  <span className="text-lg line-through" style={{ color: 'var(--text-muted)' }}>
                    S/ {product.originalPrice.toFixed(2)}
                  </span>
                  <span className="px-2 py-0.5 rounded text-sm font-bold" style={{ backgroundColor: '#22c55e20', color: '#22c55e' }}>
                    {discountPercentage}% OFF
                  </span>
                </>
              )}
            </div>

            {/* En Stock */}
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 inline-block"></span>
              <span className="text-sm font-semibold" style={{ color: '#22c55e' }}>En Stock</span>
            </div>

            {/* Separador */}
            <hr style={{ borderColor: 'var(--border-color)' }} />

            {/* Botones: Agregar al carrito + Comprar por WhatsApp */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Botón agregar al carrito */}
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-base text-white transition-all duration-300 shadow-md"
                style={{ backgroundColor: '#e91e8c' }}
              >
                <ShoppingCart className="w-5 h-5" /> Agregar al Carrito
              </button>

              {/* Botón Comprar por WhatsApp */}
              <button
                onClick={handleWhatsApp}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg font-bold text-base text-white transition-all duration-300 shadow-md"
                style={{ backgroundColor: '#25D366' }}
              >
                <WhatsAppIcon />
                Comprar por WhatsApp
              </button>
            </div>

            {/* Categorías y Etiquetas */}
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
              <span style={{ color: 'var(--text-muted)' }}>
                Categorías: <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{product.category}</span>
              </span>
              {product.badge && (
                <span style={{ color: 'var(--text-muted)' }}>
                  Etiquetas: <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{product.badge}</span>
                </span>
              )}
            </div>

            {/* Separador */}
            <hr style={{ borderColor: 'var(--border-color)' }} />

            {/* Compartir */}
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-semibold flex items-center gap-1" style={{ color: 'var(--text-primary)' }}>
                <Share2 className="w-4 h-4" /> Compartir:
              </span>
              {/* Facebook */}
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`}
                target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-opacity hover:opacity-80"
                style={{ backgroundColor: '#1877f2' }}
              >
                <Facebook className="w-4 h-4" />
              </a>
              {/* X/Twitter */}
              <a
                href={`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`}
                target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-opacity hover:opacity-80"
                style={{ backgroundColor: '#000' }}
              >
                <XIcon />
              </a>
              {/* WhatsApp */}
              <a
                href={`https://wa.me/?text=${shareText}%20${shareUrl}`}
                target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-opacity hover:opacity-80"
                style={{ backgroundColor: '#25d366' }}
              >
                <WhatsAppIcon />
              </a>
              {/* Instagram (abre perfil) */}
              <a
                href="https://www.instagram.com"
                target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-opacity hover:opacity-80"
                style={{ background: 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)' }}
              >
                <InstagramIcon />
              </a>

            </div>

            {/* Separador */}
            <hr style={{ borderColor: 'var(--border-color)' }} />

            {/* Descripción */}
            {product.description && (
              <div>
                <h3 className="text-base font-bold mb-3" style={{ color: 'var(--text-primary)' }}>
                  Descripción
                </h3>
                <ul className="space-y-2">
                  {product.description.split('.').filter(s => s.trim().length > 2).map((sentence, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                      <span className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: '#e91e8c' }}></span>
                      {sentence.trim()}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Contenido del Arreglo */}
            {product.arrangementContent && product.arrangementContent.length > 0 && (
              <>
                <hr style={{ borderColor: 'var(--border-color)' }} />
                <div>
                  {/* Título con barra lateral */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-1 h-6 rounded-full" style={{ backgroundColor: '#e91e8c' }}></div>
                    <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                      Contenido del Arreglo
                    </h3>
                  </div>
                  {/* Grid de items en 2 columnas */}
                  <div className="grid grid-cols-2 gap-2">
                    {product.arrangementContent.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-1.5 px-2 py-2 sm:px-3 sm:py-2.5 rounded-lg"
                        style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)' }}
                      >
                        {/* Icono con fondo */}
                        <div
                          className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-sm sm:text-lg"
                          style={{ backgroundColor: '#e91e8c20' }}
                        >
                          {item.emoji}
                        </div>
                        {/* Cantidad + Nombre */}
                        <div className="min-w-0 flex flex-wrap items-baseline gap-x-1">
                          <span className="font-bold text-xs sm:text-sm" style={{ color: '#e91e8c' }}>
                            {item.quantity}
                          </span>
                          <span className="text-xs sm:text-sm leading-tight break-words" style={{ color: 'var(--text-secondary)' }}>
                            {item.name}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Fecha y horario de entrega */}
            <>
              <hr style={{ borderColor: 'var(--border-color)' }} />
              <div className="space-y-5">
                {/* Fecha de entrega */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <CalendarDays className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                    <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                      Selecciona una fecha de entrega
                    </h3>
                  </div>

                  <div className="flex sm:grid sm:grid-cols-3 gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    {[
{ id: 'today', title: 'Para Hoy', date: '01/04', note: '(pide antes de las 5pm)' },
                       { id: 'tomorrow', title: 'Para Mañana', date: '02/04', note: '' },
                    ].map((option) => {
                      const active = selectedDateOption === option.id;
                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => setSelectedDateOption(option.id as 'today' | 'tomorrow')}
                          className="relative min-w-[190px] sm:min-w-0 rounded-2xl px-2.5 py-3 sm:px-4 sm:py-4 text-center transition-all duration-200 flex-shrink-0"
                          style={{
                            backgroundColor: active ? 'rgba(233,30,140,0.18)' : 'var(--bg-card)',
                            border: `2px solid ${active ? 'var(--accent)' : 'var(--border-color)'}`,
                            color: active ? 'var(--text-primary)' : 'var(--text-primary)',
                            boxShadow: active ? '0 10px 30px rgba(233,30,140,0.12)' : 'none'
                          }}
                        >
                          {active && (
                            <div
                              className="absolute -top-3 -right-3 w-9 h-9 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: '#fff', color: 'var(--accent)', boxShadow: '0 8px 18px rgba(0,0,0,0.18)' }}
                            >
                              <Check className="w-5 h-5" />
                            </div>
                          )}
<div className="text-sm sm:text-base md:text-lg font-bold mb-1">{option.title}</div>
                            <div className="text-sm sm:text-base font-semibold mb-0.5" style={{ color: active ? 'var(--accent)' : 'var(--text-primary)' }}>{option.date}</div>
                            {option.note && (
                              <div className="text-[11px] sm:text-xs md:text-sm leading-tight" style={{ color: active ? 'var(--text-primary)' : 'var(--text-muted)' }}>{option.note}</div>
                            )}
                        </button>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => setSelectedDateOption('custom')}
                      className="min-w-[190px] sm:min-w-0 rounded-2xl px-2.5 py-3 sm:px-4 sm:py-4 text-center transition-all duration-200 flex-shrink-0"
                      style={{
                        backgroundColor: selectedDateOption === 'custom' ? 'rgba(233,30,140,0.10)' : 'var(--bg-card)',
                        border: `2px solid ${selectedDateOption === 'custom' ? 'var(--accent)' : 'var(--border-color)'}`,
                        color: 'var(--text-primary)'
                      }}
                    >
                      <div className="text-sm sm:text-base md:text-lg font-bold mb-2 sm:mb-3">Otra Fecha</div>
                      <div
                        className="rounded-xl px-3 py-2.5 sm:px-4 sm:py-3 flex items-center justify-between gap-3"
                        style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)' }}
                      >
                        <div className="relative w-full">
                          <span
                            className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-sm"
                            style={{ color: customDeliveryDate ? 'transparent' : 'var(--text-primary)' }}
                          >
                            Click Aquí
                          </span>
                          <input
                            type="date"
                            value={customDeliveryDate}
                            onChange={(e) => {
                              setCustomDeliveryDate(e.target.value);
                              setSelectedDateOption('custom');
                            }}
                            className="w-full bg-transparent outline-none text-sm"
                            style={{ color: customDeliveryDate ? 'var(--text-primary)' : 'transparent', caretColor: 'var(--text-primary)' }}
                          />
                        </div>
                        
                      </div>
                    </button>
                  </div>
                </div>

                {/* Rango horario */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="w-4 h-4" style={{ color: 'var(--accent)' }} />
                    <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                      Selecciona un rango horario
                    </h3>
                  </div>

                  <div className="flex sm:grid sm:grid-cols-2 gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    {[
                      { id: 'morning', label: '9 am - 1 pm' },
                      { id: 'afternoon', label: '1pm - 5pm' },
                    ].map((slot) => {
                      const active = selectedTimeRange === slot.id;
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => setSelectedTimeRange(slot.id as 'morning' | 'afternoon')}
                          className="min-w-[190px] sm:min-w-0 flex-shrink-0 rounded-2xl py-2.5 px-3 sm:py-3 sm:px-4 text-center text-sm sm:text-base md:text-lg font-bold transition-all duration-200"
                          style={{
                            backgroundColor: active ? 'rgba(233,30,140,0.18)' : 'var(--bg-card)',
                            border: `2px solid ${active ? 'var(--accent)' : 'var(--border-color)'}`,
                            color: active ? 'var(--accent)' : 'var(--text-primary)',
                            boxShadow: active ? '0 10px 26px rgba(233,30,140,0.10)' : 'none'
                          }}
                        >
                          {slot.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </>

            {/* Envío / Garantía / Atención — dinámico desde panel admin */}
            {features.some(f => f.enabled) && (
              <div className="flex flex-wrap gap-4 py-2">
                {features.filter(f => f.enabled).map(f => {
                  const Icon = f.icon === 'truck' ? Truck : f.icon === 'shield' ? Shield : Clock;
                  return (
                    <div key={f.id} className="flex items-center gap-2">
                      <Icon className="w-5 h-5 flex-shrink-0" style={{ color: f.color }} />
                      <span className="text-sm font-medium" style={{ color: f.color }}>{f.text}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Métodos de Pago */}
            <div
              className="rounded-xl p-4"
              style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5" style={{ color: 'var(--text-primary)' }} />
                <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Métodos de Pago Aceptados</span>
              </div>

              {/* Métodos de pago — dinámicos desde panel admin */}
              <div className="flex flex-wrap items-center justify-center gap-3">
                {paymentBadges.filter(b => b.enabled).map(badge => (
                  <div
                    key={badge.id}
                    className="h-9 px-3 rounded-md flex items-center justify-center font-bold text-xs shadow-sm min-w-[56px]"
                    style={{ backgroundColor: badge.bgColor, color: badge.textColor }}
                  >
                    {badge.image ? (
                      <img src={badge.image} alt={badge.text} className="h-6 object-contain" />
                    ) : (
                      badge.text
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Botón flotante carrito rosado con latido - visible mientras haya items en carrito */}
      {(
        <button
          onClick={() => { onOpenCart?.(); }}
          className={`fixed bottom-6 right-6 z-[300] flex items-center justify-center rounded-full shadow-2xl ${cartCount > 0 ? 'animate-heartbeat' : ''}`}
          style={{
            backgroundColor: '#e91e8c',
            width: '62px',
            height: '62px',
            opacity: cartCount > 0 ? 1 : 0,
            transform: cartCount > 0 ? 'scale(1)' : 'scale(0.5)',
            transition: 'opacity 0.5s ease, transform 0.5s ease',
            border: '3px solid white',
          }}
          title="Ver carrito"
        >
          <ShoppingCart className="w-7 h-7 text-white" />
          {cartCount > 0 && (
            <span
              className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs"
              style={{ backgroundColor: '#25D366', border: '2px solid white' }}
            >
              {cartCount}
            </span>
          )}
        </button>
      )}

      {/* Toast "Añadido al carrito" */}
      {showToast && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none"
        >
          <div
            className="bg-white rounded-2xl shadow-2xl px-10 py-8 flex flex-col items-center gap-3 pointer-events-none"
            style={{
              opacity: toastVisible ? 1 : 0,
              transform: toastVisible ? 'scale(1) translateY(0)' : 'scale(0.85) translateY(20px)',
              transition: 'opacity 0.4s ease, transform 0.4s ease',
              minWidth: '280px',
              maxWidth: '340px',
            }}
          >
            {/* Círculo verde con check */}
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#25D366' }}
            >
              <svg viewBox="0 0 24 24" className="w-9 h-9 text-white fill-none stroke-white stroke-[3]">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            {/* Título */}
            <p className="text-gray-900 font-bold text-xl text-center">¡Añadido al carrito!</p>
            {/* Subtítulo con nombre del producto */}
            <p className="text-gray-500 text-sm text-center leading-snug">
              <span className="font-semibold text-gray-700">{product.name}</span>
              {' '}(1 unidad) se agregó correctamente
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
