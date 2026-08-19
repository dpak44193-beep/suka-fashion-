import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { MOCK_USERS, MOCK_ORDERS, PRODUCTS, ADMIN_LOGS } from '@/data/mockData';
import { User, OrderStatus, UserRole } from '@/types';

type Tab = 'overview' | 'users' | 'orders' | 'logs';

const STATUS_STYLES: Record<OrderStatus, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  confirmed: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-600',
};

const ROLE_STYLES: Record<UserRole, string> = {
  super_admin: 'bg-[#2D6B76]/10 text-[#2D6B76]',
  admin: 'bg-[#4A9BA8]/10 text-[#4A9BA8]',
  customer: 'bg-[#D4A574]/15 text-[#D4A574]',
};

export default function SuperAdminDashboard() {
  const { currentUser } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [users, setUsers] = useState<User[]>(MOCK_USERS);

  const totalRevenue = MOCK_ORDERS.reduce((s, o) => s + o.totalAmount, 0);
  const customers = users.filter(u => u.role === 'customer');
  const admins = users.filter(u => u.role === 'admin');

  function toggleStatus(id: string) {
    setUsers(prev =>
      prev.map(u => (u.id === id ? { ...u, isActive: !u.isActive } : u))
    );
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'users', label: `Users (${users.length})` },
    { id: 'orders', label: `Orders (${MOCK_ORDERS.length})` },
    { id: 'logs', label: 'Activity Logs' },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-7">
          <p className="text-xs text-[#7FBCC4] uppercase tracking-widest font-medium mb-1">
            Super Admin &mdash; Platform Control
          </p>
          <h1 className="font-display text-2xl font-semibold text-[#2D3436]">
            {currentUser?.name}
          </h1>
          <p className="text-sm text-[#9CA3AF] mt-0.5">
            Full platform overview for Suka Fashions
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white rounded-xl border border-[#E8E4DC] p-1 mb-7 w-fit overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 px-4 py-2 text-sm rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#2D6B76] text-white font-medium shadow-sm'
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
                {
                  label: 'Total Revenue',
                  value: `&#8377;${totalRevenue.toLocaleString('en-IN')}`,
                  sub: 'All time',
                  color: 'text-[#2D6B76]',
                },
                {
                  label: 'Total Orders',
                  value: MOCK_ORDERS.length,
                  sub: 'All orders',
                  color: 'text-[#4A9BA8]',
                },
                {
                  label: 'Total Customers',
                  value: customers.length,
                  sub: 'Registered',
                  color: 'text-[#D4A574]',
                },
                {
                  label: 'Total Products',
                  value: PRODUCTS.length,
                  sub: 'In catalog',
                  color: 'text-[#7A9D84]',
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
                  <p className="text-sm font-medium text-[#2D3436] mt-1">{stat.label}</p>
                  <p className="text-xs text-[#9CA3AF]">{stat.sub}</p>
                </div>
              ))}
            </div>

            {/* Category Breakdown */}
            <div className="bg-white rounded-2xl border border-[#E8E4DC] p-6">
              <h3 className="font-display text-lg font-semibold text-[#2D3436] mb-5">
                Products by Category
              </h3>
              <div className="space-y-4">
                {[
                  'Sarees',
                  'Kurtas & Suits',
                  'Lehengas',
                  'Gowns & Dresses',
                  'Western Wear',
                  'Accessories',
                ].map(cat => {
                  const count = PRODUCTS.filter(p => p.category === cat).length;
                  const pct = Math.round((count / PRODUCTS.length) * 100);
                  return (
                    <div key={cat}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="text-[#2D3436] font-medium">{cat}</span>
                        <span className="text-[#9CA3AF]">
                          {count} product{count !== 1 ? 's' : ''} &middot; {pct}%
                        </span>
                      </div>
                      <div className="h-2 bg-[#F5F1E8] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#4A9BA8] to-[#7FBCC4] rounded-full transition-all duration-700"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Admin Team */}
            <div className="bg-white rounded-2xl border border-[#E8E4DC] p-6">
              <h3 className="font-display text-lg font-semibold text-[#2D3436] mb-4">
                Admin Team ({admins.length})
              </h3>
              <div className="space-y-4">
                {admins.map(admin => {
                  const productCount = PRODUCTS.filter(
                    p => p.createdBy === admin.id
                  ).length;
                  return (
                    <div
                      key={admin.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#4A9BA8]/10 flex items-center justify-center text-sm font-semibold text-[#4A9BA8]">
                          {admin.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#2D3436]">
                            {admin.name}
                          </p>
                          <p className="text-xs text-[#9CA3AF]">{admin.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-[#2D6B76]">
                          {productCount} products
                        </p>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full ${
                            admin.isActive
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-600'
                          }`}
                        >
                          {admin.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* USERS */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-2xl border border-[#E8E4DC] overflow-hidden">
            <div className="p-4 border-b border-[#E8E4DC] flex items-center justify-between">
              <p className="text-sm font-semibold text-[#2D3436]">All Users</p>
              <p className="text-xs text-[#9CA3AF]">{users.length} total</p>
            </div>
            <div className="divide-y divide-[#E8E4DC]">
              {users.map(user => (
                <div
                  key={user.id}
                  className="flex items-center justify-between px-4 py-3.5 hover:bg-[#FAFAF9] transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-[#F5F1E8] flex items-center justify-center text-sm font-semibold text-[#2D6B76] shrink-0">
                      {user.name.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[#2D3436] truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-[#9CA3AF] truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0 ml-3">
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize hidden sm:block ${ROLE_STYLES[user.role]}`}
                    >
                      {user.role.replace('_', ' ')}
                    </span>
                    {user.id !== currentUser?.id && (
                      <button
                        onClick={() => toggleStatus(user.id)}
                        className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                          user.isActive
                            ? 'border-[#E8E4DC] text-[#6B7280] hover:border-red-300 hover:text-red-500 hover:bg-red-50'
                            : 'border-[#4A9BA8] text-[#4A9BA8] hover:bg-[#4A9BA8] hover:text-white'
                        }`}
                      >
                        {user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-3">
            {MOCK_ORDERS.map(order => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-[#E8E4DC] p-5"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-[#2D3436]">{order.id}</p>
                    <p className="text-xs text-[#9CA3AF] mt-0.5">{order.orderDate}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-[#2D6B76]">
                      &#8377;{order.totalAmount.toLocaleString('en-IN')}
                    </p>
                    <span
                      className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize ${STATUS_STYLES[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
                <div className="grid sm:grid-cols-3 gap-2 text-xs text-[#6B7280]">
                  <div>
                    <span className="font-medium text-[#2D3436]">Customer: </span>
                    {order.customerDetails.name}
                  </div>
                  <div>
                    <span className="font-medium text-[#2D3436]">Phone: </span>
                    {order.customerDetails.phone}
                  </div>
                  <div>
                    <span className="font-medium text-[#2D3436]">Location: </span>
                    {order.customerDetails.city}, {order.customerDetails.state}
                  </div>
                  <div className="sm:col-span-3">
                    <span className="font-medium text-[#2D3436]">Items: </span>
                    {order.items.map(i => i.product.name).join(', ')}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* LOGS */}
        {activeTab === 'logs' && (
          <div className="bg-white rounded-2xl border border-[#E8E4DC] overflow-hidden">
            <div className="p-4 border-b border-[#E8E4DC]">
              <p className="text-sm font-semibold text-[#2D3436]">
                Activity Logs
              </p>
            </div>
            <div className="divide-y divide-[#E8E4DC]">
              {ADMIN_LOGS.map(log => (
                <div
                  key={log.id}
                  className="flex items-start justify-between p-4 hover:bg-[#FAFAF9] transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#4A9BA8]/10 flex items-center justify-center text-xs font-semibold text-[#4A9BA8] shrink-0 mt-0.5">
                      {log.adminName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm text-[#2D3436]">
                        <span className="font-medium">{log.adminName}</span>{' '}
                        {log.action}
                      </p>
                      <p className="text-xs text-[#9CA3AF] mt-0.5">
                        {log.resourceType} &middot; {log.resourceId}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-[#9CA3AF] shrink-0 ml-4 mt-0.5">
                    {log.timestamp}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
