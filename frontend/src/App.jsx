import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import CategoryNav from './components/CategoryNav';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import OrderTracker from './components/OrderTracker';
import AdminDashboard from './components/AdminDashboard';
import RiderDashboard from './components/RiderDashboard';
import { useCart } from './context/CartContext';
import { fetchProducts } from './services/api';

export default function App() {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState('store'); // 'store' | 'tracker' | 'admin' | 'rider'
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCatalog = async () => {
      setIsLoading(true);
      const data = await fetchProducts(activeCategory, searchQuery);
      setProducts(data);
      setIsLoading(false);
    };

    const timer = setTimeout(() => {
      loadCatalog();
    }, 200);

    return () => clearTimeout(timer);
  }, [activeCategory, searchQuery]);

  return (
    <div className="app">
      {/* Top Header */}
      <Header
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {viewMode === 'store' && (
        <>
          {/* Category Filter Pills */}
          <CategoryNav
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />

          {/* Hero Promo Banner */}
          <div className="promo-banner">
            <div className="banner-card">
              <div className="banner-content">
                <span className="banner-tag">⚡ FLASH SALE • 10 MIN DELIVERY</span>
                <h2>Fresh Groceries at your Doorstep</h2>
                <p>Get up to 40% OFF on Fruits, Vegetables, Dairy & Snacks</p>
              </div>
              <div style={{ fontSize: '64px' }}>🛒</div>
            </div>
          </div>

          {/* Main Product Catalog */}
          <main className="main-container">
            <div className="section-title">
              <div>
                <span>{activeCategory === 'All' ? '⚡ All Essentials' : activeCategory}</span>
                <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500', marginLeft: '10px' }}>
                  ({products.length} items available)
                </span>
              </div>
            </div>

            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>⚡ Loading Fresh Products...</div>
              </div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px', color: '#64748b' }}>
                <div style={{ fontSize: '40px', marginBottom: '8px' }}>🔍</div>
                <h3>No products found</h3>
                <p>Try searching for "Milk", "Banana", "Chips" or "Apples"</p>
              </div>
            ) : (
              <div className="product-grid">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </main>
        </>
      )}

      {viewMode === 'tracker' && <OrderTracker setViewMode={setViewMode} />}
      {viewMode === 'admin' && <AdminDashboard />}
      {viewMode === 'rider' && <RiderDashboard />}

      {/* Cart Drawer */}
      <CartDrawer setViewMode={setViewMode} />
    </div>
  );
}
