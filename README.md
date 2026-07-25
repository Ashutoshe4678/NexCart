# 🛒 SnapBasket
### A Full-Stack Grocery Delivery Platform built with the MERN Stack

[![React](https://img.shields.io/badge/Frontend-React%2018-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Server-Express.js-000000?logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

SnapBasket is a modern e-commerce web application inspired by quick-commerce platforms like Blinkit, Zepto, and Instamart. It features role-based workflows for **Customers**, **Store Admins**, and **Delivery Riders**, supported by a strict order status state machine.

---

## 🚀 Live Demo

- **Frontend**: [https://snapbasket.vercel.app](https://snapbasket.vercel.app)
- **Backend API**: [https://snapbasket-api.onrender.com](https://snapbasket-api.onrender.com)

---

## 🛠 Tech Stack

### Frontend
- **Core**: React 18, Vite
- **State Management**: Context API
- **HTTP Client**: Axios
- **Styling**: Vanilla CSS3 (Custom Glassmorphism Design System)
- **Icons & Animations**: Lucide-React, Canvas Confetti

### Backend
- **Environment**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB & Mongoose ORM
- **Engine**: Automated Dual DB Mode (Mongoose + In-Memory Fallback)

---

## ✨ Features

### 👤 Customer
- **Product Catalog**: Browse items across multiple categories (Fruits & Veggies, Dairy & Bakery, Munchies, Drinks, Instant Food).
- **Search & Filters**: Instant real-time keyword search and category pill filtering.
- **Cart Management**: Slide-out cart drawer, quantity adjustment, tip selection, and dynamic bill breakdown.
- **Checkout & Tracking**: Instant checkout and 5-stage order progress timeline.

### 🏬 Store Admin
- **Dark Store Management**: View live order fulfillment stream.
- **Order Packing**: Move incoming orders from `Placed` ➔ `Packing`.
- **Rider Assignment**: Assign available EV riders to packed orders.
- **Inventory Control**: Add new products with pricing, category, and image URLs.
- **Revenue Analytics**: Track total orders, active deliveries, and total store revenue KPIs.

### 🛵 Delivery Partner (Rider)
- **Assigned Deliveries**: Dedicated console displaying assigned delivery tasks.
- **Delivery Control**: Pickup orders (`Rider Assigned` ➔ `Out for Delivery`) and update distance milestones.
- **Handover Confirmation**: Exclusive permission to mark orders as `Delivered`.

### 🛡️ Order State Machine
Enforces strict sequential status transitions:
$$\text{Placed} \longrightarrow \text{Packing} \longrightarrow \text{Rider Assigned} \longrightarrow \text{Out for Delivery} \longrightarrow \text{Delivered}$$

---

## 🏗️ System Architecture

```
[ React Frontend (Vite) ]
         │
         ▼  (Axios REST Requests)
[ Express API Server ]
         │
    ┌────┴──────────────────────────┐
    ▼                               ▼
[ MongoDB Database ]     [ Strict State Machine ]
(Mongoose Schemas)       (RBAC Transition Matrix)
```

---

## 📸 Screenshots

### 1. Storefront & Catalog
![Storefront](https://raw.githubusercontent.com/Ashutoshe4678/Snap-Basket/main/frontend/public/screenshot-store.png)

### 2. Slide-out Cart Drawer
![Cart Drawer](https://raw.githubusercontent.com/Ashutoshe4678/Snap-Basket/main/frontend/public/screenshot-cart.png)

### 3. Live 5-Stage Order Tracking
![Order Tracker](https://raw.githubusercontent.com/Ashutoshe4678/Snap-Basket/main/frontend/public/screenshot-tracker.png)

### 4. Store Admin Dashboard
![Admin Dashboard](https://raw.githubusercontent.com/Ashutoshe4678/Snap-Basket/main/frontend/public/screenshot-admin.png)

### 5. Delivery Partner Console
![Rider Console](https://raw.githubusercontent.com/Ashutoshe4678/Snap-Basket/main/frontend/public/screenshot-rider.png)

---

## 📁 Directory Structure

```
SnapBasket/
├── backend/
│   ├── config/
│   │   └── db.js              # Database connection & fallback engine
│   ├── controllers/
│   │   ├── productController.js
│   │   └── orderController.js # Order processing & state machine
│   ├── models/
│   │   ├── Product.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── productRoutes.js
│   │   └── orderRoutes.js
│   ├── data/
│   │   └── seedData.js        # Seed product catalog
│   └── server.js              # Express server entry point
│
├── frontend/
│   ├── src/
│   │   ├── components/        # Header, ProductCard, CartDrawer, OrderTracker, Admin, Rider
│   │   ├── context/           # CartContext & RBAC state
│   │   ├── services/          # API Axios handlers
│   │   ├── styles/            # Design system CSS
│   │   └── App.jsx
│   ├── index.html
│   └── vite.config.js
│
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Backend Environment Configuration
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/snapbasket
NODE_ENV=development
```

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/Ashutoshe4678/Snap-Basket.git
cd Snap-Basket
```

### 2. Setup & Start Backend
```bash
cd backend
npm install
npm start
```
*Backend runs on `http://localhost:5000`*

### 3. Setup & Start Frontend
```bash
cd ../frontend
npm install
npm run dev
```
*Frontend runs on `http://localhost:3000`*

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
