import { ShoppingCart, Search, Menu, User, Settings, X, Phone, Mail, Truck, Clock3, Sparkles, Gift } from 'lucide-react';
import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { ProductContext } from '../context/ProductContext';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  onSearch?: (query: string) => void;
}

export function Header({ cartCount, onCartClick, onSearch }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const context = useContext(ProductContext);
  const header = context?.storeConfig?.header;
  const topBar = context?.storeConfig?.topBar;
  const themeMode = context?.storeConfig?.themeMode || 'dark';
  const toggleTheme = () => context?.updateStoreConfig({ themeMode: themeMode === 'dark' ? 'light' : 'dark' });

  const renderTopBarIcon = (icon: string) => {
    switch (icon) {
      case 'phone': return <Phone className="w-3.5 h-3.5" />;
      case 'mail': return <Mail className="w-3.5 h-3.5" />;
      case 'truck': return <Truck className="w-3.5 h-3.5" />;
      case 'clock': return <Clock3 className="w-3.5 h-3.5" />;
      case 'sparkles': return <Sparkles className="w-3.5 h-3.5" />;
      case 'gift': return <Gift className="w-3.5 h-3.5" />;
      default: return null;
    }
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) onSearch(searchQuery);
  };

  if (!header) return null;

  // Altura del header
  const heightClass = header.headerHeight === 'compact' ? 'py-2' : header.headerHeight === 'tall' ? 'py-6' : 'py-4';

  // Tamaño del logo texto
  const logoSizeClass = header.logoSize === 'sm' ? 'text-lg md:text-xl'
    : header.logoSize === 'md' ? 'text-xl md:text-2xl'
    : header.logoSize === 'lg' ? 'text-2xl md:text-3xl'
    : 'text-3xl md:text-4xl';

  // Tamaño de fuente del menú
  const menuFontClass = header.menuFontSize === 'xs' ? 'text-xs'
    : header.menuFontSize === 'base' ? 'text-base'
    : 'text-sm';

  const menuWeightClass = header.menuFontWeight === 'normal' ? 'font-normal'
    : header.menuFontWeight === 'bold' ? 'font-bold'
    : 'font-medium';

  // Tema del header
  const isLightMode = themeMode === 'light';
  const effectiveHeaderBg = isLightMode ? 'rgba(255,255,255,0.96)' : `rgba(${hexToRgb(header.headerBgColor)}, ${header.headerBgOpacity / 100})`;
  const primaryTextColor = isLightMode ? '#111827' : '#ffffff';
  const secondaryTextColor = isLightMode ? '#374151' : header.menuColor;
  const hoverTextColor = isLightMode ? '#e91e8c' : header.menuHoverColor;
  const logoTextColor = isLightMode ? (header.logoColorLight || header.logoColor || '#dc2626') : (header.logoColorDark || header.logoColor || '#dc2626');
  const effectiveLogoImage = isLightMode
    ? (header.logoImageLight || header.logoImage || '')
    : (header.logoImageDark || header.logoImage || '');

  const positionClass = header.headerPosition === 'fixed' ? 'fixed' : 'relative';

  return (
    <>
      <div className={`${positionClass} top-0 left-0 right-0 z-[60]`}>
        {/* Barra superior editable */}
        {topBar?.enabled && topBar.items.some(item => item.enabled) && (
          <div
            className="w-full topbar-marquee"
            style={{
              background: topBar.useGradient
                ? `linear-gradient(90deg, ${topBar.gradientFrom}, ${topBar.gradientTo})`
                : topBar.bgColor,
              color: topBar.textColor,
            }}
          >
            <div className="topbar-marquee-track" style={{ animationDuration: `${topBar.speed || 18}s` }}>
              {[0, 1, 2, 3].map(copyIndex => (
                <div
                  key={copyIndex}
                  className={`topbar-marquee-content px-3 md:px-6 ${topBar.height === 'sm' ? 'py-2 text-[11px] md:text-sm' : topBar.height === 'lg' ? 'py-3 text-sm md:text-base' : 'py-2.5 text-xs md:text-sm'}`}
                >
                  {topBar.items.filter(item => item.enabled).map(item => (
                    <a
                      key={`${copyIndex}-${item.id}`}
                      href={item.link || '#'}
                      className="inline-flex items-center gap-2 font-medium opacity-95 hover:opacity-100 transition-opacity whitespace-nowrap"
                      style={{ color: topBar.textColor }}
                    >
                      {renderTopBarIcon(item.icon)}
                      <span>{item.text}</span>
                    </a>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Barra de anuncio */}
        {header.announcementBarVisible && (
          <div
            className="w-full text-center text-sm py-2 px-4 font-medium"
            style={{ backgroundColor: header.announcementBgColor, color: header.announcementTextColor }}
          >
            <a href={header.announcementLink || '#'} className="hover:underline">
              {header.announcementText}
            </a>
          </div>
        )}

        {/* Header principal */}
        <header
          className={`left-0 right-0 transition-all duration-300 ${header.headerBlur && isScrolled ? 'backdrop-blur-md' : ''}`}
          style={{
            backgroundColor: effectiveHeaderBg,
            boxShadow: isScrolled ? (isLightMode ? '0 4px 22px rgba(0,0,0,0.10)' : '0 2px 20px rgba(0,0,0,0.5)') : 'none',
            borderBottom: isLightMode ? '1px solid rgba(0,0,0,0.06)' : '1px solid rgba(255,255,255,0.04)',
          }}
        >
        <div className={`flex items-center justify-between px-4 ${heightClass} md:px-8`}>

          {/* Logo + Menú */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            {header.logoType === 'image' && effectiveLogoImage ? (
              <a href="/">
                <img src={effectiveLogoImage} alt="Logo" className="h-8 md:h-10 object-contain" />
              </a>
            ) : (
              <a
                href="/"
                className={`${logoSizeClass} font-bold tracking-tighter transition-opacity hover:opacity-80`}
                style={{ color: logoTextColor }}
              >
                {header.logoText || 'SHOPFLIX'}
              </a>
            )}

            {/* Menú desktop */}
            {header.menuVisible && (
              <nav className="hidden md:flex items-center gap-5">
                {header.menuItems.map((item, i) => (
                  <a
                    key={i}
                    href={item.link}
                    className={`${menuFontClass} ${menuWeightClass} transition-colors`}
                    style={{ color: i === 0 ? hoverTextColor : secondaryTextColor }}
                    onMouseEnter={e => (e.currentTarget.style.color = hoverTextColor)}
                    onMouseLeave={e => (e.currentTarget.style.color = i === 0 ? hoverTextColor : secondaryTextColor)}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
            )}
          </div>

          {/* Acciones derecha */}
          <div className="flex items-center gap-2 md:gap-4">

            {/* Búsqueda */}
            {header.showSearch && (
              <div className="relative">
                {searchOpen ? (
                  <form onSubmit={handleSearchSubmit} className="flex items-center gap-2">
                    <input
                      type="text"
                      placeholder="Buscar productos..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-black/50 border border-gray-600 rounded-full px-4 py-1.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-white w-36 md:w-56"
                      autoFocus
                      onBlur={() => !searchQuery && setSearchOpen(false)}
                    />
                    <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery(''); }} className="text-gray-400 hover:text-white">
                      <X className="w-4 h-4" />
                    </button>
                  </form>
                ) : (
                  <button onClick={() => setSearchOpen(true)} className="transition-colors p-2" style={{ color: primaryTextColor }} onMouseEnter={e => (e.currentTarget.style.color = '#e91e8c')} onMouseLeave={e => (e.currentTarget.style.color = primaryTextColor)}>
                    <Search className="w-5 h-5" />
                  </button>
                )}
              </div>
            )}

            {/* Switch Modo Oscuro/Claro */}
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border-2 transition-all duration-300 cursor-pointer"
              style={{
                backgroundColor: themeMode === 'dark' ? '#1e293b' : '#fef3c7',
                borderColor: themeMode === 'dark' ? '#818cf8' : '#f59e0b',
              }}
              title={themeMode === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {themeMode === 'dark' ? (
                <>
                  <span style={{ fontSize: '16px' }}>🌙</span>
                  <span className="hidden md:block text-xs font-semibold" style={{ color: '#a5b4fc' }}>Oscuro</span>
                </>
              ) : (
                <>
                  <span style={{ fontSize: '16px' }}>☀️</span>
                  <span className="hidden md:block text-xs font-semibold" style={{ color: '#d97706' }}>Claro</span>
                </>
              )}
            </button>

            {/* Carrito */}
            {header.showCart && (
              <button onClick={onCartClick} className="relative transition-colors p-2" style={{ color: primaryTextColor }} onMouseEnter={e => (e.currentTarget.style.color = '#e91e8c')} onMouseLeave={e => (e.currentTarget.style.color = primaryTextColor)}>
                <ShoppingCart className="w-5 h-5" />
                {header.showCartBadge && cartCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold"
                    style={{ backgroundColor: header.cartBadgeColor }}
                  >
                    {cartCount}
                  </span>
                )}
              </button>
            )}

            {/* Admin */}
            {header.showAdminIcon && (
              <Link to="/admin" className="hidden md:block text-[#25D366] hover:text-[#e91e8c] transition-colors p-2" title="Panel de Control">
                <Settings className="w-5 h-5" />
              </Link>
            )}

            {/* Usuario */}
            {header.showUserIcon && (
              <button className="hidden md:block transition-colors p-2" style={{ color: primaryTextColor }} onMouseEnter={e => (e.currentTarget.style.color = '#e91e8c')} onMouseLeave={e => (e.currentTarget.style.color = primaryTextColor)}>
                <User className="w-5 h-5" />
              </button>
            )}

            {/* Menú hamburguesa móvil */}
            {header.menuVisible && (
              <button
                className="md:hidden transition-colors p-2"
                style={{ color: primaryTextColor }}
                onMouseEnter={e => (e.currentTarget.style.color = '#e91e8c')}
                onMouseLeave={e => (e.currentTarget.style.color = primaryTextColor)}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>

        {/* Menú móvil desplegable */}
        {header.menuVisible && mobileMenuOpen && (
          <div className="md:hidden border-t border-white/10" style={{ backgroundColor: `rgba(${hexToRgb(header.headerBgColor)}, 0.98)` }}>
            <nav className="flex flex-col px-6 py-4 gap-4">
              {header.menuItems.map((item, i) => (
                <a
                  key={i}
                  href={item.link}
                  className={`${menuFontClass} ${menuWeightClass} py-1 transition-colors`}
                  style={{ color: header.menuColor }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </a>
              ))}
              <Link to="/admin" className="text-[#25D366] text-sm font-medium py-1" onClick={() => setMobileMenuOpen(false)}>
                ⚙️ Panel de Control
              </Link>
            </nav>
          </div>
        )}
        </header>
      </div>
    </>
  );
}

// Función auxiliar para convertir hex a rgb
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : '9, 9, 11';
}
