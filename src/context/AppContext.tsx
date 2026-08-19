import { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, User, View } from '@/types';
import { MOCK_USERS } from '@/data/mockData';

interface AppContextType {
  currentView: View;
  navigate: (view: View, productId?: string) => void;
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, size: string, color: string) => void;
  updateQuantity: (productId: string, size: string, color: string, qty: number) => void;
  clearCart: () => void;
  currentUser: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  selectedProductId: string | null;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [currentView, setCurrentView] = useState<View>('home');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  function navigate(view: View, productId?: string) {
    setCurrentView(view);
    if (productId !== undefined) setSelectedProductId(productId);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function addToCart(item: CartItem) {
    setCart(prev => {
      const existing = prev.find(
        i =>
          i.product.id === item.product.id &&
          i.size === item.size &&
          i.color === item.color
      );
      if (existing) {
        return prev.map(i =>
          i.product.id === item.product.id &&
          i.size === item.size &&
          i.color === item.color
            ? { ...i, quantity: i.quantity + item.quantity }
            : i
        );
      }
      return [...prev, item];
    });
  }

  function removeFromCart(productId: string, size: string, color: string) {
    setCart(prev =>
      prev.filter(
        i => !(i.product.id === productId && i.size === size && i.color === color)
      )
    );
  }

  function updateQuantity(productId: string, size: string, color: string, qty: number) {
    if (qty <= 0) {
      removeFromCart(productId, size, color);
      return;
    }
    setCart(prev =>
      prev.map(i =>
        i.product.id === productId && i.size === size && i.color === color
          ? { ...i, quantity: qty }
          : i
      )
    );
  }

  function clearCart() {
    setCart([]);
  }

  function login(email: string, _password: string): boolean {
    const user = MOCK_USERS.find(
      u => u.email.toLowerCase() === email.toLowerCase() && u.isActive
    );
    if (user) {
      setCurrentUser(user);
      if (user.role === 'super_admin') navigate('super-admin');
      else if (user.role === 'admin') navigate('admin-dashboard');
      else navigate('customer-dashboard');
      return true;
    }
    return false;
  }

  function logout() {
    setCurrentUser(null);
    navigate('home');
  }

  return (
    <AppContext.Provider
      value={{
        currentView,
        navigate,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        currentUser,
        login,
        logout,
        selectedProductId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
