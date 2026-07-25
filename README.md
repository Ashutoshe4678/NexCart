# ⚡ SnapBasket - Ultra-Fast 10-Minute Grocery Delivery MERN Application

SnapBasket is a full-stack MERN application built for instant grocery delivery (inspired by Blinkit, Zepto, and Instamart).

## 🚀 Features

- **⚡ Express 10-Min Catalog**: Real-time product browsing across Fruits & Vegetables, Dairy & Bakery, Munchies & Snacks, Cold Drinks & Juices, Instant Meals.
- **🔍 Instant Search & Category Filters**: Search by item names, tags, or filter by category pills.
- **🛒 Dynamic Cart & Tip System**: Slide-out cart drawer, item increment/decrement, tip selection for delivery partners, and bill breakdown.
- **🚀 Live 10-Minute Order Tracker**: Interactive timeline progress bar (Order Confirmed ➔ Packed ➔ Out for Delivery ➔ Delivered) with real-time countdown timer.
- **🛠️ Admin Dashboard**: Manage inventory, add new products with images/prices, view revenue KPIs, and advance order delivery statuses.
- **⚡ Zero-Config Fallback Database**: Built to run with MongoDB / Mongoose or automatic high-speed in-memory database fallback if MongoDB is not running locally.

---

## 📁 Directory Structure

```
C:\Users\ashuk\Downloads\snap basket\
├── backend/
│   ├── config/db.js           # Mongoose DB connector & fallback engine
│   ├── controllers/           # Product & Order business logic
│   ├── models/                # Product & Order schemas
│   ├── routes/                # Express API endpoints
│   ├── data/seedData.js       # Pre-seeded product catalog
│   ├── server.js              # Node/Express API server (Port 5000)
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/        # Header, CategoryNav, ProductCard, CartDrawer, OrderTracker, AdminDashboard
    │   ├── context/           # CartContext state management
    │   ├── services/          # API fetchers (Axios)
    │   ├── styles/            # Glassmorphism & Emerald design system
    │   └── App.jsx
    └── package.json
```

---

## 🛠️ How to Run Locally

### 1. Install Dependencies
```bash
# Terminal 1 (Backend)
cd "C:\Users\ashuk\Downloads\snap basket\backend"
npm install

# Terminal 2 (Frontend)
cd "C:\Users\ashuk\Downloads\snap basket\frontend"
npm install
```

### 2. Start Servers
```bash
# Start Backend API (Port 5000)
cd "C:\Users\ashuk\Downloads\snap basket\backend"
npm start

# Start Frontend App (Port 3000)
cd "C:\Users\ashuk\Downloads\snap basket\frontend"
npm run dev
```

Then open `http://localhost:3000` in your web browser!
