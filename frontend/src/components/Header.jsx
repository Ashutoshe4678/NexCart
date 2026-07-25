import React from 'react';
import { ShoppingBag, Search, MapPin, Zap, Shield, User, Bike, Store, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Header({ searchQuery, setSearchQuery, viewMode, setViewMode }) {
  const { totalItemCount, grandTotal, setIsCartOpen, deliveryAddress, activeOrder, userRole, setUserRole } = useCart();

  const handleRoleChange = (role) => {
    setUserRole(role);
    if (role === 'Store Admin' || role === 'Super Admin') {
      setViewMode('admin');
    } else if (role === 'Delivery Partner') {
      setViewMode('rider');
    } else {
      setViewMode('store');
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        {/* Brand Logo */}
        <div className="logo-area" onClick={() => { setUserRole('Customer'); setViewMode('store'); }}>
          <div className="brand-icon">⚡</div>
          <div className="brand-title">
            Snap<span>Basket</span>
          </div>
        </div>

        {/* 10 Min Delivery Badge */}
        <div className="delivery-badge">
          <Zap size={14} className="fill-amber-500 text-amber-500" />
          <span>Delivery in 10 Mins</span>
        </div>

        {/* Address Selector */}
        <div className="address-selector" title="Change Address">
          <MapPin size={16} className="text-emerald-600" />
          <div>
            <strong style={{ display: 'block', fontSize: '12px' }}>Home</strong>
            <span style={{ fontSize: '12px', color: '#64748b' }}>{deliveryAddress}</span>
          </div>
        </div>

        {/* Instant Search Bar */}
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search 'milk', 'bananas', 'chips', 'paneer'..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Role Switcher Pill Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: '#f1f5f9',
          padding: '3px',
          borderRadius: '9999px',
          border: '1px solid #e2e8f0'
        }}>
          {[
            { id: 'Customer', icon: User, label: 'Customer' },
            { id: 'Store Admin', icon: Store, label: 'Admin' },
            { id: 'Delivery Partner', icon: Bike, label: 'Rider' },
            { id: 'Super Admin', icon: ShieldCheck, label: 'Super' }
          ].map(r => {
            const Icon = r.icon;
            const isActive = userRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => handleRoleChange(r.id)}
                style={{
                  background: isActive ? '#0f172a' : 'transparent',
                  color: isActive ? 'white' : '#64748b',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon size={13} />
                <span>{r.label}</span>
              </button>
            );
          })}
        </div>

        {/* Navigation & Cart Button */}
        <div className="nav-actions">
          {activeOrder && (
            <button
              className={`admin-toggle-btn ${viewMode === 'tracker' ? 'active' : ''}`}
              onClick={() => setViewMode('tracker')}
            >
              🚀 Live Order
            </button>
          )}

          <button className="cart-button" onClick={() => setIsCartOpen(true)}>
            <ShoppingBag size={18} />
            <span>{totalItemCount > 0 ? `${totalItemCount} Items` : 'My Cart'}</span>
            {grandTotal > 0 && <span style={{ opacity: 0.9 }}>| ₹{grandTotal}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}
