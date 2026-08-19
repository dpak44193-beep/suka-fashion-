import { useApp } from '@/context/AppContext';
import { MOCK_ORDERS } from '@/data/mockData';
import { OrderStatus } from '@/types';

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
};

export default function CustomerDashboard() {
  const { currentUser, navigate } = useApp();
  const orders = MOCK_ORDERS.filter(o => o.customerId === currentUser?.id);

  const delivered = orders.filter(o => o.status === 'delivered').length;
  const inProgress = orders.filter(o =>
    ['pending', 'confirmed', 'shipped'].includes(o.status)
  ).length;

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-xs text-[#7FBCC4] uppercase tracking-widest font-medium mb-1">
              My Account
            </p>
            <h1 className="font-display text-3xl font-semibold text-[#2D3436]">
              Hello, {currentUser?.name.split(' ')[0]} &#128075;
            </h1>
            <p className="text-sm text-[#9CA3AF] mt-1">{currentUser?.email}</p>
          </div>
          <button
            onClick={() => navigate('products')}
            className="px-5 py-2.5 bg-[#4A9BA8] text-white text-sm rounded-full font-medium hover:bg-[#2D6B76] transition-colors shadow-sm"
          >
            Shop Now
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Total Orders', value: orders.length, color: 'text-[#4A9BA8]' },
            { label: 'Delivered', value: delivered, color: 'text-[#7A9D84]' },
            { label: 'In Progress', value: inProgress, color: 'text-[#D4A574]' },
          ].map(stat => (
            <div
              key={stat.label}
              className="bg-white rounded-2xl border border-[#E8E4DC] p-5 text-center"
            >
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-[#9CA3AF] mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Orders */}
        <div>
          <h2 className="font-display text-xl font-semibold text-[#2D3436] mb-4">
            Order History
          </h2>
          {orders.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#E8E4DC]">
              <p className="text-4xl mb-3">&#128717;</p>
              <p className="font-display text-lg text-[#2D3436] font-medium mb-1">
                No orders yet
              </p>
              <p className="text-sm text-[#9CA3AF] mb-5">
                Your orders will appear here once you shop
              </p>
              <button
                onClick={() => navigate('products')}
                className="text-sm text-[#4A9BA8] hover:text-[#2D6B76] font-medium transition-colors"
              >
                Start shopping &rarr;
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl border border-[#E8E4DC] p-5"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-semibold text-[#2D3436]">{order.id}</p>
                      <p className="text-xs text-[#9CA3AF] mt-0.5">{order.orderDate}</p>
                    </div>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${STATUS_STYLES[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.name}
                          className="w-12 h-14 rounded-lg object-cover bg-[#F5F1E8] shrink-0"
                        />
                        <div>
                          <p className="text-sm font-medium text-[#2D3436]">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-[#9CA3AF]">
                            {item.size} &middot; {item.color} &middot; Qty {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t border-[#E8E4DC] pt-3">
                    <span className="text-sm text-[#6B7280]">Order Total</span>
                    <span className="font-semibold text-[#2D6B76]">
                      &#8377;{order.totalAmount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  {order.status === 'delivered' && (
                    <button
                      onClick={() => navigate('products')}
                      className="mt-3 w-full py-2 text-xs text-[#4A9BA8] border border-[#4A9BA8]/30 rounded-lg hover:bg-[#4A9BA8]/5 transition-colors"
                    >
                      Buy Again
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
