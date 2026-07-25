import React from 'react';
import { ShoppingBag, Search, MapPin, Zap, Shield, User, Bike, Store, ShieldCheck, ShoppingCart } from 'lucide-react';
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
        {/* Fancy Brand Logo - NexCart */}
        <div className="logo-area" onClick={() => { setUserRole('Customer'); setViewMode('store'); }}>
          <div className="brand-icon" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #10b981 100%)', boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)' }}>
            🛒
          </div>
          <div className="brand-title">
            Nex<span style={{ color: '#4f46e5' }}>Cart</span>
          </div>
        </div>

        {/* 10 Min Delivery Badge */}
        <div className="delivery-badge" style={{ background: '#eef2ff', borderColor: '#c7d2fe', color: '#3730a3' }}>
          <Zap size={14} className="fill-indigo-600 text-indigo-600" />
          <span>Delivery in 10 Mins</span>
        </div>

        {/* Address Selector */}
        <div className="address-selector" title="Change Address">
          <MapPin size={16} className="text-indigo-600" />
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
                  background: isActive ? '#4f46e5' : 'transparent',
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

          <button className="cart-button" style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #3730a3 100%)', boxShadow: '0 4px 14px rgba(79, 70, 229, 0.35)' }} onClick={() => setIsCartOpen(true)}>
            <ShoppingBag size={18} />
            <span>{totalItemCount > 0 ? `${totalItemCount} Items` : 'My Cart'}</span>
            {grandTotal > 0 && <span style={{ opacity: 0.9 }}>| ₹{grandTotal}</span>}
          </button>
        </div>
      </div>
    </header>
  );
}
