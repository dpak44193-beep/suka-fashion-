import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { PRODUCTS, MOCK_ORDERS, CATEGORIES } from '@/data/mockData';
import { Product, OrderStatus } from '@/types';

type Tab = 'overview' | 'products' | 'orders';

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
};

export default function AdminDashboard() {
  const { currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [orders, setOrders] = useState(MOCK_ORDERS);
  const [showAddForm, setShowAddForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const revenue = orders
    .filter(o => o.status === 'delivered')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const lowStock = products.filter(p => p.stockQuantity <= 5);

  function updateOrderStatus(orderId: string, status: OrderStatus) {
    setOrders(prev =>
      prev.map(o => (o.id === orderId ? { ...o, status } : o))
    );
  }

  function deleteProduct(id: string) {
    setProducts(prev => prev.filter(p => p.id !== id));
    setDeletingId(null);
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'products', label: `Products (${products.length})` },
    { id: 'orders', label: `Orders (${orders.length})` },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-xs text-[#7FBCC4] uppercase tracking-widest font-medium mb-1">
              Admin Panel
            </p>
            <h1 className="font-display text-2xl font-semibold text-[#2D3436]">
              {currentUser?.name}
            </h1>
            <p className="text-sm text-[#9CA3AF]">{currentUser?.email}</p>
          </div>
          {activeTab === 'products' && (
            <button
              onClick={() => setShowAddForm(true)}
              className="px-5 py-2.5 bg-[#4A9BA8] text-white text-sm rounded-full font-medium hover:bg-[#2D6B76] transition-colors shadow-sm"
            >
              + Add Product
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl border border-[#E8E4DC] p-1 mb-6 w-fit">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-5 py-2 text-sm rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#4A9BA8] text-white font-medium shadow-sm'
                  : 'text-[#6B7280] hover:text-[#2D3436]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { label: 'Products Listed', value: products.length, color: 'text-[#4A9BA8]' },
                { label: 'Total Orders', value: orders.length, color: 'text-[#D4A574]' },
                {
                  label: 'Revenue Generated',
                  value: `&#8377;${revenue.toLocaleString('en-IN')}`,
                  color: 'text-[#7A9D84]',
                },
                {
                  label: 'Low Stock Items',
                  value: lowStock.length,
                  color: lowStock.length > 0 ? 'text-red-400' : 'text-[#9CA3AF]',
                },
              ].map(stat => (
                <div
                  key={stat.label}
                  className="bg-white rounded-2xl border border-[#E8E4DC] p-5"
                >
                  <p
                    className={`text-2xl font-bold ${stat.color}`}
                    dangerouslySetInnerHTML={{ __html: String(stat.value) }}
                  />
                  <p className="text-xs text-[#9CA3AF] mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Low Stock Alert */}
            {lowStock.length > 0 && (
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
                <p className="text-sm font-semibold text-amber-800 mb-2">
                  &#9888; Low Stock Alert
                </p>
                <div className="space-y-1">
                  {lowStock.map(p => (
                    <p key={p.id} className="text-xs text-amber-700">
                      {p.name} &mdash; only {p.stockQuantity} unit
                      {p.stockQuantity !== 1 ? 's' : ''} remaining
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Orders Table */}
            <div>
              <h3 className="font-display text-lg font-semibold text-[#2D3436] mb-3">
                Recent Orders
              </h3>
              <div className="bg-white rounded-2xl border border-[#E8E4DC] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[500px]">
                    <thead>
                      <tr className="border-b border-[#E8E4DC]">
                        {['Order ID', 'Customer', 'Amount', 'Status', 'Date'].map(h => (
                          <th
                            key={h}
                            className="text-left text-xs font-medium text-[#9CA3AF] px-4 py-3"
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map(order => (
                        <tr
                          key={order.id}
                          className="border-b border-[#E8E4DC] last:border-0 hover:bg-[#FAFAF9] transition-colors"
                        >
                          <td className="px-4 py-3 text-sm font-medium text-[#2D3436]">
                            {order.id}
                          </td>
                          <td className="px-4 py-3 text-sm text-[#6B7280]">
                            {order.customerDetails.name}
                          </td>
                          <td className="px-4 py-3 text-sm font-semibold text-[#2D6B76]">
                            &#8377;{order.totalAmount.toLocaleString('en-IN')}
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${STATUS_STYLES[order.status]}`}
                            >
                              {order.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-[#9CA3AF]">
                            {order.orderDate}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            {showAddForm && (
              <AddProductForm
                adminId={currentUser?.id ?? ''}
                onSave={p => {
                  setProducts(prev => [p, ...prev]);
                  setShowAddForm(false);
                }}
                onCancel={() => setShowAddForm(false)}
              />
            )}
            {products.map(product => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-[#E8E4DC] p-4 flex items-center gap-4"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-16 h-20 rounded-xl object-cover bg-[#F5F1E8] shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#2D3436] truncate">{product.name}</p>
                  <p className="text-xs text-[#9CA3AF]">
                    {product.category} &middot; SKU: {product.sku}
                  </p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="text-sm font-semibold text-[#2D6B76]">
                      &#8377;
                      {(
                        product.price *
                        (1 - product.discountPercentage / 100)
                      ).toLocaleString('en-IN')}
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        product.stockQuantity <= 5
                          ? 'text-red-400'
                          : 'text-[#7A9D84]'
                      }`}
                    >
                      {product.stockQuantity} in stock
                    </span>
                    {product.discountPercentage > 0 && (
                      <span className="text-xs bg-[#D4A574]/15 text-[#D4A574] px-2 py-0.5 rounded-full">
                        {product.discountPercentage}% OFF
                      </span>
                    )}
                  </div>
                </div>
                <div className="shrink-0 flex items-center gap-1">
                  {deletingId === product.id ? (
                    <div className="flex gap-2 text-xs">
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setDeletingId(null)}
                        className="px-3 py-1.5 border border-[#E8E4DC] text-[#6B7280] rounded-lg hover:border-[#4A9BA8]"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeletingId(product.id)}
                      className="p-2 text-[#C0BAB2] hover:text-red-400 transition-colors rounded-lg hover:bg-red-50"
                      aria-label="Delete product"
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
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.map(order => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-[#E8E4DC] p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-[#2D3436]">{order.id}</p>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">
                      {order.orderDate} &middot; {order.customerDetails.name} &middot;{' '}
                      {order.customerDetails.phone}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="font-semibold text-[#2D6B76]">
                      &#8377;{order.totalAmount.toLocaleString('en-IN')}
                    </span>
                    <select
                      value={order.status}
                      onChange={e =>
                        updateOrderStatus(order.id, e.target.value as OrderStatus)
                      }
                      className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize cursor-pointer border-0 outline-none ${STATUS_STYLES[order.status]}`}
                    >
                      {(
                        [
                          'pending',
                          'confirmed',
                          'shipped',
                          'delivered',
                          'cancelled',
                        ] as OrderStatus[]
                      ).map(s => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <p className="text-xs text-[#6B7280]">
                  {order.items
                    .map(i => `${i.product.name} (x${i.quantity})`)
                    .join(', ')}
                </p>
                <p className="text-xs text-[#9CA3AF] mt-1">
                  &#128205; {order.customerDetails.address},{' '}
                  {order.customerDetails.city}, {order.customerDetails.state} &mdash;{' '}
                  {order.customerDetails.pincode}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function AddProductForm({
  adminId,
  onSave,
  onCancel,
}: {
  adminId: string;
  onSave: (p: Product) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({
    name: '',
    category: CATEGORIES[0],
    description: '',
    price: '',
    discountPercentage: '0',
    stockQuantity: '',
    sku: '',
  });

  const inputCls =
    'w-full px-3 py-2.5 text-sm border border-[#E8E4DC] rounded-xl focus:outline-none focus:border-[#4A9BA8] focus:ring-2 focus:ring-[#4A9BA8]/15 transition-all';

  function handleSave() {
    if (!form.name || !form.price || !form.stockQuantity || !form.sku) return;
    const product: Product = {
      id: `p${Date.now()}`,
      name: form.name,
      category: form.category,
      description: form.description,
      price: Number(form.price),
      discountPercentage: Number(form.discountPercentage),
      stockQuantity: Number(form.stockQuantity),
      sizeOptions: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      colorOptions: ['Default'],
      images: [
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop&auto=format',
      ],
      sku: form.sku,
      isActive: true,
      createdBy: adminId,
    };
    onSave(product);
  }

  return (
    <div className="bg-white rounded-2xl border-2 border-[#4A9BA8]/30 p-5 mb-2">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-lg font-semibold text-[#2D3436]">
          Add New Product
        </h3>
        <button
          onClick={onCancel}
          className="text-[#9CA3AF] hover:text-[#2D3436] transition-colors"
        >
          &times;
        </button>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="text-xs text-[#6B7280] mb-1 block">
            Product Name <span className="text-red-400">*</span>
          </label>
          <input
            className={inputCls}
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Elegant Silk Saree"
          />
        </div>
        <div>
          <label className="text-xs text-[#6B7280] mb-1 block">Category</label>
          <select
            className={inputCls}
            value={form.category}
            onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
          >
            {CATEGORIES.map(c => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs text-[#6B7280] mb-1 block">Description</label>
          <textarea
            className={`${inputCls} resize-none`}
            rows={2}
            value={form.description}
            onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
            placeholder="Product description..."
          />
        </div>
        <div>
          <label className="text-xs text-[#6B7280] mb-1 block">
            Price (&#8377;) <span className="text-red-400">*</span>
          </label>
          <input
            className={inputCls}
            type="number"
            value={form.price}
            onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
            placeholder="2500"
            min="0"
          />
        </div>
        <div>
          <label className="text-xs text-[#6B7280] mb-1 block">Discount %</label>
          <input
            className={inputCls}
            type="number"
            value={form.discountPercentage}
            onChange={e =>
              setForm(f => ({ ...f, discountPercentage: e.target.value }))
            }
            placeholder="0"
            min="0"
            max="90"
          />
        </div>
        <div>
          <label className="text-xs text-[#6B7280] mb-1 block">
            Stock Quantity <span className="text-red-400">*</span>
          </label>
          <input
            className={inputCls}
            type="number"
            value={form.stockQuantity}
            onChange={e =>
              setForm(f => ({ ...f, stockQuantity: e.target.value }))
            }
            placeholder="50"
            min="0"
          />
        </div>
        <div>
          <label className="text-xs text-[#6B7280] mb-1 block">
            SKU <span className="text-red-400">*</span>
          </label>
          <input
            className={inputCls}
            value={form.sku}
            onChange={e => setForm(f => ({ ...f, sku: e.target.value }))}
            placeholder="SAR-009"
          />
        </div>
      </div>
      <div className="flex gap-3 mt-4">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 border border-[#E8E4DC] text-[#6B7280] rounded-xl text-sm hover:border-[#4A9BA8] transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="flex-1 py-2.5 bg-[#4A9BA8] text-white rounded-xl text-sm font-medium hover:bg-[#2D6B76] transition-colors"
        >
          Save Product
        </button>
      </div>
    </div>
  );
}
