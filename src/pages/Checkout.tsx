import { useState } from 'react';
import { ArrowLeft, Lock, ShoppingBag, Truck, User, CreditCard, CheckCircle, MapPin, Clock, Package } from 'lucide-react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CheckoutProps {
  items: CartItem[];
  total: number;
  subtotal: number;
  discount: number;
  complementsTotal: number;
  onBack: () => void;
}

type DeliveryMethod = 'pickup' | 'delivery' | null;

const STEPS = [
  { id: 1, label: 'Entrega', icon: Truck },
  { id: 2, label: 'Datos', icon: User },
  { id: 3, label: 'Pago', icon: CreditCard },
  { id: 4, label: 'Confirmar', icon: CheckCircle },
];

export function Checkout({ items, total, subtotal, discount, complementsTotal, onBack }: CheckoutProps) {
  const [currentStep] = useState(1);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>(null);

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);
  const shipping = deliveryMethod === 'pickup' ? 0 : deliveryMethod === 'delivery' ? null : null;

  return (
    <div className="min-h-screen" style={{ background: '#f5f5f5' }}>

      {/* HEADER */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: '#e91e8c' }}>
              <ShoppingBag size={20} className="text-white" />
            </div>
            <span className="font-bold text-lg hidden sm:block" style={{ color: '#e91e8c' }}>Mi Tienda</span>
          </div>

          {/* Checkout seguro */}
          <div className="flex items-center gap-1.5 text-xs text-gray-500">
            <Lock size={13} className="text-green-500" />
            <span className="font-medium text-gray-600">CHECKOUT SEGURO</span>
            <span>• SSL protegido</span>
          </div>
        </div>
      </div>

      {/* BARRA DE PROGRESO */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4">
          {/* Volver */}
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 py-3 text-sm font-medium transition-colors hover:opacity-70"
            style={{ color: '#e91e8c' }}
          >
            <ArrowLeft size={16} />
            Volver a la tienda
          </button>

          {/* Steps */}
          <div className="flex items-center justify-center pb-4 gap-0">
            {STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isActive = step.id === currentStep;
              const isDone = step.id < currentStep;
              const isLast = idx === STEPS.length - 1;
              return (
                <div key={step.id} className="flex items-center">
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center transition-all border-2"
                      style={{
                        background: isActive ? '#e91e8c' : isDone ? '#e91e8c' : 'white',
                        borderColor: isActive || isDone ? '#e91e8c' : '#d1d5db',
                      }}
                    >
                      {isDone
                        ? <CheckCircle size={20} className="text-white" />
                        : <Icon size={20} style={{ color: isActive ? 'white' : '#9ca3af' }} />
                      }
                    </div>
                    <span
                      className="text-xs font-semibold"
                      style={{ color: isActive ? '#e91e8c' : isDone ? '#e91e8c' : '#9ca3af' }}
                    >
                      {step.label}
                    </span>
                  </div>
                  {!isLast && (
                    <div
                      className="w-16 sm:w-24 h-0.5 mb-4 mx-1"
                      style={{ background: isDone ? '#e91e8c' : '#e5e7eb' }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[1fr,380px] gap-6">

        {/* COLUMNA IZQUIERDA — ENTREGA */}
        <div>
          {/* Tarjeta principal de entrega */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">

            {/* Header de la tarjeta */}
            <div className="px-6 py-4 text-white font-bold text-lg flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg, #e91e8c, #c2185b)' }}>
              <Truck size={22} />
              ¿Cómo deseas recibir tu pedido?
            </div>

            {/* Opciones de entrega */}
            <div className="p-5 flex flex-col gap-4">

              {/* Opción 1: Recojo en tienda */}
              <button
                onClick={() => setDeliveryMethod('pickup')}
                className="w-full text-left border-2 rounded-xl p-4 transition-all duration-200 hover:border-pink-300 hover:shadow-md"
                style={{
                  borderColor: deliveryMethod === 'pickup' ? '#e91e8c' : '#e5e7eb',
                  background: deliveryMethod === 'pickup' ? '#fff0f8' : 'white',
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: deliveryMethod === 'pickup' ? '#e91e8c' : '#f3f4f6' }}>
                    <MapPin size={18} style={{ color: deliveryMethod === 'pickup' ? 'white' : '#6b7280' }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-gray-800 text-base">Recojo en tienda</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: '#25D366' }}>
                        GRATIS
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">Recoge personalmente en nuestra tienda</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <Clock size={13} style={{ color: '#25D366' }} />
                      <span className="text-xs font-medium" style={{ color: '#25D366' }}>Listo en 2-4 horas</span>
                    </div>
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-2"
                    style={{ borderColor: deliveryMethod === 'pickup' ? '#e91e8c' : '#d1d5db' }}>
                    {deliveryMethod === 'pickup' && (
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#e91e8c' }} />
                    )}
                  </div>
                </div>
              </button>

              {/* Opción 2: Envío a domicilio */}
              <button
                onClick={() => setDeliveryMethod('delivery')}
                className="w-full text-left border-2 rounded-xl p-4 transition-all duration-200 hover:border-pink-300 hover:shadow-md"
                style={{
                  borderColor: deliveryMethod === 'delivery' ? '#e91e8c' : '#e5e7eb',
                  background: deliveryMethod === 'delivery' ? '#fff0f8' : 'white',
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: deliveryMethod === 'delivery' ? '#e91e8c' : '#f3f4f6' }}>
                    <Truck size={18} style={{ color: deliveryMethod === 'delivery' ? 'white' : '#6b7280' }} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-gray-800 text-base">Envío a domicilio</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full text-white" style={{ background: '#f59e0b' }}>
                        Según distrito
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-0.5">Entregamos las flores donde tú indiques</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <Clock size={13} className="text-orange-400" />
                      <span className="text-xs font-medium text-orange-400">Entrega en 2-4 horas</span>
                    </div>
                  </div>
                  <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-2"
                    style={{ borderColor: deliveryMethod === 'delivery' ? '#e91e8c' : '#d1d5db' }}>
                    {deliveryMethod === 'delivery' && (
                      <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#e91e8c' }} />
                    )}
                  </div>
                </div>
              </button>

              {/* Si selecciona delivery, mostrar campo de dirección */}
              {deliveryMethod === 'delivery' && (
                <div className="rounded-xl border-2 p-4 animate-fadeIn" style={{ borderColor: '#e91e8c', background: '#fff0f8' }}>
                  <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <MapPin size={16} style={{ color: '#e91e8c' }} />
                    Dirección de entrega
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">Distrito *</label>
                      <select className="w-full border-2 rounded-lg px-3 py-2.5 text-sm focus:outline-none transition-colors"
                        style={{ borderColor: '#e5e7eb' }}
                        onFocus={e => e.target.style.borderColor = '#e91e8c'}
                        onBlur={e => e.target.style.borderColor = '#e5e7eb'}>
                        <option value="">Selecciona tu distrito</option>
                        <option>San Isidro</option>
                        <option>Miraflores</option>
                        <option>San Borja</option>
                        <option>Surco</option>
                        <option>La Molina</option>
                        <option>Barranco</option>
                        <option>Magdalena</option>
                        <option>Pueblo Libre</option>
                        <option>Jesús María</option>
                        <option>Lince</option>
                        <option>San Miguel</option>
                        <option>Breña</option>
                        <option>Rimac</option>
                        <option>San Martín de Porres</option>
                        <option>Los Olivos</option>
                        <option>Comas</option>
                        <option>Independencia</option>
                        <option>Canto Rey</option>
                        <option>Ate</option>
                        <option>Santa Anita</option>
                        <option>El Agustino</option>
                        <option>San Juan de Lurigancho</option>
                        <option>Villa El Salvador</option>
                        <option>Chorrillos</option>
                        <option>San Juan de Miraflores</option>
                        <option>Villa María del Triunfo</option>
                        <option>Surquillo</option>
                        <option>San Luis</option>
                        <option>Chaclacayo</option>
                        <option>Lurigancho</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">Dirección completa *</label>
                      <input type="text" placeholder="Ej: Av. Javier Prado 1234, Dpto 501"
                        className="w-full border-2 rounded-lg px-3 py-2.5 text-sm focus:outline-none transition-colors"
                        style={{ borderColor: '#e5e7eb' }}
                        onFocus={e => e.target.style.borderColor = '#e91e8c'}
                        onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">Referencia (opcional)</label>
                      <input type="text" placeholder="Ej: Frente al parque, edificio azul"
                        className="w-full border-2 rounded-lg px-3 py-2.5 text-sm focus:outline-none transition-colors"
                        style={{ borderColor: '#e5e7eb' }}
                        onFocus={e => e.target.style.borderColor = '#e91e8c'}
                        onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">Fecha de entrega *</label>
                      <input type="date"
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full border-2 rounded-lg px-3 py-2.5 text-sm focus:outline-none transition-colors"
                        style={{ borderColor: '#e5e7eb' }}
                        onFocus={e => e.target.style.borderColor = '#e91e8c'}
                        onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="text-xs font-semibold text-gray-600 mb-1 block">Hora preferida</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['8:00 - 12:00', '12:00 - 16:00', '16:00 - 20:00'].map(t => (
                          <button key={t}
                            className="border-2 rounded-lg py-2 text-xs font-medium transition-all hover:border-pink-400"
                            style={{ borderColor: '#e5e7eb', color: '#6b7280' }}>
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Si selecciona pickup, mostrar info de la tienda */}
              {deliveryMethod === 'pickup' && (
                <div className="rounded-xl border-2 p-4 animate-fadeIn" style={{ borderColor: '#25D366', background: '#f0fdf4' }}>
                  <h3 className="font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <MapPin size={16} style={{ color: '#25D366' }} />
                    Información de recojo
                  </h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-start gap-2">
                      <MapPin size={14} className="text-gray-400 mt-0.5 flex-shrink-0" />
                      <span>Av. Principal 123, Canto Rey, San Juan de Lurigancho</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-gray-400 flex-shrink-0" />
                      <span>Lun - Dom: 8:00 AM - 10:00 PM</span>
                    </div>
                    <div className="mt-3 p-3 rounded-lg bg-green-50 border border-green-200">
                      <p className="text-xs text-green-700 font-medium">✅ Tu pedido estará listo para recoger en 2-4 horas después de confirmado el pago.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Botón continuar */}
            <div className="px-5 pb-5">
              <button
                disabled={!deliveryMethod}
                className="w-full py-3.5 rounded-xl font-bold text-base transition-all duration-200 flex items-center justify-center gap-2"
                style={{
                  background: deliveryMethod ? 'linear-gradient(135deg, #e91e8c, #c2185b)' : '#e5e7eb',
                  color: deliveryMethod ? 'white' : '#9ca3af',
                  cursor: deliveryMethod ? 'pointer' : 'not-allowed',
                  boxShadow: deliveryMethod ? '0 4px 20px rgba(233,30,140,0.35)' : 'none',
                }}
              >
                {deliveryMethod
                  ? <>Continuar con mis datos <ArrowLeft size={18} className="rotate-180" /></>
                  : 'Selecciona un método de entrega'
                }
              </button>
            </div>
          </div>

          {/* Info de seguridad */}
          <div className="mt-4 flex items-center justify-center gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-1">
              <Lock size={12} className="text-green-500" />
              <span>Pago 100% seguro</span>
            </div>
            <div className="flex items-center gap-1">
              <Package size={12} style={{ color: '#e91e8c' }} />
              <span>Garantía de frescura</span>
            </div>
            <div className="flex items-center gap-1">
              <CheckCircle size={12} className="text-blue-400" />
              <span>Atención personalizada</span>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA — RESUMEN DEL PEDIDO */}
        <div className="h-fit">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden sticky top-24">

            {/* Header rosado del resumen */}
            <div className="px-5 py-4 text-white flex items-center gap-2"
              style={{ background: 'linear-gradient(135deg, #e91e8c, #c2185b)' }}>
              <ShoppingBag size={20} />
              <div>
                <p className="font-bold text-base">Tu pedido</p>
                <p className="text-xs opacity-90">{totalItems} {totalItems === 1 ? 'producto' : 'productos'}</p>
              </div>
            </div>

            {/* Productos */}
            <div className="p-4 space-y-3">
              {items.map(item => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-lg object-cover border"
                      style={{ borderColor: '#e5e7eb' }}
                    />
                    {/* Badge cantidad */}
                    <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: '#e91e8c' }}>
                      {item.quantity}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">x{item.quantity} unidades</p>
                  </div>
                  <span className="text-sm font-bold text-gray-800 flex-shrink-0">
                    S/. {(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t mx-4" style={{ borderColor: '#f3f4f6' }} />

            {/* Totales */}
            <div className="p-4 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span className="font-medium">S/. {subtotal.toFixed(2)}</span>
              </div>
              {complementsTotal > 0 && (
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Complementos</span>
                  <span className="font-medium">S/. {complementsTotal.toFixed(2)}</span>
                </div>
              )}
              {discount > 0 && (
                <div className="flex justify-between text-sm" style={{ color: '#25D366' }}>
                  <span>Descuento</span>
                  <span className="font-medium">-S/. {discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-gray-600">
                <span>Envío</span>
                <span className="font-medium">
                  {shipping === 0 ? <span style={{ color: '#25D366' }}>GRATIS</span> : 'Por calcular'}
                </span>
              </div>

              <div className="border-t pt-2 mt-2" style={{ borderColor: '#f3f4f6' }}>
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-800">Total a pagar</span>
                  <span className="font-bold text-xl" style={{ color: '#e91e8c' }}>
                    S/. {total.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Compra segura */}
            <div className="px-4 pb-4">
              <div className="flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs text-gray-500"
                style={{ background: '#f9fafb' }}>
                <Lock size={12} className="text-green-500" />
                <span>Compra 100% segura</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
