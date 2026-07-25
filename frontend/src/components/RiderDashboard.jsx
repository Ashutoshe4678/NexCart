import React, { useState, useEffect } from 'react';
import { fetchOrdersAPI, updateOrderStatusAPI, updateRiderLocationAPI } from '../services/api';
import { Bike, Navigation, CheckCircle, Package, MapPin, AlertCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function RiderDashboard() {
  const { userRole, setActiveOrder } = useCart();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadOrders = async () => {
    setIsLoading(true);
    const data = await fetchOrdersAPI();
    setOrders(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStartDelivery = async (orderId) => {
    try {
      const updated = await updateOrderStatusAPI(orderId, 'out_for_delivery', userRole);
      setActiveOrder(updated);
      loadOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Permission denied');
    }
  };

  const handleMarkDelivered = async (orderId) => {
    try {
      const updated = await updateOrderStatusAPI(orderId, 'delivered', userRole);
      setActiveOrder(updated);
      loadOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Permission denied');
    }
  };

  const handleSimulateGPS = async (orderId, km) => {
    await updateRiderLocationAPI(orderId, km);
    loadOrders();
  };

  // Filter deliveries assigned to or ready for delivery partner
  const riderDeliveries = orders.filter(o =>
    o.status === 'rider_assigned' || o.status === 'out_for_delivery' || o.status === 'delivered'
  );

  return (
    <div className="main-container" style={{ paddingTop: '30px' }}>
      <div style={{
        background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
        color: 'white',
        padding: '24px',
        borderRadius: '16px',
        marginBottom: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div>
          <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '9999px', fontSize: '12px', fontWeight: '800' }}>
            🏍️ RIDER PARTNER PORTAL
          </span>
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginTop: '6px' }}>Delivery Partner Console</h2>
          <p style={{ opacity: 0.9, fontSize: '14px' }}>Logged in as: <strong>Vikram Kumar</strong> (EV Scooter Rider)</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '13px', opacity: 0.9 }}>Active Assigned Runs</div>
          <div style={{ fontSize: '28px', fontWeight: '800' }}>
            {riderDeliveries.filter(o => o.status !== 'delivered').length}
          </div>
        </div>
      </div>

      <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>📦 Delivery Tasks</h3>

      {riderDeliveries.length === 0 ? (
        <div style={{ background: 'white', padding: '40px', borderRadius: '16px', textAlign: 'center', color: '#64748b', border: '1px solid #e2e8f0' }}>
          No active delivery runs assigned yet. Store Admin will assign orders here!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {riderDeliveries.map((order) => (
            <div key={order.orderId || order._id} style={{
              background: 'white',
              borderRadius: '16px',
              border: '1px solid #e2e8f0',
              padding: '20px',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div>
                  <div style={{ fontSize: '12px', color: '#64748b', fontWeight: '700' }}>ORDER ID: {order.orderId}</div>
                  <div style={{ fontSize: '16px', fontWeight: '800' }}>Customer: {order.customerName || 'Rahul Sharma'}</div>
                </div>

                <span style={{
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: '800',
                  background: order.status === 'delivered' ? '#ecfdf5' : '#fffbeb',
                  color: order.status === 'delivered' ? '#047857' : '#b45309'
                }}>
                  {order.status.replace(/_/g, ' ').toUpperCase()}
                </span>
              </div>

              <div style={{ fontSize: '13px', color: '#475569', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={16} className="text-emerald-600" />
                <span><strong>Address:</strong> {order.address}</span>
              </div>

              {/* Action Buttons specific to Rider Role */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #f1f5f9', paddingTop: '14px' }}>
                <div style={{ fontSize: '14px', fontWeight: '800', color: '#10b981' }}>
                  Collect ₹{order.totalAmount} ({order.paymentMethod})
                </div>

                <div style={{ display: 'flex', gap: '10px' }}>
                  {order.status === 'rider_assigned' && (
                    <button
                      onClick={() => handleStartDelivery(order.orderId || order._id)}
                      style={{ background: '#f59e0b', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: '800', fontSize: '13px', cursor: 'pointer' }}
                    >
                      🚀 Pick Up & Start Delivery
                    </button>
                  )}

                  {order.status === 'out_for_delivery' && (
                    <>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        {[1.8, 0.8, 0.2].map(km => (
                          <button
                            key={km}
                            onClick={() => handleSimulateGPS(order.orderId || order._id, km)}
                            style={{ background: '#f1f5f9', border: '1px solid #cbd5e1', padding: '6px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
                          >
                            📍 {km} km
                          </button>
                        ))}
                      </div>

                      <button
                        onClick={() => handleMarkDelivered(order.orderId || order._id)}
                        style={{ background: '#10b981', color: 'white', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: '800', fontSize: '13px', cursor: 'pointer' }}
                      >
                        🎉 Confirm Handover & Deliver
                      </button>
                    </>
                  )}

                  {order.status === 'delivered' && (
                    <span style={{ fontSize: '13px', fontWeight: '800', color: '#10b981' }}>
                      ✓ Successfully Delivered
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
