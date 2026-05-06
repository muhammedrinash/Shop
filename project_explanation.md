# VILUXE — Full-Stack E-Commerce Application

## 1. Project Overview

**VILUXE** is a full-stack e-commerce web application built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js). It allows users to browse products, add them to cart, place orders, and track order status. It also has a complete Admin Dashboard for managing products, orders, and users.

**Live URL:** Deployed on **Vercel**
**GitHub:** https://github.com/muhammedrinash/Shop

---

## 2. Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19 | Building the user interface (UI) as reusable components |
| **Build Tool** | Vite 8 | Fast development server and production bundler |
| **Styling** | Tailwind CSS 4 | Utility-first CSS framework for styling |
| **Icons** | Lucide React | Beautiful open-source icon library |
| **HTTP Client** | Axios | Making API calls from frontend to backend |
| **Routing** | React Router DOM 7 | Client-side page navigation (SPA) |
| **Backend** | Node.js + Express 5 | REST API server |
| **Database** | MongoDB (via Mongoose 9) | NoSQL database for storing all data |
| **Authentication** | JWT (JSON Web Tokens) | Secure user login sessions |
| **Password Hashing** | bcrypt.js | Encrypting passwords before storing |
| **Deployment** | Vercel | Hosting both frontend and backend |

---

## 3. Project Folder Structure

```
Shop/
├── Backend/                    ← Node.js API Server
│   ├── config/
│   │   └── db.js               ← MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   ← Register & Login logic
│   │   ├── orderController.js  ← Create & Get orders
│   │   ├── cartController.js   ← Get & Update cart
│   │   └── adminController.js  ← Admin CRUD operations
│   ├── middleware/
│   │   ├── authMiddleware.js   ← JWT token verification
│   │   └── adminMiddleware.js  ← Admin role check
│   ├── models/
│   │   ├── User.js             ← User schema
│   │   ├── Product.js          ← Product schema
│   │   ├── Order.js            ← Order schema
│   │   └── Cart.js             ← Cart schema
│   ├── routes/
│   │   ├── authRoutes.js       ← /api/auth/*
│   │   ├── orderRoutes.js      ← /api/orders/*
│   │   ├── cartRoutes.js       ← /api/carts/*
│   │   └── adminRoutes.js      ← /api/admin/*
│   ├── server.js               ← Main entry point
│   └── .env                    ← Environment variables
│
├── Frontend/                   ← React Application
│   ├── src/
│   │   ├── Components/
│   │   │   ├── Navbar.jsx      ← Navigation bar
│   │   │   ├── Footer.jsx      ← Page footer
│   │   │   ├── ProductCard.jsx ← Product display card
│   │   │   ├── ProtectedRoute.jsx ← Login guard
│   │   │   └── AdminRoute.jsx  ← Admin guard
│   │   ├── pages/
│   │   │   ├── Home.jsx        ← Landing page
│   │   │   ├── Store.jsx       ← Product listing
│   │   │   ├── SingleProduct.jsx ← Product details
│   │   │   ├── Cart.jsx        ← Shopping cart
│   │   │   ├── Login.jsx       ← User login
│   │   │   ├── Register.jsx    ← User registration
│   │   │   ├── OrderStatus.jsx ← Order tracking
│   │   │   └── AdminDashboard.jsx ← Admin panel
│   │   ├── services/
│   │   │   └── api.js          ← Axios instance with JWT
│   │   ├── App.jsx             ← Main app with routing
│   │   ├── main.jsx            ← Entry point
│   │   └── index.css           ← Global styles
│   └── vite.config.js          ← Vite configuration
│
└── vercel.json                 ← Deployment configuration
```

---

## 4. Backend Explanation (Node.js + Express)

### 4.1 Server Entry Point — `server.js`

This is where the application starts. It does 4 things:
1. **Loads environment variables** from `.env` file (database URL, secrets)
2. **Connects to MongoDB** using the `connectDB()` function
3. **Sets up middleware** — CORS (allows frontend to call backend) and JSON parsing
4. **Registers all routes** — auth, products, orders, carts, admin

```
app.use("/api/auth", ...)     → Login and Register
app.use("/api/products", ...) → Get product list
app.use("/api/orders", ...)   → Create and view orders
app.use("/api/carts", ...)    → Cart persistence
app.use("/api/admin", ...)    → Admin management
```

The server only `app.listen()` locally. On Vercel, it exports the `app` as a serverless function.

### 4.2 Database Connection — `config/db.js`

Uses **Mongoose** to connect to **MongoDB Atlas** (cloud database). The connection string is stored in the `.env` file as `MONGO_URI`.

### 4.3 Database Models (Schemas)

#### User Model — `models/User.js`
| Field | Type | Description |
|-------|------|-------------|
| `name` | String | User's full name |
| `email` | String | Unique email address |
| `password` | String | Hashed password (bcrypt) |
| `isAdmin` | Boolean | Admin role flag (default: false) |
| `timestamps` | Auto | `createdAt` and `updatedAt` |

#### Product Model — `models/Product.js`
| Field | Type | Description |
|-------|------|-------------|
| `name` | String | Product name |
| `price` | Number | Price in dollars |
| `image` | String | Image URL |
| `description` | String | Product description |
| `category` | String | Category (e.g., "electronics") |
| `stock` | Number | Available quantity |

#### Order Model — `models/Order.js`
| Field | Type | Description |
|-------|------|-------------|
| `userId` | ObjectId → User | Reference to who placed the order |
| `customerName` | String | Name pulled from User record |
| `phone` | String | Contact phone |
| `address` | String | Delivery address |
| `items` | Array | List of { productId, name, quantity, price } |
| `totalPrice` | Number | Order total |
| `status` | String | "pending", "completed", or "cancelled" |

#### Cart Model — `models/Cart.js`
| Field | Type | Description |
|-------|------|-------------|
| `cartId` | String | Unique cart identifier (stored in browser) |
| `items` | Array | Cart items with name, price, image, category |

### 4.4 Authentication System

#### How Registration Works (`POST /api/auth/register`):
1. User sends `name`, `email`, `password`
2. Server checks if email already exists
3. Password is **hashed** using `bcrypt.hash(password, 10)` — the `10` is the salt rounds
4. User is saved to MongoDB
5. A **JWT token** is generated with the user's `id` and `isAdmin` status
6. Token + user info is sent back to the frontend

#### How Login Works (`POST /api/auth/login`):
1. User sends `email`, `password`
2. Server finds user by email
3. `bcrypt.compare()` checks if the entered password matches the stored hash
4. If correct, a new JWT token is generated and sent back
5. Frontend stores the token in `localStorage`

#### How JWT Token Protection Works (`authMiddleware.js`):
1. Every protected API request must include: `Authorization: Bearer <token>`
2. Middleware extracts the token from the header
3. `jwt.verify()` decodes it and extracts `userId` and `isAdmin`
4. These are attached to `req.userId` and `req.isAdmin` for use in controllers
5. If token is missing or invalid → 401 Unauthorized

#### How Admin Protection Works (`adminMiddleware.js`):
1. Runs AFTER `authMiddleware` (so we already have `req.isAdmin`)
2. If `req.isAdmin` is false → 403 Forbidden ("Admins only")
3. Admin routes use both middlewares: `router.use(protect, admin)`

### 4.5 API Routes Summary

| Method | Route | Auth? | Description |
|--------|-------|-------|-------------|
| `POST` | `/api/auth/register` | No | Create new account |
| `POST` | `/api/auth/login` | No | Login to account |
| `GET` | `/api/products` | No | Get all products |
| `GET` | `/api/products/:id` | No | Get single product |
| `POST` | `/api/orders` | Yes | Place an order |
| `GET` | `/api/orders` | Yes | Get user's orders |
| `GET` | `/api/carts/:cartId` | No | Get/create cart |
| `POST` | `/api/carts/:cartId` | No | Update cart items |
| `GET` | `/api/admin/stats` | Admin | Dashboard statistics |
| `GET` | `/api/admin/orders` | Admin | All orders |
| `PUT` | `/api/admin/orders/:id/status` | Admin | Update order status |
| `DELETE` | `/api/admin/orders/:id` | Admin | Delete an order |
| `GET` | `/api/admin/users` | Admin | All users |
| `DELETE` | `/api/admin/users/:id` | Admin | Delete a user |
| `POST` | `/api/admin/products` | Admin | Create product |
| `PUT` | `/api/admin/products/:id` | Admin | Update product |
| `DELETE` | `/api/admin/products/:id` | Admin | Delete product |

---

## 5. Frontend Explanation (React)

### 5.1 Entry Point — `main.jsx` → `App.jsx`

`main.jsx` renders `<App />` into the DOM. `App.jsx` is the main component that:
1. Sets up **React Router** for page navigation
2. Manages **cart state** (add, remove, clear items)
3. Syncs cart with the database via API
4. Defines all routes and which ones need login

### 5.2 API Service — `services/api.js`

Creates an **Axios instance** with:
- `baseURL: "/api"` — all requests go to `/api/*`
- **Request interceptor** — automatically attaches JWT token to every request:
  ```js
  config.headers.Authorization = `Bearer ${token}`
  ```
  This means we don't have to manually add the token each time.

### 5.3 Routing & Page Access

| Route | Page | Requires Login? |
|-------|------|----------------|
| `/` | Home | No — public |
| `/store` | Product listing | No — public |
| `/product/:id` | Product details | No — public |
| `/login` | Login page | No |
| `/register` | Register page | No |
| `/cart` | Shopping cart | **Yes** |
| `/orders` | My orders | **Yes** |
| `/admin` | Admin dashboard | **Yes + Admin** |

**Key behavior:** Users can browse the entire store without logging in. When they click "Add to Cart", the app checks if they're logged in. If not, it redirects them to the login page.

### 5.4 Components Explained

#### `Navbar.jsx`
- Top announcement bar ("FREE SHIPPING...")
- Logo + navigation links (Home, Shop, Orders)
- Search bar with real-time filtering
- Login button (when not logged in) / User greeting + Logout (when logged in)
- Cart icon with item count badge
- Mobile responsive hamburger menu
- Category navigation row (Fashion, Electronics, Accessories)

#### `ProductCard.jsx`
- Product image with category badge
- Star rating display
- Product name and price (with original/sale price comparison)
- "Add to Cart" button

#### `Footer.jsx`
- 4-column grid layout: Brand, Shop Links, Help Links, Newsletter
- Copyright and legal links

#### `ProtectedRoute.jsx`
- Wrapper component that checks for JWT token in localStorage
- If no token → redirects to `/login` page
- If token exists → renders the child page

#### `AdminRoute.jsx`
- Checks for token AND `isAdmin` flag
- No token → login page
- Not admin → home page

### 5.5 Pages Explained

#### `Home.jsx` — Landing Page
1. **Hero Slider** — 3 rotating banners with product categories
2. **Features Bar** — Free Shipping, Easy Returns, Secure Payment, 24/7 Support
3. **Shop by Category** — 3 category cards with images (Fashion, Electronics, Accessories)
4. **Trending Products** — Grid of up to 8 products from the database
5. **Promo Banner** — "Get 20% Off Your First Order" CTA
6. **Newsletter** — Email subscription form

#### `Store.jsx` — Product Listing
- Page header with product count
- Real-time **search bar** with clear button
- **Sort dropdown** (Featured, Price Low-High, Price High-Low, Name A-Z)
- Responsive product grid (2/3/4 columns)
- Loading skeleton animation while fetching
- Empty state with clear search button

#### `SingleProduct.jsx` — Product Detail Page
- Breadcrumb navigation (Home > Shop > Product Name)
- Large product image
- Category badge, star rating, review count
- Price with discount and savings badge
- Product description
- Stock status indicator (green/red dot)
- Add to Cart button with "✓ Added!" feedback
- View Cart button
- Guarantees bar (Free Shipping, 30-Day Returns, Secure Payment)
- "You Might Also Like" section with 4 related products

#### `Cart.jsx` — Shopping Cart
- Items list with image, name, category, quantity, price
- Remove item button (trash icon)
- Order summary sidebar with subtotal, shipping, tax, total
- "Proceed to Checkout" button → creates order via API
- Empty cart state with "Continue Shopping" link

#### `Login.jsx` — User Login
- Clean card layout with email + password fields
- Show/hide password toggle
- Error display with red banner
- Loading spinner during authentication
- "Forgot password?" link
- "Create one" link to register page

#### `Register.jsx` — User Registration
- Same clean style as Login
- Name + Email + Password fields
- Terms of Service acknowledgment
- Redirects to home page after registration

#### `OrderStatus.jsx` — Order Tracking
- Lists all orders for the logged-in user
- Each order shows: ID, date, customer name, items, total, status badge
- Status badges: Pending (amber), Completed (green)
- "View Details" opens a modal with full order info

#### `AdminDashboard.jsx` — Admin Panel
- **Sidebar navigation** with tabs: Overview, Orders, Products, Users
- **Overview tab**: 4 stat cards (Revenue, Orders, Products, Users) + Recent Orders table
- **Orders tab**: Full orders table with status dropdown to change status, delete button
- **Products tab**: Product cards grid with Edit/Delete. "Add Product" button opens a modal form
- **Users tab**: Users table with role badge (Admin/User), delete button

---

## 6. How Data Flows (User Journey)

### Browsing Products (No Login)
```
User visits site → React loads Home page
Home.jsx calls API.get("/products") → Backend queries MongoDB
Products returned → Displayed as ProductCard components
User clicks product → SingleProduct.jsx loads with API.get("/products/:id")
```

### Adding to Cart (Login Required)
```
User clicks "Add to Cart" → App.jsx checks localStorage for token
❌ No token → window.location.href = "/login"
✅ Has token → Item added to cart state + synced to MongoDB via API.post("/carts/:cartId")
```

### Placing an Order
```
User goes to /cart → Cart page loads items from state
User clicks "Proceed to Checkout" → API.post("/orders", orderData)
Backend authMiddleware verifies JWT → orderController creates Order in MongoDB
Success → Cart cleared, order saved
User goes to /orders → API.get("/orders") returns their orders
```

### Admin Managing Products
```
Admin logs in (isAdmin: true) → AdminRoute allows access to /admin
AdminDashboard loads → API calls to /api/admin/stats, /orders, /users, /products
Admin can: Create/Edit/Delete products, Update order status, Delete users
All admin routes protected by authMiddleware + adminMiddleware
```

---

## 7. Security Features

| Feature | Implementation |
|---------|---------------|
| **Password Hashing** | bcrypt with 10 salt rounds — passwords are never stored in plain text |
| **JWT Authentication** | Tokens expire after 7 days, contain user ID and admin flag |
| **Protected Routes** | Frontend: ProtectedRoute/AdminRoute components. Backend: auth/admin middleware |
| **Role-Based Access** | `isAdmin` flag controls admin panel access on both frontend and backend |
| **CORS** | Configured to allow cross-origin requests |

---

## 8. Deployment (Vercel)

The `vercel.json` file configures how the app is deployed:

```json
{
  "builds": [
    { "src": "Backend/server.js", "use": "@vercel/node" },        ← Backend as serverless function
    { "src": "Frontend/package.json", "use": "@vercel/static-build" } ← Frontend as static files
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "Backend/server.js" },  ← API calls go to backend
    { "src": "/(.*)", "dest": "Frontend/$1" }              ← Everything else goes to frontend
  ]
}
```

**How it works:**
- Frontend is built with `vite build` → outputs static HTML/CSS/JS to `dist/`
- Backend runs as a **serverless function** (no always-running server)
- When user visits the site → gets the React frontend
- When frontend makes API calls to `/api/*` → routed to the backend function

---

## 9. Key Concepts Used

| Concept | Where Used |
|---------|-----------|
| **MERN Stack** | MongoDB + Express + React + Node.js |
| **REST API** | Backend follows RESTful conventions (GET, POST, PUT, DELETE) |
| **SPA (Single Page Application)** | React Router handles navigation without page reload |
| **JWT Authentication** | Stateless token-based auth (no sessions) |
| **MVC Pattern** | Models (schemas) → Controllers (logic) → Routes (endpoints) |
| **Component-Based Architecture** | React UI split into reusable components |
| **Client-Side Routing** | React Router DOM manages page navigation |
| **Responsive Design** | Tailwind CSS breakpoints (sm, md, lg) for mobile/tablet/desktop |
| **Environment Variables** | `.env` file for secrets, `import.meta.env` for frontend |
| **Serverless Deployment** | Vercel deploys backend as serverless functions |
| **State Management** | React useState + prop drilling for cart state |
| **MongoDB Aggregation** | `Order.aggregate()` used to calculate total revenue in admin stats |
