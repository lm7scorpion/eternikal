import { Category } from '../context/ProductContext';

interface CategoriesCirclesProps {
  categories: Category[];
}

export function CategoriesCircles({ categories }: CategoriesCirclesProps) {
  const visibleCategories = categories.filter(c => c.isVisible).sort((a, b) => a.order - b.order);

  if (visibleCategories.length === 0) return null;

  return (
    <section className="px-4 md:px-8 lg:px-12 py-6 md:py-7" style={{ backgroundColor: 'var(--bg-primary)' }}>
      <div className="max-w-7xl mx-auto overflow-x-auto overflow-y-visible scrollbar-hide">
        <div className="flex items-start gap-5 md:gap-7 min-w-max md:min-w-0 md:justify-center py-2">
          {visibleCategories.map((category) => (
            <button
              key={category.id}
              className="flex flex-col items-center gap-2 w-[84px] md:w-[96px] flex-shrink-0 group pt-1"
              onClick={() => {
                const el = document.getElementById('products');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <div
                className="w-[58px] h-[58px] md:w-[72px] md:h-[72px] rounded-full flex items-center justify-center overflow-hidden shadow-sm transition-transform duration-300 group-hover:scale-105"
                style={{ backgroundColor: category.circleColor }}
              >
                {category.circleImage ? (
                  <img src={category.circleImage} alt={category.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-2xl md:text-3xl">{category.emoji}</span>
                )}
              </div>
              <span
                className="text-[13px] md:text-[15px] leading-tight text-center font-medium"
                style={{ color: 'var(--text-primary)' }}
              >
                {category.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
