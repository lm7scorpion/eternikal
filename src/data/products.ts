export interface ArrangementItem {
  id: number;
  emoji: string;
  quantity: number;
  name: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  hoverImage?: string;
  category: string;
  rating: number;
  badge?: string;
  arrangementContent?: ArrangementItem[];
}

export const categories: string[] = [
  "Ramos de Rosas",
  "Girasoles y Mixtos",
  "Temáticos y Personajes"
];

export const products: Product[] = [
  // Categoria: Ramos de Rosas
  {
    id: 1,
    name: "Ramo de 12 Rosas Rojas (Limpiapipas)",
    description: "Hermoso ramo clásico de 12 rosas rojas hechas 100% a mano con limpiapipas de alta calidad. Incluye envoltura de papel coreano y lazo. Nunca se marchitarán, el regalo perfecto para demostrar amor eterno.",
    price: 350,
    originalPrice: 450,
    image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=600&h=800&fit=crop",
    hoverImage: "https://images.unsplash.com/photo-1518882605630-8eb565f5e673?q=80&w=600&h=800&fit=crop",
    category: "Ramos de Rosas",
    rating: 5.0,
    badge: "Más Vendido",
    arrangementContent: [
      { id: 1, emoji: "🌹", quantity: 12, name: "Rosas rojas" },
      { id: 2, emoji: "🌿", quantity: 3, name: "Tallos de follaje verde" },
      { id: 3, emoji: "🎀", quantity: 1, name: "Lazo decorativo" },
      { id: 4, emoji: "📄", quantity: 1, name: "Envoltura papel coreano" },
    ]
  },
  {
    id: 2,
    name: "Ramo Pastel (Rosas Rosas y Blancas)",
    description: "Delicado arreglo en tonos pastel. Contiene 8 rosas rosadas y 7 rosas blancas de limpiapipas, ideal para cumpleaños o aniversarios. Acabado brillante y suave al tacto.",
    price: 420,
    image: "https://images.unsplash.com/photo-1508611311053-d1dc57eb1fc8?q=80&w=600&h=800&fit=crop",
    category: "Ramos de Rosas",
    rating: 4.8
  },
  {
    id: 3,
    name: "Mini Ramo de 3 Rosas Eternas",
    description: "Detalle pequeño pero significativo. 3 rosas rojas de limpiapipas con follaje artificial. Perfecto para tener un detalle especial sin gastar de más.",
    price: 120,
    image: "https://images.unsplash.com/photo-1548094891-c4ba474eb5a5?q=80&w=600&h=800&fit=crop",
    category: "Ramos de Rosas",
    rating: 4.6
  },
  {
    id: 4,
    name: "Ramo Buchón 50 Rosas (Limpiapipas)",
    description: "Impresionante ramo buchón elaborado con 50 rosas de limpiapipas rojas. Un regalo que dejará sin palabras. Incluye corona decorativa.",
    price: 1200,
    originalPrice: 1500,
    image: "https://images.unsplash.com/photo-1614031679244-a9b80302b115?q=80&w=600&h=800&fit=crop",
    category: "Ramos de Rosas",
    rating: 4.9,
    badge: "Premium"
  },
  {
    id: 5,
    name: "Ramo Rosas Azules Brillantes",
    description: "Ramo exótico de 15 rosas en tonos azules y plateados. Hechas con limpiapipas metalizados para dar un efecto deslumbrante.",
    price: 500,
    image: "https://images.unsplash.com/photo-1582794543139-8ac9cb0f7b11?q=80&w=600&h=800&fit=crop",
    category: "Ramos de Rosas",
    rating: 4.7,
    badge: "Nuevo"
  },

  // Categoria: Girasoles y Mixtos
  {
    id: 6,
    name: "Arreglo de 3 Girasoles Grandes",
    description: "Tres hermosos girasoles gigantes elaborados en limpiapipas amarillo vibrante y centro café texturizado. Transmiten alegría y buena energía.",
    price: 280,
    originalPrice: 320,
    image: "https://images.unsplash.com/photo-1474112704314-8162b7749a90?q=80&w=600&h=800&fit=crop",
    category: "Girasoles y Mixtos",
    rating: 4.9,
    badge: "Oferta",
    arrangementContent: [
      { id: 1, emoji: "🌻", quantity: 3, name: "Girasoles grandes" },
      { id: 2, emoji: "🌿", quantity: 5, name: "Hojas decorativas" },
      { id: 3, emoji: "🎀", quantity: 1, name: "Moño amarillo" },
    ]
  },
  {
    id: 7,
    name: "Girasol Solitario en Domo",
    description: "Un girasol perfecto de limpiapipas dentro de un domo de acrílico transparente. Inspirado en 'La Bella y la Bestia' pero con un toque soleado.",
    price: 180,
    image: "https://images.unsplash.com/photo-1563241527-3004b7be0ffd?q=80&w=600&h=800&fit=crop",
    category: "Girasoles y Mixtos",
    rating: 4.5
  },
  {
    id: 8,
    name: "Ramo Mixto: Girasol y Rosas Rojas",
    description: "La combinación perfecta. Un girasol central rodeado de 6 rosas rojas. Artesanía detallada en cada pétalo.",
    price: 390,
    image: "https://images.unsplash.com/photo-1591886960571-74d43a9d4166?q=80&w=600&h=800&fit=crop",
    category: "Girasoles y Mixtos",
    rating: 4.8
  },
  {
    id: 9,
    name: "Ramo de Tulipanes (Limpiapipas)",
    description: "10 hermosos tulipanes en colores surtidos (rosa, amarillo, morado). Una técnica diferente de doblado que da un acabado súper realista y tierno.",
    price: 320,
    image: "https://images.unsplash.com/photo-1520764834382-bd44d2dcf0e2?q=80&w=600&h=800&fit=crop",
    category: "Girasoles y Mixtos",
    rating: 4.7,
    badge: "Nuevo"
  },
  {
    id: 10,
    name: "Cesta Floral Primaveral",
    description: "Cesta tejida que incluye margaritas, lavanda y pequeñas rosas, todo hecho 100% de limpiapipas de colores.",
    price: 450,
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?q=80&w=600&h=800&fit=crop",
    category: "Girasoles y Mixtos",
    rating: 4.6
  },

  // Categoria: Temáticos y Personajes
  {
    id: 11,
    name: "Ramo Kuromi y Rosas Moradas",
    description: "Arreglo temático con la carita de Kuromi tejida en limpiapipas, acompañada de 5 rosas moradas y negras. Ideal para fans.",
    price: 480,
    image: "https://images.unsplash.com/photo-1580136608260-4eb11f4b24fe?q=80&w=600&h=800&fit=crop",
    category: "Temáticos y Personajes",
    rating: 4.9,
    badge: "Popular"
  },
  {
    id: 12,
    name: "Ramo Hello Kitty Floral",
    description: "Figura de Hello Kitty hecha a mano rodeada de flores rosas de limpiapipas. Un detalle súper kawaii y tierno.",
    price: 520,
    originalPrice: 600,
    image: "https://images.unsplash.com/photo-1523688882641-9c178229fb1e?q=80&w=600&h=800&fit=crop",
    category: "Temáticos y Personajes",
    rating: 5.0
  },
  {
    id: 13,
    name: "Ramo Stitch y Flores Azules",
    description: "El experimento 626 en forma de limpiapipas, sentado sobre un ramo de flores azules. Muy resistente y adorable.",
    price: 550,
    image: "https://images.unsplash.com/photo-1518895949257-7621c3c786d7?q=80&w=600&h=800&fit=crop",
    category: "Temáticos y Personajes",
    rating: 4.8
  },
  {
    id: 14,
    name: "Ramo Araña (Spiderman Theme)",
    description: "Ramo de rosas rojas y azules con detalles de telaraña blanca, ideal para regalarle a ese fanático de los superhéroes.",
    price: 400,
    image: "https://images.unsplash.com/photo-1532453288672-3a27e9be9efd?q=80&w=600&h=800&fit=crop",
    category: "Temáticos y Personajes",
    rating: 4.7
  },
  {
    id: 15,
    name: "Corona de Flores de Personaje",
    description: "Diadema tejida con flores de limpiapipas y orejitas de tu personaje favorito. Ligera y cómoda de usar.",
    price: 250,
    image: "https://images.unsplash.com/photo-1550062867-02058e57e930?q=80&w=600&h=800&fit=crop",
    category: "Temáticos y Personajes",
    rating: 4.4
  }
];