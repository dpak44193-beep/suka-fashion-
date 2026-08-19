import { AppProvider, useApp } from '@/context/AppContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HomePage from '@/pages/HomePage';
import ProductsPage from '@/pages/ProductsPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import CartPage from '@/pages/CartPage';
import AuthPage from '@/pages/AuthPage';
import CustomerDashboard from '@/pages/CustomerDashboard';
import AdminDashboard from '@/pages/AdminDashboard';
import SuperAdminDashboard from '@/pages/SuperAdminDashboard';

const AUTH_VIEWS = new Set(['login', 'register']);
const ADMIN_VIEWS = new Set(['admin-dashboard', 'super-admin']);

function AppContent() {
  const { currentView } = useApp();

  const isAuthView = AUTH_VIEWS.has(currentView);
  const isAdminView = ADMIN_VIEWS.has(currentView);

  return (
    <div className="min-h-screen flex flex-col">
      {!isAuthView && <Navbar />}
      <main className="flex-1">
        {currentView === 'home' && <HomePage />}
        {currentView === 'products' && <ProductsPage />}
        {currentView === 'product-detail' && <ProductDetailPage />}
        {currentView === 'cart' && <CartPage />}
        {isAuthView && <AuthPage />}
        {currentView === 'customer-dashboard' && <CustomerDashboard />}
        {currentView === 'admin-dashboard' && <AdminDashboard />}
        {currentView === 'super-admin' && <SuperAdminDashboard />}
      </main>
      {!isAuthView && !isAdminView && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
