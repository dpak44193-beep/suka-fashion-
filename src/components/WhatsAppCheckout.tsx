import { useState } from 'react';
import { CartItem, CustomerDetails } from '@/types';
import { useApp } from '@/context/AppContext';

interface Props {
  items: CartItem[];
  total: number;
  onClose: () => void;
}

const ADMIN_WHATSAPP = '9080255150';

const EMPTY_DETAILS: CustomerDetails = {
  name: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  notes: '',
};

export default function WhatsAppCheckout({ items, total, onClose }: Props) {
  const { clearCart, navigate, currentUser, createOrder } = useApp();
  const [step, setStep] = useState<'form' | 'preview'>('form');
  const [details, setDetails] = useState<CustomerDetails>(EMPTY_DETAILS);
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerDetails, string>>>({});

  function set(field: keyof CustomerDetails, value: string) {
    setDetails(d => ({ ...d, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: undefined }));
  }

  function validate(): boolean {
    const errs: Partial<Record<keyof CustomerDetails, string>> = {};
    if (!details.name.trim()) errs.name = 'Required';
    if (!details.email.includes('@')) errs.email = 'Valid email required';
    if (details.phone.replace(/\D/g, '').length < 10) errs.phone = 'Valid phone required';
    if (!details.address.trim()) errs.address = 'Required';
    if (!details.city.trim()) errs.city = 'Required';
    if (!details.state.trim()) errs.state = 'Required';
    if (details.pincode.replace(/\D/g, '').length !== 6) errs.pincode = '6-digit pincode';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function generateMessage(): string {
    const productList = items
      .map(item => {
        const price =
          item.product.price * (1 - item.product.discountPercentage / 100);
        return `- ${item.product.name} x${item.quantity}\n  Size: ${item.size} | Color: ${item.color}\n  Price: ₹${(price * item.quantity).toLocaleString('en-IN')}`;
      })
      .join('\n');

    return `Hi Suka Fashions Team,\n\nI'm interested in purchasing:\n\n📦 Products:\n${productList}\n\n💰 Total: ₹${total.toLocaleString('en-IN')}\n\n📋 My Details:\nName: ${details.name}\nEmail: ${details.email}\nPhone: ${details.phone}\nAddress: ${details.address}\nCity: ${details.city}, ${details.state} - ${details.pincode}${details.notes ? `\n\nNotes: ${details.notes}` : ''}\n\nPlease confirm my order. Thank you! 🙏`;
  }

  function handleSend() {
    const msg = generateMessage();
    const url = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(msg)}`;
    createOrder({
      id: `ORD-${Date.now()}`,
      customerId: currentUser?.id ?? 'guest',
      items,
      totalAmount: total,
      status: 'pending',
      orderDate: new Date().toISOString().slice(0, 10),
      customerDetails: details,
    });
    window.open(url, '_blank');
    clearCart();
    onClose();
    navigate('home');
  }

  const inputCls = (field: keyof CustomerDetails) =>
    `w-full px-3 py-2.5 text-sm border rounded-xl outline-none focus:ring-2 focus:ring-[#4A9BA8]/25 transition-all ${
      errors[field]
        ? 'border-red-400 bg-red-50'
        : 'border-[#E8E4DC] focus:border-[#4A9BA8]'
    }`;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-[#E8E4DC]">
          <div>
            <h2 className="font-display text-xl font-semibold text-[#2D3436]">
              {step === 'form' ? 'Complete Your Order' : 'Review & Send'}
            </h2>
            <p className="text-xs text-[#7FBCC4] mt-0.5">
              {step === 'form' ? 'Fill in your delivery details' : 'Preview your WhatsApp message'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#9CA3AF] hover:text-[#2D3436] transition-colors rounded-lg hover:bg-[#F5F1E8]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-5">
          {step === 'form' ? (
            <>
              {/* Order Summary */}
              <div className="bg-[#F5F1E8] rounded-xl p-4 mb-5">
                <p className="text-xs font-medium text-[#2D6B76] uppercase tracking-wide mb-3">
                  Order Summary
                </p>
                <div className="space-y-1.5">
                  {items.map((item, i) => {
                    const price =
                      item.product.price * (1 - item.product.discountPercentage / 100);
                    return (
                      <div key={i} className="flex justify-between text-sm text-[#2D3436]">
                        <span className="truncate pr-2">
                          {item.product.name} &times;{item.quantity}
                          <span className="text-[#9CA3AF] ml-1">
                            ({item.size}, {item.color})
                          </span>
                        </span>
                        <span className="shrink-0 font-medium">
                          &#8377;{(price * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    );
                  })}
                </div>
                <div className="border-t border-[#D4A574]/30 mt-3 pt-3 flex justify-between font-semibold text-[#2D6B76]">
                  <span>Total</span>
                  <span>&#8377;{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Customer Form */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-medium text-[#6B7280] mb-1 block">
                    Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    className={inputCls('name')}
                    value={details.name}
                    onChange={e => set('name', e.target.value)}
                    placeholder="Anjali Singh"
                  />
                  {errors.name && (
                    <p className="text-xs text-red-500 mt-0.5">{errors.name}</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-medium text-[#6B7280] mb-1 block">
                      Email <span className="text-red-400">*</span>
                    </label>
                    <input
                      className={inputCls('email')}
                      type="email"
                      value={details.email}
                      onChange={e => set('email', e.target.value)}
                      placeholder="you@example.com"
                    />
                    {errors.email && (
                      <p className="text-xs text-red-500 mt-0.5">{errors.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#6B7280] mb-1 block">
                      Phone <span className="text-red-400">*</span>
                    </label>
                    <input
                      className={inputCls('phone')}
                      type="tel"
                      value={details.phone}
                      onChange={e => set('phone', e.target.value)}
                      placeholder="+91 98765 43210"
                    />
                    {errors.phone && (
                      <p className="text-xs text-red-500 mt-0.5">{errors.phone}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#6B7280] mb-1 block">
                    Address <span className="text-red-400">*</span>
                  </label>
                  <input
                    className={inputCls('address')}
                    value={details.address}
                    onChange={e => set('address', e.target.value)}
                    placeholder="42 Green Park, Near MG Road"
                  />
                  {errors.address && (
                    <p className="text-xs text-red-500 mt-0.5">{errors.address}</p>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-medium text-[#6B7280] mb-1 block">
                      City <span className="text-red-400">*</span>
                    </label>
                    <input
                      className={inputCls('city')}
                      value={details.city}
                      onChange={e => set('city', e.target.value)}
                      placeholder="Bangalore"
                    />
                    {errors.city && (
                      <p className="text-xs text-red-500 mt-0.5">{errors.city}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#6B7280] mb-1 block">
                      State <span className="text-red-400">*</span>
                    </label>
                    <input
                      className={inputCls('state')}
                      value={details.state}
                      onChange={e => set('state', e.target.value)}
                      placeholder="Karnataka"
                    />
                    {errors.state && (
                      <p className="text-xs text-red-500 mt-0.5">{errors.state}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-xs font-medium text-[#6B7280] mb-1 block">
                      Pincode <span className="text-red-400">*</span>
                    </label>
                    <input
                      className={inputCls('pincode')}
                      value={details.pincode}
                      onChange={e => set('pincode', e.target.value)}
                      placeholder="560001"
                      maxLength={6}
                    />
                    {errors.pincode && (
                      <p className="text-xs text-red-500 mt-0.5">{errors.pincode}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-[#6B7280] mb-1 block">
                    Notes (optional)
                  </label>
                  <textarea
                    className={`${inputCls('notes')} resize-none`}
                    rows={2}
                    value={details.notes}
                    onChange={e => set('notes', e.target.value)}
                    placeholder="Any special instructions for packaging, delivery, etc."
                  />
                </div>
              </div>

              <button
                onClick={() => { if (validate()) setStep('preview'); }}
                className="mt-5 w-full py-3.5 bg-[#4A9BA8] text-white rounded-xl font-medium hover:bg-[#2D6B76] transition-colors"
              >
                Preview WhatsApp Message
              </button>
            </>
          ) : (
            <>
              <div className="bg-[#F5F1E8] rounded-xl p-4 mb-5">
                <p className="text-xs font-medium text-[#2D6B76] uppercase tracking-wide mb-3">
                  Message Preview
                </p>
                <pre className="text-xs text-[#2D3436] whitespace-pre-wrap font-sans leading-relaxed">
                  {generateMessage()}
                </pre>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setStep('form')}
                  className="flex-1 py-3 border border-[#E8E4DC] text-[#2D3436] text-sm rounded-xl hover:border-[#4A9BA8] transition-colors"
                >
                  Edit Details
                </button>
                <button
                  onClick={handleSend}
                  className="flex-1 py-3 bg-[#25D366] text-white text-sm rounded-xl font-medium hover:bg-[#1ebe5d] transition-colors flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Send via WhatsApp
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
