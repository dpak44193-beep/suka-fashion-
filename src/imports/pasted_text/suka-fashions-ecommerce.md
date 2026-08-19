Suka Fashions - E-Commerce Platform Build Prompt
Project Overview

Build a women's fashion e-commerce platform (similar to Koskii.com) with three user roles: Super Admin, Admin, and Customer. The platform should enable product browsing, WhatsApp-based checkout, and administrative inventory management.

Design & Branding
Color Palette
Primary Teal: 
#4A9BA8 (from logo)
Secondary Light Teal: 
#7FBCC4
Accent Teal: 
#2D6B76
Neutral Cream: 
#F5F1E8 (from theme)
Warm Gold: 
#D4A574 (from theme)
Sage Green: 
#7A9D84 (from theme)
Text: 
#2D3436 (dark gray)
Background: 
#FAFAF9 (off-white)
Logo & Style
Elegant, minimalist aesthetic matching "Suka Fashions" branding
Feminine design language with flowing elements
Responsive design for mobile-first experience
Technology Stack Recommendation
Frontend
Framework: React.js / Next.js
Styling: Tailwind CSS
State Management: Redux or Context API
UI Components: Custom components or shadcn/ui
Backend
Runtime: Node.js
Framework: Express.js
Database: MongoDB / PostgreSQL
Authentication: JWT + bcrypt
Third-party Integration: WhatsApp API / Twilio
Deployment
Frontend: Vercel / Netlify
Backend: Heroku / AWS / DigitalOcean
Database Schema
Collections/Tables Required
Users
- user_id (UUID)
- name
- email (unique)
- phone (unique)
- password (hashed)
- role (enum: super_admin, admin, customer)
- address
- city
- state
- pincode
- created_at
- updated_at
- is_active
Products
- product_id (UUID)
- name
- category
- description
- price
- discount_percentage
- stock_quantity
- size_options (array: XS, S, M, L, XL, XXL)
- color_options (array)
- images (array of URLs)
- sku
- created_by (admin_id)
- created_at
- updated_at
- is_active
Orders
- order_id (UUID)
- customer_id
- products (array with product_id, selected_size, selected_color, quantity, price)
- total_amount
- status (enum: pending, confirmed, shipped, delivered, cancelled)
- whatsapp_message_sent (boolean)
- customer_details (captured at checkout)
- order_date
- updated_at
- admin_notes (for order fulfillment)
Admin Logs
- log_id (UUID)
- admin_id
- action (created/updated/deleted product, order status changed, etc.)
- resource_type (product, order, user)
- resource_id
- timestamp
Feature Requirements by Role
Super Admin Dashboard
User Management
View all admins and customers
Activate/deactivate accounts
Delete users
View user activity logs
Product Management (Full Access)
Create, read, update, delete products
Bulk upload products (CSV)
Manage inventory
Set discounts
Order Management
View all orders across all admins
Update order status
View complete order analytics
Generate reports (revenue, top products, etc.)
Admin Management
Create new admin accounts
Assign permissions
View admin activity logs
Revoke admin access
Analytics Dashboard
Total revenue
Total orders
Total customers
Top selling products
Monthly sales trend
Product category breakdown
Admin Dashboard
Product Management
Create, read, update, delete products (assigned category)
Upload product images
Manage inventory levels
Set product prices and discounts
Track which products they created
Order Management
View orders for their products
Update order status
Add admin notes to orders
Generate order fulfillment reports
Inventory Alerts
Low stock notifications
Out of stock alerts
Personal Analytics
Total products listed
Total orders from their products
Revenue generated
Customer Storefront
Product Browsing
Category-wise filtering
Price range filtering
Size & color filters
Search functionality
Product details page with images
Stock availability display
Shopping Cart
Add/remove items
Update quantity
Save for later
View cart total
Checkout Flow
Checkout button redirects to WhatsApp
Dynamic WhatsApp message auto-generated with:
Selected product details
Size, color, quantity
Total price
Customer details form (name, email, phone, address, city, state, pincode)
Confirmation before sending to admin
Order Tracking
View previous orders
Order status updates
Order history
API Endpoints
Authentication
POST /api/auth/register - Register user (customer/admin)
POST /api/auth/login - Login
POST /api/auth/logout - Logout
POST /api/auth/refresh-token - Refresh JWT token
Products (Customer)
GET /api/products - Get all products (paginated, filterable)
GET /api/products/:id - Get product details
GET /api/products/category/:category - Get by category
Products (Admin/Super Admin)
POST /api/admin/products - Create product
PUT /api/admin/products/:id - Update product
DELETE /api/admin/products/:id - Delete product
GET /api/admin/products - View own products (admin) or all (super admin)
POST /api/admin/products/bulk-upload - CSV upload
Orders
POST /api/orders - Create order (customer)
GET /api/orders - Get customer's orders
GET /api/admin/orders - Get admin's orders
PUT /api/admin/orders/:id - Update order status
GET /api/super-admin/orders - Get all orders
Users (Super Admin Only)
GET /api/super-admin/users - Get all users
PUT /api/super-admin/users/:id/role - Change user role
DELETE /api/super-admin/users/:id - Delete user
Analytics
GET /api/admin/analytics - Admin analytics
GET /api/super-admin/analytics - Platform analytics
WhatsApp Integration Flow
When Customer Clicks "Buy Now"
Display modal/form requesting customer details:
Full Name
Email
Phone Number
Address
City, State, Pincode
Additional notes (optional)
Generate WhatsApp message template:
Hi [Admin Name],

I'm interested in purchasing:

📦 Products:
- [Product Name] x [Quantity]
- Size: [Size]
- Color: [Color]
- Price: ₹[Price]

💰 Total: ₹[Total Amount]

📋 My Details:
Name: [Customer Name]
Email: [Customer Email]
Phone: [Customer Phone]
Address: [Full Address]
City: [City], [State] - [Pincode]

Notes: [Customer Notes]

Please confirm my order. Thank you!
Generate WhatsApp link: https://wa.me/[ADMIN_PHONE]?text=[ENCODED_MESSAGE]
Redirect to WhatsApp
After redirect, save order to database with status: "pending"
Frontend Pages/Routes
Public Routes
/ - Homepage (featured products, categories)
/products - Products listing
/products/:id - Product detail page
/about - About Suka Fashions
/contact - Contact page
/auth/login - Login page
/auth/register - Registration page
Customer Routes (Protected)
/dashboard - Customer dashboard
/orders - Order history
/cart - Shopping cart
/checkout - Checkout process
/profile - User profile
Admin Routes (Protected)
/admin/dashboard - Admin dashboard
/admin/products - Product management
/admin/products/new - Create product
/admin/products/:id/edit - Edit product
/admin/orders - Order management
/admin/analytics - Analytics
Super Admin Routes (Protected)
/super-admin/dashboard - Super admin dashboard
/super-admin/users - User management
/super-admin/admins - Admin management
/super-admin/orders - All orders
/super-admin/analytics - Platform analytics
/super-admin/logs - Activity logs
Key Features Summary
Feature	Customer	Admin	Super Admin
Browse & Filter Products	✅	-	-
WhatsApp Checkout	✅	-	-
View Order History	✅	-	-
Create Products	-	✅	✅
Manage Inventory	-	✅	✅
Update Order Status	-	✅	✅
View All Orders	-	Own only	All
Manage Admins	-	-	✅
Manage Users	-	-	✅
View Analytics	-	Own	Platform-wide
Activity Logs	-	-	✅
UI/UX Requirements
Responsiveness
Mobile-first design (320px+)
Tablet optimization (768px+)
Desktop optimization (1024px+)
Performance
Page load time < 3s
Lazy load product images
Pagination for product listings
Caching strategies for product data
Accessibility
WCAG 2.1 AA compliance
Alt text for all images
Keyboard navigation support
Color contrast ratios
Security Requirements
Password hashing with bcrypt (minimum 10 rounds)
JWT token expiration (access: 1h, refresh: 7d)
HTTPS only
CORS properly configured
Input validation on all endpoints
Rate limiting on auth endpoints
Admin/Super Admin verification before sensitive operations
Audit logs for data changes
Testing Requirements
Unit tests for auth logic
Integration tests for API endpoints
E2E tests for critical user flows (checkout, product creation)
Test coverage minimum: 70%
Deployment Checklist
 Environment variables configured (.env)
 Database migrations run
 SSL certificate installed
 WhatsApp API credentials set up
 Email service configured (optional)
 Backup strategy implemented
 Monitoring & error tracking (Sentry)
 CDN configured for images
Future Enhancements (Phase 2)
Payment gateway integration (Razorpay, PhonePe)
Email notifications
SMS alerts
Wishlist feature
Product reviews & ratings
Recommendation engine
Multiple language support
Subscription/membership plans
Live chat support
Inventory sync with multiple warehouses
Success Metrics

✅ Platform loads in < 3 seconds ✅ 0 authentication errors ✅ Admin can manage 1000+ products efficiently ✅ Customer checkout flow < 2 minutes ✅ 99.9% uptime ✅ All roles properly isolated (no privilege escalation)