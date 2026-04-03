import { X, Minus, Plus, Trash2, ShoppingCart, Tag, MapPin, Gift, CheckCircle } from 'lucide-react';
import { Product } from '../data/products';
import { useContext, useState } from 'react';
import { ProductContext, Complement } from '../context/ProductContext';
import { ComplementsModal } from './ComplementsModal';

interface CartItem extends Product { quantity: number; }
interface CartComplement extends Complement { quantity: number; }

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: number, quantity: number) => void;
  onRemoveItem: (productId: number) => void;
  onCheckout?: (data: { total: number; subtotal: number; discount: number; complementsTotal: number }) => void;
}

export function Cart({ isOpen, onClose, items, onUpdateQuantity, onRemoveItem, onCheckout }: CartProps) {
  const context = useContext(ProductContext);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; type: string; value: number; description: string } | null>(null);
  const [couponMsg, setCouponMsg] = useState('');
  const [couponError, setCouponError] = useState(false);
  const [showComplementsModal, setShowComplementsModal] = useState(false);
  const [cartComplements, setCartComplements] = useState<CartComplement[]>([]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const complementsTotal = cartComplements.reduce((sum, c) => sum + c.price * c.quantity, 0);

  let discount = 0;
  let freeShipping = false;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percentage') discount = subtotal * (appliedCoupon.value / 100);
    else if (appliedCoupon.type === 'fixed') discount = Math.min(appliedCoupon.value, subtotal);
    else if (appliedCoupon.type === 'free_shipping') freeShipping = true;
  }
  const total = subtotal + complementsTotal - discount;

  const handleApplyCoupon = () => {
    if (!couponCode.trim() || !context) return;
    const cartItemsData = items.map(i => ({ category: i.category, id: i.id }));
    const result = context.validateCoupon(couponCode, subtotal, cartItemsData);
    if (result.valid && result.coupon) {
      setAppliedCoupon({ code: result.coupon.code, type: result.coupon.type, value: result.coupon.value, description: result.coupon.description });
      setCouponMsg(result.message);
      setCouponError(false);
    } else {
      setCouponMsg(result.message);
      setCouponError(true);
      setAppliedCoupon(null);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setCouponMsg('');
    setCouponError(false);
  };

  const handleCheckout = () => {
    if (!context || items.length === 0) return;
    const { whatsappNumber } = context.storeConfig;
    let message = `¡Hola! Me gustaría realizar el siguiente pedido:%0A%0A`;
    items.forEach(item => {
      message += `🌸 ${item.quantity}x ${item.name} - S/ ${(item.price * item.quantity).toFixed(2)}%0A`;
    });
    if (cartComplements.length > 0) {
      message += `%0A🎁 *Complementos:*%0A`;
      cartComplements.forEach(c => {
        message += `  • ${c.quantity}x ${c.name} - S/ ${(c.price * c.quantity).toFixed(2)}%0A`;
      });
    }
    if (appliedCoupon) {
      message += `%0A🏷️ Cupón: ${appliedCoupon.code} (-S/ ${discount.toFixed(2)})%0A`;
    }
    message += `%0A💰 *Total a pagar: S/ ${total.toFixed(2)}*%0A%0AQuedo atento/a para coordinar el pago y la entrega. ¡Gracias!`;
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank');
  };

  if (!isOpen) return null;

  const totalComplementsCount = cartComplements.reduce((s, c) => s + c.quantity, 0);

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50 z-[100]" onClick={onClose} />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-full max-w-[440px] z-[101] flex flex-col shadow-2xl overflow-hidden"
        style={{ background: 'var(--bg-primary)' }}>

        {/* HEADER ROSADO */}
        <div className="flex items-center justify-between px-5 py-4" style={{ background: '#e91e8c' }}>
          <div className="flex items-center gap-2">
            <ShoppingCart size={22} className="text-white" />
            <span className="text-white font-bold text-xl">Mi Carrito</span>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 rounded-full p-1.5 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* SUB-HEADER */}
        <div className="flex items-center justify-between px-5 py-2.5 border-b"
          style={{ borderColor: 'var(--border-color)', background: 'var(--bg-secondary)' }}>
          <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
            {totalItems} {totalItems === 1 ? 'producto' : 'productos'}
          </span>
          <span className="text-sm font-semibold" style={{ color: '#e91e8c' }}>
            Subtotal: S/. {(subtotal + complementsTotal).toFixed(2)}
          </span>
        </div>

        {/* CONTENIDO SCROLLABLE */}
        <div className="flex-1 overflow-y-auto">

          {/* CARRITO VACÍO */}
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-16">
              <ShoppingCart size={64} style={{ color: 'var(--text-secondary)', opacity: 0.3 }} />
              <p className="text-lg font-medium" style={{ color: 'var(--text-secondary)' }}>Tu carrito está vacío</p>
              <p className="text-sm text-center px-8" style={{ color: 'var(--text-secondary)', opacity: 0.7 }}>
                Explora nuestra tienda y agrega los arreglos que más te gusten
              </p>
              <button onClick={onClose}
                className="px-6 py-2.5 rounded-full text-white text-sm font-semibold transition-all hover:scale-105"
                style={{ background: '#e91e8c' }}>
                Ver Productos
              </button>
            </div>
          ) : (
            <div className="p-4 flex flex-col gap-4">

              {/* PRODUCTOS */}
              <div className="flex flex-col gap-3">
                {items.map(item => (
                  <div key={item.id} className="rounded-xl p-3 flex gap-3 shadow-sm border"
                    style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                    <div className="w-20 h-24 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm leading-tight mb-1 line-clamp-2"
                        style={{ color: 'var(--text-primary)' }}>{item.name}</h4>
                      {item.description && (
                        <p className="text-xs line-clamp-2 mb-2" style={{ color: 'var(--text-secondary)' }}>
                          {item.description}
                        </p>
                      )}
                      <div className="font-bold text-base mb-2" style={{ color: '#e91e8c' }}>
                        S/. {item.price.toFixed(2)}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 rounded-full border px-2 py-1"
                          style={{ borderColor: 'var(--border-color)' }}>
                          <button onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-pink-100 transition-colors"
                            style={{ color: 'var(--text-primary)' }}>
                            <Minus size={12} />
                          </button>
                          <span className="text-sm font-bold w-5 text-center" style={{ color: 'var(--text-primary)' }}>
                            {item.quantity}
                          </span>
                          <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-5 h-5 flex items-center justify-center rounded-full hover:bg-pink-100 transition-colors"
                            style={{ color: 'var(--text-primary)' }}>
                            <Plus size={12} />
                          </button>
                        </div>
                        <button onClick={() => onRemoveItem(item.id)}
                          className="flex items-center gap-1 text-xs text-red-400 hover:text-red-600 transition-colors">
                          <Trash2 size={13} />
                          <span>Eliminar</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* COMPLEMENTOS EN CARRITO */}
              {cartComplements.length > 0 && (
                <div className="rounded-xl p-3 border" style={{ background: 'rgba(233,30,140,0.04)', borderColor: 'rgba(233,30,140,0.2)' }}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Gift size={14} style={{ color: '#e91e8c' }} />
                      <span className="text-sm font-semibold" style={{ color: '#e91e8c' }}>Complementos del regalo</span>
                    </div>
                    <button onClick={() => setShowComplementsModal(true)}
                      className="text-xs font-medium underline" style={{ color: '#e91e8c' }}>
                      Editar
                    </button>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    {cartComplements.map(c => (
                      <div key={c.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <img src={c.image} alt={c.name} className="w-8 h-8 rounded-lg object-cover" />
                          <div>
                            <p className="text-xs font-medium line-clamp-1" style={{ color: 'var(--text-primary)' }}>{c.name}</p>
                            <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>x{c.quantity}</p>
                          </div>
                        </div>
                        <span className="text-xs font-bold" style={{ color: '#e91e8c' }}>
                          S/. {(c.price * c.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* BENEFICIOS */}
              <div className="rounded-xl p-3 border" style={{ background: 'rgba(37,211,102,0.07)', borderColor: 'rgba(37,211,102,0.25)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle size={16} style={{ color: '#25D366' }} />
                  <span className="font-semibold text-sm" style={{ color: '#25D366' }}>Beneficios incluidos</span>
                </div>
                <ul className="flex flex-col gap-1">
                  {['Garantía de frescura', 'Atención personalizada', 'Hecho 100% a mano'].map(b => (
                    <li key={b} className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#25D366' }} />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              {/* REGALO ESPECIAL — botón que abre el modal */}
              <button
                onClick={() => setShowComplementsModal(true)}
                className="w-full rounded-xl p-3 border flex items-start justify-between transition-all hover:scale-[1.01] active:scale-[0.99]"
                style={{ background: 'rgba(233,30,140,0.06)', borderColor: 'rgba(233,30,140,0.2)' }}>
                <div className="flex items-start gap-2">
                  <Gift size={16} style={{ color: '#e91e8c' }} className="mt-0.5 flex-shrink-0" />
                  <div className="text-left">
                    <p className="font-semibold text-sm" style={{ color: '#e91e8c' }}>
                      Haz tu regalo especial
                      {totalComplementsCount > 0 && (
                        <span className="ml-2 text-xs px-2 py-0.5 rounded-full text-white" style={{ background: '#e91e8c' }}>
                          {totalComplementsCount}
                        </span>
                      )}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
                      🎈 Globos &nbsp;🧸 Peluches &nbsp;🍫 Chocolates disponibles
                    </p>
                  </div>
                </div>
                <span className="text-lg font-bold" style={{ color: '#e91e8c' }}>++</span>
              </button>

              {/* CUPÓN */}
              <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'rgba(233,30,140,0.35)', borderStyle: 'dashed' }}>
                {appliedCoupon ? (
                  <div className="p-3 flex items-center justify-between" style={{ background: 'rgba(37,211,102,0.07)' }}>
                    <div className="flex items-center gap-2">
                      <Tag size={15} style={{ color: '#25D366' }} />
                      <div>
                        <p className="text-sm font-bold" style={{ color: '#25D366' }}>{appliedCoupon.code}</p>
                        <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{appliedCoupon.description}</p>
                      </div>
                    </div>
                    <button onClick={handleRemoveCoupon} className="text-xs text-red-400 hover:text-red-600 font-medium transition-colors">Quitar</button>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <div className="flex items-center gap-2 px-3 flex-1">
                      <Tag size={16} style={{ color: '#e91e8c' }} />
                      <input type="text" placeholder="¿Tienes un cupón?" value={couponCode}
                        onChange={e => { setCouponCode(e.target.value.toUpperCase()); setCouponMsg(''); }}
                        onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                        className="flex-1 py-3 bg-transparent text-sm outline-none"
                        style={{ color: 'var(--text-primary)' }} />
                    </div>
                    <button onClick={handleApplyCoupon}
                      className="px-4 py-3 text-sm font-bold transition-colors"
                      style={{ color: '#e91e8c' }}>
                      Aplicar →
                    </button>
                  </div>
                )}
                {couponMsg && (
                  <p className={`text-xs px-3 pb-2 ${couponError ? 'text-red-400' : 'text-green-500'}`}>{couponMsg}</p>
                )}
              </div>

              {/* RESUMEN PRECIOS */}
              <div className="rounded-xl p-4 border flex flex-col gap-2"
                style={{ background: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}>
                <div className="flex justify-between text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <span>Subtotal ({totalItems} {totalItems === 1 ? 'producto' : 'productos'})</span>
                  <span>S/. {subtotal.toFixed(2)}</span>
                </div>
                {complementsTotal > 0 && (
                  <div className="flex justify-between text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <span>🎁 Complementos ({totalComplementsCount})</span>
                    <span>S/. {complementsTotal.toFixed(2)}</span>
                  </div>
                )}
                {appliedCoupon && discount > 0 && (
                  <div className="flex justify-between text-sm" style={{ color: '#25D366' }}>
                    <span>Descuento ({appliedCoupon.code})</span>
                    <span>-S/. {discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <span>Envío</span>
                  <span style={{ color: freeShipping ? '#25D366' : 'var(--text-secondary)' }}>
                    {freeShipping ? 'GRATIS 🎉' : 'Calculado en checkout'}
                  </span>
                </div>
                <div className="border-t pt-2 mt-1 flex justify-between font-bold text-base"
                  style={{ borderColor: 'var(--border-color)' }}>
                  <span style={{ color: 'var(--text-primary)' }}>Total</span>
                  <span style={{ color: '#e91e8c' }}>S/. {total.toFixed(2)}</span>
                </div>
              </div>

              {/* OPCIONES DE ENTREGA */}
              <div className="rounded-xl p-3 border" style={{ background: 'rgba(37,211,102,0.06)', borderColor: 'rgba(37,211,102,0.2)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin size={15} style={{ color: '#25D366' }} />
                  <span className="font-semibold text-sm" style={{ color: '#25D366' }}>Opciones de entrega</span>
                </div>
                <ul className="flex flex-col gap-1">
                  <li className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#25D366' }} />
                    Recojo en tienda — <strong>GRATIS</strong>
                  </li>
                  <li className="flex items-center gap-2 text-xs" style={{ color: 'var(--text-secondary)' }}>
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#25D366' }} />
                    Delivery — Consultar por WhatsApp
                  </li>
                </ul>
              </div>

            </div>
          )}
        </div>

        {/* FOOTER FIJO */}
        {items.length > 0 && (
          <div className="p-4 border-t flex flex-col gap-2" style={{ borderColor: 'var(--border-color)', background: 'var(--bg-primary)' }}>
            <button onClick={() => {
                if (onCheckout) {
                  onCheckout({ total, subtotal, discount, complementsTotal });
                  onClose();
                } else {
                  handleCheckout();
                }
              }}
              className="w-full py-3.5 rounded-xl text-white font-bold text-base flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
              style={{ background: '#e91e8c', boxShadow: '0 4px 20px rgba(233,30,140,0.4)' }}>
              <ShoppingCart size={18} />
              Pagar — S/. {total.toFixed(2)}
            </button>
            <p className="text-center text-xs" style={{ color: 'var(--text-secondary)' }}>
              Al continuar, aceptas nuestros términos y condiciones
            </p>
          </div>
        )}
      </div>

      {/* MODAL DE COMPLEMENTOS */}
      <ComplementsModal
        isOpen={showComplementsModal}
        onClose={() => setShowComplementsModal(false)}
        onAddComplements={(items) => setCartComplements(items)}
        currentComplements={cartComplements}
      />
    </>
  );
}
