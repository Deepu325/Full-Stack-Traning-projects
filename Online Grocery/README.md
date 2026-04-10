# Online Grocery Store - Full Stack Web Application
## College Mini Project

---

## PROJECT TITLE
**Online Grocery Store System**

---

## PROJECT DESCRIPTION
A complete full-stack web application for an online grocery store where users can:
- Register and login to their accounts
- Browse products by category
- Add products to shopping cart
- Manage cart items (add, update, remove)
- Place orders with delivery address
- View order history and order details
- Track order status

The system demonstrates all CRUD operations (Create, Read, Update, Delete) with a clean, responsive user interface.

---

## TECHNOLOGY STACK

### Frontend:
- **HTML5** - Page structure
- **CSS3** - Styling and responsive layout
- **JavaScript (ES6)** - Client-side interactivity and form validation
- **Responsive Design** - Mobile-first approach

### Backend:
- **PHP 7+** - Server-side logic and API endpoints
- **Sessions** - User authentication management

### Database:
- **MySQL** - Data storage and management
- **SQL Queries** - CRUD operations

---

## PROJECT FOLDER STRUCTURE

```
Online Grocery/
│
├── frontend/                    # HTML pages
│   ├── index.html              # Homepage
│   ├── login.html              # Login page
│   ├── register.html           # Registration page
│   ├── dashboard.html          # Products listing
│   ├── cart.html               # Shopping cart
│   └── order-history.html      # Orders history
│
├── backend/                    # PHP backend
│   ├── includes/
│   │   ├── config.php          # Database configuration
│   │   ├── auth.php            # Authentication functions
│   │   ├── product.php         # Product operations
│   │   ├── cart.php            # Cart operations
│   │   └── order.php           # Order operations
│   ├── auth_api.php            # Auth API endpoints
│   ├── product_api.php         # Product/Cart API endpoints
│   └── order_api.php           # Order API endpoints
│
├── css/
│   └── style.css               # All styling
│
├── js/
│   └── main.js                 # Client-side JavaScript
│
├── database/
│   └── grocery_store.sql       # Database schema & sample data
│
└── README.md                   # This file
```

---

## DATABASE DESIGN (SQL SCHEMA)

### Tables Created:

#### 1. **users** - Stores user information
```sql
- user_id (Primary Key)
- username (Unique)
- email (Unique)
- password (hashed)
- full_name
- phone
- address
- created_at
- updated_at
```

#### 2. **products** - Stores product information
```sql
- product_id (Primary Key)
- product_name
- category
- price (Decimal)
- stock_quantity
- description
- image_path
- created_at
- updated_at
```

#### 3. **cart** - Stores shopping cart items
```sql
- cart_id (Primary Key)
- user_id (Foreign Key → users.user_id)
- product_id (Foreign Key → products.product_id)
- quantity
- added_at
```

#### 4. **orders** - Stores order information
```sql
- order_id (Primary Key)
- user_id (Foreign Key → users.user_id)
- order_date
- total_amount
- status (pending, processing, shipped, delivered, cancelled)
- delivery_address
- created_at
```

#### 5. **order_items** - Stores individual items in orders
```sql
- order_item_id (Primary Key)
- order_id (Foreign Key → orders.order_id)
- product_id (Foreign Key → products.product_id)
- quantity
- price (price at time of order)
- created_at
```

### Sample Products Included:
- Basmati Rice (₹450)
- Whole Wheat Flour (₹80)
- Sunflower Oil (₹220)
- Skim Milk (₹65)
- Butter (₹420)
- Eggs (₹72)
- Fresh Tomatoes (₹40)
- Onions (₹30)
- Potatoes (₹25)
- Apples (₹120)
- Bananas (₹60)
- Lemon (₹55)

---

## KEY FEATURES IMPLEMENTED

### 1. User Authentication
- **Registration** - New users can create account
- **Login** - Existing users can login
- **Logout** - Users can logout
- **Session Management** - PHP sessions for logged-in users

### 2. Product Management
- **View All Products** - Display all available products
- **Category Filter** - Filter products by category
- **Product Details** - Modal view for detailed product information
- **Stock Display** - Show available stock quantity
- **Price Display** - Display product prices

### 3. Shopping Cart
- **Add to Cart** - Add products with quantity
- **View Cart** - Display all cart items with totals
- **Update Quantity** - Change item quantity
- **Remove Item** - Delete items from cart
- **Cart Total** - Calculate total price automatically
- **Unique Constraints** - Prevent duplicate items

### 4. Order Management
- **Place Order** - Create order from cart items
- **View Orders** - Display user's order history
- **Order Details** - View complete order information
- **Track Status** - See order status (pending, processing, shipped, delivered, cancelled)
- **Transaction Safety** - Database transactions ensure data consistency

### 5. Frontend Features
- **Responsive Design** - Works on all device sizes
- **Form Validation** - Client-side input validation
- **Error Handling** - User-friendly error messages
- **Loading States** - Visual feedback during operations
- **Modal Windows** - For product details and order information
- **Sticky Cart Counter** - Real-time cart count updates

### 6. Security Features
- **Password Hashing** - bcrypt password encryption
- **SQL Injection Protection** - Prepared statements
- **Session Validation** - User authentication checks
- **Input Validation** - Both client and server-side

---

## EXAMPLE CRUD SQL OPERATIONS

### CREATE (Insert)
```sql
-- Add new user
INSERT INTO users (username, email, password, full_name)
VALUES ('john_doe', 'john@example.com', '$2y$10$...hashed', 'John Doe');

-- Add product
INSERT INTO products (product_name, category, price, stock_quantity, description)
VALUES ('Basmati Rice', 'Grains', 450.00, 100, 'Premium Basmati Rice 1kg');

-- Add to cart
INSERT INTO cart (user_id, product_id, quantity)
VALUES (1, 5, 2);

-- Create order
INSERT INTO orders (user_id, total_amount, delivery_address, status)
VALUES (1, 1500.00, '123 Main Street', 'pending');
```

### READ (Select)
```sql
-- Get all products
SELECT * FROM products WHERE stock_quantity > 0;

-- Get user's cart with product details
SELECT c.*, p.product_name, p.price 
FROM cart c 
JOIN products p ON c.product_id = p.product_id
WHERE c.user_id = 1;

-- Get user's orders
SELECT * FROM orders 
WHERE user_id = 1 
ORDER BY order_date DESC;

-- Get order items
SELECT oi.*, p.product_name 
FROM order_items oi
JOIN products p ON oi.product_id = p.product_id
WHERE oi.order_id = 5;
```

### UPDATE
```sql
-- Update product stock
UPDATE products 
SET stock_quantity = stock_quantity - 2 
WHERE product_id = 5;

-- Update cart quantity
UPDATE cart 
SET quantity = 5 
WHERE user_id = 1 AND product_id = 5;

-- Update order status
UPDATE orders 
SET status = 'shipped' 
WHERE order_id = 1;
```

### DELETE
```sql
-- Remove from cart
DELETE FROM cart 
WHERE user_id = 1 AND product_id = 5;

-- Delete entire cart
DELETE FROM cart 
WHERE user_id = 1;
```

---

## STEPS TO RUN THE PROJECT

### STEP 1: Prerequisites
- **XAMPP** (or WAMP/MAMP) - Local Apache + MySQL server
- **PHP 7.0+** with MySQLi extension
- **MySQL 5.7+**
- Modern web browser (Chrome, Firefox, Safari, Edge)

### STEP 2: Install & Setup
1. **Download XAMPP** from https://www.apachefriends.org/
   - Extract and install in `C:\xampp` (Windows) or `/Applications/XAMPP` (Mac)

2. **Start XAMPP Services**
   - Open XAMPP Control Panel
   - Click "Start" for Apache and MySQL

3. **Copy Project Files**
   - Navigate to XAMPP's htdocs folder:
     - Windows: `C:\xampp\htdocs\`
     - Mac: `/Applications/XAMPP/htdocs/`
   - Paste the entire "Online Grocery" folder

### STEP 3: Create Database
1. **Open phpMyAdmin**
   - Go to `http://localhost/phpmyadmin/`
   - Default username: `root`
   - Default password: (leave blank)

2. **Import SQL File**
   - Click "Import" tab
   - Select `database/grocery_store.sql`
   - Click "Go"
   - Database will be created with all tables and sample data

### STEP 4: Configure Database Connection (if needed)
If your MySQL uses different credentials, update:
- File: `backend/includes/config.php`
```php
define('DB_SERVER', 'localhost');   // Change if needed
define('DB_USER', 'root');          // Change if needed
define('DB_PASS', '');              // Add password if set
define('DB_NAME', 'grocery_store');
```

### STEP 5: Run the Application
1. **Open Browser**
   - Homepage: `http://localhost/Online Grocery/frontend/index.html`

2. **Test the Features**
   - Register a new account
   - Login with your credentials
   - Browse products
   - Add items to cart
   - Place an order
   - View order history

### STEP 6: Verify All Features

#### Test Registration
```
GO TO: http://localhost/Online Grocery/frontend/register.html
Enter: John Doe / john@example.com / john123 / phone / address
Click: Create Account
Expected: Success message, redirect to login
```

#### Test Login
```
GO TO: http://localhost/Online Grocery/frontend/login.html
Enter: john@example.com / john123
Click: Login
Expected: Logged in, redirect to dashboard, see user name
```

#### Test Products
```
GO TO: http://localhost/Online Grocery/frontend/dashboard.html
Actions:
- See all 12 products loaded
- Click on "View" button for product details
- Filter by category
- Add items to cart with quantity
Expected: Cart count increases, success message shown
```

#### Test Cart
```
GO TO: http://localhost/Online Grocery/frontend/cart.html
Actions:
- See all cart items with prices
- Update quantities
- Remove items
- See total calculated correctly
Expected: Cart updates in real-time
```

#### Test Checkout
```
On cart page:
- Click "Proceed to Checkout"
- Enter delivery address
- Click "Place Order"
Expected: Order created, redirected to order history
```

#### Test Order History
```
GO TO: http://localhost/Online Grocery/frontend/order-history.html
Actions:
- See all your orders
- Click "View Details" on any order
- See all items and order information
Expected: Order details modal shows all information
```

---

## SAMPLE TEST DATA

### Test User Account
```
Username: testuser
Email: test@example.com
Password: test123
Full Name: Test User
Phone: 9876543210
Address: 123, Main Street, City
```

(Use the registration page to create actual test account)

### Test Products Available
| Product | Category | Price | Stock |
|---------|----------|-------|-------|
| Basmati Rice | Grains | ₹450 | 100 |
| Whole Wheat Flour | Flour | ₹80 | 150 |
| Sunflower Oil | Oils | ₹220 | 80 |
| Skim Milk | Dairy | ₹65 | 120 |
| Butter | Dairy | ₹420 | 60 |
| Eggs | Dairy | ₹72 | 200 |
| Fresh Tomatoes | Vegetables | ₹40 | 250 |
| Onions | Vegetables | ₹30 | 300 |
| Potatoes | Vegetables | ₹25 | 400 |
| Apples | Fruits | ₹120 | 180 |
| Bananas | Fruits | ₹60 | 250 |
| Lemon | Fruits | ₹55 | 200 |

---

## TROUBLESHOOTING

### Issue: "Connection to database failed"
**Solution:**
- Check if MySQL is running in XAMPP
- Verify database credentials in `config.php`
- Ensure database "grocery_store" is created

### Issue: "Cannot access page after login"
**Solution:**
- Check browser's cookie settings
- Clear browser cache and cookies
- Try incognito/private browsing

### Issue: "Products not showing"
**Solution:**
- Confirm SQL file was imported successfully
- Check if products table has data in phpMyAdmin
- Check browser console for JavaScript errors

### Issue: "Cart not working"
**Solution:**
- Ensure user is logged in
- Check browser console for errors
- Verify product_api.php is accessible

### Issue: "Images not loading"
**Solution:**
- This is normal as image paths are references only
- Placeholder images from https://via.placeholder.com are used
- To add real images, create an `images/` folder

---

## KEY FUNCTIONS EXPLAINED

### Backend Functions (PHP)

#### auth.php
```php
registerUser()      // Register new user with validation
loginUser()         // Authenticate user credentials
logoutUser()        // Clear session and logout
```

#### product.php
```php
getAllProducts()           // Fetch all available products
getProductById()           // Fetch single product details
getProductsByCategory()    // Filter by category
getAllCategories()         // Get unique categories
updateProductStock()       // Decrease stock after order
```

#### cart.php
```php
addToCart()              // Add/update item in cart
getCartItems()           // Fetch user's cart with joins
getCartTotal()           // Calculate total price
updateCartItem()         // Change quantity
removeFromCart()         // Delete item from cart
clearCart()              // Empty entire cart
```

#### order.php
```php
createOrder()            // Create order from cart (with transaction)
getUserOrders()          // Get all user's orders
getOrderDetails()        // Get complete order with items
updateOrderStatus()      // Update order status (admin)
```

### Frontend Functions (JavaScript)

```javascript
isUserLoggedIn()          // Check login status
updateAuthMenu()          // Update navbar based on login
updateCartCount()         // Refresh cart count
formatCurrency()          // Format price display
validateEmail()           // Email validation
addToCartProduct()        // Add item to cart
loadCart()               // Load and display cart
loadOrders()             // Load and display orders
```

---

## FEATURES NOT INCLUDED (Beyond Scope)

- Image upload functionality
- Payment gateway integration
- Admin dashboard
- Email notifications
- Real-time order tracking (SMS)
- Product reviews and ratings
- Wishlist functionality
- Coupon/discount codes
- User profile editing
- Forgotten password recovery

---

## CODE QUALITY & BEST PRACTICES

✅ **Implemented:**
- Prepared statements for SQL injection prevention
- Password hashing with bcrypt
- Proper error handling and validation
- Clear function documentation
- Responsive mobile-first design
- Modular code organization
- Database transactions for order creation
- XSS protection with proper output handling

---

## LEARNING OUTCOMES

After completing this project, you will understand:
1. **Full-stack architecture** - Frontend, backend, database integration
2. **User authentication** - Session management and security
3. **Database design** - Normalization, relationships, constraints
4. **CRUD operations** - Create, Read, Update, Delete patterns
5. **API design** - RESTful endpoints and data formats
6. **Frontend-backend communication** - AJAX and fetch API
7. **Responsive design** - Mobile-first CSS approach
8. **Form validation** - Client and server-side validation
9. **Security** - Best practices for web applications
10. **Git workflow** - Version control and project management

---

## FURTHER ENHANCEMENTS

Ideas to extend this project:
1. Add payment gateway (Stripe, Razorpay)
2. Implement email notifications (PHPMailer)
3. Create admin dashboard for product management
4. Add product search and advanced filters
5. Implement user reviews and ratings
6. Add wishlist feature
7. User profile management
8. Coupon/discount code system
9. Real-time notifications with WebSockets
10. Mobile app version with React Native

---

## FILE STRUCTURE REFERENCE

```
Online Grocery/
├── Database Operations: backend/includes/
│   ├── Database: database/grocery_store.sql
│   └── Config: backend/includes/config.php
│
├── User Management: backend/auth_api.php
├── Product Management: backend/product_api.php
├── Cart Management: backend/product_api.php
├── Order Management: backend/order_api.php
│
├── HTML Pages: frontend/*.html
├── CSS Styling: css/style.css
├── JavaScript: js/main.js
│
└── Documentation: This README.md
```

---

## CREDITS

**Project Type:** College Mini Project - Full Stack Development  
**Difficulty Level:** Beginner to Intermediate  
**Estimated Development Time:** 20-30 hours  
**Best Suited For:** BCA/B.Tech CS Students  

---

## LICENSE

This project is provided for educational purposes. Feel free to use, modify, and distribute for learning.

---

## CONTACT & SUPPORT

For issues or questions:
1. Check the Troubleshooting section
2. Verify all files are in correct locations
3. Check browser console for JavaScript errors
4. Check phpMyAdmin for database status

---

**Last Updated:** March 2026  
**Project Status:** Complete and Ready for Submission
