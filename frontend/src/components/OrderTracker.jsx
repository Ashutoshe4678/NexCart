import React, { useState, useEffect } from 'react';
import { CheckCircle2, Clock, MapPin, Package, Bike, Home, ArrowLeft, UserCheck, Navigation, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { updateOrderStatusAPI, updateRiderLocationAPI } from '../services/api';

export default function OrderTracker({ setViewMode }) {
  const { activeOrder, setActiveOrder, userRole } = useCart();
  const [secondsLeft, setSecondsLeft] = useState(600); // 10 minutes
  const [distanceKm, setDistanceKm] = useState(2.4);

  useEffect(() => {
    if (!activeOrder) return;

    // Timer Countdown
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    // Live GPS Distance Ticker simulation for 'out_for_delivery'
    const gpsInterval = setInterval(() => {
      if (activeOrder.status === 'out_for_delivery') {
        setDistanceKm(prev => {
          if (prev <= 0.2) return 0.2;
          const next = parseFloat((prev - 0.3).toFixed(1));
          updateRiderLocationAPI(activeOrder.orderId, next);
          return next;
        });
      }
    }, 4000);

    return () => {
      clearInterval(timer);
      clearInterval(gpsInterval);
    };
  }, [activeOrder]);

  if (!activeOrder) {
    return (
      <div className="main-container" style={{ textAlign: 'center', padding: '80px 20px' }}>
        <h2>No Active Order</h2>
        <p style={{ color: '#64748b', margin: '12px 0 24px' }}>Place an order from the store to track real-time delivery!</p>
        <button
          className="cart-button"
          style={{ margin: '0 auto' }}
          onClick={() => setViewMode('store')}
        >
          Browse Store
        </button>
      </div>
    );
  }

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // 5-Stage Professional Order Timeline
  const steps = [
    { id: 'placed', label: 'Order Placed', icon: CheckCircle2 },
    { id: 'packing', label: 'Packed at Dark Store', icon: Package },
    { id: 'rider_assigned', label: 'Rider Assigned', icon: UserCheck },
    { id: 'out_for_delivery', label: 'Out for Delivery', icon: Bike },
    { id: 'delivered', label: 'Delivered', icon: Home }
  ];

  const currentStatus = activeOrder.status || 'placed';

  const getStepStatus = (stepId) => {
    const orderIndex = steps.findIndex(s => s.id === currentStatus);
    const stepIndex = steps.findIndex(s => s.id === stepId);
    if (stepIndex < orderIndex) return 'completed';
    if (stepIndex === orderIndex) return 'active';
    return 'pending';
  };

  const getDistanceDisplay = () => {
    if (currentStatus === 'delivered') return '0 m (Arrived at Doorstep)';
    if (currentStatus === 'placed' || currentStatus === 'packing') return 'Preparing at Dark Store (2.4 km)';
    if (currentStatus === 'rider_assigned') return 'Rider arriving at store (2.4 km)';
    if (distanceKm <= 0.2) return '800 m (Reaching in 1 min)';
    return `${distanceKm} km away`;
  };

  return (
    <div className="main-container">
      <button
        onClick={() => setViewMode('store')}
        style={{
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontWeight: '700',
          color: '#10b981',
          margin: '20px 0 10px'
        }}
      >
        <ArrowLeft size={18} /> Back to Shopping
      </button>

      <div className="tracker-card">
        {/* Header */}
        <div className="tracker-header">
          <div>
            <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>
              ORDER ID: {activeOrder.orderId}
            </div>
            <h2 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a' }}>
              {currentStatus === 'delivered' ? '🎉 Order Delivered!' : '⚡ Express 10-Minute Delivery'}
            </h2>
          </div>
          <div className="eta-timer">
            <Clock size={22} />
            <span>{currentStatus === 'delivered' ? '00:00' : formatTime(secondsLeft)}</span>
          </div>
        </div>

        {/* 5-Stage Timeline */}
        <div className="timeline" style={{ margin: '36px 0' }}>
          {steps.map((st) => {
            const Icon = st.icon;
            const statusClass = getStepStatus(st.id);
            return (
              <div key={st.id} className={`timeline-step ${statusClass}`}>
                <div className="step-icon">
                  <Icon size={18} />
                </div>
                <div className="step-label" style={{ fontSize: '11px', textAlign: 'center' }}>{st.label}</div>
              </div>
            );
          })}
        </div>

        {/* Live GPS Distance Radar Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          color: 'white',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '24px',
          boxShadow: 'var(--shadow-md)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                background: '#10b981',
                width: '42px',
                height: '42px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 0 6px rgba(16, 185, 129, 0.3)'
              }}>
                <Navigation size={22} className="text-white animate-pulse" />
              </div>
              <div>
                <div style={{ fontSize: '12px', opacity: 0.8, fontWeight: '700' }}>LIVE RIDER GPS TRACKING</div>
                <div style={{ fontSize: '20px', fontWeight: '800' }}>{getDistanceDisplay()}</div>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', opacity: 0.8 }}>ESTIMATED ETA</div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#34d399' }}>
                {currentStatus === 'delivered' ? 'Arrived' : '6 Mins'}
              </div>
            </div>
          </div>
        </div>

        {/* Rider Info Card */}
        <div style={{
          background: '#f8fafc',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          padding: '16px 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: '#10b981',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: '800',
              fontSize: '18px'
            }}>
              VK
            </div>
            <div>
              <div style={{ fontWeight: '800', fontSize: '15px' }}>
                {activeOrder.riderName || 'Vikram Kumar'} (NexCart Partner)
              </div>
              <div style={{ fontSize: '13px', color: '#64748b' }}>
                ⚡ EV Scooter | {activeOrder.riderPhone || '+91 98112 33445'}
              </div>
            </div>
          </div>

          <div style={{
            background: '#ecfdf5',
            color: '#047857',
            padding: '6px 12px',
            borderRadius: '9999px',
            fontSize: '12px',
            fontWeight: '800'
          }}>
            4.9 ★ Partner
          </div>
        </div>

        {/* Ordered Items Summary */}
        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
          <h4 style={{ fontSize: '15px', fontWeight: '800', marginBottom: '12px' }}>Items in this basket</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {activeOrder.items?.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                <div>
                  <strong>{item.quantity}x</strong> {item.product}
                </div>
                <div style={{ fontWeight: '700' }}>₹{item.price * item.quantity}</div>
              </div>
            ))}
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '16px',
            fontWeight: '800',
            borderTop: '1px dashed #cbd5e1',
            marginTop: '16px',
            paddingTop: '12px'
          }}>
            <span>Total Paid</span>
            <span style={{ color: '#10b981' }}>₹{activeOrder.totalAmount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
