import { useState, useContext } from 'react';
import { Plus, Pencil, Trash2, Home, Package, Search, X, Image, Eye, EyeOff, Settings, Layout, Menu, Type, Palette, Bell, Tag, GripVertical, ChevronUp, ChevronDown, Ticket, Gift, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductContext, Banner, HeaderConfig, Category, Coupon, Complement, DeliveryConfig, ProductPageConfig, ProductFeature, PaymentBadge } from '../context/ProductContext';
import { Product, ArrangementItem } from '../data/products';
import { toast, Toaster } from 'react-hot-toast';

const ARRANGEMENT_EMOJIS = ['🌹','🌸','🌻','🌺','💐','🌷','🍀','🌿','🌱','🎀','🎁','🧸','⭐','💫','🦋','🌙','☀️','❤️','🎊','🎉','📄','🪴','🌾','🍃','🌼','🌈','💎','🎈'];

type TabType = 'products' | 'banners' | 'categories' | 'coupons' | 'complements' | 'header' | 'topbar' | 'delivery' | 'payments' | 'promobanners' | 'productpage' | 'settings';
type HeaderSubTab = 'logo' | 'apariencia' | 'menu' | 'iconos' | 'anuncio';

export function Admin() {
  const context = useContext(ProductContext);
  if (!context) return null;
  const {
    products, banners, categories, coupons, storeConfig,
    addProduct, updateProduct, deleteProduct,
    addBanner, updateBanner, deleteBanner,
    addCategory, updateCategory, deleteCategory, reorderCategories,
    addCoupon, updateCoupon, deleteCoupon,
    updateStoreConfig, updateHeaderConfig
  } = context;

  const [activeTab, setActiveTab] = useState<TabType>('products');
  const [headerSubTab, setHeaderSubTab] = useState<HeaderSubTab>('logo');
  const [headerForm, setHeaderForm] = useState<HeaderConfig>({ ...storeConfig.header });
  const [topBarForm, setTopBarForm] = useState({ ...storeConfig.topBar });
  const [newMenuItem, setNewMenuItem] = useState({ label: '', link: '' });

  // Página del Producto
  const [productPageConfig, setProductPageConfig] = useState<ProductPageConfig>(
    storeConfig.productPage || {
      showBadgeOnImage: true,
      features: [
        { id: 1, icon: 'truck' as const, text: 'Envío el mismo día', color: '#22c55e', enabled: true },
        { id: 2, icon: 'shield' as const, text: 'Garantía de frescura', color: '#818cf8', enabled: true },
        { id: 3, icon: 'clock' as const, text: 'Atención 24/7', color: '#c084fc', enabled: true },
      ],
      paymentBadges: [
        { id: 1, text: 'VISA', bgColor: '#1a1f71', textColor: '#ffffff', image: '', enabled: true },
        { id: 2, text: 'Mastercard', bgColor: '#eb001b', textColor: '#ffffff', image: '', enabled: true },
        { id: 3, text: 'Yape', bgColor: '#7b2d8b', textColor: '#ffffff', image: '', enabled: true },
        { id: 4, text: 'Plin', bgColor: '#00c9b1', textColor: '#ffffff', image: '', enabled: true },
        { id: 5, text: 'BCP', bgColor: '#f68b1f', textColor: '#ffffff', image: '', enabled: true },
        { id: 6, text: 'Interbank', bgColor: '#007dc3', textColor: '#ffffff', image: '', enabled: true },
        { id: 7, text: 'BBVA', bgColor: '#004481', textColor: '#ffffff', image: '', enabled: true },
        { id: 8, text: 'Scotiabank', bgColor: '#ec1c24', textColor: '#ffffff', image: '', enabled: true },
        { id: 9, text: 'PagoEfectivo', bgColor: '#f5a623', textColor: '#ffffff', image: '', enabled: true },
      ],
    }
  );

  const saveProductPage = () => {
    updateStoreConfig({ productPage: productPageConfig });
    toast.success('✅ Página del producto guardada');
  };

  const updateFeature = (id: number, changes: Partial<ProductFeature>) => {
    setProductPageConfig(prev => ({
      ...prev,
      features: prev.features.map(f => f.id === id ? { ...f, ...changes } : f),
    }));
  };

  const updatePaymentBadge = (id: number, changes: Partial<PaymentBadge>) => {
    setProductPageConfig(prev => ({
      ...prev,
      paymentBadges: prev.paymentBadges.map(b => b.id === id ? { ...b, ...changes } : b),
    }));
  };

  const addPaymentBadge = () => {
    const newId = Math.max(...productPageConfig.paymentBadges.map(b => b.id), 0) + 1;
    setProductPageConfig(prev => ({
      ...prev,
      paymentBadges: [...prev.paymentBadges, { id: newId, text: 'Nuevo', bgColor: '#666666', textColor: '#ffffff', image: '', enabled: true }],
    }));
  };

  const removePaymentBadge = (id: number) => {
    setProductPageConfig(prev => ({
      ...prev,
      paymentBadges: prev.paymentBadges.filter(b => b.id !== id),
    }));
  };

  // Productos
  const [search, setSearch] = useState('');
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Banners
  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);

  // Categorías
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', emoji: '🌸', description: '', isVisible: true, circleColor: '#f9a8d4', circleImage: '' });

  // Cupones
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [couponSearch, setCouponSearch] = useState('');
  const [couponFilterStatus, setCouponFilterStatus] = useState<'all' | 'active' | 'inactive' | 'expired'>('all');

  // Complementos
  const [isComplementModalOpen, setIsComplementModalOpen] = useState(false);
  const [editingComplement, setEditingComplement] = useState<Complement | null>(null);
  const [complementSearch, setComplementSearch] = useState('');
  const [complementCategoryFilter, setComplementCategoryFilter] = useState<'all' | 'globos' | 'peluches' | 'chocolates'>('all');
  const [complementForm, setComplementForm] = useState<Omit<Complement, 'id'>>({
    name: '', brand: '', category: 'globos', size: 'Mediano', price: 0,
    image: '', description: '', isActive: true, stock: 10, featured: false,
  });
  const defaultCouponForm = {
    code: '', description: '', type: 'percentage' as 'percentage' | 'fixed' | 'free_shipping',
    value: '', minOrderAmount: '', maxUses: '', expiryDate: '',
    applicableCategories: [] as string[], applicableProducts: [] as number[],
    isActive: true, onePerUser: false,
  };
  const [couponForm, setCouponForm] = useState(defaultCouponForm);

  // Entrega
  const [deliveryForm, setDeliveryForm] = useState<DeliveryConfig>({ ...storeConfig.delivery });
  const [districtSearch, setDistrictSearch] = useState('');
  const [newDistrict, setNewDistrict] = useState({ name: '', price: 0, isActive: true });

  // Pagos (configuración directa vía updateStoreConfig)

  // Formulario producto
  const [productForm, setProductForm] = useState({
    name: '', description: '', price: '', originalPrice: '',
    image: '', hoverImage: '', category: categories[0]?.name || '', rating: '5', badge: ''
  });

  // Contenido del arreglo
  const [arrangementItems, setArrangementItems] = useState<ArrangementItem[]>([
    { id: 1, emoji: '🌹', quantity: 1, name: '' }
  ]);

  // Formulario banner
  const [bannerForm, setBannerForm] = useState({
    title: '', subtitle: '', imageDesktop: '', imageMobile: '',
    buttonText: 'Ver Colección', buttonLink: '#products',
    showTitle: true, showSubtitle: true, showButton: true,
    isActive: true, order: 1
  });

  // WhatsApp
  const [whatsappNumber, setWhatsappNumber] = useState(storeConfig.whatsappNumber);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );
  const activeBanners = banners.filter(b => b.isActive).sort((a, b) => a.order - b.order);
  const inactiveBanners = banners.filter(b => !b.isActive).sort((a, b) => a.order - b.order);
  const sortedCategories = [...categories].sort((a, b) => a.order - b.order);

  // ─── Handlers Header ────────────────────────────────────────
  const handleSaveHeader = () => { updateHeaderConfig(headerForm); toast.success('✅ Header guardado'); };
  const handleResetHeader = () => { setHeaderForm({ ...storeConfig.header }); toast('↩️ Cambios descartados', { icon: '⚠️' }); };
  const handleAddMenuItem = () => {
    if (!newMenuItem.label.trim()) return toast.error('Escribe el nombre del ítem');
    setHeaderForm(prev => ({ ...prev, menuItems: [...prev.menuItems, { label: newMenuItem.label, link: newMenuItem.link || '#' }] }));
    setNewMenuItem({ label: '', link: '' });
  };
  const handleRemoveMenuItem = (index: number) => {
    setHeaderForm(prev => ({ ...prev, menuItems: prev.menuItems.filter((_, i) => i !== index) }));
  };
  const handleUpdateMenuItem = (index: number, field: 'label' | 'link', value: string) => {
    setHeaderForm(prev => ({ ...prev, menuItems: prev.menuItems.map((item, i) => i === index ? { ...item, [field]: value } : item) }));
  };

  // ─── Handlers Productos ──────────────────────────────────────
  const handleOpenProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setProductForm({
        name: product.name, description: product.description,
        price: product.price.toString(), originalPrice: product.originalPrice?.toString() || '',
        image: product.image, hoverImage: product.hoverImage || '',
        category: product.category, rating: product.rating.toString(), badge: product.badge || ''
      });
      setArrangementItems(
        product.arrangementContent && product.arrangementContent.length > 0
          ? product.arrangementContent
          : [{ id: 1, emoji: '🌹', quantity: 1, name: '' }]
      );
    } else {
      setEditingProduct(null);
      setProductForm({ name: '', description: '', price: '', originalPrice: '', image: '', hoverImage: '', category: categories[0]?.name || '', rating: '5', badge: '' });
      setArrangementItems([{ id: 1, emoji: '🌹', quantity: 1, name: '' }]);
    }
    setIsProductModalOpen(true);
  };

  // Handlers contenido del arreglo
  const handleAddArrangementItem = () => {
    setArrangementItems(prev => [...prev, { id: Date.now(), emoji: '🌸', quantity: 1, name: '' }]);
  };
  const handleRemoveArrangementItem = (id: number) => {
    setArrangementItems(prev => prev.filter(item => item.id !== id));
  };
  const handleUpdateArrangementItem = (id: number, field: keyof ArrangementItem, value: string | number) => {
    setArrangementItems(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleSaveProduct = () => {
    if (!productForm.name.trim()) return toast.error('El nombre es obligatorio');
    if (!productForm.price || isNaN(Number(productForm.price))) return toast.error('El precio es obligatorio');
    if (!productForm.image.trim()) return toast.error('La imagen principal es obligatoria');
    const validItems = arrangementItems.filter(i => i.name.trim().length > 0);
    const data = {
      name: productForm.name, description: productForm.description,
      price: parseFloat(productForm.price), originalPrice: productForm.originalPrice ? parseFloat(productForm.originalPrice) : undefined,
      image: productForm.image, hoverImage: productForm.hoverImage || undefined,
      category: productForm.category, rating: parseFloat(productForm.rating) || 5,
      badge: productForm.badge || undefined,
      arrangementContent: validItems.length > 0 ? validItems : undefined
    };
    if (editingProduct) { updateProduct(editingProduct.id, data); toast.success('✅ Producto actualizado'); }
    else { addProduct(data); toast.success('✅ Producto creado'); }
    setIsProductModalOpen(false);
  };

  const handleDeleteProduct = (id: number) => {
    if (confirm('¿Eliminar este producto?')) { deleteProduct(id); toast.success('🗑️ Producto eliminado'); }
  };

  // ─── Handlers Banners ────────────────────────────────────────
  const handleOpenBannerModal = (banner?: Banner) => {
    if (banner) {
      setEditingBanner(banner);
      setBannerForm({
        title: banner.title,
        subtitle: banner.subtitle,
        imageDesktop: banner.imageDesktop,
        imageMobile: banner.imageMobile,
        buttonText: banner.buttonText,
        buttonLink: banner.buttonLink,
        showTitle: banner.showTitle ?? true,
        showSubtitle: banner.showSubtitle ?? true,
        showButton: banner.showButton ?? true,
        isActive: banner.isActive,
        order: banner.order,
      });
    } else {
      setEditingBanner(null);
      setBannerForm({
        title: '',
        subtitle: '',
        imageDesktop: '',
        imageMobile: '',
        buttonText: 'Ver Colección',
        buttonLink: '#products',
        showTitle: true,
        showSubtitle: true,
        showButton: true,
        isActive: true,
        order: banners.length + 1,
      });
    }
    setIsBannerModalOpen(true);
  };

  const handleSaveBanner = () => {
    if (!bannerForm.title.trim()) return toast.error('El título es obligatorio');
    if (!bannerForm.imageDesktop.trim()) return toast.error('La imagen de PC es obligatoria');
    if (!bannerForm.imageMobile.trim()) return toast.error('La imagen de móvil es obligatoria');
    if (editingBanner) { updateBanner(editingBanner.id, bannerForm); toast.success('✅ Banner actualizado'); }
    else { addBanner(bannerForm); toast.success('✅ Banner creado'); }
    setIsBannerModalOpen(false);
  };

  const handleDeleteBanner = (id: number) => {
    if (confirm('¿Eliminar este banner?')) { deleteBanner(id); toast.success('🗑️ Banner eliminado'); }
  };

  // ─── Handlers Categorías ─────────────────────────────────────
  const handleOpenCategoryModal = (category?: Category) => {
    if (category) {
      setEditingCategory(category);
      setCategoryForm({
        name: category.name,
        emoji: category.emoji,
        description: category.description,
        isVisible: category.isVisible,
        circleColor: category.circleColor || '#f9a8d4',
        circleImage: category.circleImage || ''
      });
    } else {
      setEditingCategory(null);
      setCategoryForm({ name: '', emoji: '🌸', description: '', isVisible: true, circleColor: '#f9a8d4', circleImage: '' });
    }
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = () => {
    if (!categoryForm.name.trim()) return toast.error('El nombre de la categoría es obligatorio');
    if (editingCategory) {
      updateCategory(editingCategory.id, categoryForm);
      toast.success('✅ Categoría actualizada');
    } else {
      addCategory({ ...categoryForm, order: categories.length + 1 });
      toast.success('✅ Categoría creada');
    }
    setIsCategoryModalOpen(false);
  };

  const handleDeleteCategory = (id: number, name: string) => {
    const inUse = products.some(p => p.category === name);
    if (inUse) return toast.error(`⚠️ La categoría "${name}" tiene productos. Muévelos primero.`);
    if (confirm('¿Eliminar esta categoría?')) { deleteCategory(id); toast.success('🗑️ Categoría eliminada'); }
  };

  const handleMoveCategory = (id: number, direction: 'up' | 'down') => {
    const sorted = [...categories].sort((a, b) => a.order - b.order);
    const idx = sorted.findIndex(c => c.id === id);
    if (direction === 'up' && idx === 0) return;
    if (direction === 'down' && idx === sorted.length - 1) return;
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    [sorted[idx], sorted[swapIdx]] = [sorted[swapIdx], sorted[idx]];
    reorderCategories(sorted);
  };

  const emojis = ['🌹', '🌸', '🌺', '🌻', '🌼', '💐', '🌷', '🪷', '🌿', '🍀', '🎀', '🎁', '🎊', '💝', '💖', '⭐', '✨', '🦋', '🐱', '🐶', '🦄', '🌙', '🎀', '🎨', '🍓', '🍰', '🧸', '👑'];

  // ─── Sidebar Tabs ─────────────────────────────────────────────
  const tabs = [
    { id: 'products' as TabType, icon: <Package size={18} />, label: 'Productos', count: products.length },
    { id: 'categories' as TabType, icon: <Tag size={18} />, label: 'Categorías', count: categories.length },
    { id: 'banners' as TabType, icon: <Image size={18} />, label: 'Banners', count: banners.length },
    { id: 'coupons' as TabType, icon: <Ticket size={18} />, label: 'Cupones', count: coupons.length },
    { id: 'complements' as TabType, icon: <Gift size={18} />, label: 'Complementos', count: context?.complements.length ?? 0 },
    { id: 'delivery' as TabType, icon: <span style={{fontSize:'16px'}}>🚚</span>, label: 'Entrega', count: null },
    { id: 'payments' as TabType, icon: <CreditCard size={18} />, label: 'Métodos de Pago', count: null },
    { id: 'topbar' as TabType, icon: <Bell size={18} />, label: 'Barra Superior', count: null },
    { id: 'promobanners' as TabType, icon: <Image size={18} />, label: 'Banners Promo', count: null },
    { id: 'productpage' as TabType, icon: <Package size={18} />, label: 'Página del Producto', count: null },
    { id: 'header' as TabType, icon: <Layout size={18} />, label: 'Header & Logo', count: null },
    { id: 'settings' as TabType, icon: <Settings size={18} />, label: 'Configuración', count: null },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 flex">
      <Toaster position="top-right" />

      {/* ── Sidebar ── */}
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col fixed h-full z-10">
        <div className="p-5 border-b border-zinc-800">
          <Link to="/" className="flex items-center gap-2 text-red-500 font-bold text-xl mb-1">
            <Home size={20} /> SHOPFLIX
          </Link>
          <p className="text-zinc-500 text-xs">Panel de Administración</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm transition-all ${activeTab === tab.id ? 'bg-red-600 text-white font-medium' : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'}`}>
              <span className="flex items-center gap-2">{tab.icon}{tab.label}</span>
              {tab.count !== null && <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-red-700' : 'bg-zinc-800 text-zinc-400'}`}>{tab.count}</span>}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-zinc-800">
          <Link to="/" className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm px-3 py-2 rounded-lg hover:bg-zinc-800 transition-all">
            <Eye size={16} /> Ver Tienda
          </Link>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 ml-64 p-8">

        {/* ══════════ PRODUCTOS ══════════ */}
        {activeTab === 'products' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-white">📦 Productos</h1>
                <p className="text-zinc-400 text-sm mt-1">{products.length} productos en total</p>
              </div>
              <button onClick={() => handleOpenProductModal()} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all">
                <Plus size={18} /> Nuevo Producto
              </button>
            </div>
            <div className="relative mb-4">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar producto o categoría..."
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-9 pr-4 py-2.5 text-white text-sm focus:outline-none focus:border-red-500" />
            </div>
            <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
              <table className="w-full">
                <thead><tr className="border-b border-zinc-800">
                  <th className="text-left text-zinc-400 text-xs font-medium px-4 py-3">PRODUCTO</th>
                  <th className="text-left text-zinc-400 text-xs font-medium px-4 py-3">CATEGORÍA</th>
                  <th className="text-left text-zinc-400 text-xs font-medium px-4 py-3">PRECIO</th>
                  <th className="text-left text-zinc-400 text-xs font-medium px-4 py-3">RATING</th>
                  <th className="text-left text-zinc-400 text-xs font-medium px-4 py-3">ACCIONES</th>
                </tr></thead>
                <tbody>
                  {filteredProducts.map(product => (
                    <tr key={product.id} className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={product.image} alt={product.name} className="w-10 h-14 object-cover rounded" onError={e => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40x56?text=?'; }} />
                          <div>
                            <p className="text-white text-sm font-medium line-clamp-1">{product.name}</p>
                            {product.badge && <span className="text-xs bg-red-600/20 text-red-400 px-2 py-0.5 rounded-full">{product.badge}</span>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-zinc-300 text-sm">{product.category}</td>
                      <td className="px-4 py-3">
                        <p className="text-white text-sm font-medium">S/ {product.price}</p>
                        {product.originalPrice && <p className="text-zinc-500 text-xs line-through">S/ {product.originalPrice}</p>}
                      </td>
                      <td className="px-4 py-3"><span className="text-yellow-400 text-sm">⭐ {product.rating}</span></td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => handleOpenProductModal(product)} className="p-1.5 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white rounded transition-all"><Pencil size={14} /></button>
                          <button onClick={() => handleDeleteProduct(product.id)} className="p-1.5 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded transition-all"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredProducts.length === 0 && <div className="text-center py-12 text-zinc-500">No se encontraron productos</div>}
            </div>
          </div>
        )}

        {/* ══════════ CATEGORÍAS ══════════ */}
        {activeTab === 'categories' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-white">🏷️ Categorías</h1>
                <p className="text-zinc-400 text-sm mt-1">{categories.length} categorías — cada una es una fila en tu tienda</p>
              </div>
              <button onClick={() => handleOpenCategoryModal()} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all">
                <Plus size={18} /> Nueva Categoría
              </button>
            </div>

            {/* Info */}
            <div className="bg-blue-600/10 border border-blue-600/30 rounded-xl p-4 mb-6 flex gap-3">
              <span className="text-blue-400 text-xl">💡</span>
              <div>
                <p className="text-blue-300 text-sm font-medium">¿Cómo funcionan las categorías?</p>
                <p className="text-blue-400/70 text-xs mt-1">Cada categoría que crees aparece como una <strong>fila horizontal</strong> en tu tienda, exactamente igual que Netflix. Puedes ordenarlas, ocultarlas temporalmente sin borrarlas, y ver cuántos productos tiene cada una.</p>
              </div>
            </div>

            {/* Lista de categorías */}
            <div className="space-y-3">
              {sortedCategories.map((cat, idx) => {
                const productCount = products.filter(p => p.category === cat.name).length;
                return (
                  <div key={cat.id} className={`bg-zinc-900 border rounded-xl p-4 flex items-center gap-4 transition-all ${cat.isVisible ? 'border-zinc-800' : 'border-zinc-800/50 opacity-60'}`}>
                    {/* Orden */}
                    <div className="flex flex-col gap-1">
                      <button onClick={() => handleMoveCategory(cat.id, 'up')} disabled={idx === 0}
                        className="p-1 text-zinc-500 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors rounded hover:bg-zinc-700">
                        <ChevronUp size={14} />
                      </button>
                      <GripVertical size={16} className="text-zinc-600 mx-auto" />
                      <button onClick={() => handleMoveCategory(cat.id, 'down')} disabled={idx === sortedCategories.length - 1}
                        className="p-1 text-zinc-500 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors rounded hover:bg-zinc-700">
                        <ChevronDown size={14} />
                      </button>
                    </div>

                    {/* Emoji / Círculo */}
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center text-2xl flex-shrink-0 overflow-hidden"
                      style={{ backgroundColor: cat.circleColor || '#f9a8d4' }}
                    >
                      {cat.circleImage ? (
                        <img src={cat.circleImage} alt={cat.name} className="w-full h-full object-cover" />
                      ) : (
                        cat.emoji
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-semibold text-sm">{cat.name}</h3>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${cat.isVisible ? 'bg-green-600/20 text-green-400' : 'bg-zinc-700 text-zinc-400'}`}>
                          {cat.isVisible ? '● Visible' : '○ Oculta'}
                        </span>
                      </div>
                      {cat.description && <p className="text-zinc-500 text-xs truncate">{cat.description}</p>}
                      <p className="text-zinc-600 text-xs mt-1">
                        {productCount === 0 ? 'Sin productos aún' : `${productCount} producto${productCount > 1 ? 's' : ''}`}
                      </p>
                    </div>

                    {/* Preview fila */}
                    <div className="hidden md:flex items-center gap-1 flex-shrink-0">
                      {products.filter(p => p.category === cat.name).slice(0, 4).map(p => (
                        <img key={p.id} src={p.image} alt={p.name}
                          className="w-8 h-11 object-cover rounded opacity-80"
                          onError={e => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/32x44?text=?'; }} />
                      ))}
                      {productCount > 4 && <span className="text-zinc-500 text-xs ml-1">+{productCount - 4}</span>}
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button onClick={() => updateCategory(cat.id, { isVisible: !cat.isVisible })}
                        className={`p-2 rounded-lg transition-all ${cat.isVisible ? 'bg-green-600/20 hover:bg-green-600 text-green-400 hover:text-white' : 'bg-zinc-700 hover:bg-zinc-600 text-zinc-400 hover:text-white'}`}
                        title={cat.isVisible ? 'Ocultar categoría' : 'Mostrar categoría'}>
                        {cat.isVisible ? <Eye size={15} /> : <EyeOff size={15} />}
                      </button>
                      <button onClick={() => handleOpenCategoryModal(cat)}
                        className="p-2 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white rounded-lg transition-all">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => handleDeleteCategory(cat.id, cat.name)}
                        className="p-2 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition-all">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                );
              })}

              {categories.length === 0 && (
                <div className="text-center py-16 text-zinc-500">
                  <Tag size={40} className="mx-auto mb-3 opacity-30" />
                  <p>No tienes categorías aún</p>
                  <p className="text-sm mt-1">Crea tu primera categoría para organizar tus productos</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════════ CUPONES ══════════ */}
        {activeTab === 'coupons' && (
          <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-white">🏷️ Cupones de Descuento</h1>
                <p className="text-zinc-400 text-sm mt-1">
                  {coupons.filter(c => c.isActive).length} activos · {coupons.filter(c => !c.isActive).length} inactivos · {coupons.length} total
                </p>
              </div>
              <button onClick={() => { setEditingCoupon(null); setCouponForm(defaultCouponForm); setIsCouponModalOpen(true); }}
                className="flex items-center gap-2 text-white px-4 py-2 rounded-lg font-medium transition-all hover:opacity-90"
                style={{ background: '#e91e8c' }}>
                <Plus size={18} /> Nuevo Cupón
              </button>
            </div>

            {/* Info box */}
            <div className="rounded-xl p-4 mb-6 border border-pink-500/20 bg-pink-500/5">
              <p className="text-pink-300 text-sm font-semibold mb-1">💡 ¿Cómo funcionan los cupones?</p>
              <p className="text-zinc-400 text-xs">Crea códigos que tus clientes ingresan en el carrito para obtener descuentos. Puedes crear cupones de <strong className="text-white">% porcentaje</strong>, <strong className="text-white">monto fijo</strong> o <strong className="text-white">envío gratis</strong>. Puedes limitarlos por categoría, monto mínimo, fecha y usos máximos.</p>
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap gap-2 mb-5">
              <input type="text" placeholder="🔍 Buscar cupón..." value={couponSearch}
                onChange={e => setCouponSearch(e.target.value)}
                className="bg-zinc-800 text-white border border-zinc-700 rounded-lg px-3 py-2 text-sm outline-none flex-1 min-w-[180px] focus:border-pink-500/50" />
              {(['all','active','inactive','expired'] as const).map(f => (
                <button key={f} onClick={() => setCouponFilterStatus(f)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${couponFilterStatus === f ? 'text-white border-pink-500' : 'text-zinc-400 border-zinc-700 hover:border-zinc-500'}`}
                  style={couponFilterStatus === f ? { background: '#e91e8c22', borderColor: '#e91e8c' } : {}}>
                  {f === 'all' ? 'Todos' : f === 'active' ? '✅ Activos' : f === 'inactive' ? '⏸ Inactivos' : '⏰ Expirados'}
                </button>
              ))}
            </div>

            {/* Lista de cupones */}
            <div className="space-y-3">
              {coupons
                .filter(c => {
                  const matchSearch = c.code.toLowerCase().includes(couponSearch.toLowerCase()) || c.description.toLowerCase().includes(couponSearch.toLowerCase());
                  const isExpired = c.expiryDate && new Date(c.expiryDate) < new Date();
                  if (couponFilterStatus === 'active') return matchSearch && c.isActive && !isExpired;
                  if (couponFilterStatus === 'inactive') return matchSearch && !c.isActive;
                  if (couponFilterStatus === 'expired') return matchSearch && isExpired;
                  return matchSearch;
                })
                .map(coupon => {
                  const isExpired = coupon.expiryDate && new Date(coupon.expiryDate) < new Date();
                  const usagePercent = coupon.maxUses > 0 ? Math.min((coupon.usedCount / coupon.maxUses) * 100, 100) : 0;
                  return (
                    <div key={coupon.id}
                      className={`rounded-xl border p-4 transition-all ${!coupon.isActive || isExpired ? 'opacity-60' : ''}`}
                      style={{ background: 'var(--bg-secondary)', borderColor: coupon.isActive && !isExpired ? 'rgba(233,30,140,0.3)' : 'var(--border-color)' }}>

                      <div className="flex flex-wrap items-start justify-between gap-3">
                        {/* Código y tipo */}
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                            style={{ background: 'rgba(233,30,140,0.12)' }}>
                            <Ticket size={22} style={{ color: '#e91e8c' }} />
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="text-white font-bold text-lg tracking-widest">{coupon.code}</span>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                                isExpired ? 'bg-red-500/20 text-red-400' :
                                coupon.isActive ? 'bg-green-500/20 text-green-400' : 'bg-zinc-700 text-zinc-400'
                              }`}>
                                {isExpired ? '⏰ Expirado' : coupon.isActive ? '✅ Activo' : '⏸ Inactivo'}
                              </span>
                              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${
                                coupon.type === 'percentage' ? 'bg-blue-500/20 text-blue-400' :
                                coupon.type === 'fixed' ? 'bg-purple-500/20 text-purple-400' : 'bg-green-500/20 text-green-400'
                              }`}>
                                {coupon.type === 'percentage' ? `${coupon.value}% OFF` :
                                 coupon.type === 'fixed' ? `S/ ${coupon.value} OFF` : '🚚 Envío Gratis'}
                              </span>
                            </div>
                            <p className="text-zinc-400 text-xs mt-0.5">{coupon.description}</p>
                          </div>
                        </div>

                        {/* Botones */}
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateCoupon(coupon.id, { isActive: !coupon.isActive })}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${coupon.isActive ? 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600' : 'bg-green-600/20 text-green-400 hover:bg-green-600/30'}`}>
                            {coupon.isActive ? '⏸ Pausar' : '▶ Activar'}
                          </button>
                          <button onClick={() => {
                            setEditingCoupon(coupon);
                            setCouponForm({
                              code: coupon.code, description: coupon.description,
                              type: coupon.type, value: String(coupon.value),
                              minOrderAmount: String(coupon.minOrderAmount), maxUses: String(coupon.maxUses),
                              expiryDate: coupon.expiryDate, applicableCategories: coupon.applicableCategories,
                              applicableProducts: coupon.applicableProducts, isActive: coupon.isActive,
                              onePerUser: coupon.onePerUser,
                            });
                            setIsCouponModalOpen(true);
                          }}
                            className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 transition-all">
                            <Pencil size={15} />
                          </button>
                          <button onClick={() => { if (window.confirm(`¿Eliminar cupón ${coupon.code}?`)) deleteCoupon(coupon.id); }}
                            className="p-1.5 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-all">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>

                      {/* Detalles */}
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
                        <div className="rounded-lg p-2 text-center" style={{ background: 'var(--bg-primary)' }}>
                          <p className="text-xs text-zinc-500">Mín. pedido</p>
                          <p className="text-white text-sm font-bold">S/ {coupon.minOrderAmount}</p>
                        </div>
                        <div className="rounded-lg p-2 text-center" style={{ background: 'var(--bg-primary)' }}>
                          <p className="text-xs text-zinc-500">Usos</p>
                          <p className="text-sm font-bold" style={{ color: usagePercent >= 80 ? '#e91e8c' : '#25D366' }}>
                            {coupon.usedCount} / {coupon.maxUses === 0 ? '∞' : coupon.maxUses}
                          </p>
                        </div>
                        <div className="rounded-lg p-2 text-center" style={{ background: 'var(--bg-primary)' }}>
                          <p className="text-xs text-zinc-500">Vence</p>
                          <p className={`text-sm font-bold ${isExpired ? 'text-red-400' : 'text-white'}`}>
                            {coupon.expiryDate ? new Date(coupon.expiryDate).toLocaleDateString('es-PE') : 'Sin límite'}
                          </p>
                        </div>
                        <div className="rounded-lg p-2 text-center" style={{ background: 'var(--bg-primary)' }}>
                          <p className="text-xs text-zinc-500">Aplica a</p>
                          <p className="text-white text-xs font-bold truncate">
                            {coupon.applicableCategories.length > 0 ? coupon.applicableCategories[0] : 'Todo el catálogo'}
                          </p>
                        </div>
                      </div>

                      {/* Barra de uso */}
                      {coupon.maxUses > 0 && (
                        <div className="mt-3">
                          <div className="flex justify-between text-xs text-zinc-500 mb-1">
                            <span>Usos: {coupon.usedCount} de {coupon.maxUses}</span>
                            <span>{usagePercent.toFixed(0)}%</span>
                          </div>
                          <div className="h-1.5 bg-zinc-700 rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all"
                              style={{ width: `${usagePercent}%`, background: usagePercent >= 80 ? '#e91e8c' : '#25D366' }} />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

              {coupons.length === 0 && (
                <div className="text-center py-16">
                  <Ticket size={48} className="mx-auto mb-3 opacity-20 text-zinc-400" />
                  <p className="text-zinc-400">No tienes cupones aún</p>
                  <p className="text-zinc-500 text-sm mt-1">Crea tu primer cupón para ofrecer descuentos</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ══════════ BANNERS ══════════ */}
        {activeTab === 'banners' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-white">🖼️ Banners del Carrusel</h1>
                <p className="text-zinc-400 text-sm mt-1">{activeBanners.length} activos · {inactiveBanners.length} inactivos</p>
              </div>
              <button onClick={() => handleOpenBannerModal()} className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all">
                <Plus size={18} /> Nuevo Banner
              </button>
            </div>
            {[...activeBanners, ...inactiveBanners].map(banner => (
              <div key={banner.id} className={`bg-zinc-900 border rounded-xl p-4 mb-3 flex gap-4 items-center ${banner.isActive ? 'border-zinc-700' : 'border-zinc-800 opacity-60'}`}>
                <img src={banner.imageDesktop} alt={banner.title} className="w-32 h-16 object-cover rounded-lg flex-shrink-0"
                  onError={e => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/128x64?text=Sin+Imagen'; }} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-white font-semibold text-sm truncate">{banner.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${banner.isActive ? 'bg-green-600/20 text-green-400' : 'bg-zinc-700 text-zinc-400'}`}>
                      {banner.isActive ? '● Activo' : '○ Inactivo'}
                    </span>
                  </div>
                  <p className="text-zinc-500 text-xs truncate">{banner.subtitle}</p>
                  <p className="text-zinc-600 text-xs mt-1">Botón: "{banner.buttonText}" → {banner.buttonLink}</p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => updateBanner(banner.id, { isActive: !banner.isActive })}
                    className={`p-2 rounded-lg transition-all ${banner.isActive ? 'bg-green-600/20 hover:bg-green-600 text-green-400 hover:text-white' : 'bg-zinc-700 hover:bg-zinc-600 text-zinc-400 hover:text-white'}`}>
                    {banner.isActive ? <Eye size={15} /> : <EyeOff size={15} />}
                  </button>
                  <button onClick={() => handleOpenBannerModal(banner)} className="p-2 bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white rounded-lg transition-all"><Pencil size={15} /></button>
                  <button onClick={() => handleDeleteBanner(banner.id)} className="p-2 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition-all"><Trash2 size={15} /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══════════ COMPLEMENTOS ══════════ */}
        {activeTab === 'complements' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-white">🎁 Complementos del Regalo</h1>
                <p className="text-zinc-400 text-sm mt-1">Gestiona globos, peluches y chocolates para complementar los arreglos</p>
              </div>
              <button onClick={() => {
                setEditingComplement(null);
                setComplementForm({ name: '', brand: '', category: 'globos', size: 'Mediano', price: 0, image: '', description: '', isActive: true, stock: 10, featured: false });
                setIsComplementModalOpen(true);
              }} className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-semibold transition-all hover:scale-105"
                style={{ background: '#e91e8c' }}>
                <Plus size={18} /> Nuevo Complemento
              </button>
            </div>

            {/* Filtros */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                <input type="text" placeholder="Buscar complemento..." value={complementSearch}
                  onChange={e => setComplementSearch(e.target.value)}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none focus:border-pink-500" />
              </div>
              <div className="flex gap-2 flex-wrap">
                {[
                  { key: 'all', label: '🎁 Todos' },
                  { key: 'globos', label: '🎈 Globos' },
                  { key: 'peluches', label: '🧸 Peluches' },
                  { key: 'chocolates', label: '🍫 Chocolates' },
                ].map(f => (
                  <button key={f.key}
                    onClick={() => setComplementCategoryFilter(f.key as typeof complementCategoryFilter)}
                    className="px-3 py-2 rounded-xl text-xs font-semibold border transition-all"
                    style={{
                      background: complementCategoryFilter === f.key ? '#e91e8c' : 'transparent',
                      borderColor: complementCategoryFilter === f.key ? '#e91e8c' : '#3f3f46',
                      color: complementCategoryFilter === f.key ? 'white' : '#a1a1aa',
                    }}>{f.label}</button>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Total', value: context?.complements.length ?? 0, color: '#e91e8c', emoji: '🎁' },
                { label: 'Globos', value: context?.complements.filter(c => c.category === 'globos').length ?? 0, color: '#3b82f6', emoji: '🎈' },
                { label: 'Peluches', value: context?.complements.filter(c => c.category === 'peluches').length ?? 0, color: '#8b5cf6', emoji: '🧸' },
                { label: 'Chocolates', value: context?.complements.filter(c => c.category === 'chocolates').length ?? 0, color: '#f59e0b', emoji: '🍫' },
              ].map(stat => (
                <div key={stat.label} className="bg-zinc-800 rounded-xl p-4 border border-zinc-700 text-center">
                  <div className="text-2xl mb-1">{stat.emoji}</div>
                  <div className="text-2xl font-bold text-white">{stat.value}</div>
                  <div className="text-xs text-zinc-400">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Grid de complementos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {(context?.complements ?? [])
                .filter(c => {
                  const matchSearch = c.name.toLowerCase().includes(complementSearch.toLowerCase()) || c.brand.toLowerCase().includes(complementSearch.toLowerCase());
                  const matchCat = complementCategoryFilter === 'all' || c.category === complementCategoryFilter;
                  return matchSearch && matchCat;
                })
                .map(comp => (
                  <div key={comp.id} className="bg-zinc-800 rounded-2xl border border-zinc-700 overflow-hidden flex flex-col">
                    {/* Imagen */}
                    <div className="relative aspect-square overflow-hidden bg-zinc-900">
                      {comp.image ? (
                        <img src={comp.image} alt={comp.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl">
                          {comp.category === 'globos' ? '🎈' : comp.category === 'peluches' ? '🧸' : '🍫'}
                        </div>
                      )}
                      {/* Badges */}
                      <div className="absolute top-2 left-2 flex flex-col gap-1">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${comp.isActive ? 'bg-green-500' : 'bg-zinc-500'}`}>
                          {comp.isActive ? '✓ Activo' : '⏸ Inactivo'}
                        </span>
                        {comp.featured && (
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: '#e91e8c' }}>⭐ Popular</span>
                        )}
                      </div>
                      <span className="absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full text-white capitalize"
                        style={{ background: comp.category === 'globos' ? '#3b82f6' : comp.category === 'peluches' ? '#8b5cf6' : '#f59e0b' }}>
                        {comp.category === 'globos' ? '🎈' : comp.category === 'peluches' ? '🧸' : '🍫'} {comp.category}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="p-4 flex flex-col flex-1">
                      <p className="text-xs text-zinc-400 mb-0.5">{comp.brand}</p>
                      <h3 className="font-bold text-white text-sm line-clamp-2 mb-1">{comp.name}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs px-2 py-0.5 bg-zinc-700 rounded-full text-zinc-300">{comp.size}</span>
                        <span className="text-xs text-zinc-400">Stock: {comp.stock}</span>
                      </div>
                      <p className="text-xs text-zinc-400 line-clamp-2 flex-1 mb-3">{comp.description}</p>

                      <div className="flex items-center justify-between">
                        <span className="font-bold text-lg" style={{ color: '#e91e8c' }}>S/. {comp.price.toFixed(2)}</span>
                        <div className="flex gap-2">
                          <button onClick={() => {
                            context?.updateComplement(comp.id, { isActive: !comp.isActive });
                          }} className="p-2 rounded-lg border border-zinc-600 hover:border-zinc-400 transition-colors text-zinc-300 hover:text-white">
                            {comp.isActive ? <EyeOff size={14} /> : <Eye size={14} />}
                          </button>
                          <button onClick={() => {
                            setEditingComplement(comp);
                            setComplementForm({ name: comp.name, brand: comp.brand, category: comp.category, size: comp.size, price: comp.price, image: comp.image, description: comp.description, isActive: comp.isActive, stock: comp.stock, featured: comp.featured });
                            setIsComplementModalOpen(true);
                          }} className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors text-white">
                            <Pencil size={14} />
                          </button>
                          <button onClick={() => {
                            if (confirm(`¿Eliminar "${comp.name}"?`)) context?.deleteComplement(comp.id);
                          }} className="p-2 rounded-lg bg-red-600 hover:bg-red-700 transition-colors text-white">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ══════════ ENTREGA ══════════ */}
        {activeTab === 'delivery' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-white">🚚 Configuración de Entrega</h1>
                <p className="text-zinc-400 text-sm mt-1">Configura las opciones de recojo y envío a domicilio</p>
              </div>
              <button
                onClick={() => {
                  updateStoreConfig({ ...storeConfig, delivery: deliveryForm });
                  toast.success('¡Configuración de entrega guardada!');
                }}
                className="px-5 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg font-medium transition-all"
              >💾 Guardar Entrega</button>
            </div>

            <div className="grid grid-cols-1 gap-6">

              {/* RECOJO EN TIENDA */}
              <div className="bg-zinc-800 rounded-xl p-6 border border-zinc-700">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                      <span className="text-xl">📍</span>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Recojo en Tienda</h2>
                      <p className="text-zinc-400 text-xs">Datos de tu local físico</p>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-sm text-zinc-400">Habilitado</span>
                    <div
                      onClick={() => setDeliveryForm(p => ({ ...p, pickupEnabled: !p.pickupEnabled }))}
                      className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${deliveryForm.pickupEnabled ? 'bg-green-500' : 'bg-zinc-600'}`}
                      style={{ position: 'relative' }}
                    >
                      <div style={{ position: 'absolute', top: '2px', left: deliveryForm.pickupEnabled ? '26px' : '2px', width: '20px', height: '20px', borderRadius: '50%', background: 'white', transition: 'left 0.2s' }} />
                    </div>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-xs font-bold text-zinc-400 block mb-1">Nombre de la Tienda</label>
                    <input value={deliveryForm.storeName} onChange={e => setDeliveryForm(p => ({ ...p, storeName: e.target.value }))}
                      className="w-full bg-zinc-700 border border-zinc-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-bold text-zinc-400 block mb-1">Dirección Completa</label>
                    <input value={deliveryForm.storeAddress} onChange={e => setDeliveryForm(p => ({ ...p, storeAddress: e.target.value }))}
                      className="w-full bg-zinc-700 border border-zinc-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-400 block mb-1">Distrito / Zona</label>
                    <input value={deliveryForm.storeDistrict} onChange={e => setDeliveryForm(p => ({ ...p, storeDistrict: e.target.value }))}
                      className="w-full bg-zinc-700 border border-zinc-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-400 block mb-1">Teléfono</label>
                    <input value={deliveryForm.storePhone} onChange={e => setDeliveryForm(p => ({ ...p, storePhone: e.target.value }))}
                      placeholder="+51 999 999 999"
                      className="w-full bg-zinc-700 border border-zinc-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-400 block mb-1">Horario de Atención</label>
                    <input value={deliveryForm.storeSchedule} onChange={e => setDeliveryForm(p => ({ ...p, storeSchedule: e.target.value }))}
                      placeholder="Lun-Dom: 8:00 AM - 10:00 PM"
                      className="w-full bg-zinc-700 border border-zinc-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-400 block mb-1">Tiempo de preparación</label>
                    <input value={deliveryForm.pickupReadyTime} onChange={e => setDeliveryForm(p => ({ ...p, pickupReadyTime: e.target.value }))}
                      placeholder="2-4 horas"
                      className="w-full bg-zinc-700 border border-zinc-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500" />
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-bold text-zinc-400 block mb-1">🗺️ Embed de Google Maps (iframe src)</label>
                    <textarea value={deliveryForm.storeMapEmbed} onChange={e => setDeliveryForm(p => ({ ...p, storeMapEmbed: e.target.value }))}
                      rows={2} placeholder="https://www.google.com/maps/embed?pb=..."
                      className="w-full bg-zinc-700 border border-zinc-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500 resize-none" />
                    <p className="text-zinc-500 text-xs mt-1">Ve a Google Maps → Compartir → Insertar mapa → copia solo el valor del atributo src del iframe</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-xs font-bold text-zinc-400 block mb-1">🔗 Link directo de Google Maps</label>
                    <input value={deliveryForm.storeMapLink} onChange={e => setDeliveryForm(p => ({ ...p, storeMapLink: e.target.value }))}
                      placeholder="https://maps.google.com/?q=..."
                      className="w-full bg-zinc-700 border border-zinc-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500" />
                  </div>
                </div>
              </div>

              {/* ENVÍO A DOMICILIO */}
              <div className="bg-zinc-800 rounded-xl p-6 border border-zinc-700">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-pink-500/20 flex items-center justify-center">
                      <span className="text-xl">🚚</span>
                    </div>
                    <div>
                      <h2 className="text-lg font-bold text-white">Envío a Domicilio</h2>
                      <p className="text-zinc-400 text-xs">Distritos y costos de envío</p>
                    </div>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-sm text-zinc-400">Habilitado</span>
                    <div
                      onClick={() => setDeliveryForm(p => ({ ...p, deliveryEnabled: !p.deliveryEnabled }))}
                      className={`w-12 h-6 rounded-full transition-colors cursor-pointer ${deliveryForm.deliveryEnabled ? 'bg-pink-500' : 'bg-zinc-600'}`}
                      style={{ position: 'relative' }}
                    >
                      <div style={{ position: 'absolute', top: '2px', left: deliveryForm.deliveryEnabled ? '26px' : '2px', width: '20px', height: '20px', borderRadius: '50%', background: 'white', transition: 'left 0.2s' }} />
                    </div>
                  </label>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="text-xs font-bold text-zinc-400 block mb-1">Tiempo de entrega</label>
                    <input value={deliveryForm.deliveryTime} onChange={e => setDeliveryForm(p => ({ ...p, deliveryTime: e.target.value }))}
                      placeholder="2-4 horas"
                      className="w-full bg-zinc-700 border border-zinc-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-zinc-400 block mb-1">Descripción del servicio</label>
                    <input value={deliveryForm.deliveryNote} onChange={e => setDeliveryForm(p => ({ ...p, deliveryNote: e.target.value }))}
                      placeholder="Entregamos las flores donde tú indiques"
                      className="w-full bg-zinc-700 border border-zinc-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500" />
                  </div>
                </div>

                {/* Distritos */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-bold text-white">📍 Distritos y costos de envío</h3>
                    <span className="text-xs text-zinc-400">{deliveryForm.districts.filter(d => d.isActive).length} activos</span>
                  </div>

                  {/* Buscador */}
                  <div className="relative mb-3">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
                    <input value={districtSearch} onChange={e => setDistrictSearch(e.target.value)}
                      placeholder="Buscar distrito..."
                      className="w-full bg-zinc-700 border border-zinc-600 text-white rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-pink-500" />
                  </div>

                  {/* Lista de distritos */}
                  <div className="space-y-2 max-h-64 overflow-y-auto mb-4">
                    {deliveryForm.districts.filter(d => d.name.toLowerCase().includes(districtSearch.toLowerCase())).map((district, idx) => (
                      <div key={idx} className="flex items-center gap-3 bg-zinc-700 rounded-lg px-3 py-2">
                        <button
                          onClick={() => setDeliveryForm(p => ({
                            ...p,
                            districts: p.districts.map((d, i) => p.districts.indexOf(district) === i ? { ...d, isActive: !d.isActive } : d)
                          }))}
                          className={`w-8 h-5 rounded-full transition-colors flex-shrink-0 ${district.isActive ? 'bg-green-500' : 'bg-zinc-500'}`}
                          style={{ position: 'relative' }}
                        >
                          <div style={{ position: 'absolute', top: '1px', left: district.isActive ? '14px' : '1px', width: '14px', height: '14px', borderRadius: '50%', background: 'white', transition: 'left 0.2s' }} />
                        </button>
                        <span className="text-sm text-white flex-1">{district.name}</span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-zinc-400">S/</span>
                          <input
                            type="number" min="0" value={district.price}
                            onChange={e => setDeliveryForm(p => ({
                              ...p,
                              districts: p.districts.map((d, i) => p.districts.indexOf(district) === i ? { ...d, price: parseFloat(e.target.value) || 0 } : d)
                            }))}
                            className="w-16 bg-zinc-600 border border-zinc-500 text-white rounded px-2 py-1 text-sm text-center focus:outline-none"
                          />
                        </div>
                        <button
                          onClick={() => setDeliveryForm(p => ({ ...p, districts: p.districts.filter((_, i) => p.districts.indexOf(district) !== i) }))}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Agregar nuevo distrito */}
                  <div className="border border-dashed border-zinc-600 rounded-lg p-3">
                    <p className="text-xs font-bold text-zinc-400 mb-2">➕ Agregar nuevo distrito</p>
                    <div className="flex gap-2">
                      <input value={newDistrict.name} onChange={e => setNewDistrict(p => ({ ...p, name: e.target.value }))}
                        placeholder="Nombre del distrito"
                        className="flex-1 bg-zinc-700 border border-zinc-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500" />
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-zinc-400">S/</span>
                        <input type="number" min="0" value={newDistrict.price} onChange={e => setNewDistrict(p => ({ ...p, price: parseFloat(e.target.value) || 0 }))}
                          className="w-16 bg-zinc-700 border border-zinc-600 text-white rounded-lg px-2 py-2 text-sm text-center focus:outline-none focus:border-pink-500" />
                      </div>
                      <button
                        onClick={() => {
                          if (!newDistrict.name.trim()) return;
                          setDeliveryForm(p => ({ ...p, districts: [...p.districts, { ...newDistrict, isActive: true }] }));
                          setNewDistrict({ name: '', price: 0, isActive: true });
                          toast.success('Distrito agregado');
                        }}
                        className="px-3 py-2 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-sm font-medium transition-all"
                      >
                        Agregar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════ MÉTODOS DE PAGO ══════════ */}
        {activeTab === 'payments' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold" style={{ color: '#e91e8c' }}>💳 Métodos de Pago</h1>
                <p className="text-zinc-400 text-sm mt-1">Configura Yape y Plin con tu número, titular y código QR</p>
              </div>
            </div>

            {/* YAPE */}
            <div className="bg-zinc-900 rounded-2xl p-6 mb-6 border border-zinc-800">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl bg-purple-600 flex items-center justify-center text-white font-bold text-lg">Y</div>
                <div>
                  <h2 className="text-white font-bold text-lg">Yape</h2>
                  <p className="text-zinc-400 text-sm">Pago por QR o número de teléfono</p>
                </div>
                <div className="ml-auto">
                  <div
                    onClick={() => updateStoreConfig({ ...storeConfig, payment: { ...storeConfig.payment, yape: { ...storeConfig.payment.yape, enabled: !storeConfig.payment.yape.enabled } } })}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${storeConfig.payment.yape.enabled ? 'bg-green-500' : 'bg-zinc-600'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${storeConfig.payment.yape.enabled ? 'left-7' : 'left-1'}`} />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-zinc-300 block mb-1.5">📱 Número de Yape</label>
                  <input
                    type="text"
                    value={storeConfig.payment.yape.accountNumber}
                    onChange={e => updateStoreConfig({ ...storeConfig, payment: { ...storeConfig.payment, yape: { ...storeConfig.payment.yape, accountNumber: e.target.value } } })}
                    placeholder="Ej: 926 885 380"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-300 block mb-1.5">👤 Nombre del Titular</label>
                  <input
                    type="text"
                    value={storeConfig.payment.yape.accountHolder}
                    onChange={e => updateStoreConfig({ ...storeConfig, payment: { ...storeConfig.payment, yape: { ...storeConfig.payment.yape, accountHolder: e.target.value } } })}
                    placeholder="Ej: RONALD HUAMAN RIVERA"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-purple-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-zinc-300 block mb-1.5">
                    🖼️ URL del Código QR &nbsp;
                    <span className="inline-flex gap-1 text-xs">
                      <span className="bg-blue-500 text-white px-1.5 py-0.5 rounded">PNG</span>
                      <span className="bg-green-600 text-white px-1.5 py-0.5 rounded">JPG</span>
                      <span className="bg-purple-500 text-white px-1.5 py-0.5 rounded">500×500px</span>
                    </span>
                  </label>
                  <input
                    type="url"
                    value={storeConfig.payment.yape.qrImage}
                    onChange={e => updateStoreConfig({ ...storeConfig, payment: { ...storeConfig.payment, yape: { ...storeConfig.payment.yape, qrImage: e.target.value } } })}
                    placeholder="https://res.cloudinary.com/... (URL de tu QR de Yape)"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-purple-500"
                  />
                  <p className="text-zinc-500 text-xs mt-1">📌 Abre tu app Yape → Mi QR → Captura pantalla → Súbela a Cloudinary y pega el link aquí</p>
                  {storeConfig.payment.yape.qrImage && (
                    <div className="mt-3 w-32 h-32 rounded-xl overflow-hidden border-2 border-purple-500">
                      <img src={storeConfig.payment.yape.qrImage} alt="QR Yape" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* PLIN */}
            <div className="bg-zinc-900 rounded-2xl p-6 mb-6 border border-zinc-800">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl bg-teal-500 flex items-center justify-center text-white font-bold text-lg">P</div>
                <div>
                  <h2 className="text-white font-bold text-lg">Plin</h2>
                  <p className="text-zinc-400 text-sm">Pago por QR o número de teléfono</p>
                </div>
                <div className="ml-auto">
                  <div
                    onClick={() => updateStoreConfig({ ...storeConfig, payment: { ...storeConfig.payment, plin: { ...storeConfig.payment.plin, enabled: !storeConfig.payment.plin.enabled } } })}
                    className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer ${storeConfig.payment.plin.enabled ? 'bg-green-500' : 'bg-zinc-600'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${storeConfig.payment.plin.enabled ? 'left-7' : 'left-1'}`} />
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-zinc-300 block mb-1.5">📱 Número de Plin</label>
                  <input
                    type="text"
                    value={storeConfig.payment.plin.accountNumber}
                    onChange={e => updateStoreConfig({ ...storeConfig, payment: { ...storeConfig.payment, plin: { ...storeConfig.payment.plin, accountNumber: e.target.value } } })}
                    placeholder="Ej: 926 885 380"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-teal-500"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-300 block mb-1.5">👤 Nombre del Titular</label>
                  <input
                    type="text"
                    value={storeConfig.payment.plin.accountHolder}
                    onChange={e => updateStoreConfig({ ...storeConfig, payment: { ...storeConfig.payment, plin: { ...storeConfig.payment.plin, accountHolder: e.target.value } } })}
                    placeholder="Ej: RONALD HUAMAN RIVERA"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-teal-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-zinc-300 block mb-1.5">
                    🖼️ URL del Código QR &nbsp;
                    <span className="inline-flex gap-1 text-xs">
                      <span className="bg-blue-500 text-white px-1.5 py-0.5 rounded">PNG</span>
                      <span className="bg-green-600 text-white px-1.5 py-0.5 rounded">JPG</span>
                      <span className="bg-teal-500 text-white px-1.5 py-0.5 rounded">500×500px</span>
                    </span>
                  </label>
                  <input
                    type="url"
                    value={storeConfig.payment.plin.qrImage}
                    onChange={e => updateStoreConfig({ ...storeConfig, payment: { ...storeConfig.payment, plin: { ...storeConfig.payment.plin, qrImage: e.target.value } } })}
                    placeholder="https://res.cloudinary.com/... (URL de tu QR de Plin)"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-teal-500"
                  />
                  <p className="text-zinc-500 text-xs mt-1">📌 Abre tu app Plin → Mi QR → Captura pantalla → Súbela a Cloudinary y pega el link aquí</p>
                  {storeConfig.payment.plin.qrImage && (
                    <div className="mt-3 w-32 h-32 rounded-xl overflow-hidden border-2 border-teal-500">
                      <img src={storeConfig.payment.plin.qrImage} alt="QR Plin" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="bg-blue-950 border border-blue-800 rounded-2xl p-5">
              <h3 className="text-blue-300 font-semibold mb-2">💡 ¿Cómo obtener tu código QR?</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-200">
                <div>
                  <p className="font-medium text-purple-300 mb-1">Yape:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Abre la app de Yape</li>
                    <li>Toca tu foto de perfil</li>
                    <li>Selecciona "Mi código QR"</li>
                    <li>Captura la pantalla</li>
                    <li>Súbela a Cloudinary y pega el link arriba</li>
                  </ol>
                </div>
                <div>
                  <p className="font-medium text-teal-300 mb-1">Plin:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    <li>Abre tu app de banco (BBVA, BCP, etc.)</li>
                    <li>Ve a la sección Plin</li>
                    <li>Selecciona "Cobrar con QR"</li>
                    <li>Captura la pantalla</li>
                    <li>Súbela a Cloudinary y pega el link arriba</li>
                  </ol>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ══════════ BANNERS PROMO ══════════ */}
        {activeTab === 'promobanners' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold" style={{ color: '#e91e8c' }}>🎨 Banners Promo</h1>
                <p className="text-zinc-400 text-sm mt-1">Banners estáticos que aparecen entre las filas de productos</p>
              </div>
              <button
                onClick={() => {
                  const newBanner = {
                    id: Date.now(),
                    title: 'Nuevo Banner',
                    subtitle: 'Subtítulo del banner',
                    buttonText: 'Ver colección',
                    buttonLink: '#',
                    gradientFrom: '#e91e8c',
                    gradientTo: '#25D366',
                    textColor: 'light' as const,
                    image: '',
                    active: true,
                  };
                  context.updateStoreConfig({ promoBanners: [...(context.storeConfig.promoBanners || []), newBanner] });
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-white font-semibold"
                style={{ background: '#e91e8c' }}
              >
                <Plus size={18} /> Nuevo Banner Promo
              </button>
            </div>

            {(context.storeConfig.promoBanners || []).length === 0 && (
              <div className="text-center py-16 text-zinc-500">
                <Image size={48} className="mx-auto mb-4 opacity-30" />
                <p className="text-lg">No hay banners promo todavía</p>
                <p className="text-sm">Haz clic en "Nuevo Banner Promo" para crear uno</p>
              </div>
            )}

            {(context.storeConfig.promoBanners || []).map((banner: any, index: number) => (
              <div key={banner.id} className="rounded-xl overflow-hidden border border-zinc-700">
                {/* Preview del banner */}
                <div
                  className="p-6 flex items-center justify-between relative overflow-hidden"
                  style={{ background: `linear-gradient(135deg, ${banner.gradientFrom}, ${banner.gradientTo})`, minHeight: '120px' }}
                >
                  <div>
                    <h3 className={`text-xl font-bold ${banner.textColor === 'light' ? 'text-white' : 'text-gray-900'}`}>{banner.title}</h3>
                    <p className={`text-sm mt-1 ${banner.textColor === 'light' ? 'text-white/80' : 'text-gray-700'}`}>{banner.subtitle}</p>
                    <button className={`mt-3 px-4 py-1 rounded-full text-sm border ${banner.textColor === 'light' ? 'border-white text-white' : 'border-gray-900 text-gray-900'}`}>
                      {banner.buttonText}
                    </button>
                  </div>
                  {banner.image && (
                    <img src={banner.image} alt="" className="h-20 w-20 object-contain rounded-lg" />
                  )}
                </div>

                {/* Controles */}
                <div className="bg-zinc-800 p-4 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-zinc-400 text-xs mb-1 block">Título *</label>
                      <input
                        className="w-full bg-zinc-700 text-white rounded-lg px-3 py-2 text-sm border border-zinc-600"
                        value={banner.title}
                        onChange={e => {
                          const updated = (context.storeConfig.promoBanners || []).map((b: any) => b.id === banner.id ? { ...b, title: e.target.value } : b);
                          context.updateStoreConfig({ promoBanners: updated });
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-zinc-400 text-xs mb-1 block">Subtítulo</label>
                      <input
                        className="w-full bg-zinc-700 text-white rounded-lg px-3 py-2 text-sm border border-zinc-600"
                        value={banner.subtitle}
                        onChange={e => {
                          const updated = (context.storeConfig.promoBanners || []).map((b: any) => b.id === banner.id ? { ...b, subtitle: e.target.value } : b);
                          context.updateStoreConfig({ promoBanners: updated });
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-zinc-400 text-xs mb-1 block">Texto del Botón</label>
                      <input
                        className="w-full bg-zinc-700 text-white rounded-lg px-3 py-2 text-sm border border-zinc-600"
                        value={banner.buttonText}
                        onChange={e => {
                          const updated = (context.storeConfig.promoBanners || []).map((b: any) => b.id === banner.id ? { ...b, buttonText: e.target.value } : b);
                          context.updateStoreConfig({ promoBanners: updated });
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-zinc-400 text-xs mb-1 block">Link del Botón</label>
                      <input
                        className="w-full bg-zinc-700 text-white rounded-lg px-3 py-2 text-sm border border-zinc-600"
                        value={banner.buttonLink}
                        onChange={e => {
                          const updated = (context.storeConfig.promoBanners || []).map((b: any) => b.id === banner.id ? { ...b, buttonLink: e.target.value } : b);
                          context.updateStoreConfig({ promoBanners: updated });
                        }}
                      />
                    </div>
                    <div>
                      <label className="text-zinc-400 text-xs mb-1 block">🎨 Color Inicio Degradado</label>
                      <div className="flex gap-2">
                        <input type="color" value={banner.gradientFrom}
                          onChange={e => {
                            const updated = (context.storeConfig.promoBanners || []).map((b: any) => b.id === banner.id ? { ...b, gradientFrom: e.target.value } : b);
                            context.updateStoreConfig({ promoBanners: updated });
                          }}
                          className="w-10 h-10 rounded cursor-pointer border-0"
                        />
                        <input className="flex-1 bg-zinc-700 text-white rounded-lg px-3 py-2 text-sm border border-zinc-600"
                          value={banner.gradientFrom}
                          onChange={e => {
                            const updated = (context.storeConfig.promoBanners || []).map((b: any) => b.id === banner.id ? { ...b, gradientFrom: e.target.value } : b);
                            context.updateStoreConfig({ promoBanners: updated });
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-zinc-400 text-xs mb-1 block">🎨 Color Fin Degradado</label>
                      <div className="flex gap-2">
                        <input type="color" value={banner.gradientTo}
                          onChange={e => {
                            const updated = (context.storeConfig.promoBanners || []).map((b: any) => b.id === banner.id ? { ...b, gradientTo: e.target.value } : b);
                            context.updateStoreConfig({ promoBanners: updated });
                          }}
                          className="w-10 h-10 rounded cursor-pointer border-0"
                        />
                        <input className="flex-1 bg-zinc-700 text-white rounded-lg px-3 py-2 text-sm border border-zinc-600"
                          value={banner.gradientTo}
                          onChange={e => {
                            const updated = (context.storeConfig.promoBanners || []).map((b: any) => b.id === banner.id ? { ...b, gradientTo: e.target.value } : b);
                            context.updateStoreConfig({ promoBanners: updated });
                          }}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-zinc-400 text-xs mb-1 block">Color del Texto</label>
                      <select
                        className="w-full bg-zinc-700 text-white rounded-lg px-3 py-2 text-sm border border-zinc-600"
                        value={banner.textColor}
                        onChange={e => {
                          const updated = (context.storeConfig.promoBanners || []).map((b: any) => b.id === banner.id ? { ...b, textColor: e.target.value } : b);
                          context.updateStoreConfig({ promoBanners: updated });
                        }}
                      >
                        <option value="light">☀️ Claro (blanco)</option>
                        <option value="dark">🌙 Oscuro (negro)</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-zinc-400 text-xs mb-1 block">🖼️ URL Imagen Decorativa</label>
                      <input
                        className="w-full bg-zinc-700 text-white rounded-lg px-3 py-2 text-sm border border-zinc-600"
                        placeholder="https://..."
                        value={banner.image}
                        onChange={e => {
                          const updated = (context.storeConfig.promoBanners || []).map((b: any) => b.id === banner.id ? { ...b, image: e.target.value } : b);
                          context.updateStoreConfig({ promoBanners: updated });
                        }}
                      />
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex items-center justify-between pt-2 border-t border-zinc-700">
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-400 text-sm">Activo</span>
                      <button
                        onClick={() => {
                          const updated = (context.storeConfig.promoBanners || []).map((b: any) => b.id === banner.id ? { ...b, active: !b.active } : b);
                          context.updateStoreConfig({ promoBanners: updated });
                        }}
                        className={`w-12 h-6 rounded-full transition-all relative ${banner.active ? 'bg-green-500' : 'bg-zinc-600'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${banner.active ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => {
                        const arr = [...(context.storeConfig.promoBanners || [])];
                        if (index > 0) { [arr[index-1], arr[index]] = [arr[index], arr[index-1]]; context.updateStoreConfig({ promoBanners: arr }); }
                      }} className="p-2 bg-zinc-700 rounded-lg hover:bg-zinc-600"><ChevronUp size={16} className="text-white" /></button>
                      <button onClick={() => {
                        const arr = [...(context.storeConfig.promoBanners || [])];
                        if (index < arr.length - 1) { [arr[index], arr[index+1]] = [arr[index+1], arr[index]]; context.updateStoreConfig({ promoBanners: arr }); }
                      }} className="p-2 bg-zinc-700 rounded-lg hover:bg-zinc-600"><ChevronDown size={16} className="text-white" /></button>
                      <button onClick={() => {
                        const updated = (context.storeConfig.promoBanners || []).filter((b: any) => b.id !== banner.id);
                        context.updateStoreConfig({ promoBanners: updated });
                      }} className="p-2 bg-red-600 rounded-lg hover:bg-red-700"><Trash2 size={16} className="text-white" /></button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ══════════ PÁGINA DEL PRODUCTO ══════════ */}
        {activeTab === 'productpage' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold" style={{ color: '#e91e8c' }}>🛍️ Página del Producto</h1>
                <p className="text-zinc-400 text-sm mt-1">Configura lo que aparece en el popup de detalle de cada producto</p>
              </div>
              <button
                onClick={saveProductPage}
                className="px-5 py-2.5 text-white rounded-xl font-bold text-sm transition-all"
                style={{ background: '#e91e8c' }}
              >
                💾 Guardar Cambios
              </button>
            </div>

            {/* ── SECCIÓN 1: Etiqueta en imagen ── */}
            <div className="bg-zinc-900 rounded-2xl p-6 mb-6 border border-zinc-800">
              <h2 className="text-white font-bold text-lg mb-1">🏷️ Etiqueta en la imagen del producto</h2>
              <p className="text-zinc-400 text-sm mb-4">La etiqueta es el badge de color (ej: "Más Vendido", "Oferta") que aparece sobre la imagen.</p>
              <div className="flex items-center justify-between p-4 bg-zinc-800 rounded-xl border border-zinc-700">
                <div>
                  <p className="text-white font-medium">Mostrar etiqueta sobre la imagen</p>
                  <p className="text-zinc-400 text-xs mt-0.5">Si está desactivado, la etiqueta no aparecerá en ningún producto aunque tenga una asignada</p>
                </div>
                <div
                  onClick={() => setProductPageConfig(prev => ({ ...prev, showBadgeOnImage: !prev.showBadgeOnImage }))}
                  className={`w-14 h-7 rounded-full transition-colors relative cursor-pointer flex-shrink-0 ${productPageConfig.showBadgeOnImage ? 'bg-green-500' : 'bg-zinc-600'}`}
                >
                  <div className={`absolute top-1.5 w-4 h-4 bg-white rounded-full transition-all shadow ${productPageConfig.showBadgeOnImage ? 'left-8' : 'left-1.5'}`} />
                </div>
              </div>
              {/* Preview */}
              <div className="mt-4 p-3 bg-zinc-800 rounded-xl">
                <p className="text-zinc-400 text-xs mb-2">Vista previa:</p>
                <div className="relative w-24 h-32 bg-zinc-700 rounded-lg overflow-hidden">
                  <div className="w-full h-full bg-gradient-to-br from-pink-900 to-zinc-800 flex items-center justify-center text-3xl">🌸</div>
                  {productPageConfig.showBadgeOnImage && (
                    <span className="absolute top-2 left-2 text-white text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#e91e8c' }}>
                      Más Vendido
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* ── SECCIÓN 2: Características (Envío, Garantía, Atención) ── */}
            <div className="bg-zinc-900 rounded-2xl p-6 mb-6 border border-zinc-800">
              <h2 className="text-white font-bold text-lg mb-1">✨ Características del producto</h2>
              <p className="text-zinc-400 text-sm mb-5">Los 3 iconos con texto que aparecen debajo de la descripción (Envío, Garantía, Atención).</p>
              <div className="space-y-4">
                {productPageConfig.features.map(feature => (
                  <div key={feature.id} className="bg-zinc-800 rounded-xl p-4 border border-zinc-700">
                    <div className="flex items-center gap-3 mb-3">
                      {/* Toggle */}
                      <div
                        onClick={() => updateFeature(feature.id, { enabled: !feature.enabled })}
                        className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer flex-shrink-0 ${feature.enabled ? 'bg-green-500' : 'bg-zinc-600'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow ${feature.enabled ? 'left-7' : 'left-1'}`} />
                      </div>
                      <span className="text-white text-sm font-medium">
                        {feature.icon === 'truck' ? '🚚' : feature.icon === 'shield' ? '🛡️' : '🕐'} Característica {feature.id}
                      </span>
                      <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${feature.enabled ? 'bg-green-900 text-green-300' : 'bg-zinc-700 text-zinc-400'}`}>
                        {feature.enabled ? 'Activo' : 'Oculto'}
                      </span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {/* Ícono */}
                      <div>
                        <label className="text-zinc-400 text-xs block mb-1.5">Ícono</label>
                        <select
                          value={feature.icon}
                          onChange={e => updateFeature(feature.id, { icon: e.target.value as 'truck' | 'shield' | 'clock' })}
                          className="w-full bg-zinc-700 border border-zinc-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500"
                        >
                          <option value="truck">🚚 Camión (envío)</option>
                          <option value="shield">🛡️ Escudo (garantía)</option>
                          <option value="clock">🕐 Reloj (tiempo/atención)</option>
                        </select>
                      </div>
                      {/* Texto */}
                      <div>
                        <label className="text-zinc-400 text-xs block mb-1.5">Texto</label>
                        <input
                          type="text"
                          value={feature.text}
                          onChange={e => updateFeature(feature.id, { text: e.target.value })}
                          placeholder="Ej: Envío el mismo día"
                          className="w-full bg-zinc-700 border border-zinc-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500"
                        />
                      </div>
                      {/* Color */}
                      <div>
                        <label className="text-zinc-400 text-xs block mb-1.5">Color del texto e ícono</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={feature.color}
                            onChange={e => updateFeature(feature.id, { color: e.target.value })}
                            className="w-10 h-9 rounded cursor-pointer border border-zinc-600 bg-zinc-700"
                          />
                          <input
                            type="text"
                            value={feature.color}
                            onChange={e => updateFeature(feature.id, { color: e.target.value })}
                            className="flex-1 bg-zinc-700 border border-zinc-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500"
                          />
                        </div>
                      </div>
                    </div>
                    {/* Preview */}
                    {feature.enabled && (
                      <div className="mt-3 flex items-center gap-2 p-2 bg-zinc-700 rounded-lg">
                        <span style={{ color: feature.color }}>
                          {feature.icon === 'truck' ? '🚚' : feature.icon === 'shield' ? '🛡️' : '🕐'}
                        </span>
                        <span className="text-sm font-medium" style={{ color: feature.color }}>{feature.text}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* ── SECCIÓN 3: Métodos de pago aceptados ── */}
            <div className="bg-zinc-900 rounded-2xl p-6 border border-zinc-800">
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-white font-bold text-lg mb-1">💳 Métodos de Pago Aceptados</h2>
                  <p className="text-zinc-400 text-sm">Los paneles de colores con los logos de pago que aparecen al final del producto.</p>
                </div>
                <button
                  onClick={addPaymentBadge}
                  className="flex items-center gap-2 px-4 py-2 text-white rounded-xl text-sm font-medium transition-all"
                  style={{ background: '#e91e8c' }}
                >
                  <Plus size={16} /> Agregar
                </button>
              </div>

              {/* Vista previa */}
              <div className="flex flex-wrap gap-2 p-3 bg-zinc-800 rounded-xl mb-5">
                <p className="w-full text-zinc-400 text-xs mb-1">Vista previa (solo activos):</p>
                {productPageConfig.paymentBadges.filter(b => b.enabled).map(badge => (
                  <div
                    key={badge.id}
                    className="h-8 px-3 rounded-md flex items-center justify-center font-bold text-xs shadow"
                    style={{ backgroundColor: badge.bgColor, color: badge.textColor, minWidth: '56px' }}
                  >
                    {badge.image ? <img src={badge.image} alt={badge.text} className="h-5 object-contain" onError={e => { e.currentTarget.style.display = 'none'; }} /> : badge.text}
                  </div>
                ))}
                {productPageConfig.paymentBadges.filter(b => b.enabled).length === 0 && (
                  <p className="text-zinc-500 text-xs italic">No hay métodos activos</p>
                )}
              </div>

              {/* Lista de badges */}
              <div className="space-y-3">
                {productPageConfig.paymentBadges.map(badge => (
                  <div key={badge.id} className="bg-zinc-800 rounded-xl p-4 border border-zinc-700">
                    <div className="flex items-center gap-3 mb-3">
                      {/* Toggle */}
                      <div
                        onClick={() => updatePaymentBadge(badge.id, { enabled: !badge.enabled })}
                        className={`w-12 h-6 rounded-full transition-colors relative cursor-pointer flex-shrink-0 ${badge.enabled ? 'bg-green-500' : 'bg-zinc-600'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow ${badge.enabled ? 'left-7' : 'left-1'}`} />
                      </div>
                      {/* Preview mini */}
                      <div
                        className="h-7 px-3 rounded flex items-center justify-center font-bold text-xs flex-shrink-0"
                        style={{ backgroundColor: badge.bgColor, color: badge.textColor, minWidth: '48px' }}
                      >
                        {badge.text}
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${badge.enabled ? 'bg-green-900 text-green-300' : 'bg-zinc-700 text-zinc-400'}`}>
                        {badge.enabled ? 'Activo' : 'Oculto'}
                      </span>
                      {/* Eliminar */}
                      <button
                        onClick={() => removePaymentBadge(badge.id)}
                        className="ml-auto p-1.5 bg-red-900 hover:bg-red-800 text-red-300 rounded-lg transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {/* Texto */}
                      <div>
                        <label className="text-zinc-400 text-xs block mb-1.5">Texto</label>
                        <input
                          type="text"
                          value={badge.text}
                          onChange={e => updatePaymentBadge(badge.id, { text: e.target.value })}
                          className="w-full bg-zinc-700 border border-zinc-600 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-pink-500"
                        />
                      </div>
                      {/* Color fondo */}
                      <div>
                        <label className="text-zinc-400 text-xs block mb-1.5">Color fondo</label>
                        <div className="flex items-center gap-1.5">
                          <input type="color" value={badge.bgColor} onChange={e => updatePaymentBadge(badge.id, { bgColor: e.target.value })} className="w-9 h-9 rounded cursor-pointer border border-zinc-600 bg-zinc-700" />
                          <input type="text" value={badge.bgColor} onChange={e => updatePaymentBadge(badge.id, { bgColor: e.target.value })} className="flex-1 bg-zinc-700 border border-zinc-600 text-white rounded-lg px-2 py-2 text-xs focus:outline-none" />
                        </div>
                      </div>
                      {/* Color texto */}
                      <div>
                        <label className="text-zinc-400 text-xs block mb-1.5">Color texto</label>
                        <div className="flex items-center gap-1.5">
                          <input type="color" value={badge.textColor} onChange={e => updatePaymentBadge(badge.id, { textColor: e.target.value })} className="w-9 h-9 rounded cursor-pointer border border-zinc-600 bg-zinc-700" />
                          <input type="text" value={badge.textColor} onChange={e => updatePaymentBadge(badge.id, { textColor: e.target.value })} className="flex-1 bg-zinc-700 border border-zinc-600 text-white rounded-lg px-2 py-2 text-xs focus:outline-none" />
                        </div>
                      </div>
                      {/* URL imagen (opcional) */}
                      <div>
                        <label className="text-zinc-400 text-xs block mb-1.5">URL imagen (opcional)</label>
                        <input
                          type="url"
                          value={badge.image}
                          onChange={e => updatePaymentBadge(badge.id, { image: e.target.value })}
                          placeholder="https://... logo"
                          className="w-full bg-zinc-700 border border-zinc-600 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-pink-500"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════ BARRA SUPERIOR ══════════ */}
        {activeTab === 'topbar' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">🔔 Barra Superior</h1>
                <p className="text-zinc-400 text-sm mt-1">Edita la línea rosada que aparece encima del header</p>
              </div>
              <button
                onClick={() => { updateStoreConfig({ topBar: topBarForm }); toast.success('✅ Barra superior guardada'); }}
                className="px-5 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-semibold transition-colors"
              >
                Guardar Barra Superior
              </button>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-6 space-y-6">
              <div className="flex items-center justify-between rounded-xl bg-zinc-800/70 p-4">
                <div>
                  <p className="text-white font-semibold">Mostrar barra superior</p>
                  <p className="text-zinc-400 text-sm">Activa o desactiva completamente la línea superior</p>
                </div>
                <button
                  type="button"
                  onClick={() => setTopBarForm(prev => ({ ...prev, enabled: !prev.enabled }))}
                  className={`w-14 h-8 rounded-full transition-colors ${topBarForm.enabled ? 'bg-green-500' : 'bg-zinc-700'} relative`}
                >
                  <span className={`absolute top-1 h-6 w-6 rounded-full bg-white transition-all ${topBarForm.enabled ? 'left-7' : 'left-1'}`} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm text-zinc-300 mb-2">Color de fondo</label>
                  <div className="flex gap-2">
                    <input type="color" value={topBarForm.bgColor} onChange={e => setTopBarForm(prev => ({ ...prev, bgColor: e.target.value }))} className="w-14 h-12 rounded-lg bg-transparent" />
                    <input value={topBarForm.bgColor} onChange={e => setTopBarForm(prev => ({ ...prev, bgColor: e.target.value }))} className="flex-1 px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-zinc-300 mb-2">Color del texto</label>
                  <div className="flex gap-2">
                    <input type="color" value={topBarForm.textColor} onChange={e => setTopBarForm(prev => ({ ...prev, textColor: e.target.value }))} className="w-14 h-12 rounded-lg bg-transparent" />
                    <input value={topBarForm.textColor} onChange={e => setTopBarForm(prev => ({ ...prev, textColor: e.target.value }))} className="flex-1 px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-zinc-300 mb-2">Altura</label>
                  <select value={topBarForm.height} onChange={e => setTopBarForm(prev => ({ ...prev, height: e.target.value as 'sm' | 'md' | 'lg' }))} className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white">
                    <option value="sm">Pequeña</option>
                    <option value="md">Mediana</option>
                    <option value="lg">Grande</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-zinc-300 mb-2">Velocidad del desplazamiento</label>
                  <input
                    type="range"
                    min="8"
                    max="40"
                    step="1"
                    value={topBarForm.speed}
                    onChange={e => setTopBarForm(prev => ({ ...prev, speed: Number(e.target.value) }))}
                    className="w-full accent-pink-500"
                  />
                  <p className="text-xs text-zinc-400 mt-2">{topBarForm.speed}s por ciclo</p>
                </div>
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white font-semibold">Usar fondo degradado</p>
                    <p className="text-zinc-400 text-sm">Activa un degradado horizontal en lugar de un color sólido</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setTopBarForm(prev => ({ ...prev, useGradient: !prev.useGradient }))}
                    className={`w-14 h-8 rounded-full transition-colors ${topBarForm.useGradient ? 'bg-green-500' : 'bg-zinc-700'} relative`}
                  >
                    <span className={`absolute top-1 h-6 w-6 rounded-full bg-white transition-all ${topBarForm.useGradient ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>

                {topBarForm.useGradient && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-zinc-300 mb-2">Color inicial</label>
                      <div className="flex gap-2">
                        <input type="color" value={topBarForm.gradientFrom} onChange={e => setTopBarForm(prev => ({ ...prev, gradientFrom: e.target.value }))} className="w-14 h-12 rounded-lg bg-transparent" />
                        <input value={topBarForm.gradientFrom} onChange={e => setTopBarForm(prev => ({ ...prev, gradientFrom: e.target.value }))} className="flex-1 px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-zinc-300 mb-2">Color final</label>
                      <div className="flex gap-2">
                        <input type="color" value={topBarForm.gradientTo} onChange={e => setTopBarForm(prev => ({ ...prev, gradientTo: e.target.value }))} className="w-14 h-12 rounded-lg bg-transparent" />
                        <input value={topBarForm.gradientTo} onChange={e => setTopBarForm(prev => ({ ...prev, gradientTo: e.target.value }))} className="flex-1 px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white" />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-white font-semibold">Items de la barra</h3>
                  <button
                    onClick={() => setTopBarForm(prev => ({
                      ...prev,
                      items: [...prev.items, { id: Date.now(), text: 'Nuevo item', icon: 'none', link: '#', enabled: true }]
                    }))}
                    className="px-4 py-2 rounded-lg bg-pink-600 hover:bg-pink-500 text-white text-sm font-medium"
                  >
                    + Agregar item
                  </button>
                </div>

                {topBarForm.items.map((item, index) => (
                  <div key={item.id} className="rounded-2xl border border-zinc-800 bg-zinc-950/60 p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-white font-medium">Item {index + 1}</p>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setTopBarForm(prev => ({ ...prev, items: prev.items.map(i => i.id === item.id ? { ...i, enabled: !i.enabled } : i) }))}
                          className={`w-12 h-7 rounded-full transition-colors ${item.enabled ? 'bg-green-500' : 'bg-zinc-700'} relative`}
                        >
                          <span className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-all ${item.enabled ? 'left-6' : 'left-1'}`} />
                        </button>
                        <button
                          type="button"
                          onClick={() => setTopBarForm(prev => ({ ...prev, items: prev.items.filter(i => i.id !== item.id) }))}
                          className="px-3 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <input
                        value={item.text}
                        onChange={e => setTopBarForm(prev => ({ ...prev, items: prev.items.map(i => i.id === item.id ? { ...i, text: e.target.value } : i) }))}
                        placeholder="Texto del item"
                        className="px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white"
                      />
                      <select
                        value={item.icon}
                        onChange={e => setTopBarForm(prev => ({ ...prev, items: prev.items.map(i => i.id === item.id ? { ...i, icon: e.target.value as any } : i) }))}
                        className="px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white"
                      >
                        <option value="none">Sin icono</option>
                        <option value="phone">Teléfono</option>
                        <option value="mail">Correo</option>
                        <option value="truck">Envío</option>
                        <option value="clock">Horario</option>
                        <option value="sparkles">Destacado</option>
                        <option value="gift">Regalo</option>
                      </select>
                      <input
                        value={item.link}
                        onChange={e => setTopBarForm(prev => ({ ...prev, items: prev.items.map(i => i.id === item.id ? { ...i, link: e.target.value } : i) }))}
                        placeholder="Link del item"
                        className="px-4 py-3 rounded-xl bg-zinc-800 border border-zinc-700 text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
                <p className="text-sm text-zinc-400 mb-3">Vista previa</p>
                <div
                  className="rounded-xl px-4 py-2 overflow-x-auto whitespace-nowrap"
                  style={{
                    background: topBarForm.useGradient
                      ? `linear-gradient(90deg, ${topBarForm.gradientFrom}, ${topBarForm.gradientTo})`
                      : topBarForm.bgColor,
                    color: topBarForm.textColor
                  }}
                >
                  <div className="flex items-center gap-6 min-w-max text-sm font-medium">
                    {topBarForm.items.filter(i => i.enabled).map(i => (
                      <span key={i.id} className="inline-flex items-center gap-2">{i.text}</span>
                    ))}
                  </div>
                </div>
                <p className="text-xs text-zinc-500 mt-3">Velocidad actual: {topBarForm.speed}s por ciclo</p>
              </div>
            </div>
          </div>
        )}

        {/* ══════════ HEADER & LOGO ══════════ */}
        {activeTab === 'header' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-white">🎨 Header & Logo</h1>
                <p className="text-zinc-400 text-sm mt-1">Personaliza toda la barra superior de tu tienda</p>
              </div>
              <div className="flex gap-2">
                <button onClick={handleResetHeader} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-sm transition-all">↩️ Descartar</button>
                <button onClick={handleSaveHeader} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-all">💾 Guardar Header</button>
              </div>
            </div>
            {/* Sub-tabs */}
            <div className="flex gap-1 mb-6 bg-zinc-900 p-1 rounded-xl w-fit">
              {[
                { id: 'logo', icon: <Type size={14} />, label: 'Logo' },
                { id: 'apariencia', icon: <Palette size={14} />, label: 'Apariencia' },
                { id: 'menu', icon: <Menu size={14} />, label: 'Menú' },
                { id: 'iconos', icon: <Layout size={14} />, label: 'Iconos' },
                { id: 'anuncio', icon: <Bell size={14} />, label: 'Anuncio' },
              ].map(st => (
                <button key={st.id} onClick={() => setHeaderSubTab(st.id as HeaderSubTab)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${headerSubTab === st.id ? 'bg-red-600 text-white' : 'text-zinc-400 hover:text-white'}`}>
                  {st.icon}{st.label}
                </button>
              ))}
            </div>

            {/* Logo */}
            {headerSubTab === 'logo' && (
              <div className="space-y-6 max-w-2xl">
                <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
                  <h3 className="text-white font-semibold mb-4 flex items-center gap-2"><Type size={16} className="text-red-400" /> Tipo de Logo</h3>
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    {(['text', 'image'] as const).map(t => (
                      <button key={t} onClick={() => setHeaderForm(p => ({ ...p, logoType: t }))}
                        className={`p-4 rounded-lg border-2 text-center transition-all ${headerForm.logoType === t ? 'border-red-500 bg-red-600/10' : 'border-zinc-700 hover:border-zinc-500'}`}>
                        <div className="text-2xl mb-1">{t === 'text' ? '🔤' : '🖼️'}</div>
                        <p className="text-white text-sm font-medium">{t === 'text' ? 'Texto (Nombre)' : 'Imagen (Logo)'}</p>
                        <p className="text-zinc-500 text-xs mt-1">{t === 'text' ? 'Escribe el nombre de tu tienda' : 'Sube tu logo diseñado'}</p>
                      </button>
                    ))}
                  </div>
                    {headerForm.logoType === 'text' ? (
                      <div className="space-y-4">
                        <div>
                          <label className="text-zinc-400 text-xs mb-1 block">Nombre de la Tienda</label>
                          <input value={headerForm.logoText} onChange={e => setHeaderForm(p => ({ ...p, logoText: e.target.value }))}
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500" />
                        </div>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-zinc-400 text-xs mb-2 block">Color del Logo - Modo Oscuro</label>
                            <div className="flex gap-2 flex-wrap mb-2">
                              {['#dc2626', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#ffffff'].map(c => (
                                <button key={`dark-${c}`} onClick={() => setHeaderForm(p => ({ ...p, logoColorDark: c, logoColor: c }))} style={{ backgroundColor: c }}
                                  className={`w-7 h-7 rounded-full border-2 transition-all ${headerForm.logoColorDark === c ? 'border-white scale-110' : 'border-transparent'}`} />
                              ))}
                              <input type="color" value={headerForm.logoColorDark} onChange={e => setHeaderForm(p => ({ ...p, logoColorDark: e.target.value, logoColor: e.target.value }))}
                                className="w-7 h-7 rounded-full cursor-pointer border-2 border-zinc-600" title="Color modo oscuro" />
                            </div>
                          </div>
                          <div>
                            <label className="text-zinc-400 text-xs mb-2 block">Color del Logo - Modo Claro</label>
                            <div className="flex gap-2 flex-wrap mb-2">
                              {['#111827', '#dc2626', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'].map(c => (
                                <button key={`light-${c}`} onClick={() => setHeaderForm(p => ({ ...p, logoColorLight: c }))} style={{ backgroundColor: c }}
                                  className={`w-7 h-7 rounded-full border-2 transition-all ${headerForm.logoColorLight === c ? 'border-white scale-110' : 'border-transparent'}`} />
                              ))}
                              <input type="color" value={headerForm.logoColorLight} onChange={e => setHeaderForm(p => ({ ...p, logoColorLight: e.target.value }))}
                                className="w-7 h-7 rounded-full cursor-pointer border-2 border-zinc-600" title="Color modo claro" />
                            </div>
                          </div>
                        </div>
                      <div>
                        <label className="text-zinc-400 text-xs mb-2 block">Tamaño del Logo</label>
                        <div className="flex gap-2">
                          {[{ v: 'sm', l: 'Pequeño' }, { v: 'md', l: 'Mediano' }, { v: 'lg', l: 'Grande' }, { v: 'xl', l: 'Muy Grande' }].map(s => (
                            <button key={s.v} onClick={() => setHeaderForm(p => ({ ...p, logoSize: s.v as HeaderConfig['logoSize'] }))}
                              className={`px-3 py-1.5 rounded-lg text-xs transition-all ${headerForm.logoSize === s.v ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}>
                              {s.l}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-zinc-400 text-xs mb-1 block">Logo para Modo Oscuro <span className="text-zinc-600">(PNG/SVG recomendado)</span></label>
                        <input value={headerForm.logoImageDark || headerForm.logoImage} onChange={e => setHeaderForm(p => ({ ...p, logoImageDark: e.target.value, logoImage: e.target.value }))}
                          placeholder="https://res.cloudinary.com/tu-logo-dark.png"
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500" />
                        {(headerForm.logoImageDark || headerForm.logoImage) && <img src={headerForm.logoImageDark || headerForm.logoImage} alt="Preview logo dark" className="mt-2 h-12 object-contain bg-zinc-950 rounded p-2" />}
                      </div>
                      <div>
                        <label className="text-zinc-400 text-xs mb-1 block">Logo para Modo Claro <span className="text-zinc-600">(PNG/SVG recomendado)</span></label>
                        <input value={headerForm.logoImageLight} onChange={e => setHeaderForm(p => ({ ...p, logoImageLight: e.target.value }))}
                          placeholder="https://res.cloudinary.com/tu-logo-light.png"
                          className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500" />
                        {headerForm.logoImageLight && <img src={headerForm.logoImageLight} alt="Preview logo light" className="mt-2 h-12 object-contain bg-white rounded p-2" />}
                      </div>
                    </div>
                  )}
                  {/* Vista previa */}
                  <div className="mt-4 grid md:grid-cols-2 gap-3">
                    <div className="bg-zinc-950 rounded-lg p-4">
                      <p className="text-zinc-500 text-xs mb-2">Vista previa modo oscuro:</p>
                      {headerForm.logoType === 'text' ? (
                        <span style={{ color: headerForm.logoColorDark || headerForm.logoColor }} className={`font-black tracking-wider ${headerForm.logoSize === 'sm' ? 'text-lg' : headerForm.logoSize === 'md' ? 'text-xl' : headerForm.logoSize === 'lg' ? 'text-2xl' : 'text-3xl'}`}>
                          {headerForm.logoText || 'Tu Tienda'}
                        </span>
                      ) : (
                        <img src={headerForm.logoImageDark || headerForm.logoImage} alt="Logo preview dark" className="h-10 object-contain" />
                      )}
                    </div>
                    <div className="bg-white rounded-lg p-4 border border-zinc-200">
                      <p className="text-zinc-500 text-xs mb-2">Vista previa modo claro:</p>
                      {headerForm.logoType === 'text' ? (
                        <span style={{ color: headerForm.logoColorLight || '#111827' }} className={`font-black tracking-wider ${headerForm.logoSize === 'sm' ? 'text-lg' : headerForm.logoSize === 'md' ? 'text-xl' : headerForm.logoSize === 'lg' ? 'text-2xl' : 'text-3xl'}`}>
                          {headerForm.logoText || 'Tu Tienda'}
                        </span>
                      ) : (
                        <img src={headerForm.logoImageLight || headerForm.logoImageDark || headerForm.logoImage} alt="Logo preview light" className="h-10 object-contain" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Apariencia */}
            {headerSubTab === 'apariencia' && (
              <div className="space-y-4 max-w-2xl">
                <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800 space-y-4">
                  <h3 className="text-white font-semibold flex items-center gap-2"><Palette size={16} className="text-red-400" /> Color y Fondo</h3>
                  <div>
                    <label className="text-zinc-400 text-xs mb-2 block">Color de fondo del Header</label>
                    <div className="flex gap-2 flex-wrap mb-2">
                      {['#09090b', '#18181b', '#0f172a', '#1e1b4b', '#1a0a0a', '#0a1628', '#0d0d0d', '#000000'].map(c => (
                        <button key={c} onClick={() => setHeaderForm(p => ({ ...p, headerBgColor: c }))} style={{ backgroundColor: c }}
                          className={`w-7 h-7 rounded-full border-2 transition-all ${headerForm.headerBgColor === c ? 'border-red-500 scale-110' : 'border-zinc-600'}`} />
                      ))}
                      <input type="color" value={headerForm.headerBgColor} onChange={e => setHeaderForm(p => ({ ...p, headerBgColor: e.target.value }))}
                        className="w-7 h-7 rounded-full cursor-pointer border-2 border-zinc-600" />
                    </div>
                  </div>
                  <div>
                    <label className="text-zinc-400 text-xs mb-1 block">Opacidad del fondo: <span className="text-white">{headerForm.headerBgOpacity}%</span></label>
                    <input type="range" min="0" max="100" value={headerForm.headerBgOpacity} onChange={e => setHeaderForm(p => ({ ...p, headerBgOpacity: Number(e.target.value) }))}
                      className="w-full accent-red-500" />
                    <div className="flex justify-between text-zinc-600 text-xs mt-1"><span>Transparente</span><span>Sólido</span></div>
                  </div>
                  <div>
                    <label className="text-zinc-400 text-xs mb-2 block">Altura del Header</label>
                    <div className="flex gap-2">
                      {[{ v: 'compact', l: '🔹 Compacto' }, { v: 'normal', l: '▪️ Normal' }, { v: 'tall', l: '🔷 Alto' }].map(s => (
                        <button key={s.v} onClick={() => setHeaderForm(p => ({ ...p, headerHeight: s.v as HeaderConfig['headerHeight'] }))}
                          className={`flex-1 py-2 rounded-lg text-xs transition-all ${headerForm.headerHeight === s.v ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}>
                          {s.l}
                        </button>
                      ))}
                    </div>
                  </div>
                  {[
                    { key: 'headerBlur', label: '✨ Efecto blur (vidrio esmerilado al hacer scroll)' },
                    { key: 'headerScrollEffect', label: '📜 Fondo aparece al hacer scroll' },
                    { key: 'headerPosition', label: '📌 Header fijo (siempre visible arriba)', isFixed: true },
                  ].map(opt => (
                    <label key={opt.key} className="flex items-center justify-between cursor-pointer p-3 bg-zinc-800 rounded-lg">
                      <span className="text-zinc-300 text-sm">{opt.label}</span>
                      <button onClick={() => setHeaderForm(p => ({
                        ...p,
                        [opt.key]: opt.isFixed
                          ? (p.headerPosition === 'fixed' ? 'static' : 'fixed')
                          : !p[opt.key as keyof HeaderConfig]
                      }))}
                        className={`w-10 h-6 rounded-full transition-all relative ${(opt.isFixed ? headerForm.headerPosition === 'fixed' : headerForm[opt.key as keyof HeaderConfig]) ? 'bg-red-600' : 'bg-zinc-600'}`}>
                        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${(opt.isFixed ? headerForm.headerPosition === 'fixed' : headerForm[opt.key as keyof HeaderConfig]) ? 'left-[18px]' : 'left-0.5'}`} />
                      </button>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Menú */}
            {headerSubTab === 'menu' && (
              <div className="space-y-4 max-w-2xl">
                <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800 space-y-4">
                  <h3 className="text-white font-semibold flex items-center gap-2"><Menu size={16} className="text-red-400" /> Navegación</h3>
                  <label className="flex items-center justify-between cursor-pointer p-3 bg-zinc-800 rounded-lg">
                    <span className="text-zinc-300 text-sm">Mostrar menú de navegación</span>
                    <button onClick={() => setHeaderForm(p => ({ ...p, menuVisible: !p.menuVisible }))}
                      className={`w-10 h-6 rounded-full transition-all relative ${headerForm.menuVisible ? 'bg-red-600' : 'bg-zinc-600'}`}>
                      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${headerForm.menuVisible ? 'left-[18px]' : 'left-0.5'}`} />
                    </button>
                  </label>
                  <div>
                    <label className="text-zinc-400 text-xs mb-2 block">Ítems del Menú</label>
                    <div className="space-y-2 mb-3">
                      {headerForm.menuItems.map((item, i) => (
                        <div key={i} className="flex gap-2 items-center">
                          <input value={item.label} onChange={e => handleUpdateMenuItem(i, 'label', e.target.value)}
                            placeholder="Nombre" className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-white text-xs focus:outline-none focus:border-red-500" />
                          <input value={item.link} onChange={e => handleUpdateMenuItem(i, 'link', e.target.value)}
                            placeholder="Link (#, URL)" className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-white text-xs focus:outline-none focus:border-red-500" />
                          <button onClick={() => handleRemoveMenuItem(i)} className="p-1.5 text-red-400 hover:bg-red-600/20 rounded transition-all"><X size={14} /></button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input value={newMenuItem.label} onChange={e => setNewMenuItem(p => ({ ...p, label: e.target.value }))}
                        placeholder="Nuevo ítem..." className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-white text-xs focus:outline-none focus:border-red-500" />
                      <input value={newMenuItem.link} onChange={e => setNewMenuItem(p => ({ ...p, link: e.target.value }))}
                        placeholder="Link..." className="flex-1 bg-zinc-800 border border-zinc-700 rounded px-2 py-1.5 text-white text-xs focus:outline-none focus:border-red-500" />
                      <button onClick={handleAddMenuItem} className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded transition-all"><Plus size={14} /></button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-zinc-400 text-xs mb-1 block">Color de links</label>
                      <div className="flex gap-1 flex-wrap">
                        {['#d1d5db', '#ffffff', '#fca5a5', '#86efac', '#93c5fd', '#f9a8d4'].map(c => (
                          <button key={c} onClick={() => setHeaderForm(p => ({ ...p, menuColor: c }))} style={{ backgroundColor: c }}
                            className={`w-6 h-6 rounded-full border-2 ${headerForm.menuColor === c ? 'border-white' : 'border-transparent'}`} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-zinc-400 text-xs mb-1 block">Color al pasar el mouse</label>
                      <div className="flex gap-1 flex-wrap">
                        {['#ffffff', '#dc2626', '#f97316', '#eab308', '#22c55e', '#3b82f6'].map(c => (
                          <button key={c} onClick={() => setHeaderForm(p => ({ ...p, menuHoverColor: c }))} style={{ backgroundColor: c }}
                            className={`w-6 h-6 rounded-full border-2 ${headerForm.menuHoverColor === c ? 'border-white' : 'border-transparent'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-zinc-400 text-xs mb-2 block">Tamaño de fuente</label>
                    <div className="flex gap-2">
                      {[{ v: 'xs', l: 'Pequeña' }, { v: 'sm', l: 'Normal' }, { v: 'base', l: 'Grande' }].map(s => (
                        <button key={s.v} onClick={() => setHeaderForm(p => ({ ...p, menuFontSize: s.v as HeaderConfig['menuFontSize'] }))}
                          className={`flex-1 py-1.5 rounded-lg text-xs transition-all ${headerForm.menuFontSize === s.v ? 'bg-red-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}>
                          {s.l}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Iconos */}
            {headerSubTab === 'iconos' && (
              <div className="space-y-4 max-w-2xl">
                <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800 space-y-3">
                  <h3 className="text-white font-semibold flex items-center gap-2"><Layout size={16} className="text-red-400" /> Iconos del Header</h3>
                  {[
                    { key: 'showSearch', label: '🔍 Buscador', desc: 'Barra de búsqueda de productos' },
                    { key: 'showCart', label: '🛒 Carrito', desc: 'Icono del carrito de compras' },
                    { key: 'showCartBadge', label: '🔴 Contador del carrito', desc: 'Número de ítems encima del icono' },
                    { key: 'showUserIcon', label: '👤 Icono de usuario', desc: 'Icono de cuenta/usuario' },
                    { key: 'showAdminIcon', label: '⚙️ Icono de admin', desc: 'Acceso rápido al panel' },
                  ].map(opt => (
                    <label key={opt.key} className="flex items-center justify-between cursor-pointer p-3 bg-zinc-800 rounded-lg">
                      <div>
                        <p className="text-zinc-200 text-sm">{opt.label}</p>
                        <p className="text-zinc-500 text-xs">{opt.desc}</p>
                      </div>
                      <button onClick={() => setHeaderForm(p => ({ ...p, [opt.key]: !p[opt.key as keyof HeaderConfig] }))}
                        className={`w-10 h-6 rounded-full transition-all relative flex-shrink-0 ${headerForm[opt.key as keyof HeaderConfig] ? 'bg-red-600' : 'bg-zinc-600'}`}>
                        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${headerForm[opt.key as keyof HeaderConfig] ? 'left-[18px]' : 'left-0.5'}`} />
                      </button>
                    </label>
                  ))}
                  <div>
                    <label className="text-zinc-400 text-xs mb-1 block">Color del contador del carrito</label>
                    <div className="flex gap-2 flex-wrap">
                      {['#dc2626', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899'].map(c => (
                        <button key={c} onClick={() => setHeaderForm(p => ({ ...p, cartBadgeColor: c }))} style={{ backgroundColor: c }}
                          className={`w-7 h-7 rounded-full border-2 transition-all ${headerForm.cartBadgeColor === c ? 'border-white scale-110' : 'border-transparent'}`} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Anuncio */}
            {headerSubTab === 'anuncio' && (
              <div className="space-y-4 max-w-2xl">
                <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800 space-y-4">
                  <h3 className="text-white font-semibold flex items-center gap-2"><Bell size={16} className="text-red-400" /> Barra de Anuncio</h3>
                  <label className="flex items-center justify-between cursor-pointer p-3 bg-zinc-800 rounded-lg">
                    <div>
                      <p className="text-zinc-200 text-sm">Activar barra de anuncio</p>
                      <p className="text-zinc-500 text-xs">Aparece encima del header</p>
                    </div>
                    <button onClick={() => setHeaderForm(p => ({ ...p, announcementBarVisible: !p.announcementBarVisible }))}
                      className={`w-10 h-6 rounded-full transition-all relative ${headerForm.announcementBarVisible ? 'bg-red-600' : 'bg-zinc-600'}`}>
                      <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${headerForm.announcementBarVisible ? 'left-[18px]' : 'left-0.5'}`} />
                    </button>
                  </label>
                  <div>
                    <label className="text-zinc-400 text-xs mb-1 block">Texto del anuncio</label>
                    <input value={headerForm.announcementText} onChange={e => setHeaderForm(p => ({ ...p, announcementText: e.target.value }))}
                      placeholder="🌸 ¡Envíos gratis en pedidos mayores a S/ 150!"
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500" />
                  </div>
                  <div>
                    <label className="text-zinc-400 text-xs mb-1 block">Link (opcional)</label>
                    <input value={headerForm.announcementLink} onChange={e => setHeaderForm(p => ({ ...p, announcementLink: e.target.value }))}
                      placeholder="#productos" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-zinc-400 text-xs mb-1 block">Color de fondo</label>
                      <div className="flex gap-1 flex-wrap">
                        {['#dc2626', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#a855f7', '#ec4899', '#09090b'].map(c => (
                          <button key={c} onClick={() => setHeaderForm(p => ({ ...p, announcementBgColor: c }))} style={{ backgroundColor: c }}
                            className={`w-7 h-7 rounded-full border-2 ${headerForm.announcementBgColor === c ? 'border-white scale-110' : 'border-transparent'}`} />
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="text-zinc-400 text-xs mb-1 block">Color del texto</label>
                      <div className="flex gap-1 flex-wrap">
                        {['#ffffff', '#09090b', '#fef9c3', '#fecaca', '#bbf7d0', '#bfdbfe'].map(c => (
                          <button key={c} onClick={() => setHeaderForm(p => ({ ...p, announcementTextColor: c }))} style={{ backgroundColor: c }}
                            className={`w-7 h-7 rounded-full border-2 ${headerForm.announcementTextColor === c ? 'border-zinc-900 scale-110' : 'border-transparent'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  {/* Vista previa */}
                  <div>
                    <p className="text-zinc-500 text-xs mb-2">Vista previa:</p>
                    <div style={{ backgroundColor: headerForm.announcementBgColor, color: headerForm.announcementTextColor }} className="rounded-lg p-2 text-center text-sm font-medium">
                      {headerForm.announcementText || 'Tu anuncio aquí'}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════════ CONFIGURACIÓN ══════════ */}
        {activeTab === 'settings' && (
          <div className="max-w-xl">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-white">⚙️ Configuración General</h1>
              <p className="text-zinc-400 text-sm mt-1">Ajustes generales de tu tienda</p>
            </div>
            {/* MODO OSCURO / CLARO */}
            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 space-y-4 mb-4">
              <h3 className="text-white font-semibold flex items-center gap-2">🎨 Apariencia de la Tienda</h3>
              <p className="text-zinc-400 text-xs">Cambia entre modo oscuro (estilo Netflix) y modo claro. El cambio se aplica instantáneamente en toda la tienda.</p>
              
              {/* Toggle visual */}
              <div className="flex items-center gap-4">
                {/* Opción Oscuro */}
                <button
                  onClick={() => { updateStoreConfig({ themeMode: 'dark' }); toast.success('🌙 Modo Oscuro activado'); }}
                  className={`flex-1 rounded-xl p-4 border-2 transition-all ${storeConfig.themeMode === 'dark' ? 'border-red-500' : 'border-zinc-700'}`}
                  style={{ backgroundColor: '#0a0a0a' }}
                >
                  <div className="text-2xl mb-2">🌙</div>
                  <div className="text-white font-bold text-sm">Modo Oscuro</div>
                  <div className="text-zinc-400 text-xs mt-1">Fondo negro, estilo Netflix</div>
                  <div className="flex gap-1 mt-3">
                    <span className="w-4 h-4 rounded" style={{ backgroundColor: '#0a0a0a', border: '1px solid #444' }}></span>
                    <span className="w-4 h-4 rounded" style={{ backgroundColor: '#1a1a1a', border: '1px solid #444' }}></span>
                    <span className="w-4 h-4 rounded" style={{ backgroundColor: '#dc2626' }}></span>
                    <span className="w-4 h-4 rounded" style={{ backgroundColor: '#ffffff' }}></span>
                  </div>
                  {storeConfig.themeMode === 'dark' && (
                    <div className="mt-2 text-green-400 text-xs font-bold">✓ ACTIVO</div>
                  )}
                </button>

                {/* Opción Claro */}
                <button
                  onClick={() => { updateStoreConfig({ themeMode: 'light' }); toast.success('☀️ Modo Claro activado'); }}
                  className={`flex-1 rounded-xl p-4 border-2 transition-all ${storeConfig.themeMode === 'light' ? 'border-red-500' : 'border-zinc-700'}`}
                  style={{ backgroundColor: '#f5f5f5' }}
                >
                  <div className="text-2xl mb-2">☀️</div>
                  <div className="text-zinc-900 font-bold text-sm">Modo Claro</div>
                  <div className="text-zinc-500 text-xs mt-1">Fondo blanco, estilo moderno</div>
                  <div className="flex gap-1 mt-3">
                    <span className="w-4 h-4 rounded" style={{ backgroundColor: '#f5f5f5', border: '1px solid #ccc' }}></span>
                    <span className="w-4 h-4 rounded" style={{ backgroundColor: '#ffffff', border: '1px solid #ccc' }}></span>
                    <span className="w-4 h-4 rounded" style={{ backgroundColor: '#dc2626' }}></span>
                    <span className="w-4 h-4 rounded" style={{ backgroundColor: '#0a0a0a' }}></span>
                  </div>
                  {storeConfig.themeMode === 'light' && (
                    <div className="mt-2 text-green-600 text-xs font-bold">✓ ACTIVO</div>
                  )}
                </button>
              </div>

              {/* Preview */}
              <div className="rounded-lg overflow-hidden border border-zinc-700">
                <div className="text-zinc-400 text-xs px-3 py-2 bg-zinc-800">Vista previa del tema seleccionado:</div>
                <div className="p-4" style={{ backgroundColor: storeConfig.themeMode === 'dark' ? '#0a0a0a' : '#f5f5f5' }}>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="font-bold text-sm" style={{ color: storeConfig.themeMode === 'dark' ? '#dc2626' : '#dc2626' }}>SHOPFLIX</span>
                    <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: storeConfig.themeMode === 'dark' ? '#1a1a1a' : '#ffffff', color: storeConfig.themeMode === 'dark' ? '#b3b3b3' : '#444444', border: `1px solid ${storeConfig.themeMode === 'dark' ? '#2a2a2a' : '#e0e0e0'}` }}>Inicio</span>
                    <span className="text-xs px-2 py-0.5 rounded" style={{ backgroundColor: storeConfig.themeMode === 'dark' ? '#1a1a1a' : '#ffffff', color: storeConfig.themeMode === 'dark' ? '#b3b3b3' : '#444444', border: `1px solid ${storeConfig.themeMode === 'dark' ? '#2a2a2a' : '#e0e0e0'}` }}>Productos</span>
                  </div>
                  <div className="flex gap-2">
                    {[1,2,3].map(i => (
                      <div key={i} className="flex-1 rounded aspect-[3/4]" style={{ backgroundColor: storeConfig.themeMode === 'dark' ? '#1a1a1a' : '#e0e0e0' }}></div>
                    ))}
                  </div>
                  <div className="mt-2 text-xs" style={{ color: storeConfig.themeMode === 'dark' ? '#b3b3b3' : '#444444' }}>Ramos de Rosas 🌹</div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-xl p-6 border border-zinc-800 space-y-4">
              <h3 className="text-white font-semibold flex items-center gap-2">📱 WhatsApp para pedidos</h3>
              <p className="text-zinc-400 text-xs">Cuando un cliente finalice su compra, se abrirá WhatsApp con tu número y el resumen del pedido.</p>
              <div>
                <label className="text-zinc-400 text-xs mb-1 block">Número con código de país (sin + ni espacios)</label>
                <input value={whatsappNumber} onChange={e => setWhatsappNumber(e.target.value)}
                  placeholder="51999888777"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500" />
                <p className="text-zinc-600 text-xs mt-1">Ejemplo Perú: 51999888777 · México: 52155xxxxxxx · España: 346xxxxxxxx</p>
              </div>
              <button onClick={() => { updateStoreConfig({ whatsappNumber }); toast.success('✅ WhatsApp guardado'); }}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-lg font-medium transition-all">
                💾 Guardar Configuración
              </button>
            </div>
          </div>
        )}
      </main>

      {/* ══════════ MODAL PRODUCTO ══════════ */}
      {isProductModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <h2 className="text-white font-bold text-lg">{editingProduct ? '✏️ Editar Producto' : '➕ Nuevo Producto'}</h2>
              <button onClick={() => setIsProductModalOpen(false)} className="text-zinc-400 hover:text-white p-1"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 text-xs mb-1 block">Nombre del Producto *</label>
                  <input value={productForm.name} onChange={e => setProductForm(p => ({ ...p, name: e.target.value }))}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500" required />
                </div>
                <div>
                  <label className="text-zinc-400 text-xs mb-1 block">Categoría *</label>
                  <select value={productForm.category} onChange={e => setProductForm(p => ({ ...p, category: e.target.value }))}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500">
                    {categories.map(c => <option key={c.id} value={c.name}>{c.emoji} {c.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 text-xs mb-1 block">Precio Actual (S/) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm font-medium">S/</span>
                    <input type="number" value={productForm.price} onChange={e => setProductForm(p => ({ ...p, price: e.target.value }))}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-9 pr-3 py-2 text-white text-sm focus:outline-none focus:border-red-500" required />
                  </div>
                </div>
                <div>
                  <label className="text-zinc-400 text-xs mb-1 block">Precio Anterior / Tachado (S/) <span className="text-zinc-600">Opcional</span></label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm font-medium">S/</span>
                    <input type="number" value={productForm.originalPrice} onChange={e => setProductForm(p => ({ ...p, originalPrice: e.target.value }))}
                      placeholder="Opcional" className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-9 pr-3 py-2 text-white text-sm focus:outline-none focus:border-red-500" />
                  </div>
                </div>
              </div>
              {/* Imagen Principal */}
              <div>
                <label className="text-zinc-400 text-xs mb-1 flex items-center gap-2 block">
                  Imagen Principal *
                  <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">PNG</span>
                  <span className="bg-green-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">JPG</span>
                  <span className="bg-purple-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">📐 600 × 800 px</span>
                </label>
                <input value={productForm.image} onChange={e => setProductForm(p => ({ ...p, image: e.target.value }))}
                  placeholder="https://res.cloudinary.com/tu-imagen.jpg"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500" />
                <p className="text-pink-400 text-xs mt-1">📌 Sube tu foto a Cloudinary y pega el link aquí</p>
                {productForm.image && <img src={productForm.image} alt="preview" className="mt-2 h-24 object-cover rounded" />}
              </div>
              {/* Imagen Hover */}
              <div>
                <label className="text-zinc-400 text-xs mb-1 flex items-center gap-2 block">
                  Imagen Hover — Al pasar el mouse
                  <span className="bg-blue-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">PNG</span>
                  <span className="bg-green-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">JPG</span>
                  <span className="bg-purple-600 text-white text-[10px] px-1.5 py-0.5 rounded font-bold">📐 600 × 800 px</span>
                  <span className="text-zinc-500 text-[10px]">Opcional</span>
                </label>
                <input value={productForm.hoverImage} onChange={e => setProductForm(p => ({ ...p, hoverImage: e.target.value }))}
                  placeholder="Se muestra al pasar el mouse (desktop)"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500" />
                <p className="text-yellow-400 text-xs mt-1">💡 Usa un ángulo diferente o detalle del arreglo</p>
                {productForm.hoverImage && <img src={productForm.hoverImage} alt="hover preview" className="mt-2 h-24 object-cover rounded" />}
              </div>
              <div>
                <label className="text-zinc-400 text-xs mb-1 block">Descripción <span className="text-zinc-600">(Opcional)</span></label>
                <textarea value={productForm.description} onChange={e => setProductForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="Escribe los detalles aquí... (opcional)" rows={3}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 text-xs mb-1 block">Etiqueta Especial <span className="text-zinc-600">Opcional</span></label>
                  <input value={productForm.badge} onChange={e => setProductForm(p => ({ ...p, badge: e.target.value }))}
                    placeholder="Ej. Oferta, Nuevo, Más Vendido"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500" />
                </div>
                <div>
                  <label className="text-zinc-400 text-xs mb-1 block">Calificación (1 a 5)</label>
                  <input type="number" min="1" max="5" step="0.1" value={productForm.rating} onChange={e => setProductForm(p => ({ ...p, rating: e.target.value }))}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500" />
                </div>
              </div>

              {/* ── Contenido del Arreglo ── */}
              <div className="border border-zinc-700 rounded-xl p-4 bg-zinc-900">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-5 rounded-full bg-pink-500"></div>
                    <span className="text-white font-semibold text-sm">Contenido del Arreglo</span>
                    <span className="text-zinc-500 text-xs">(Opcional — lo que lleva el arreglo)</span>
                  </div>
                  <button
                    onClick={handleAddArrangementItem}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-pink-600 hover:bg-pink-700 text-white text-xs rounded-lg font-semibold transition-all"
                  >
                    <Plus className="w-3 h-3" /> Agregar ítem
                  </button>
                </div>

                <div className="space-y-2">
                  {arrangementItems.map((item, index) => (
                    <div key={item.id} className="flex items-center gap-2 bg-zinc-800 rounded-lg p-2">
                      {/* Selector de emoji */}
                      <select
                        value={item.emoji}
                        onChange={e => handleUpdateArrangementItem(item.id, 'emoji', e.target.value)}
                        className="bg-zinc-700 border border-zinc-600 rounded-lg px-2 py-1.5 text-white text-base focus:outline-none focus:border-pink-500 w-16 text-center"
                      >
                        {ARRANGEMENT_EMOJIS.map(emoji => (
                          <option key={emoji} value={emoji}>{emoji}</option>
                        ))}
                      </select>
                      {/* Cantidad */}
                      <input
                        type="number" min="1" max="999"
                        value={item.quantity}
                        onChange={e => handleUpdateArrangementItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                        className="bg-zinc-700 border border-zinc-600 rounded-lg px-2 py-1.5 text-white text-sm focus:outline-none focus:border-pink-500 w-16 text-center"
                        placeholder="Cant."
                      />
                      {/* Nombre */}
                      <input
                        type="text"
                        value={item.name}
                        onChange={e => handleUpdateArrangementItem(item.id, 'name', e.target.value)}
                        placeholder={`Ej: ${index === 0 ? 'Rosas rojas' : index === 1 ? 'Girasoles' : 'Lirios'}`}
                        className="flex-1 bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-pink-500"
                      />
                      {/* Botón eliminar (solo si hay más de 1) */}
                      {arrangementItems.length > 1 && (
                        <button
                          onClick={() => handleRemoveArrangementItem(item.id)}
                          className="w-7 h-7 flex items-center justify-center text-zinc-500 hover:text-red-400 transition-colors flex-shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-zinc-600 text-xs mt-2">💡 Los ítems sin nombre no se guardarán</p>
              </div>

            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-zinc-800">
              <button onClick={() => setIsProductModalOpen(false)} className="px-4 py-2 text-zinc-400 hover:text-white transition-all text-sm">Cancelar</button>
              <button onClick={handleSaveProduct} className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-sm transition-all">
                {editingProduct ? 'Guardar Cambios' : 'Crear Producto'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ MODAL BANNER ══════════ */}
      {isBannerModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-700 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <h2 className="text-white font-bold text-lg">{editingBanner ? '✏️ Editar Banner' : '➕ Nuevo Banner'}</h2>
              <button onClick={() => setIsBannerModalOpen(false)} className="text-zinc-400 hover:text-white p-1"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-zinc-400 text-xs mb-1 block">Título del Banner *</label>
                <input value={bannerForm.title} onChange={e => setBannerForm(p => ({ ...p, title: e.target.value }))}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500" />
              </div>
              <div>
                <label className="text-zinc-400 text-xs mb-1 block">Subtítulo / Descripción <span className="text-zinc-600">Opcional</span></label>
                <textarea value={bannerForm.subtitle} onChange={e => setBannerForm(p => ({ ...p, subtitle: e.target.value }))}
                  rows={2} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 text-xs mb-1 flex items-center gap-1 block">
                    🖥️ Imagen para PC (Horizontal) *
                    <span className="bg-blue-600 text-white text-[10px] px-1 py-0.5 rounded">PNG</span>
                    <span className="bg-green-600 text-white text-[10px] px-1 py-0.5 rounded">JPG</span>
                    <span className="bg-purple-600 text-white text-[10px] px-1 py-0.5 rounded">1980×440px</span>
                  </label>
                  <input value={bannerForm.imageDesktop} onChange={e => setBannerForm(p => ({ ...p, imageDesktop: e.target.value }))}
                    placeholder="URL imagen horizontal..."
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-red-500" />
                  <p className="text-zinc-500 text-[10px] mt-1">Imagen ancha y horizontal — se ve en computadoras</p>
                  {bannerForm.imageDesktop && <img src={bannerForm.imageDesktop} alt="PC preview" className="mt-2 w-full h-20 object-cover rounded border border-purple-800/40"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
                </div>
                <div>
                  <label className="text-zinc-400 text-xs mb-1 flex items-center gap-1 block">
                    📱 Imagen para Móvil (Vertical) *
                    <span className="bg-blue-600 text-white text-[10px] px-1 py-0.5 rounded">PNG</span>
                    <span className="bg-green-600 text-white text-[10px] px-1 py-0.5 rounded">JPG</span>
                    <span className="bg-orange-500 text-white text-[10px] px-1 py-0.5 rounded">800×1200px</span>
                  </label>
                  <input value={bannerForm.imageMobile} onChange={e => setBannerForm(p => ({ ...p, imageMobile: e.target.value }))}
                    placeholder="URL imagen vertical..."
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-xs focus:outline-none focus:border-red-500" />
                  <p className="text-zinc-500 text-[10px] mt-1">Imagen alta y vertical — se ve en celulares</p>
                  {bannerForm.imageMobile && <img src={bannerForm.imageMobile} alt="Mobile preview" className="mt-2 w-20 h-28 object-cover rounded border border-orange-800/40"
                    onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 text-xs mb-1 block">Texto del Botón</label>
                  <input value={bannerForm.buttonText} onChange={e => setBannerForm(p => ({ ...p, buttonText: e.target.value }))}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500" />
                </div>
                <div>
                  <label className="text-zinc-400 text-xs mb-1 block">Link del Botón</label>
                  <input value={bannerForm.buttonLink} onChange={e => setBannerForm(p => ({ ...p, buttonLink: e.target.value }))}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <label className="flex items-center justify-between gap-3 p-3 bg-zinc-800 rounded-lg cursor-pointer">
                  <span className="text-zinc-300 text-sm">Mostrar título</span>
                  <input type="checkbox" checked={bannerForm.showTitle} onChange={e => setBannerForm(p => ({ ...p, showTitle: e.target.checked }))} className="accent-red-500 w-4 h-4" />
                </label>
                <label className="flex items-center justify-between gap-3 p-3 bg-zinc-800 rounded-lg cursor-pointer">
                  <span className="text-zinc-300 text-sm">Mostrar subtítulo</span>
                  <input type="checkbox" checked={bannerForm.showSubtitle} onChange={e => setBannerForm(p => ({ ...p, showSubtitle: e.target.checked }))} className="accent-red-500 w-4 h-4" />
                </label>
                <label className="flex items-center justify-between gap-3 p-3 bg-zinc-800 rounded-lg cursor-pointer">
                  <span className="text-zinc-300 text-sm">Mostrar botón</span>
                  <input type="checkbox" checked={bannerForm.showButton} onChange={e => setBannerForm(p => ({ ...p, showButton: e.target.checked }))} className="accent-red-500 w-4 h-4" />
                </label>
              </div>

              <label className="flex items-center gap-3 p-3 bg-zinc-800 rounded-lg cursor-pointer">
                <input type="checkbox" checked={bannerForm.isActive} onChange={e => setBannerForm(p => ({ ...p, isActive: e.target.checked }))} className="accent-red-500 w-4 h-4" />
                <span className="text-zinc-300 text-sm">Banner activo (visible en la tienda)</span>
              </label>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-zinc-800">
              <button onClick={() => setIsBannerModalOpen(false)} className="px-4 py-2 text-zinc-400 hover:text-white transition-all text-sm">Cancelar</button>
              <button onClick={handleSaveBanner} className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-sm transition-all">
                {editingBanner ? 'Guardar Cambios' : 'Crear Banner'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ MODAL CATEGORÍA ══════════ */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-700 w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <h2 className="text-white font-bold text-lg">{editingCategory ? '✏️ Editar Categoría' : '➕ Nueva Categoría'}</h2>
              <button onClick={() => setIsCategoryModalOpen(false)} className="text-zinc-400 hover:text-white p-1"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="text-zinc-400 text-xs mb-1 block">Nombre de la Categoría *</label>
                <input value={categoryForm.name} onChange={e => setCategoryForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Ej. Ramos de Rosas, Girasoles, Temáticos..."
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500" />
              </div>
              <div>
                <label className="text-zinc-400 text-xs mb-2 block">Emoji de la Categoría</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {emojis.map(em => (
                    <button key={em} onClick={() => setCategoryForm(p => ({ ...p, emoji: em }))}
                      className={`w-9 h-9 text-xl rounded-lg transition-all hover:bg-zinc-700 ${categoryForm.emoji === em ? 'bg-red-600/30 ring-2 ring-red-500' : 'bg-zinc-800'}`}>
                      {em}
                    </button>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="text-zinc-400 text-xs mb-1 block">Color del circulito</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={categoryForm.circleColor}
                        onChange={e => setCategoryForm(p => ({ ...p, circleColor: e.target.value }))}
                        className="w-14 h-10 rounded border border-zinc-700 bg-zinc-800 p-1"
                      />
                      <input
                        value={categoryForm.circleColor}
                        onChange={e => setCategoryForm(p => ({ ...p, circleColor: e.target.value }))}
                        className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500"
                        placeholder="#f9a8d4"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-zinc-400 text-xs mb-1 block">Imagen del circulito <span className="text-zinc-600">Opcional</span></label>
                    <input
                      value={categoryForm.circleImage}
                      onChange={e => setCategoryForm(p => ({ ...p, circleImage: e.target.value }))}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500"
                      placeholder="https://..."
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-zinc-800 rounded-lg p-3">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0"
                    style={{ backgroundColor: categoryForm.circleColor }}
                  >
                    {categoryForm.circleImage ? (
                      <img src={categoryForm.circleImage} alt="preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-3xl">{categoryForm.emoji}</span>
                    )}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{categoryForm.name || 'Nombre de categoría'}</p>
                    <p className="text-zinc-500 text-xs">Así se verá en la tienda debajo del banner principal</p>
                  </div>
                </div>
              </div>
              <div>
                <label className="text-zinc-400 text-xs mb-1 block">Descripción <span className="text-zinc-600">Opcional</span></label>
                <input value={categoryForm.description} onChange={e => setCategoryForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="Breve descripción de esta categoría..."
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500" />
              </div>
              <label className="flex items-center gap-3 p-3 bg-zinc-800 rounded-lg cursor-pointer">
                <input type="checkbox" checked={categoryForm.isVisible} onChange={e => setCategoryForm(p => ({ ...p, isVisible: e.target.checked }))} className="accent-red-500 w-4 h-4" />
                <div>
                  <p className="text-zinc-300 text-sm">Categoría visible en la tienda</p>
                  <p className="text-zinc-500 text-xs">Si la desactivas, no aparecerá en la tienda pero no se borrará</p>
                </div>
              </label>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-zinc-800">
              <button onClick={() => setIsCategoryModalOpen(false)} className="px-4 py-2 text-zinc-400 hover:text-white transition-all text-sm">Cancelar</button>
              <button onClick={handleSaveCategory} className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold text-sm transition-all">
                {editingCategory ? 'Guardar Cambios' : 'Crear Categoría'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ══════════ MODAL CUPÓN ══════════ */}
      {isCouponModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-700 w-full max-w-xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <h2 className="text-white font-bold text-lg">{editingCoupon ? '✏️ Editar Cupón' : '🏷️ Nuevo Cupón'}</h2>
              <button onClick={() => setIsCouponModalOpen(false)} className="text-zinc-400 hover:text-white p-1"><X size={20} /></button>
            </div>

            <div className="p-6 space-y-5">
              {/* Código */}
              <div>
                <label className="text-zinc-400 text-xs mb-1 block font-semibold">CÓDIGO DEL CUPÓN *</label>
                <input value={couponForm.code}
                  onChange={e => setCouponForm(p => ({ ...p, code: e.target.value.toUpperCase().replace(/\s/g,'') }))}
                  placeholder="Ej. BIENVENIDA10, ROSAS20, VERANO..."
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2.5 text-white text-base font-bold tracking-widest focus:outline-none focus:border-pink-500 uppercase" />
                <p className="text-zinc-500 text-xs mt-1">Sin espacios. El cliente lo escribe exactamente así en el carrito.</p>
              </div>

              {/* Descripción */}
              <div>
                <label className="text-zinc-400 text-xs mb-1 block font-semibold">DESCRIPCIÓN <span className="text-zinc-600 font-normal">(Para tu referencia)</span></label>
                <input value={couponForm.description}
                  onChange={e => setCouponForm(p => ({ ...p, description: e.target.value }))}
                  placeholder="Ej. 10% de descuento para nuevos clientes"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-pink-500" />
              </div>

              {/* Tipo de descuento */}
              <div>
                <label className="text-zinc-400 text-xs mb-2 block font-semibold">TIPO DE DESCUENTO *</label>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { val: 'percentage', label: '% Porcentaje', icon: '📊', desc: 'Ej. 15% OFF' },
                    { val: 'fixed', label: 'S/ Monto fijo', icon: '💰', desc: 'Ej. S/ 20 OFF' },
                    { val: 'free_shipping', label: '🚚 Envío gratis', icon: '🚚', desc: 'Sin costo de envío' },
                  ] as const).map(t => (
                    <button key={t.val} onClick={() => setCouponForm(p => ({ ...p, type: t.val }))}
                      className={`p-3 rounded-xl border text-center transition-all ${couponForm.type === t.val ? 'border-pink-500 bg-pink-500/10' : 'border-zinc-700 bg-zinc-800 hover:border-zinc-500'}`}>
                      <div className="text-xl mb-1">{t.icon}</div>
                      <div className={`text-xs font-bold ${couponForm.type === t.val ? 'text-pink-400' : 'text-zinc-300'}`}>{t.label}</div>
                      <div className="text-zinc-500 text-xs mt-0.5">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Valor */}
              {couponForm.type !== 'free_shipping' && (
                <div>
                  <label className="text-zinc-400 text-xs mb-1 block font-semibold">
                    {couponForm.type === 'percentage' ? 'PORCENTAJE DE DESCUENTO (%)' : 'MONTO DE DESCUENTO (S/)'}
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">
                      {couponForm.type === 'percentage' ? '%' : 'S/'}
                    </span>
                    <input type="number" value={couponForm.value}
                      onChange={e => setCouponForm(p => ({ ...p, value: e.target.value }))}
                      placeholder={couponForm.type === 'percentage' ? '10' : '20'}
                      min="0" max={couponForm.type === 'percentage' ? '100' : undefined}
                      className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-8 pr-3 py-2 text-white text-sm focus:outline-none focus:border-pink-500" />
                  </div>
                </div>
              )}

              {/* Monto mínimo y usos máximos */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-zinc-400 text-xs mb-1 block font-semibold">MONTO MÍNIMO (S/)</label>
                  <input type="number" value={couponForm.minOrderAmount}
                    onChange={e => setCouponForm(p => ({ ...p, minOrderAmount: e.target.value }))}
                    placeholder="0 = sin mínimo" min="0"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-pink-500" />
                </div>
                <div>
                  <label className="text-zinc-400 text-xs mb-1 block font-semibold">USOS MÁXIMOS</label>
                  <input type="number" value={couponForm.maxUses}
                    onChange={e => setCouponForm(p => ({ ...p, maxUses: e.target.value }))}
                    placeholder="0 = ilimitado" min="0"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-pink-500" />
                </div>
              </div>

              {/* Fecha de expiración */}
              <div>
                <label className="text-zinc-400 text-xs mb-1 block font-semibold">FECHA DE EXPIRACIÓN <span className="text-zinc-600 font-normal">(Opcional)</span></label>
                <input type="date" value={couponForm.expiryDate}
                  onChange={e => setCouponForm(p => ({ ...p, expiryDate: e.target.value }))}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-pink-500" />
                <p className="text-zinc-500 text-xs mt-1">Si no pones fecha, el cupón nunca expira.</p>
              </div>

              {/* Segmentación por categoría */}
              <div>
                <label className="text-zinc-400 text-xs mb-2 block font-semibold">APLICA SOLO A ESTAS CATEGORÍAS <span className="text-zinc-600 font-normal">(vacío = todo el catálogo)</span></label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => {
                    const isSelected = couponForm.applicableCategories.includes(cat.name);
                    return (
                      <button key={cat.id}
                        onClick={() => setCouponForm(p => ({
                          ...p,
                          applicableCategories: isSelected
                            ? p.applicableCategories.filter(c => c !== cat.name)
                            : [...p.applicableCategories, cat.name]
                        }))}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${isSelected ? 'border-pink-500 bg-pink-500/15 text-pink-300' : 'border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-500'}`}>
                        {cat.emoji} {cat.name}
                      </button>
                    );
                  })}
                </div>
                {couponForm.applicableCategories.length === 0 && (
                  <p className="text-zinc-500 text-xs mt-1.5">✅ Aplica a todos los productos del catálogo</p>
                )}
              </div>

              {/* Opciones extra */}
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 bg-zinc-800 rounded-lg cursor-pointer hover:bg-zinc-750">
                  <input type="checkbox" checked={couponForm.isActive}
                    onChange={e => setCouponForm(p => ({ ...p, isActive: e.target.checked }))}
                    className="accent-pink-500 w-4 h-4" />
                  <div>
                    <p className="text-zinc-300 text-sm">✅ Cupón activo (visible para clientes)</p>
                    <p className="text-zinc-500 text-xs">Si lo desactivas, los clientes no podrán usarlo</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 bg-zinc-800 rounded-lg cursor-pointer hover:bg-zinc-750">
                  <input type="checkbox" checked={couponForm.onePerUser}
                    onChange={e => setCouponForm(p => ({ ...p, onePerUser: e.target.checked }))}
                    className="accent-pink-500 w-4 h-4" />
                  <div>
                    <p className="text-zinc-300 text-sm">👤 Un uso por cliente</p>
                    <p className="text-zinc-500 text-xs">Limita el cupón a un solo uso por persona</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 p-6 border-t border-zinc-800">
              <button onClick={() => setIsCouponModalOpen(false)} className="px-4 py-2 text-zinc-400 hover:text-white transition-all text-sm">Cancelar</button>
              <button onClick={() => {
                if (!couponForm.code.trim()) { toast.error('El código es obligatorio'); return; }
                if (couponForm.type !== 'free_shipping' && !couponForm.value) { toast.error('Ingresa el valor del descuento'); return; }
                const data = {
                  code: couponForm.code.toUpperCase(),
                  description: couponForm.description,
                  type: couponForm.type,
                  value: parseFloat(couponForm.value) || 0,
                  minOrderAmount: parseFloat(couponForm.minOrderAmount) || 0,
                  maxUses: parseInt(couponForm.maxUses) || 0,
                  expiryDate: couponForm.expiryDate,
                  applicableCategories: couponForm.applicableCategories,
                  applicableProducts: couponForm.applicableProducts,
                  isActive: couponForm.isActive,
                  onePerUser: couponForm.onePerUser,
                };
                if (editingCoupon) {
                  updateCoupon(editingCoupon.id, data);
                  toast.success('Cupón actualizado ✅');
                } else {
                  addCoupon(data);
                  toast.success('Cupón creado 🏷️');
                }
                setIsCouponModalOpen(false);
              }}
                className="px-6 py-2 text-white rounded-lg font-semibold text-sm transition-all hover:opacity-90"
                style={{ background: '#e91e8c' }}>
                {editingCoupon ? 'Guardar Cambios' : 'Crear Cupón'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ MODAL COMPLEMENTO ══════════ */}
      {isComplementModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-2xl border border-zinc-700 w-full max-w-xl max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-zinc-800">
              <h2 className="text-xl font-bold text-white">{editingComplement ? '✏️ Editar Complemento' : '➕ Nuevo Complemento'}</h2>
              <button onClick={() => setIsComplementModalOpen(false)} className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-white transition-all"><X size={20} /></button>
            </div>
            <div className="p-6 space-y-4">
              {/* Nombre */}
              <div>
                <label className="text-sm font-medium text-zinc-300 block mb-1.5">Nombre *</label>
                <input type="text" value={complementForm.name} onChange={e => setComplementForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Ej. Globo Feliz Cumpleaños"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-pink-500" />
              </div>
              {/* Marca + Categoría */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-zinc-300 block mb-1.5">Marca *</label>
                  <input type="text" value={complementForm.brand} onChange={e => setComplementForm(p => ({ ...p, brand: e.target.value }))}
                    placeholder="Ej. Ferrero Rocher"
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-pink-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-300 block mb-1.5">Categoría *</label>
                  <select value={complementForm.category} onChange={e => setComplementForm(p => ({ ...p, category: e.target.value as Complement['category'] }))}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-pink-500">
                    <option value="globos">🎈 Globos</option>
                    <option value="peluches">🧸 Peluches</option>
                    <option value="chocolates">🍫 Chocolates</option>
                  </select>
                </div>
              </div>
              {/* Precio + Tamaño + Stock */}
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium text-zinc-300 block mb-1.5">Precio (S/) *</label>
                  <input type="number" value={complementForm.price} onChange={e => setComplementForm(p => ({ ...p, price: parseFloat(e.target.value) || 0 }))}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-pink-500" />
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-300 block mb-1.5">Tamaño</label>
                  <select value={complementForm.size} onChange={e => setComplementForm(p => ({ ...p, size: e.target.value as Complement['size'] }))}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-pink-500">
                    <option>Pequeño</option>
                    <option>Mediano</option>
                    <option>Grande</option>
                    <option>Extra Grande</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-zinc-300 block mb-1.5">Stock</label>
                  <input type="number" value={complementForm.stock} onChange={e => setComplementForm(p => ({ ...p, stock: parseInt(e.target.value) || 0 }))}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-pink-500" />
                </div>
              </div>
              {/* Imagen */}
              <div>
                <label className="text-sm font-medium text-zinc-300 block mb-1.5">
                  URL Imagen &nbsp;
                  <span className="inline-flex gap-1 text-xs">
                    <span className="bg-blue-500 text-white px-1.5 py-0.5 rounded">PNG</span>
                    <span className="bg-green-600 text-white px-1.5 py-0.5 rounded">JPG</span>
                    <span className="bg-purple-500 text-white px-1.5 py-0.5 rounded">400×500px</span>
                  </span>
                </label>
                <input type="url" value={complementForm.image} onChange={e => setComplementForm(p => ({ ...p, image: e.target.value }))}
                  placeholder="https://res.cloudinary.com/..."
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-pink-500" />
                {complementForm.image && (
                  <div className="mt-2 w-24 h-28 rounded-lg overflow-hidden border border-zinc-600">
                    <img src={complementForm.image} alt="preview" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
                  </div>
                )}
              </div>
              {/* Descripción */}
              <div>
                <label className="text-sm font-medium text-zinc-300 block mb-1.5">Descripción <span className="text-zinc-500">(Opcional)</span></label>
                <textarea value={complementForm.description} onChange={e => setComplementForm(p => ({ ...p, description: e.target.value }))}
                  rows={2} placeholder="Descripción breve del complemento..."
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-white outline-none focus:border-pink-500 resize-none" />
              </div>
              {/* Toggles */}
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <div onClick={() => setComplementForm(p => ({ ...p, isActive: !p.isActive }))}
                    className={`w-11 h-6 rounded-full transition-colors relative ${complementForm.isActive ? 'bg-green-500' : 'bg-zinc-600'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${complementForm.isActive ? 'left-6' : 'left-1'}`} />
                  </div>
                  <span className="text-sm text-zinc-300">Activo</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <div onClick={() => setComplementForm(p => ({ ...p, featured: !p.featured }))}
                    className={`w-11 h-6 rounded-full transition-colors relative ${complementForm.featured ? 'bg-pink-500' : 'bg-zinc-600'}`}>
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${complementForm.featured ? 'left-6' : 'left-1'}`} />
                  </div>
                  <span className="text-sm text-zinc-300">⭐ Popular</span>
                </label>
              </div>
            </div>
            <div className="flex justify-end gap-3 p-6 border-t border-zinc-800">
              <button onClick={() => setIsComplementModalOpen(false)} className="px-4 py-2 text-zinc-400 hover:text-white transition-all text-sm">Cancelar</button>
              <button onClick={() => {
                if (!complementForm.name.trim()) { toast.error('El nombre es obligatorio'); return; }
                if (!complementForm.brand.trim()) { toast.error('La marca es obligatoria'); return; }
                if (!complementForm.price || complementForm.price <= 0) { toast.error('El precio debe ser mayor a 0'); return; }
                if (editingComplement) {
                  context?.updateComplement(editingComplement.id, complementForm);
                  toast.success('Complemento actualizado ✅');
                } else {
                  context?.addComplement(complementForm);
                  toast.success('Complemento agregado 🎁');
                }
                setIsComplementModalOpen(false);
              }} className="px-6 py-2 text-white rounded-lg font-semibold text-sm transition-all hover:opacity-90"
                style={{ background: '#e91e8c' }}>
                {editingComplement ? 'Guardar Cambios' : 'Agregar Complemento'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
