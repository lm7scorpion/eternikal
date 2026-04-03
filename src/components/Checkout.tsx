import { useState, useContext } from 'react';
import { ArrowLeft, Lock, Truck, MapPin, Phone, Clock, User, CreditCard, Calendar, Copy, X, ShoppingCart, CheckCircle, Shield } from 'lucide-react';
import { Header } from './Header';
import { ProductContext } from '../context/ProductContext';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CheckoutProps {
  cartItems: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  onBack: () => void;
  onOpenCart: () => void;
}

const ROAD_TYPES = ['Av.', 'Calle', 'Jr.', 'Pasaje', 'Carretera', 'Malecón', 'Prolongación'];
const HOURS = ['8:00 AM - 12:00 PM', '11:00 AM - 1:00 PM', '12:00 PM - 3:00 PM', '2:00 PM - 5:00 PM', '5:00 PM - 9:00 PM'];

export default function Checkout({ cartItems, subtotal, discount, total, onBack, onOpenCart }: CheckoutProps) {
  const context = useContext(ProductContext);
  const delivery = context?.storeConfig?.delivery;
  const whatsapp = context?.storeConfig?.whatsappNumber || '51999888777';
  const payment = context?.storeConfig?.payment;
  const topBar = context?.storeConfig?.topBar;
  const header = context?.storeConfig?.header;
  const topBarOffset = topBar?.enabled ? (topBar.height === 'lg' ? 44 : topBar.height === 'sm' ? 32 : 38) : 0;
  const announcementOffset = header?.announcementBarVisible ? 36 : 0;
  const checkoutTopPadding = 76 + topBarOffset + announcementOffset;

  const [showQRModal, setShowQRModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [deliveryMethod, setDeliveryMethod] = useState<'pickup' | 'delivery' | null>(null);

  // PASO 1
  const [roadType, setRoadType] = useState('');
  const [roadName, setRoadName] = useState('');
  const [streetNumber, setStreetNumber] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [city, setCity] = useState('Lima');
  const [region, setRegion] = useState('Lima');
  const [postalCode, setPostalCode] = useState('');
  const [reference, setReference] = useState('');
  const [mapsLink, setMapsLink] = useState('');
  const [phone, setPhone] = useState('');

  // PASO 2
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [docNumber, setDocNumber] = useState('');
  const [docType, setDocType] = useState('DNI (Peruanos)');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [deliveryHour, setDeliveryHour] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [recipientPhone, setRecipientPhone] = useState('');
  const [relation, setRelation] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'yape' | 'plin' | null>(null);

  const activeDistricts = delivery?.districts?.filter((d: { isActive: boolean }) => d.isActive) || [];
  const selectedDistrictData = activeDistricts.find((d: { name: string }) => d.name === selectedDistrict);
  const shippingCost = deliveryMethod === 'pickup' ? 0 : (selectedDistrictData ? selectedDistrictData.price : null);
  const finalTotal = total + (shippingCost || 0);

  const fullAddress = roadType && roadName && streetNumber && selectedDistrict
    ? `${roadType} ${roadName} ${streetNumber}, ${selectedDistrict}, ${city}, ${region}`
    : '';

  const handleCopyNumber = (number: string) => {
    navigator.clipboard.writeText(number.replace(/\s/g, ''));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppOrder = () => {
    const items = cartItems.map(i => `• ${i.name} x${i.quantity} — S/ ${(i.price * i.quantity).toFixed(2)}`).join('\n');
    const msg = `🌸 *NUEVO PEDIDO*\n\n*Productos:*\n${items}\n\n*Entrega:* ${deliveryMethod === 'pickup' ? 'Recojo en tienda' : `Domicilio: ${fullAddress}`}\n*Datos:* ${firstName} ${lastName} | ${phone}\n*Email:* ${email}\n*Fecha:* ${deliveryDate} | ${deliveryHour}\n*Destinatario:* ${recipientName} | ${recipientPhone}\n*Método de pago:* ${paymentMethod === 'yape' ? 'Yape' : 'Plin'}\n\n*Total: S/ ${finalTotal.toFixed(2)}*`;
    window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  // Barra de pasos
  const StepsBar = () => (
    <div className="w-full px-4 py-3">
      <div className="flex items-center justify-center gap-0 max-w-sm mx-auto">
        {[
          { n: 1, icon: <Truck size={14} />, label: 'Entrega' },
          { n: 2, icon: <User size={14} />, label: 'Datos' },
          { n: 3, icon: <CreditCard size={14} />, label: 'Pago' },
          { n: 4, icon: <CheckCircle size={14} />, label: 'Confirmar' },
        ].map((s, i) => (
          <div key={s.n} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all ${
                step > s.n ? 'bg-green-500 border-green-500 text-white' :
                step === s.n ? 'bg-[#e91e8c] border-[#e91e8c] text-white' :
                'bg-white border-gray-300 text-gray-400'
              }`}>
                {step > s.n ? <CheckCircle size={16} /> : s.n}
              </div>
              <span className={`text-xs mt-1 font-medium ${step === s.n ? 'text-[#e91e8c]' : step > s.n ? 'text-green-500' : 'text-gray-400'}`}>
                {s.label}
              </span>
            </div>
            {i < 3 && (
              <div className={`w-8 sm:w-12 h-0.5 mb-5 mx-1 ${step > s.n ? 'bg-green-500' : 'bg-gray-200'}`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Resumen del pedido (siempre arriba en móvil)
  const OrderSummary = () => (
    <div className="rounded-2xl overflow-hidden shadow-md mb-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
      <div className="px-4 py-3 flex items-center gap-2" style={{ background: 'linear-gradient(135deg, #e91e8c, #ff6bb3)' }}>
        <ShoppingCart size={18} className="text-white" />
        <div>
          <p className="text-white font-bold text-sm">Tu pedido</p>
          <p className="text-white/80 text-xs">{cartItems.length} producto{cartItems.length !== 1 ? 's' : ''}</p>
        </div>
      </div>
      <div className="p-4">
        {cartItems.map(item => (
          <div key={item.id} className="flex items-center gap-3 mb-3">
            <div className="relative flex-shrink-0">
              <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-white text-xs flex items-center justify-center font-bold" style={{ background: '#e91e8c' }}>{item.quantity}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>{item.name}</p>
              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>x{item.quantity} unidades</p>
            </div>
            <p className="text-sm font-bold flex-shrink-0" style={{ color: 'var(--text-primary)' }}>S/. {(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}
        <div className="border-t pt-3 mt-2 space-y-1" style={{ borderColor: 'var(--border-color)' }}>
          <div className="flex justify-between text-sm" style={{ color: 'var(--text-secondary)' }}>
            <span>• Subtotal</span><span>S/. {subtotal.toFixed(2)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-sm text-green-500">
              <span>• Descuento</span><span>-S/. {discount.toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-sm" style={{ color: 'var(--text-secondary)' }}>
            <span>• Envío</span>
            <span className={shippingCost === 0 ? 'text-green-500 font-medium' : shippingCost ? 'font-medium' : ''} style={{ color: shippingCost === null ? 'var(--text-secondary)' : undefined }}>
              {shippingCost === 0 ? '✓ Gratis' : shippingCost ? `S/. ${shippingCost.toFixed(2)}` : 'Por calcular'}
            </span>
          </div>
          <div className="flex justify-between font-bold text-base pt-2 border-t" style={{ borderColor: 'var(--border-color)' }}>
            <span style={{ color: 'var(--text-primary)' }}>Total a pagar</span>
            <span style={{ color: '#e91e8c' }}>S/. {finalTotal.toFixed(2)}</span>
          </div>
          {selectedDistrict && shippingCost !== null && shippingCost !== undefined && (
            <div className="mt-2 p-2 rounded-lg bg-green-50 border border-green-200 flex items-center gap-1">
              <CheckCircle size={12} className="text-green-500" />
              <span className="text-xs text-green-700">Envío a {selectedDistrict} — Costo incluido en el total</span>
            </div>
          )}
          {step === 3 && !selectedDistrict && deliveryMethod === 'delivery' && (
            <div className="mt-2 p-2 rounded-lg bg-orange-50 border border-orange-200">
              <p className="text-xs text-orange-600 font-medium flex items-center gap-1"><MapPin size={10} /> Selecciona tu distrito</p>
              <p className="text-xs text-orange-500">El costo de envío se calculará al seleccionar</p>
            </div>
          )}
          <p className="text-center text-xs mt-2 flex items-center justify-center gap-1" style={{ color: 'var(--text-secondary)' }}>
            <Lock size={10} /> Compra 100% segura
          </p>
        </div>
      </div>
    </div>
  );

  // Input styles
  const inputClass = "w-full px-3 py-2.5 rounded-xl border text-sm outline-none focus:ring-2 transition-all";
  const inputStyle = { background: 'var(--bg-primary)', color: 'var(--text-primary)', borderColor: 'var(--border-color)' };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Header
        onCartClick={onOpenCart}
        cartCount={cartItems.reduce((s, i) => s + i.quantity, 0)}
        onSearch={() => {}}
      />

      {/* Sub-header */}
      <div style={{ paddingTop: `${checkoutTopPadding}px` }}>
        <div className="flex items-center justify-between px-4 py-3" style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)' }}>
          <button onClick={onBack} className="flex items-center gap-1 text-sm font-medium" style={{ color: '#e91e8c' }}>
            <ArrowLeft size={16} /> Volver
          </button>
          <div className="text-right">
            <p className="text-xs font-bold uppercase tracking-wide" style={{ color: 'var(--text-secondary)' }}>CHECKOUT SEGURO</p>
            <p className="text-xs flex items-center justify-end gap-1" style={{ color: 'var(--text-secondary)' }}><Lock size={10} /> SSL protegido</p>
          </div>
        </div>
      </div>

      {/* Steps bar */}
      <div style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)' }}>
        <StepsBar />
      </div>

      {/* CONTENT: móvil = columna, desktop = grid */}
      <div className="max-w-5xl mx-auto px-3 sm:px-6 py-4">

        {/* PASO 1: ENTREGA */}
        {step === 1 && (
          <div className="flex flex-col lg:grid lg:grid-cols-[1fr_360px] gap-4">
            {/* Móvil: resumen arriba */}
            <div className="lg:hidden"><OrderSummary /></div>

            {/* Formulario entrega */}
            <div className="space-y-3">
              <div className="rounded-2xl overflow-hidden shadow-sm" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                <div className="px-4 py-3" style={{ background: 'linear-gradient(135deg, #e91e8c, #ff6bb3)' }}>
                  <p className="text-white font-bold flex items-center gap-2"><Truck size={16} /> ¿Cómo deseas recibir tu pedido?</p>
                </div>
                <div className="p-3 space-y-3">

                  {/* Recojo en tienda */}
                  <div
                    onClick={() => setDeliveryMethod('pickup')}
                    className={`rounded-xl border-2 cursor-pointer transition-all relative overflow-hidden ${deliveryMethod === 'pickup' ? 'border-green-500' : 'border-transparent'}`}
                    style={{ background: deliveryMethod === 'pickup' ? 'rgba(37,211,102,0.05)' : 'var(--bg-primary)', border: deliveryMethod === 'pickup' ? '2px solid #25D366' : `1px solid var(--border-color)` }}
                  >
                    {deliveryMethod === 'pickup' && (
                      <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded-bl-lg font-medium flex items-center gap-1">
                        <CheckCircle size={10} /> Seleccionado
                      </div>
                    )}
                    <div className="p-3 flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(37,211,102,0.15)' }}>
                        <MapPin size={16} className="text-green-500" />
                      </div>
                      <div className="flex-1 pr-6">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Recojo en tienda</span>
                          <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full font-bold">GRATIS</span>
                        </div>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>Recoge personalmente en nuestra tienda</p>
                        <p className="text-xs text-green-500 flex items-center gap-1 mt-1"><Clock size={10} /> Listo en 2-4 horas</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${deliveryMethod === 'pickup' ? 'bg-green-500 border-green-500' : 'border-gray-300'}`}>
                        {deliveryMethod === 'pickup' && <CheckCircle size={12} className="text-white" />}
                      </div>
                    </div>

                    {deliveryMethod === 'pickup' && (
                      <div className="mx-3 mb-3 space-y-2">
                        <div className="p-3 rounded-xl" style={{ background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.2)' }}>
                          <div className="flex items-start gap-2">
                            <MapPin size={14} className="text-green-500 mt-0.5 flex-shrink-0" />
                            <div>
                              <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>{delivery?.storeName || 'Flores & Detalles Lima'}</p>
                              <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{delivery?.storeAddress || 'Av. Principal 123, Lima, Perú'}</p>
                              <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{delivery?.storeDistrict || 'San Juan de Lurigancho'}</p>
                              <div className="flex flex-wrap gap-3 mt-1.5">
                                <span className="text-xs flex items-center gap-1" style={{ color: '#e91e8c' }}><Phone size={10} /> {delivery?.storePhone || '+51 999 888 777'}</span>
                                <span className="text-xs flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}><Clock size={10} /> {delivery?.storeSchedule || 'Lun-Dom: 8:00 AM - 10:00 PM'}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {delivery?.storeMapEmbed && (
                          <div className="rounded-xl overflow-hidden relative">
                            <div className="absolute top-2 left-2 z-10">
                              <a href={delivery?.storeMapLink || '#'} target="_blank" rel="noreferrer" className="bg-white text-blue-600 text-xs px-2 py-1 rounded-lg shadow font-medium flex items-center gap-1">
                                Maps ↗
                              </a>
                            </div>
                            <iframe src={delivery.storeMapEmbed} width="100%" height="180" style={{ border: 0 }} allowFullScreen loading="lazy" className="rounded-xl" />
                          </div>
                        )}

                        <a href={delivery?.storeMapLink || 'https://maps.google.com'} target="_blank" rel="noreferrer"
                          className="w-full py-2.5 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 transition-colors">
                          <MapPin size={14} /> Ver en Google Maps
                        </a>

                        <div className="p-2 rounded-lg flex items-start gap-2" style={{ background: 'rgba(37,211,102,0.08)' }}>
                          <CheckCircle size={12} className="text-green-500 mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-green-600">Te avisaremos por WhatsApp cuando tu pedido esté listo para recoger</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Envío a domicilio */}
                  <div
                    onClick={() => setDeliveryMethod('delivery')}
                    className="rounded-xl cursor-pointer transition-all relative overflow-hidden"
                    style={{ background: deliveryMethod === 'delivery' ? 'rgba(233,30,140,0.05)' : 'var(--bg-primary)', border: deliveryMethod === 'delivery' ? '2px solid #e91e8c' : `1px solid var(--border-color)` }}
                  >
                    {deliveryMethod === 'delivery' && (
                      <div className="absolute top-0 right-0 text-white text-xs px-2 py-1 rounded-bl-lg font-medium flex items-center gap-1" style={{ background: '#e91e8c' }}>
                        <CheckCircle size={10} /> Seleccionado
                      </div>
                    )}
                    <div className="p-3 flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(233,30,140,0.1)' }}>
                        <Truck size={16} style={{ color: '#e91e8c' }} />
                      </div>
                      <div className="flex-1 pr-6">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Envío a domicilio</span>
                          <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(233,30,140,0.1)', color: '#e91e8c' }}>Según distrito</span>
                        </div>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>Entregamos las flores donde tú indiques</p>
                        <p className="text-xs flex items-center gap-1 mt-1" style={{ color: '#f59e0b' }}><Clock size={10} /> Entrega en 2-4 horas</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${deliveryMethod === 'delivery' ? 'border-pink-500' : 'border-gray-300'}`} style={deliveryMethod === 'delivery' ? { background: '#e91e8c' } : {}}>
                        {deliveryMethod === 'delivery' && <CheckCircle size={12} className="text-white" />}
                      </div>
                    </div>

                    {deliveryMethod === 'delivery' && (
                      <div className="mx-3 mb-3" onClick={e => e.stopPropagation()}>
                        <div className="p-3 rounded-xl" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
                          <p className="text-xs font-bold mb-3 flex items-center gap-1" style={{ color: '#e91e8c' }}><MapPin size={12} /> ¿A dónde enviamos las flores?</p>
                          <div className="space-y-3">
                            <p className="text-xs font-bold flex items-center gap-1" style={{ color: 'var(--text-primary)' }}><MapPin size={12} /> Dirección de entrega</p>

                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>* Tipo de vía</label>
                                <select value={roadType} onChange={e => setRoadType(e.target.value)} className={inputClass} style={{ ...inputStyle, borderColor: '#e91e8c' }}>
                                  <option value="">Seleccionar</option>
                                  {ROAD_TYPES.map(r => <option key={r}>{r}</option>)}
                                </select>
                              </div>
                              <div>
                                <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>* Nombre de la vía</label>
                                <input value={roadName} onChange={e => setRoadName(e.target.value)} placeholder="Ej: Las Flores" className={inputClass} style={{ ...inputStyle, borderColor: '#e91e8c' }} />
                              </div>
                            </div>

                            <div>
                              <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>* Número</label>
                              <input value={streetNumber} onChange={e => setStreetNumber(e.target.value)} placeholder="Ej: 123, 456-A, S/N" className={inputClass} style={{ ...inputStyle, borderColor: '#e91e8c' }} />
                            </div>

                            <div>
                              <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>* Distrito</label>
                              <select value={selectedDistrict} onChange={e => setSelectedDistrict(e.target.value)} className={inputClass} style={{ ...inputStyle, borderColor: '#e91e8c' }}>
                                <option value="">Seleccionar distrito</option>
                                {activeDistricts.map((d: { name: string; price: number }) => (
                                  <option key={d.name} value={d.name}>{d.name} - S/. {d.price.toFixed(2)}</option>
                                ))}
                              </select>
                              {selectedDistrictData && <p className="text-xs text-green-500 mt-1">Costo de envío: S/. {selectedDistrictData.price.toFixed(2)}</p>}
                            </div>

                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>* Ciudad</label>
                                <input value={city} onChange={e => setCity(e.target.value)} className={inputClass} style={{ ...inputStyle, borderColor: '#e91e8c' }} />
                              </div>
                              <div>
                                <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>Región</label>
                                <input value={region} onChange={e => setRegion(e.target.value)} className={inputClass} style={inputStyle} />
                              </div>
                              <div>
                                <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>C. Postal</label>
                                <input value={postalCode} onChange={e => setPostalCode(e.target.value)} placeholder="Opcional" className={inputClass} style={inputStyle} />
                              </div>
                            </div>

                            <div>
                              <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>Referencia adicional (opcional)</label>
                              <input value={reference} onChange={e => setReference(e.target.value)} placeholder="Ej: Casa color azul, al lado del parque" className={inputClass} style={inputStyle} />
                            </div>

                            <div>
                              <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>Link de ubicación de Google Maps (opcional)</label>
                              <input value={mapsLink} onChange={e => setMapsLink(e.target.value)} placeholder="https://goo.gl/maps/ejemplo123" className={inputClass} style={inputStyle} />
                              <p className="text-xs mt-1" style={{ color: '#e91e8c' }}>Pega aquí el enlace de Google Maps de tu ubicación exacta</p>
                            </div>

                            {fullAddress && (
                              <div className="p-2 rounded-lg" style={{ background: 'rgba(233,30,140,0.05)', border: '1px solid rgba(233,30,140,0.2)' }}>
                                <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-primary)' }}>Dirección completa:</p>
                                <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>{fullAddress}</p>
                                {reference && <p className="text-xs mt-1" style={{ color: '#e91e8c' }}>Referencia: {reference}</p>}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="mt-3">
                          <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>Tu teléfono (para coordinación) *</label>
                          <div className="relative">
                            <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: phone.length === 9 ? '#25D366' : 'var(--text-secondary)' }} />
                            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="987 654 321" className={`${inputClass} pl-9`} style={{ ...inputStyle, borderColor: phone.length === 9 ? '#25D366' : '#e91e8c' }} />
                          </div>
                          {phone.length === 9 && <p className="text-xs text-green-500 mt-1 flex items-center gap-1"><CheckCircle size={10} /> Número válido</p>}
                        </div>

                        {selectedDistrictData && (
                          <div className="mt-3 p-3 rounded-xl text-center font-medium text-sm" style={{ background: 'rgba(37,211,102,0.08)', color: '#25D366', border: '1px solid rgba(37,211,102,0.3)' }}>
                            Costo de envío: S/. {selectedDistrictData.price.toFixed(2)}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Botón continuar paso 1 */}
              <button
                onClick={() => deliveryMethod && setStep(2)}
                disabled={!deliveryMethod}
                className="w-full py-3.5 rounded-2xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                style={{ background: deliveryMethod ? 'linear-gradient(135deg, #e91e8c, #ff6bb3)' : 'var(--border-color)', color: deliveryMethod ? 'white' : 'var(--text-secondary)', cursor: deliveryMethod ? 'pointer' : 'not-allowed' }}
              >
                {deliveryMethod ? 'Continuar →' : 'Selecciona un método de entrega'}
              </button>
            </div>

            {/* Desktop: resumen derecha */}
            <div className="hidden lg:block lg:sticky lg:top-24 lg:self-start"><OrderSummary /></div>
          </div>
        )}

        {/* PASO 2: DATOS */}
        {step === 2 && (
          <div className="flex flex-col lg:grid lg:grid-cols-[1fr_360px] gap-4">
            <div className="lg:hidden"><OrderSummary /></div>

            <div className="space-y-3">
              {/* Header azul */}
              <div className="rounded-2xl overflow-hidden shadow-sm" style={{ border: '1px solid var(--border-color)' }}>
                <div className="px-4 py-3 flex items-center gap-2" style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                  <User size={18} className="text-white" />
                  <div>
                    <p className="text-white font-bold text-sm">Tus datos de contacto</p>
                    <p className="text-white/80 text-xs">Necesitamos estos datos para procesar tu pedido</p>
                  </div>
                </div>

                <div className="p-4 space-y-4">
                  {/* Sección 1: Info personal */}
                  <div className="p-3 rounded-xl" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
                    <p className="text-xs font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                      <span className="w-5 h-5 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs">1</span>
                      Información personal
                    </p>
                    <div className="space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>Nombres *</label>
                          <input value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="Ej: María José" className={inputClass} style={inputStyle} />
                        </div>
                        <div>
                          <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>Apellidos *</label>
                          <input value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Ej: García López" className={inputClass} style={inputStyle} />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>Correo electrónico *</label>
                          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="correo@ejemplo.com" className={inputClass} style={inputStyle} />
                        </div>
                        <div>
                          <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>Documento de identidad * *</label>
                          <input value={docNumber} onChange={e => setDocNumber(e.target.value)} placeholder="12345678" className={inputClass} style={inputStyle} />
                          <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Ingresa tu DNI de 8 dígitos</p>
                          <select value={docType} onChange={e => setDocType(e.target.value)} className={`${inputClass} mt-1`} style={inputStyle}>
                            <option>DNI (Peruanos)</option>
                            <option>Carnet de Extranjería</option>
                            <option>Pasaporte</option>
                          </select>
                        </div>
                      </div>
                      {phone && (
                        <div className="p-3 rounded-xl flex items-center gap-3" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
                          <Phone size={16} className="text-indigo-500 flex-shrink-0" />
                          <div>
                            <p className="text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>Teléfono de contacto * *</p>
                            <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{phone}</p>
                            <p className="text-xs text-indigo-500">Registrado en el paso anterior</p>
                          </div>
                        </div>
                      )}
                      {!phone && (
                        <div>
                          <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>Teléfono de contacto * *</label>
                          <div className="relative">
                            <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
                            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="987 654 321" className={`${inputClass} pl-9`} style={inputStyle} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sección 2: Cuándo */}
                  <div className="p-3 rounded-xl" style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.3)' }}>
                    <p className="text-xs font-bold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                      <span className="w-5 h-5 rounded-full bg-amber-400 text-white flex items-center justify-center text-xs">2</span>
                      {deliveryMethod === 'pickup' ? '¿Cuándo recoges tu pedido?' : '¿Cuándo entregamos?'}
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs font-medium mb-1 block flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                          <Calendar size={10} /> Fecha de {deliveryMethod === 'pickup' ? 'recojo' : 'entrega'} *
                        </label>
                        <input type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className={inputClass} style={{ ...inputStyle, borderColor: 'rgba(251,191,36,0.5)' }} />
                      </div>
                      <div>
                        <label className="text-xs font-medium mb-1 block flex items-center gap-1" style={{ color: 'var(--text-secondary)' }}>
                          <Clock size={10} /> Horario de {deliveryMethod === 'pickup' ? 'recojo' : 'entrega'} *
                        </label>
                        <select value={deliveryHour} onChange={e => setDeliveryHour(e.target.value)} className={inputClass} style={{ ...inputStyle, borderColor: 'rgba(251,191,36,0.5)' }}>
                          <option value="">Seleccionar horario</option>
                          {HOURS.map(h => <option key={h} value={h}>🕐 {h}</option>)}
                        </select>
                      </div>
                    </div>
                    <p className="text-xs mt-2 flex items-center gap-1" style={{ color: '#f59e0b' }}>⚠ Es importante seleccionar fecha y hora para programar tu {deliveryMethod === 'pickup' ? 'recojo' : 'entrega'}</p>
                  </div>

                  {/* Sección 3: Destinatario (solo si es delivery) */}
                  {deliveryMethod === 'delivery' && (
                    <div className="p-3 rounded-xl" style={{ background: 'rgba(233,30,140,0.04)', border: '1px solid rgba(233,30,140,0.2)' }}>
                      <p className="text-xs font-bold mb-3 flex items-center gap-2" style={{ color: '#e91e8c' }}>
                        <span className="w-5 h-5 rounded-full flex items-center justify-center text-xs text-white" style={{ background: '#e91e8c' }}>3</span>
                        Datos de quien recibirá las flores
                      </p>
                      <div className="space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>Nombre completo del destinatario *</label>
                            <input value={recipientName} onChange={e => setRecipientName(e.target.value)} placeholder="Ej: María García" className={inputClass} style={inputStyle} />
                          </div>
                          <div>
                            <label className="text-xs font-medium mb-1 block" style={{ color: 'var(--text-secondary)' }}>Teléfono del destinatario *</label>
                            <div className="relative">
                              <Phone size={12} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-secondary)' }} />
                              <input value={recipientPhone} onChange={e => setRecipientPhone(e.target.value)} placeholder="987 654 321" className={`${inputClass} pl-8`} style={inputStyle} />
                            </div>
                            <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Formato: 9 dígitos, debe empezar con 9</p>
                          </div>
                        </div>
                        <div>
                          <label className="text-xs font-medium mb-1 block" style={{ color: '#e91e8c' }}>¿Quién es para ti? (opcional)</label>
                          <input value={relation} onChange={e => setRelation(e.target.value)} placeholder="Ej: Mi mamá, Mi novia, Mi amiga..." className={inputClass} style={inputStyle} />
                        </div>
                        <div>
                          <label className="text-xs font-medium mb-1 block" style={{ color: '#e91e8c' }}>Instrucciones especiales para la entrega (opcional)</label>
                          <textarea value={specialInstructions} onChange={e => setSpecialInstructions(e.target.value)} placeholder="Ej: Es sorpresa, entregar sin llamar antes..." rows={2} className={`${inputClass} resize-none`} style={inputStyle} />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Sección 3/4: Notas */}
                  <div className="p-3 rounded-xl" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
                    <p className="text-xs font-bold mb-2 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                      <span className="w-5 h-5 rounded-full bg-gray-400 text-white flex items-center justify-center text-xs">{deliveryMethod === 'delivery' ? 4 : 3}</span>
                      Notas adicionales (opcional)
                    </p>
                    <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Dedicatoria, instrucciones especiales, preferencias..." rows={3} className={`${inputClass} resize-none`} style={inputStyle} />
                  </div>
                </div>
              </div>

              {/* Botones paso 2 */}
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium transition-colors flex-shrink-0" style={{ color: 'var(--text-secondary)', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                  <ArrowLeft size={16} /> Volver al envío
                </button>
                <button
                  onClick={() => {
                    if (!firstName || !lastName || !email || !deliveryDate || !deliveryHour) {
                      alert('Por favor completa todos los campos obligatorios');
                      return;
                    }
                    setStep(3);
                  }}
                  className="flex-1 py-3.5 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all"
                  style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                >
                  Continuar →
                </button>
              </div>
            </div>

            <div className="hidden lg:block lg:sticky lg:top-24 lg:self-start"><OrderSummary /></div>
          </div>
        )}

        {/* PASO 3: PAGO */}
        {step === 3 && (
          <div className="flex flex-col lg:grid lg:grid-cols-[1fr_360px] gap-4">
            <div className="lg:hidden"><OrderSummary /></div>

            <div className="space-y-3">
              <div className="rounded-2xl overflow-hidden shadow-sm" style={{ border: '1px solid var(--border-color)' }}>
                <div className="px-4 py-3" style={{ background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                  <p className="text-white font-bold flex items-center gap-2"><CreditCard size={16} /> ¿Cómo deseas pagar?</p>
                  <p className="text-white/80 text-xs">Elige tu método de pago preferido</p>
                </div>

                <div className="p-4 space-y-3">
                  {/* Yape */}
                  <div
                    onClick={() => setPaymentMethod('yape')}
                    className="p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3"
                    style={{ borderColor: paymentMethod === 'yape' ? '#7c3aed' : 'var(--border-color)', background: paymentMethod === 'yape' ? 'rgba(124,58,237,0.05)' : 'var(--bg-primary)' }}
                  >
                    <div className="w-14 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm flex-shrink-0 border" style={{ borderColor: 'var(--border-color)' }}>
                      <span className="text-xl">💜</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Yape</p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Escanea el QR y paga al instante</p>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(124,58,237,0.1)', color: '#7c3aed' }}>Rápido</span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium text-green-600" style={{ background: 'rgba(37,211,102,0.1)' }}>Sin comisión</span>
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === 'yape' ? 'bg-purple-600 border-purple-600' : 'border-gray-300'}`}>
                      {paymentMethod === 'yape' && <CheckCircle size={14} className="text-white" />}
                    </div>
                  </div>

                  {/* Plin */}
                  <div
                    onClick={() => setPaymentMethod('plin')}
                    className="p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-3"
                    style={{ borderColor: paymentMethod === 'plin' ? '#06b6d4' : 'var(--border-color)', background: paymentMethod === 'plin' ? 'rgba(6,182,212,0.05)' : 'var(--bg-primary)' }}
                  >
                    <div className="w-14 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm flex-shrink-0 border" style={{ borderColor: 'var(--border-color)' }}>
                      <span className="text-xl">💙</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Plin</p>
                      <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>Escanea el QR y paga al instante</p>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'rgba(6,182,212,0.1)', color: '#06b6d4' }}>Rápido</span>
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium text-green-600" style={{ background: 'rgba(37,211,102,0.1)' }}>Sin comisión</span>
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === 'plin' ? 'bg-cyan-500 border-cyan-500' : 'border-gray-300'}`}>
                      {paymentMethod === 'plin' && <CheckCircle size={14} className="text-white" />}
                    </div>
                  </div>

                  {/* Cómo funciona */}
                  {paymentMethod && (
                    <div className="p-3 rounded-xl" style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.2)' }}>
                      <p className="text-xs font-bold mb-2 flex items-center gap-1 text-indigo-500">📱 ¿Cómo funciona?</p>
                      {['Te mostraremos un código QR', `Abre tu app de ${paymentMethod === 'yape' ? 'Yape' : 'Plin'} y escanea`, 'Sube la captura del comprobante', '¡Listo! Procesaremos tu pedido'].map((s, i) => (
                        <p key={i} className="text-xs mb-1 text-indigo-400">{i + 1}. {s}</p>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-medium flex-shrink-0" style={{ color: 'var(--text-secondary)', background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                  <ArrowLeft size={16} /> Volver a datos
                </button>
                <button
                  onClick={() => paymentMethod && setStep(4)}
                  disabled={!paymentMethod}
                  className="flex-1 py-3.5 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all"
                  style={{ background: paymentMethod ? 'linear-gradient(135deg, #10b981, #059669)' : 'var(--border-color)', color: paymentMethod ? 'white' : 'var(--text-secondary)', cursor: paymentMethod ? 'pointer' : 'not-allowed' }}
                >
                  Continuar →
                </button>
              </div>
            </div>

            <div className="hidden lg:block lg:sticky lg:top-24 lg:self-start"><OrderSummary /></div>
          </div>
        )}

        {/* PASO 4: CONFIRMAR */}
        {step === 4 && (
          <div className="flex flex-col lg:grid lg:grid-cols-[1fr_360px] gap-4">
            <div className="lg:hidden"><OrderSummary /></div>

            <div className="space-y-3">
              <div className="rounded-2xl overflow-hidden shadow-sm" style={{ border: '1px solid var(--border-color)' }}>
                <div className="px-4 py-3" style={{ background: 'linear-gradient(135deg, #e91e8c, #ff6bb3)' }}>
                  <p className="text-white font-bold flex items-center gap-2"><CheckCircle size={16} /> Revisa tu pedido</p>
                  <p className="text-white/80 text-xs">Confirma que todo esté correcto antes de pagar</p>
                </div>
                <div className="p-4 space-y-3">
                  {/* Entrega */}
                  <div className="p-3 rounded-xl" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
                    <p className="text-sm font-bold mb-2 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}><MapPin size={14} className="text-green-500" /> {deliveryMethod === 'pickup' ? 'Recojo en tienda' : 'Envío a domicilio'}</p>
                    {deliveryMethod === 'pickup' ? (
                      <div className="text-xs space-y-0.5" style={{ color: 'var(--text-secondary)' }}>
                        <p>Tienda: <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{delivery?.storeName || 'Flores & Detalles Lima'}</span></p>
                        <p>Dirección: {delivery?.storeAddress}</p>
                        <p>Horario: {delivery?.storeSchedule || 'Lun-Dom: 8:00 AM - 10:00 PM'}</p>
                      </div>
                    ) : (
                      <div className="text-xs space-y-0.5" style={{ color: 'var(--text-secondary)' }}>
                        <p>Dirección: <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{fullAddress}</span></p>
                        {reference && <p>Referencia: {reference}</p>}
                        <p>Costo: <span className="text-green-500 font-medium">{shippingCost ? `S/. ${shippingCost.toFixed(2)}` : 'Por calcular'}</span></p>
                      </div>
                    )}
                  </div>

                  {/* Datos */}
                  <div className="p-3 rounded-xl" style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.2)' }}>
                    <p className="text-sm font-bold mb-2 flex items-center gap-2 text-indigo-500"><User size={14} /> Tus datos</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-xs" style={{ color: 'var(--text-secondary)' }}>
                      <p>Nombre: <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{firstName} {lastName}</span></p>
                      <p>Email: <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{email}</span></p>
                      <p>Teléfono: <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{phone}</span></p>
                      <p>Documento: <span className="font-medium" style={{ color: 'var(--text-primary)' }}>DNI {docNumber}</span></p>
                    </div>
                  </div>

                  {/* Fecha */}
                  <div className="p-3 rounded-xl flex items-center gap-3" style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.3)' }}>
                    <Clock size={14} className="text-amber-500 flex-shrink-0" />
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs px-2 py-1 rounded-lg font-medium bg-amber-100 text-amber-700">{deliveryDate}</span>
                      <span className="text-xs px-2 py-1 rounded-lg font-medium bg-amber-100 text-amber-700">{deliveryHour}</span>
                    </div>
                  </div>

                  {/* Método de pago */}
                  <div className="p-3 rounded-xl" style={{ background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.2)' }}>
                    <p className="text-sm font-bold mb-2 flex items-center gap-2 text-purple-500"><CreditCard size={14} /> Método de pago</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{paymentMethod === 'yape' ? '💜' : '💙'}</span>
                      <span className="font-bold text-sm" style={{ color: paymentMethod === 'yape' ? '#7c3aed' : '#06b6d4' }}>{paymentMethod === 'yape' ? 'Yape' : 'Plin'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setShowQRModal(true)}
                  className="w-full py-4 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg transition-all"
                  style={{ background: 'linear-gradient(135deg, #7c3aed, #6d28d9)' }}
                >
                  <Shield size={16} /> Ver QR para pagar
                </button>
                <button onClick={() => setStep(3)} className="text-sm flex items-center justify-center gap-1 py-2" style={{ color: 'var(--text-secondary)' }}>
                  <ArrowLeft size={14} /> Cambiar método de pago
                </button>
              </div>
            </div>

            <div className="hidden lg:block lg:sticky lg:top-24 lg:self-start"><OrderSummary /></div>
          </div>
        )}
      </div>

      {/* MODAL QR */}
      {showQRModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }}>
          <div className="w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl" style={{ background: 'var(--bg-card)' }}>
            {/* Header */}
            <div className="px-5 py-4 flex items-center justify-between" style={{ background: paymentMethod === 'yape' ? 'linear-gradient(135deg, #7c3aed, #6d28d9)' : 'linear-gradient(135deg, #06b6d4, #0891b2)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                  <span className="text-xl">{paymentMethod === 'yape' ? '💜' : '💙'}</span>
                </div>
                <div>
                  <p className="text-white font-bold">Pagar con {paymentMethod === 'yape' ? 'Yape' : 'Plin'}</p>
                  <p className="text-white/80 text-xs">Escanea y paga en segundos</p>
                </div>
              </div>
              <button onClick={() => setShowQRModal(false)} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30">
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Monto */}
              <div className="p-4 rounded-2xl text-center" style={{ background: paymentMethod === 'yape' ? 'rgba(124,58,237,0.08)' : 'rgba(6,182,212,0.08)' }}>
                <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-secondary)' }}>Monto exacto a transferir</p>
                <p className="text-3xl font-black" style={{ color: paymentMethod === 'yape' ? '#7c3aed' : '#06b6d4' }}>S/. {finalTotal.toFixed(2)}</p>
              </div>

              {/* QR */}
              <div className="flex justify-center">
                {(paymentMethod === 'yape' ? payment?.yape?.qrImage : payment?.plin?.qrImage) ? (
                  <div className="p-3 bg-white rounded-2xl shadow-lg border-4" style={{ borderColor: paymentMethod === 'yape' ? '#7c3aed' : '#06b6d4' }}>
                    <img src={paymentMethod === 'yape' ? payment?.yape?.qrImage : payment?.plin?.qrImage} alt="QR" className="w-52 h-52 object-contain" />
                  </div>
                ) : (
                  <div className="w-52 h-52 rounded-2xl flex flex-col items-center justify-center gap-2 border-4 border-dashed" style={{ borderColor: paymentMethod === 'yape' ? '#7c3aed' : '#06b6d4' }}>
                    <span className="text-4xl">📲</span>
                    <p className="text-xs text-center px-4" style={{ color: 'var(--text-secondary)' }}>Configura tu QR en el panel de administración</p>
                  </div>
                )}
              </div>

              {/* Número y titular */}
              <div className="space-y-2 rounded-2xl overflow-hidden border" style={{ borderColor: 'var(--border-color)' }}>
                <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <div className="flex items-center gap-2">
                    <Phone size={14} style={{ color: 'var(--text-secondary)' }} />
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Número</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
                      {paymentMethod === 'yape' ? (payment?.yape?.accountNumber || '--- --- ---') : (payment?.plin?.accountNumber || '--- --- ---')}
                    </span>
                    <button onClick={() => handleCopyNumber(paymentMethod === 'yape' ? (payment?.yape?.accountNumber || '') : (payment?.plin?.accountNumber || ''))} className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors" style={{ background: copied ? 'rgba(37,211,102,0.1)' : 'var(--bg-primary)' }}>
                      <Copy size={12} style={{ color: copied ? '#25D366' : 'var(--text-secondary)' }} />
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-2">
                    <User size={14} style={{ color: 'var(--text-secondary)' }} />
                    <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>Titular</span>
                  </div>
                  <span className="font-black text-sm uppercase" style={{ color: 'var(--text-primary)' }}>
                    {paymentMethod === 'yape' ? (payment?.yape?.accountHolder || 'TITULAR') : (payment?.plin?.accountHolder || 'TITULAR')}
                  </span>
                </div>
              </div>

              {/* Pasos */}
              <div className="p-3 rounded-xl" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
                <p className="text-xs font-bold mb-2 flex items-center gap-1" style={{ color: 'var(--text-primary)' }}>📋 Sigue estos pasos:</p>
                {[
                  `Abre tu app de ${paymentMethod === 'yape' ? 'Yape' : 'Plin'}`,
                  'Escanea el QR o ingresa el número',
                  `Transfiere exacto: S/. ${finalTotal.toFixed(2)}`,
                  'Confirma y guarda tu comprobante'
                ].map((s, i) => (
                  <div key={i} className="flex items-start gap-2 mb-1.5">
                    <span className="w-5 h-5 rounded-full text-white text-xs flex items-center justify-center flex-shrink-0 font-bold" style={{ background: paymentMethod === 'yape' ? '#7c3aed' : '#06b6d4' }}>{i + 1}</span>
                    <p className="text-xs" style={{ color: paymentMethod === 'yape' ? '#7c3aed' : '#06b6d4' }}>{s}</p>
                  </div>
                ))}
              </div>

              {/* Botón final */}
              <button
                onClick={() => { handleWhatsAppOrder(); setShowQRModal(false); }}
                className="w-full py-4 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 shadow-lg"
                style={{ background: paymentMethod === 'yape' ? 'linear-gradient(135deg, #7c3aed, #6d28d9)' : 'linear-gradient(135deg, #06b6d4, #0891b2)' }}
              >
                <CheckCircle size={16} /> Ya pagué - Subir comprobante →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
