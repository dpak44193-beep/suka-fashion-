import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import WhatsAppCheckout from '@/components/WhatsAppCheckout';

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, navigate } = useApp();
  const [showCheckout, setShowCheckout] = useState(false);

  const subtotal = cart.reduce((sum, item) => {
    const price = item.product.price * (1 - item.product.discountPercentage / 100);
    return sum + price * item.quantity;
  }, 0);

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] flex items-center justify-center">
        <div className="text-center">
          <div className="text-7xl mb-6">🛒</div>
          <h2 className="font-display text-2xl font-semibold text-[#2D3436] mb-2">
            Your cart is empty
          </h2>
          <p className="text-sm text-[#9CA3AF] mb-8">
            Discover our beautiful collection and find your next favourite piece.
          </p>
          <button
            onClick={() => navigate('products')}
            className="px-8 py-3.5 bg-[#4A9BA8] text-white rounded-full font-medium hover:bg-[#2D6B76] transition-colors shadow-sm"
          >
            Explore Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      {showCheckout && (
        <WhatsAppCheckout
          items={cart}
          total={subtotal}
          onClose={() => setShowCheckout(false)}
        />
      )}

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-semibold text-[#2D3436]">Your Cart</h1>
          <span className="text-sm text-[#9CA3AF]">
            {cart.reduce((s, i) => s + i.quantity, 0)} items
          </span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, idx) => {
              const price =
                item.product.price * (1 - item.product.discountPercentage / 100);
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-[#E8E4DC] p-4 flex gap-4"
                >
                  <button
                    onClick={() => navigate('product-detail', item.product.id)}
                    className="shrink-0 w-24 h-32 rounded-xl overflow-hidden bg-[#F5F1E8]"
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </button>
                  <div className="flex-1 min-w-0">
                    <button
                      onClick={() => navigate('product-detail', item.product.id)}
                      className="font-display text-base font-semibold text-[#2D3436] hover:text-[#4A9BA8] transition-colors text-left leading-tight mb-1 block"
                    >
                      {item.product.name}
                    </button>
                    <p className="text-xs text-[#9CA3AF] mb-4">
                      {item.size} &middot; {item.color}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.size,
                              item.color,
                              item.quantity - 1
                            )
                          }
                          className="w-7 h-7 rounded-full border border-[#E8E4DC] text-sm flex items-center justify-center hover:border-[#4A9BA8] hover:text-[#4A9BA8] transition-colors leading-none"
                        >
                          &minus;
                        </button>
                        <span className="w-6 text-center text-sm font-medium text-[#2D3436]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.product.id,
                              item.size,
                              item.color,
                              item.quantity + 1
                            )
                          }
                          className="w-7 h-7 rounded-full border border-[#E8E4DC] text-sm flex items-center justify-center hover:border-[#4A9BA8] hover:text-[#4A9BA8] transition-colors leading-none"
                        >
                          +
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-[#2D6B76]">
                          &#8377;{(price * item.quantity).toLocaleString('en-IN')}
                        </span>
                        <button
                          onClick={() =>
                            removeFromCart(item.product.id, item.size, item.color)
                          }
                          className="text-[#C0BAB2] hover:text-red-400 transition-colors"
                          aria-label="Remove item"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-[#E8E4DC] p-5 sticky top-24">
              <h2 className="font-display text-lg font-semibold text-[#2D3436] mb-5">
                Order Summary
              </h2>
              <div className="space-y-2 mb-5">
                {cart.map((item, i) => {
                  const price =
                    item.product.price * (1 - item.product.discountPercentage / 100);
                  return (
                    <div key={i} className="flex justify-between text-sm text-[#6B7280]">
                      <span className="truncate pr-2">
                        {item.product.name} &times;{item.quantity}
                      </span>
                      <span className="shrink-0">
                        &#8377;{(price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-[#E8E4DC] pt-4 mb-5">
                <div className="flex justify-between font-semibold text-[#2D3436]">
                  <span>Subtotal</span>
                  <span className="text-[#2D6B76]">
                    &#8377;{subtotal.toLocaleString('en-IN')}
                  </span>
                </div>
                <p className="text-xs text-[#9CA3AF] mt-1">
                  Shipping &amp; taxes calculated via WhatsApp
                </p>
              </div>
              <button
                onClick={() => setShowCheckout(true)}
                className="w-full py-3.5 bg-[#25D366] text-white font-medium rounded-xl hover:bg-[#1ebe5d] transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Checkout via WhatsApp
              </button>
              <button
                onClick={() => navigate('products')}
                className="w-full mt-2 py-2.5 text-sm text-[#4A9BA8] hover:text-[#2D6B76] transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
