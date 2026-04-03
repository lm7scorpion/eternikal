import { useState, useContext } from 'react';
import { X, Plus, Check, ShoppingBag } from 'lucide-react';
import { ProductContext, Complement } from '../context/ProductContext';

interface CartComplement extends Complement { quantity: number; }

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAddComplements: (items: CartComplement[]) => void;
  currentComplements: CartComplement[];
}

type TabType = 'todos' | 'globos' | 'peluches' | 'chocolates';

const TAB_CONFIG = [
  { key: 'todos', label: 'Todos', emoji: '🎁' },
  { key: 'globos', label: 'Globos', emoji: '🎈' },
  { key: 'peluches', label: 'Peluches', emoji: '🧸' },
  { key: 'chocolates', label: 'Chocolates', emoji: '🍫' },
];

export function ComplementsModal({ isOpen, onClose, onAddComplements, currentComplements }: Props) {
  const context = useContext(ProductContext);
  const [activeTab, setActiveTab] = useState<TabType>('todos');
  const [selected, setSelected] = useState<CartComplement[]>(currentComplements || []);

  if (!isOpen || !context) return null;

  const { complements } = context;
  const activeComplements = complements.filter(c => c.isActive);
  const filtered = activeTab === 'todos' ? activeComplements : activeComplements.filter(c => c.category === activeTab);

  const getSelected = (id: number) => selected.find(s => s.id === id);

  const handleAdd = (item: Complement) => {
    setSelected(prev => {
      const exists = prev.find(s => s.id === item.id);
      if (exists) return prev.map(s => s.id === item.id ? { ...s, quantity: s.quantity + 1 } : s);
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const handleRemove = (id: number) => {
    setSelected(prev => {
      const exists = prev.find(s => s.id === id);
      if (exists && exists.quantity > 1) return prev.map(s => s.id === id ? { ...s, quantity: s.quantity - 1 } : s);
      return prev.filter(s => s.id !== id);
    });
  };

  const totalSelected = selected.reduce((sum, s) => sum + s.quantity, 0);
  const totalExtra = selected.reduce((sum, s) => sum + s.price * s.quantity, 0);

  const handleConfirm = () => {
    onAddComplements(selected);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full max-w-5xl mx-auto bg-white rounded-t-3xl md:rounded-2xl shadow-2xl z-10 flex flex-col"
        style={{ maxHeight: '90vh' }}>

        {/* Header */}
        <div className="flex items-start justify-between p-5 border-b border-gray-100">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Agregar Complementos</h2>
            <p className="text-sm font-medium mt-0.5" style={{ color: '#25D366' }}>
              Haz tu regalo aún más especial
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
            <X size={22} className="text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 px-5 pt-4 pb-2 border-b border-gray-100 overflow-x-auto">
          {TAB_CONFIG.map(tab => (
            <button key={tab.key}
              onClick={() => setActiveTab(tab.key as TabType)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all"
              style={{
                background: activeTab === tab.key ? '#e91e8c' : '#f3f4f6',
                color: activeTab === tab.key ? 'white' : '#374151',
              }}>
              <span>{tab.emoji}</span>
              {tab.label}
              {tab.key !== 'todos' && (
                <span className="text-xs opacity-75">
                  ({activeComplements.filter(c => c.category === tab.key).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Grid de productos */}
        <div className="flex-1 overflow-y-auto p-5">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-400">
              <ShoppingBag size={48} className="mb-3 opacity-30" />
              <p className="text-sm">No hay complementos disponibles en esta categoría</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filtered.map(item => {
                const sel = getSelected(item.id);
                return (
                  <div key={item.id}
                    className="rounded-xl border overflow-hidden flex flex-col transition-all duration-200 hover:shadow-md"
                    style={{
                      borderColor: sel ? '#e91e8c' : '#e5e7eb',
                      background: sel ? '#fff5fb' : 'white',
                    }}>

                    {/* Imagen */}
                    <div className="relative aspect-square overflow-hidden bg-gray-50">
                      <img src={item.image} alt={item.name}
                        className="w-full h-full object-cover" />
                      {item.featured && (
                        <span className="absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full text-white"
                          style={{ background: '#e91e8c' }}>⭐ Popular</span>
                      )}
                      {sel && (
                        <div className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center text-white"
                          style={{ background: '#25D366' }}>
                          <Check size={13} strokeWidth={3} />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-3 flex flex-col flex-1">
                      <p className="text-xs text-gray-400 mb-0.5">{item.brand}</p>
                      <h4 className="text-xs font-semibold text-gray-800 leading-tight line-clamp-2 flex-1 mb-1">
                        {item.name}
                      </h4>
                      <p className="text-xs text-gray-400 mb-2">{item.size}</p>

                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm" style={{ color: '#e91e8c' }}>
                          S/. {item.price.toFixed(2)}
                        </span>

                        {/* Botón agregar / contador */}
                        {!sel ? (
                          <button onClick={() => handleAdd(item)}
                            className="w-7 h-7 rounded-full flex items-center justify-center text-white shadow-sm transition-transform hover:scale-110 active:scale-95"
                            style={{ background: '#e91e8c' }}>
                            <Plus size={16} strokeWidth={2.5} />
                          </button>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <button onClick={() => handleRemove(item.id)}
                              className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-bold transition-colors"
                              style={{ borderColor: '#e91e8c', color: '#e91e8c' }}>−</button>
                            <span className="text-sm font-bold w-4 text-center" style={{ color: '#e91e8c' }}>
                              {sel.quantity}
                            </span>
                            <button onClick={() => handleAdd(item)}
                              className="w-6 h-6 rounded-full flex items-center justify-center text-white transition-colors"
                              style={{ background: '#e91e8c' }}>
                              <Plus size={12} strokeWidth={2.5} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer con total y confirmar */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
          <div className="flex items-center justify-between">
            <div>
              {totalSelected > 0 ? (
                <>
                  <p className="text-sm font-semibold text-gray-700">
                    {totalSelected} complemento{totalSelected > 1 ? 's' : ''} seleccionado{totalSelected > 1 ? 's' : ''}
                  </p>
                  <p className="text-xs text-gray-500">
                    +S/. {totalExtra.toFixed(2)} al total
                  </p>
                </>
              ) : (
                <p className="text-sm text-gray-400">Ningún complemento seleccionado</p>
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={onClose}
                className="px-4 py-2 rounded-full text-sm font-semibold border transition-colors"
                style={{ borderColor: '#e5e7eb', color: '#6b7280' }}>
                Cancelar
              </button>
              <button onClick={handleConfirm}
                className="px-5 py-2 rounded-full text-sm font-bold text-white transition-all hover:scale-105 shadow-md"
                style={{ background: totalSelected > 0 ? '#e91e8c' : '#d1d5db' }}>
                {totalSelected > 0 ? `✓ Agregar ${totalSelected} al carrito` : 'Cerrar'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
