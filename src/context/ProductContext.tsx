import { createContext, useState, useEffect, ReactNode } from 'react';
import { products as initialProducts, Product, ArrangementItem } from '../data/products';
export type { ArrangementItem };

export interface Complement {
  id: number;
  name: string;
  brand: string;
  category: 'globos' | 'peluches' | 'chocolates';
  size: 'Pequeño' | 'Mediano' | 'Grande' | 'Extra Grande';
  price: number;
  image: string;
  description: string;
  isActive: boolean;
  stock: number;
  featured: boolean;
}

export interface Coupon {
  id: number;
  code: string;
  description: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: number;
  minOrderAmount: number;
  maxUses: number;
  usedCount: number;
  isActive: boolean;
  expiryDate: string;
  applicableCategories: string[];  // [] = todas
  applicableProducts: number[];    // [] = todos
  onePerUser: boolean;
  createdAt: string;
}

export interface Category {
  id: number;
  name: string;
  emoji: string;
  description: string;
  isVisible: boolean;
  order: number;
  circleColor: string;
  circleImage?: string;
}

export interface Banner {
  id: number;
  title: string;
  subtitle: string;
  imageDesktop: string;
  imageMobile: string;
  buttonText: string;
  buttonLink: string;
  showTitle: boolean;
  showSubtitle: boolean;
  showButton: boolean;
  isActive: boolean;
  order: number;
}

const initialCoupons: Coupon[] = [
  {
    id: 1,
    code: 'BIENVENIDA10',
    description: '10% de descuento en tu primer pedido',
    type: 'percentage',
    value: 10,
    minOrderAmount: 50,
    maxUses: 100,
    usedCount: 12,
    isActive: true,
    expiryDate: '2025-12-31',
    applicableCategories: [],
    applicableProducts: [],
    onePerUser: true,
    createdAt: '2025-01-01',
  },
  {
    id: 2,
    code: 'ROSAS20',
    description: 'S/ 20 de descuento en ramos de rosas',
    type: 'fixed',
    value: 20,
    minOrderAmount: 100,
    maxUses: 50,
    usedCount: 8,
    isActive: true,
    expiryDate: '2025-06-30',
    applicableCategories: ['Ramos de Rosas'],
    applicableProducts: [],
    onePerUser: false,
    createdAt: '2025-01-15',
  },
  {
    id: 3,
    code: 'ENVIOGRATIS',
    description: 'Envío gratis en cualquier pedido',
    type: 'free_shipping',
    value: 0,
    minOrderAmount: 80,
    maxUses: 200,
    usedCount: 45,
    isActive: false,
    expiryDate: '2025-03-31',
    applicableCategories: [],
    applicableProducts: [],
    onePerUser: false,
    createdAt: '2025-02-01',
  },
];

const initialCategories: Category[] = [
  { id: 1, name: 'Ramos de Rosas', emoji: '🌹', description: 'Hermosos ramos de rosas de limpiapipas', isVisible: true, order: 1, circleColor: '#f9a8d4' },
  { id: 2, name: 'Girasoles y Mixtos', emoji: '🌻', description: 'Girasoles y combinaciones especiales', isVisible: true, order: 2, circleColor: '#fde047' },
  { id: 3, name: 'Temáticos y Personajes', emoji: '🌸', description: 'Arreglos temáticos de personajes animados', isVisible: true, order: 3, circleColor: '#22d3ee' },
];

const initialComplements: Complement[] = [
  { id: 1, name: 'Globo Feliz Cumpleaños Colorido', brand: 'Globitos', category: 'globos', size: 'Mediano', price: 12.00, image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=500&fit=crop', description: 'Globo metálico de helio con diseño de cumpleaños', isActive: true, stock: 50, featured: true },
  { id: 2, name: 'Globo de Helio Estrella Dorada', brand: 'Globitos', category: 'globos', size: 'Grande', price: 20.00, image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=500&fit=crop', description: 'Globo estrella dorada con helio', isActive: true, stock: 30, featured: false },
  { id: 3, name: 'Globo Transparente con Confeti', brand: 'Globitos', category: 'globos', size: 'Grande', price: 20.00, image: 'https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=400&h=500&fit=crop', description: 'Globo transparente lleno de confeti de colores', isActive: true, stock: 25, featured: true },
  { id: 4, name: 'Osito de Peluche Amor', brand: 'TeddyLove', category: 'peluches', size: 'Pequeño', price: 35.00, image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=500&fit=crop', description: 'Osito de peluche suave con lazo rojo', isActive: true, stock: 20, featured: true },
  { id: 5, name: 'Conejito de Peluche Gigante', brand: 'TeddyLove', category: 'peluches', size: 'Grande', price: 65.00, image: 'https://images.unsplash.com/photo-1559715745-e1b33a271c8f?w=400&h=500&fit=crop', description: 'Conejito blanco gigante ultra suave', isActive: true, stock: 15, featured: false },
  { id: 6, name: 'Oso Panda de Peluche', brand: 'TeddyLove', category: 'peluches', size: 'Mediano', price: 45.00, image: 'https://images.unsplash.com/photo-1563396983906-b3795482a59a?w=400&h=500&fit=crop', description: 'Adorable oso panda de peluche suave', isActive: true, stock: 18, featured: true },
  { id: 7, name: 'Caja Ferrero Rocher 12 un.', brand: 'Ferrero Rocher', category: 'chocolates', size: 'Mediano', price: 70.00, image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=400&h=500&fit=crop', description: 'Caja de 12 bombones Ferrero Rocher', isActive: true, stock: 40, featured: true },
  { id: 8, name: 'Caja La Iberica Surtida', brand: 'La Ibérica', category: 'chocolates', size: 'Grande', price: 65.00, image: 'https://images.unsplash.com/photo-1481391319762-47dff72954d9?w=400&h=500&fit=crop', description: 'Surtido de chocolates La Ibérica 20 unidades', isActive: true, stock: 35, featured: false },
  { id: 9, name: 'Ferrero Rocher Corazón 8 un.', brand: 'Ferrero Rocher', category: 'chocolates', size: 'Pequeño', price: 45.00, image: 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400&h=500&fit=crop', description: 'Caja corazón de 8 bombones Ferrero Rocher', isActive: true, stock: 45, featured: true },
];

const initialBanners: Banner[] = [
  {
    id: 1,
    title: "Arreglos de Limpiapipas",
    subtitle: "Arte hecho a mano con amor. Perfectos para regalar o decorar tu hogar.",
    imageDesktop: "https://images.unsplash.com/photo-1563241527-3004b7be025f?w=1920&h=800&fit=crop",
    imageMobile: "https://images.unsplash.com/photo-1563241527-3004b7be025f?w=800&h=1200&fit=crop",
    buttonText: "Ver Colección",
    buttonLink: "#products",
    showTitle: true,
    showSubtitle: true,
    showButton: true,
    isActive: true,
    order: 1
  },
  {
    id: 2,
    title: "Ramos de Rosas Eternas",
    subtitle: "El regalo perfecto para ese momento especial. Hechas con limpiapipas de alta calidad.",
    imageDesktop: "https://images.unsplash.com/photo-1518882605630-8eb565f5e673?w=1920&h=800&fit=crop",
    imageMobile: "https://images.unsplash.com/photo-1518882605630-8eb565f5e673?w=800&h=1200&fit=crop",
    buttonText: "Descubrir",
    buttonLink: "#products",
    showTitle: true,
    showSubtitle: true,
    showButton: true,
    isActive: true,
    order: 2
  },
  {
    id: 3,
    title: "Día de la Madre",
    subtitle: "Sorprende a mamá con un arreglo único y hecho a mano. Envíos a domicilio disponibles.",
    imageDesktop: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1920&h=800&fit=crop",
    imageMobile: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=800&h=1200&fit=crop",
    buttonText: "Ver Ofertas",
    buttonLink: "#products",
    showTitle: true,
    showSubtitle: true,
    showButton: true,
    isActive: true,
    order: 3
  }
];

export interface HeaderConfig {
  logoType: 'text' | 'image';
  logoText: string;
  logoImage: string;
  logoImageDark: string;
  logoImageLight: string;
  logoColor: string;
  logoColorDark: string;
  logoColorLight: string;
  logoSize: 'sm' | 'md' | 'lg' | 'xl';
  headerBgColor: string;
  headerBgOpacity: number;
  headerBlur: boolean;
  headerHeight: 'compact' | 'normal' | 'tall';
  headerPosition: 'fixed' | 'static';
  headerScrollEffect: boolean;
  menuVisible: boolean;
  menuItems: { label: string; link: string }[];
  menuColor: string;
  menuHoverColor: string;
  menuFontSize: 'xs' | 'sm' | 'base';
  menuFontWeight: 'normal' | 'medium' | 'bold';
  showSearch: boolean;
  showCart: boolean;
  showCartBadge: boolean;
  cartBadgeColor: string;
  showUserIcon: boolean;
  showAdminIcon: boolean;
  announcementBarVisible: boolean;
  announcementText: string;
  announcementBgColor: string;
  announcementTextColor: string;
  announcementLink: string;
}

export interface DeliveryDistrict {
  name: string;
  price: number;
  isActive: boolean;
}

export interface DeliveryConfig {
  // Recojo en tienda
  pickupEnabled: boolean;
  storeName: string;
  storeAddress: string;
  storeDistrict: string;
  storePhone: string;
  storeSchedule: string;
  storeMapEmbed: string;
  storeMapLink: string;
  pickupReadyTime: string;
  // Envío a domicilio
  deliveryEnabled: boolean;
  deliveryTime: string;
  deliveryNote: string;
  districts: DeliveryDistrict[];
}

export interface PaymentMethodConfig {
  enabled: boolean;
  accountNumber: string;
  accountHolder: string;
  qrImage: string; // URL de la imagen QR
}

export interface PaymentConfig {
  yape: PaymentMethodConfig;
  plin: PaymentMethodConfig;
}

export interface ProductFeature {
  id: number;
  icon: 'truck' | 'shield' | 'clock' | 'star' | 'heart' | 'gift';
  text: string;
  color: string;
  enabled: boolean;
}

export interface PaymentBadge {
  id: number;
  text: string;
  bgColor: string;
  textColor: string;
  image: string; // URL imagen opcional
  enabled: boolean;
}

export interface ProductPageConfig {
  showBadgeOnImage: boolean; // habilitar/deshabilitar etiqueta en imagen
  features: ProductFeature[]; // envío, garantía, atención
  paymentBadges: PaymentBadge[]; // métodos de pago
}

export interface PromoBannerItem {
  id: number;
  title: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  gradientFrom: string;
  gradientTo: string;
  textColor: 'light' | 'dark';
  image: string;
  active: boolean;
}

export interface TopBarItem {
  id: number;
  text: string;
  icon: 'phone' | 'mail' | 'truck' | 'clock' | 'sparkles' | 'gift' | 'none';
  link: string;
  enabled: boolean;
}

export interface TopBarConfig {
  enabled: boolean;
  bgColor: string;
  textColor: string;
  height: 'sm' | 'md' | 'lg';
  speed: number;
  useGradient: boolean;
  gradientFrom: string;
  gradientTo: string;
  items: TopBarItem[];
}

export interface StoreConfig {
  whatsappNumber: string;
  themeMode: 'dark' | 'light';
  header: HeaderConfig;
  topBar: TopBarConfig;
  delivery: DeliveryConfig;
  payment: PaymentConfig;
  productPage: ProductPageConfig;
  promoBanners: PromoBannerItem[];
}

const defaultHeader: HeaderConfig = {
  logoType: 'text',
  logoText: 'SHOPFLIX',
  logoImage: '',
  logoImageDark: '',
  logoImageLight: '',
  logoColor: '#dc2626',
  logoColorDark: '#dc2626',
  logoColorLight: '#dc2626',
  logoSize: 'lg',
  headerBgColor: '#09090b',
  headerBgOpacity: 95,
  headerBlur: true,
  headerHeight: 'normal',
  headerPosition: 'fixed',
  headerScrollEffect: true,
  menuVisible: true,
  menuItems: [
    { label: 'Inicio', link: '#' },
    { label: 'Productos', link: '#products' },
    { label: 'Ofertas', link: '#' },
    { label: 'Nuevo', link: '#' },
  ],
  menuColor: '#d1d5db',
  menuHoverColor: '#ffffff',
  menuFontSize: 'sm',
  menuFontWeight: 'medium',
  showSearch: true,
  showCart: true,
  showCartBadge: true,
  cartBadgeColor: '#dc2626',
  showUserIcon: true,
  showAdminIcon: true,
  announcementBarVisible: false,
  announcementText: '🌸 ¡Envíos gratis en pedidos mayores a S/ 150!',
  announcementBgColor: '#dc2626',
  announcementTextColor: '#ffffff',
  announcementLink: '#',
};

const defaultTopBar: TopBarConfig = {
  enabled: true,
  bgColor: '#f472b6',
  textColor: '#ffffff',
  height: 'sm',
  speed: 18,
  useGradient: false,
  gradientFrom: '#f472b6',
  gradientTo: '#e91e8c',
  items: [
    { id: 1, text: 'floresydetalleslima1@gmail.com', icon: 'mail', link: 'mailto:floresydetalleslima1@gmail.com', enabled: true },
    { id: 2, text: 'Envío GRATIS a Canto Rey y zonas aledañas', icon: 'truck', link: '#', enabled: true },
    { id: 3, text: 'Horario: Lun - Dom 8:00 AM - 10:00 PM', icon: 'clock', link: '#', enabled: true },
    { id: 4, text: 'Flores frescas diarias - Calidad garantizada', icon: 'sparkles', link: '#', enabled: true },
    { id: 5, text: 'Contáctanos: +51 919 642 610', icon: 'phone', link: 'tel:+51919642610', enabled: true },
  ],
};

interface ProductContextType {
  products: Product[];
  banners: Banner[];
  categories: Category[];
  coupons: Coupon[];
  complements: Complement[];
  storeConfig: StoreConfig;
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: number, product: Partial<Product>) => void;
  deleteProduct: (id: number) => void;
  addBanner: (banner: Omit<Banner, 'id'>) => void;
  updateBanner: (id: number, banner: Partial<Banner>) => void;
  deleteBanner: (id: number) => void;
  reorderBanners: (banners: Banner[]) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: number, category: Partial<Category>) => void;
  deleteCategory: (id: number) => void;
  reorderCategories: (categories: Category[]) => void;
  addCoupon: (coupon: Omit<Coupon, 'id' | 'usedCount' | 'createdAt'>) => void;
  updateCoupon: (id: number, coupon: Partial<Coupon>) => void;
  deleteCoupon: (id: number) => void;
  validateCoupon: (code: string, cartTotal: number, cartItems: { category: string; id: number }[]) => { valid: boolean; coupon?: Coupon; message: string };
  addComplement: (c: Omit<Complement, 'id'>) => void;
  updateComplement: (id: number, c: Partial<Complement>) => void;
  deleteComplement: (id: number) => void;
  updateStoreConfig: (config: Partial<StoreConfig>) => void;
  updateHeaderConfig: (header: Partial<HeaderConfig>) => void;
}

export const ProductContext = createContext<ProductContextType | null>(null);

const defaultDelivery: DeliveryConfig = {
  pickupEnabled: true,
  storeName: 'Flores & Detalles Lima',
  storeAddress: 'Av. Próceres de la Independencia N°3301, Mercado Progreso Los Pinos, 2do. Piso / Tienda 12',
  storeDistrict: 'San Juan de Lurigancho',
  storePhone: '+51 919 642 610',
  storeSchedule: 'Lun-Dom: 8:00 AM - 10:00 PM',
  storeMapEmbed: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3900.5!2d-77.0!3d-12.0!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9105c5f619ee3ec7%3A0x4b7d5fef1f6f3b8e!2sAv.+Pr%C3%B3ceres+de+la+Independencia%2C+San+Juan+de+Lurigancho!5e0!3m2!1ses!2spe!4v1',
  storeMapLink: 'https://maps.google.com/?q=Av.+Proceres+de+la+Independencia+3301+San+Juan+de+Lurigancho+Lima',
  pickupReadyTime: '2-4 horas',
  deliveryEnabled: true,
  deliveryTime: '2-4 horas',
  deliveryNote: 'Entregamos las flores donde tú indiques',
  districts: [
    { name: 'San Juan de Lurigancho', price: 0, isActive: true },
    { name: 'Canto Rey', price: 0, isActive: true },
    { name: 'Ate', price: 10, isActive: true },
    { name: 'La Molina', price: 15, isActive: true },
    { name: 'Miraflores', price: 20, isActive: true },
    { name: 'San Isidro', price: 20, isActive: true },
    { name: 'Surco', price: 18, isActive: true },
    { name: 'San Borja', price: 18, isActive: true },
    { name: 'Jesús María', price: 18, isActive: true },
    { name: 'Lince', price: 18, isActive: true },
    { name: 'Barranco', price: 22, isActive: true },
    { name: 'Chorrillos', price: 22, isActive: true },
    { name: 'Los Olivos', price: 20, isActive: true },
    { name: 'San Martín de Porres', price: 18, isActive: true },
    { name: 'Independencia', price: 15, isActive: true },
    { name: 'Comas', price: 20, isActive: true },
    { name: 'Carabayllo', price: 22, isActive: true },
    { name: 'Puente Piedra', price: 25, isActive: false },
    { name: 'Villa El Salvador', price: 25, isActive: true },
    { name: 'Villa María del Triunfo', price: 22, isActive: true },
  ],
};

export function ProductProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = localStorage.getItem('netflix-store-products');
    return saved ? JSON.parse(saved) : initialProducts;
  });

  const [banners, setBanners] = useState<Banner[]>(() => {
    const saved = localStorage.getItem('netflix-store-banners');
    return saved ? JSON.parse(saved) : initialBanners;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('netflix-store-categories');
    return saved ? JSON.parse(saved) : initialCategories;
  });

  const [coupons, setCoupons] = useState<Coupon[]>(() => {
    const saved = localStorage.getItem('netflix-store-coupons');
    return saved ? JSON.parse(saved) : initialCoupons;
  });

  const [complements, setComplements] = useState<Complement[]>(() => {
    const saved = localStorage.getItem('netflix-store-complements');
    return saved ? JSON.parse(saved) : initialComplements;
  });

  const defaultPayment: PaymentConfig = {
    yape: { enabled: true, accountNumber: '999 888 777', accountHolder: 'NOMBRE APELLIDO', qrImage: '' },
    plin: { enabled: true, accountNumber: '999 888 777', accountHolder: 'NOMBRE APELLIDO', qrImage: '' },
  };

  const defaultProductPage: ProductPageConfig = {
    showBadgeOnImage: true,
    features: [
      { id: 1, icon: 'truck', text: 'Envío el mismo día', color: '#22c55e', enabled: true },
      { id: 2, icon: 'shield', text: 'Garantía de frescura', color: '#818cf8', enabled: true },
      { id: 3, icon: 'clock', text: 'Atención 24/7', color: '#c084fc', enabled: true },
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
  };

  const [storeConfig, setStoreConfig] = useState<StoreConfig>(() => {
    const saved = localStorage.getItem('netflix-store-config');
    if (saved) {
      const parsed = JSON.parse(saved);
      return {
        whatsappNumber: parsed.whatsappNumber || '51999888777',
        themeMode: (parsed.themeMode as 'dark' | 'light') || 'dark',
        header: { ...defaultHeader, ...(parsed.header || {}) },
        topBar: {
          ...defaultTopBar,
          ...(parsed.topBar || {}),
          speed: parsed.topBar?.speed ?? defaultTopBar.speed,
          useGradient: parsed.topBar?.useGradient ?? defaultTopBar.useGradient,
          gradientFrom: parsed.topBar?.gradientFrom || defaultTopBar.gradientFrom,
          gradientTo: parsed.topBar?.gradientTo || defaultTopBar.gradientTo,
          items: parsed.topBar?.items || defaultTopBar.items
        },
        delivery: { ...defaultDelivery, ...(parsed.delivery || {}) },
        payment: {
          yape: { ...defaultPayment.yape, ...(parsed.payment?.yape || {}) },
          plin: { ...defaultPayment.plin, ...(parsed.payment?.plin || {}) },
        },
        productPage: {
          showBadgeOnImage: parsed.productPage?.showBadgeOnImage ?? defaultProductPage.showBadgeOnImage,
          features: parsed.productPage?.features || defaultProductPage.features,
          paymentBadges: parsed.productPage?.paymentBadges || defaultProductPage.paymentBadges,
        },
        promoBanners: parsed.promoBanners || [],
      };
    }
    return { whatsappNumber: '51999888777', themeMode: 'dark', header: defaultHeader, topBar: defaultTopBar, delivery: defaultDelivery, payment: defaultPayment, productPage: defaultProductPage, promoBanners: [
      { id: 1, title: '🌸 Arreglos para toda ocasión', subtitle: 'Descubre nuestra selección especial de limpiapipas', buttonText: 'Ver colección', buttonLink: '#', gradientFrom: '#e91e8c', gradientTo: '#ff6b9d', textColor: 'light', image: '', active: true },
      { id: 2, title: '💚 Envío el mismo día', subtitle: 'Pedidos antes de las 6PM llegan hoy', buttonText: 'Pedir ahora', buttonLink: '#', gradientFrom: '#25D366', gradientTo: '#128C7E', textColor: 'light', image: '', active: true },
    ] };
  });

  useEffect(() => {
    localStorage.setItem('netflix-store-products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('netflix-store-banners', JSON.stringify(banners));
  }, [banners]);

  useEffect(() => {
    localStorage.setItem('netflix-store-categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('netflix-store-config', JSON.stringify(storeConfig));
  }, [storeConfig]);

  useEffect(() => {
    localStorage.setItem('netflix-store-coupons', JSON.stringify(coupons));
  }, [coupons]);

  const addProduct = (product: Omit<Product, 'id'>) => {
    setProducts(prev => [{ ...product, id: Date.now() }, ...prev]);
  };
  const updateProduct = (id: number, updatedInfo: Partial<Product>) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updatedInfo } : p));
  };
  const deleteProduct = (id: number) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const addBanner = (banner: Omit<Banner, 'id'>) => {
    setBanners(prev => [...prev, { ...banner, id: Date.now() }].sort((a, b) => a.order - b.order));
  };
  const updateBanner = (id: number, updatedInfo: Partial<Banner>) => {
    setBanners(prev => prev.map(b => b.id === id ? { ...b, ...updatedInfo } : b));
  };
  const deleteBanner = (id: number) => {
    setBanners(prev => prev.filter(b => b.id !== id));
  };
  const reorderBanners = (newBanners: Banner[]) => {
    setBanners(newBanners.map((b, i) => ({ ...b, order: i + 1 })));
  };

  const addCategory = (category: Omit<Category, 'id'>) => {
    setCategories(prev => [...prev, { ...category, id: Date.now() }].sort((a, b) => a.order - b.order));
  };
  const updateCategory = (id: number, updatedInfo: Partial<Category>) => {
    setCategories(prev => prev.map(c => c.id === id ? { ...c, ...updatedInfo } : c));
  };
  const deleteCategory = (id: number) => {
    setCategories(prev => prev.filter(c => c.id !== id));
  };
  const reorderCategories = (newCategories: Category[]) => {
    setCategories(newCategories.map((c, i) => ({ ...c, order: i + 1 })));
  };

  const addCoupon = (coupon: Omit<Coupon, 'id' | 'usedCount' | 'createdAt'>) => {
    setCoupons(prev => [...prev, { ...coupon, id: Date.now(), usedCount: 0, createdAt: new Date().toISOString().split('T')[0] }]);
  };
  const updateCoupon = (id: number, updatedInfo: Partial<Coupon>) => {
    setCoupons(prev => prev.map(c => c.id === id ? { ...c, ...updatedInfo } : c));
  };
  const deleteCoupon = (id: number) => {
    setCoupons(prev => prev.filter(c => c.id !== id));
  };
  const validateCoupon = (code: string, cartTotal: number, cartItems: { category: string; id: number }[]): { valid: boolean; coupon?: Coupon; message: string } => {
    const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase());
    if (!coupon) return { valid: false, message: '❌ Cupón no encontrado' };
    if (!coupon.isActive) return { valid: false, message: '❌ Este cupón no está activo' };
    if (coupon.expiryDate && new Date(coupon.expiryDate) < new Date()) return { valid: false, message: '❌ Este cupón ha expirado' };
    if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) return { valid: false, message: '❌ Este cupón ha alcanzado su límite de usos' };
    if (cartTotal < coupon.minOrderAmount) return { valid: false, message: `❌ Monto mínimo de S/ ${coupon.minOrderAmount.toFixed(2)} requerido` };
    if (coupon.applicableCategories.length > 0) {
      const hasCategory = cartItems.some(item => coupon.applicableCategories.includes(item.category));
      if (!hasCategory) return { valid: false, message: `❌ Cupón válido solo para: ${coupon.applicableCategories.join(', ')}` };
    }
    if (coupon.applicableProducts.length > 0) {
      const hasProduct = cartItems.some(item => coupon.applicableProducts.includes(item.id));
      if (!hasProduct) return { valid: false, message: '❌ Cupón no aplica a los productos en tu carrito' };
    }
    return { valid: true, coupon, message: '✅ ¡Cupón aplicado correctamente!' };
  };

  useEffect(() => {
    localStorage.setItem('netflix-store-complements', JSON.stringify(complements));
  }, [complements]);

  const addComplement = (c: Omit<Complement, 'id'>) => {
    setComplements(prev => [...prev, { ...c, id: Date.now() }]);
  };
  const updateComplement = (id: number, c: Partial<Complement>) => {
    setComplements(prev => prev.map(x => x.id === id ? { ...x, ...c } : x));
  };
  const deleteComplement = (id: number) => {
    setComplements(prev => prev.filter(x => x.id !== id));
  };

  const updateStoreConfig = (config: Partial<StoreConfig>) => {
    setStoreConfig(prev => ({ ...prev, ...config }));
  };
  const updateHeaderConfig = (header: Partial<HeaderConfig>) => {
    setStoreConfig(prev => ({ ...prev, header: { ...prev.header, ...header } }));
  };

  return (
    <ProductContext.Provider value={{
      products, banners, categories, coupons, storeConfig,
      addProduct, updateProduct, deleteProduct,
      addBanner, updateBanner, deleteBanner, reorderBanners,
      addCategory, updateCategory, deleteCategory, reorderCategories,
      addCoupon, updateCoupon, deleteCoupon, validateCoupon,
      complements, addComplement, updateComplement, deleteComplement,
      updateStoreConfig, updateHeaderConfig,
    }}>
      {children}
    </ProductContext.Provider>
  );
}
