import { useState, useMemo, useContext } from 'react';
import { Header } from '../components/Header';
import { Hero } from '../components/Hero';
import { CategoriesCircles } from '../components/CategoriesCircles';
import { ProductRow } from '../components/ProductRow';
import { ProductModal } from '../components/ProductModal';
import { Cart } from '../components/Cart';
import Checkout from '../components/Checkout';
import { Product } from '../data/products';
import { ProductContext } from '../context/ProductContext';

interface CartItem extends Product {
  quantity: number;
}

export function Store() {
  const context = useContext(ProductContext);
  if (!context) return null;
  const { products, banners, categories } = context;
  const topBar = context.storeConfig?.topBar;
  const header = context.storeConfig?.header;
  const topBarOffset = topBar?.enabled ? (topBar.height === 'lg' ? 44 : topBar.height === 'sm' ? 32 : 38) : 0;
  const announcementOffset = header?.announcementBarVisible ? 36 : 0;
  const mainTopPadding = 76 + topBarOffset + announcementOffset;

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutData, setCheckoutData] = useState<{total: number; subtotal: number; discount: number; complementsTotal: number}>({total: 0, subtotal: 0, discount: 0, complementsTotal: 0});

  // Agrupar productos por categoría (solo visibles, en orden)
  const productsByCategory = useMemo(() => {
    const grouped: Record<string, Product[]> = {};
    const sortedCats = [...categories].sort((a, b) => a.order - b.order);
    sortedCats.filter(c => c.isVisible).forEach(category => {
      const prods = products.filter(p => p.category === category.name);
      if (prods.length > 0) grouped[category.name] = prods;
    });
    return grouped;
  }, [products, categories]);

  // Productos filtrados por búsqueda
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return null;
    return products.filter(p => 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, products]);

  // Handlers
  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleAddToCart = (product: Product, qty: number = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      return [...prev, { ...product, quantity: qty }];
    });
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveItem = (productId: number) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // Si showCheckout está activo, mostrar página de checkout
  if (showCheckout) {
    return (
      <Checkout
        cartItems={cartItems}
        total={checkoutData.total}
        subtotal={checkoutData.subtotal}
        discount={checkoutData.discount}
        onBack={() => setShowCheckout(false)}
        onOpenCart={() => { setShowCheckout(false); setIsCartOpen(true); }}
      />
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
      <Header
        cartCount={cartCount}
        onCartClick={() => setIsCartOpen(true)}
        onSearch={handleSearch}
      />

      <main style={{ paddingTop: `${mainTopPadding}px` }}>
        {searchQuery && filteredProducts ? (
          <div className="pt-24 pb-12 px-4 md:px-12">
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--text-primary)' }}>
              Resultados para "{searchQuery}" ({filteredProducts.length})
            </h2>
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {filteredProducts.map(product => (
                  <div
                    key={product.id}
                    onClick={() => handleProductClick(product)}
                    className="cursor-pointer group"
                  >
                    <div className="aspect-[3/4] rounded-md overflow-hidden" style={{ backgroundColor: 'var(--bg-card)' }}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <h3 className="text-sm mt-2 truncate" style={{ color: 'var(--text-primary)' }}>{product.name}</h3>
                    <p className="font-bold" style={{ color: 'var(--accent)' }}>S/ {product.price.toFixed(2)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>No se encontraron productos</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 hover:opacity-80"
                  style={{ color: 'var(--accent)' }}
                >
                  Limpiar búsqueda
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Hero banners={banners} />
            <CategoriesCircles categories={categories} />

            <div className="relative z-10 pb-12 space-y-2" style={{ marginTop: '28px' }}>
              {Object.entries(productsByCategory).map(([categoryName, categoryProducts], index) => (
                categoryProducts.length > 0 && (
                  <div key={categoryName}>
                    <ProductRow
                      title={categoryName}
                      products={categoryProducts}
                      onAddToCart={handleAddToCart}
                      onProductClick={handleProductClick}
                    />
                    {(index + 1) % 2 === 0 && (() => {
                      const activeBanners = (context.storeConfig?.promoBanners || []).filter((b: any) => b.active);
                      const bannerIndex = Math.floor(index / 2);
                      const banner = activeBanners[bannerIndex % activeBanners.length];
                      if (!banner) return null;
                      return (
                        <div
                          key={`promo-${index}`}
                          className="mx-4 md:mx-12 my-6 rounded-2xl overflow-hidden relative"
                          style={{
                            background: `linear-gradient(135deg, ${banner.gradientFrom || '#e91e8c'}, ${banner.gradientTo || '#ff6b9d'})`,
                            minHeight: '160px',
                          }}
                        >
                          <div className="flex items-center justify-between p-8 h-full">
                            <div className="flex-1 z-10">
                              <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: banner.textColor === 'dark' ? '#1a1a1a' : '#ffffff' }}>
                                {banner.title}
                              </h2>
                              {banner.subtitle && (
                                <p className="mb-4 opacity-90 text-sm md:text-base" style={{ color: banner.textColor === 'dark' ? '#333' : '#fff' }}>
                                  {banner.subtitle}
                                </p>
                              )}
                              {banner.buttonText && (
                                <a
                                  href={banner.buttonLink || '#'}
                                  className="inline-block px-5 py-2 rounded-full text-sm font-medium transition-all hover:scale-105"
                                  style={{
                                    border: `2px solid ${banner.textColor === 'dark' ? '#1a1a1a' : '#ffffff'}`,
                                    color: banner.textColor === 'dark' ? '#1a1a1a' : '#ffffff',
                                    background: 'transparent'
                                  }}
                                >
                                  {banner.buttonText}
                                </a>
                              )}
                            </div>
                            {banner.image && (
                              <div className="hidden md:block w-48 h-32 ml-8 flex-shrink-0">
                                <img src={banner.image} alt={banner.title} className="w-full h-full object-contain" />
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )
              ))}
            </div>
          </>
        )}
      </main>

      <footer className="py-12 px-4 md:px-12" style={{ backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h4 className="text-xl font-bold mb-4" style={{ color: 'var(--accent)' }}>SHOPFLIX</h4>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                Tu tienda online con el mejor estilo. Encuentra los mejores productos al mejor precio.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Categorías</h5>
              <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <li><a href="#" className="hover:opacity-80 transition-opacity">Ramos de Rosas</a></li>
                <li><a href="#" className="hover:opacity-80 transition-opacity">Girasoles</a></li>
                <li><a href="#" className="hover:opacity-80 transition-opacity">Temáticos</a></li>
                <li><a href="#" className="hover:opacity-80 transition-opacity">Personalizados</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Ayuda</h5>
              <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <li><a href="#" className="hover:opacity-80 transition-opacity">Centro de ayuda</a></li>
                <li><a href="#" className="hover:opacity-80 transition-opacity">Envíos</a></li>
                <li><a href="#" className="hover:opacity-80 transition-opacity">Devoluciones</a></li>
                <li><a href="#" className="hover:opacity-80 transition-opacity">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Newsletter</h5>
              <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>Suscríbete para recibir ofertas exclusivas</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Tu email"
                  className="flex-1 rounded-l px-4 py-2 text-sm focus:outline-none"
                  style={{ backgroundColor: 'var(--bg-input)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                />
                <button className="px-4 py-2 rounded-r text-sm font-medium transition-colors" style={{ backgroundColor: 'var(--accent)', color: '#ffffff' }}>
                  Suscribir
                </button>
              </div>
            </div>
          </div>
          <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderTop: '1px solid var(--border-color)' }}>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              © 2025 Shopflix. Todos los derechos reservados.
            </p>
            <div className="flex gap-6 text-sm" style={{ color: 'var(--text-muted)' }}>
              <a href="#" className="hover:opacity-80">Privacidad</a>
              <a href="#" className="hover:opacity-80">Términos</a>
              <a href="#" className="hover:opacity-80">Cookies</a>
            </div>
          </div>
        </div>
      </footer>

      <ProductModal
        product={selectedProduct}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onAddToCart={handleAddToCart}
        cartCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        onOpenCart={() => { setIsModalOpen(false); setIsCartOpen(true); }}
      />

      <Cart
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={(data) => {
          setCheckoutData(data);
          setShowCheckout(true);
          setIsCartOpen(false);
        }}
      />
    </div>
  );
}
