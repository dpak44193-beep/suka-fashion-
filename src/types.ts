export type UserRole = 'customer' | 'admin' | 'super_admin';
export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
export type View =
  | 'home'
  | 'products'
  | 'product-detail'
  | 'cart'
  | 'login'
  | 'register'
  | 'customer-dashboard'
  | 'admin-dashboard'
  | 'super-admin';

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  discountPercentage: number;
  stockQuantity: number;
  sizeOptions: string[];
  colorOptions: string[];
  images: string[];
  sku: string;
  isActive: boolean;
  createdBy?: string;
}

export interface CartItem {
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

export interface CustomerDetails {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  notes: string;
}

export interface Order {
  id: string;
  customerId: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  orderDate: string;
  customerDetails: CustomerDetails;
  adminNotes?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export interface AdminLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  resourceType: string;
  resourceId: string;
  timestamp: string;
}
