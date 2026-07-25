import React, { useState, useEffect } from 'react';
import { fetchOrdersAPI, updateOrderStatusAPI, assignRiderAPI, createProductAPI } from '../services/api';
import { PlusCircle, RefreshCw, UserCheck, Shield, Store, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function AdminDashboard() {
  const { userRole } = useCart();
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [selectedRiders, setSelectedRiders] = useState({});

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Fruits & Vegetables',
    price: '',
    discountPrice: '',
    unit: '500g',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80',
    inStock: 50
  });

  const loadOrders = async () => {
    setIsLoading(true);
    const data = await fetchOrdersAPI();
    setOrders(data);
    setIsLoading(false);
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatusAPI(orderId, newStatus, userRole);
      loadOrders();
    } catch (err) {
      alert(err.response?.data?.message || 'Permission denied for this operation');
    }
  };

  const handleAssignRiderSubmit = async (orderId) => {
    const riderName = selectedRiders[orderId] || 'Vikram Kumar';
    try {
      await assignRiderAPI(orderId, riderName);
      loadOrders();
    } catch (err) {
      alert('Rider assignment error: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleAddProductSubmit = async (e) => {
    e.preventDefault();
    try {
      await createProductAPI(newProduct);
      alert('⚡ Product added successfully to Dark Store catalog!');
      setShowAddProduct(false);
      setNewProduct({
        name: '',
        category: 'Fruits & Vegetables',
        price: '',
        discountPrice: '',
        unit: '500g',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80',
        inStock: 50
      });
    } catch (err) {
      alert('Failed to add product');
    }
  };

  const totalRevenue = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
  const activeCount = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length;

  return (
    <div className="main-container" style={{ paddingTop: '30px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '800' }}>🛠️ NexCart Store Operations</h2>
            <span style={{
              background: '#0f172a',
              color: 'white',
              fontSize: '11px',
              fontWeight: '800',
              padding: '3px 8px',
              borderRadius: '6px'
            }}>
              ROLE: {userRole.toUpperCase()}
            </span>
          </div>
          <p style={{ color: '#64748b', fontSize: '14px' }}>
            {userRole === 'Store Admin' ? 'Pack items & assign delivery riders. (Delivery completion reserved for Rider).' : 'Full Super Admin access.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={loadOrders} className="admin-toggle-btn" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <RefreshCw size={14} /> Refresh Stream
          </button>
          <button onClick={() => setShowAddProduct(!showAddProduct)} className="cart-button" style={{ borderRadius: '12px', padding: '8px 16px' }}>
            <PlusCircle size={18} /> Add Catalog Item
          </button>
        </div>
      </div>

      {/* Analytics KPI Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <div style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '700' }}>Total Orders</div>
          <div style={{ fontSize: '26px', fontWeight: '800', marginTop: '4px' }}>{orders.length}</div>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '700' }}>Active Deliveries</div>
          <div style={{ fontSize: '26px', fontWeight: '800', marginTop: '4px', color: '#f59e0b' }}>{activeCount}</div>
        </div>
        <div style={{ background: 'white', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <div style={{ fontSize: '13px', color: '#64748b', fontWeight: '700' }}>Total Store Revenue</div>
          <div style={{ fontSize: '26px', fontWeight: '800', marginTop: '4px', color: '#10b981' }}>₹{totalRevenue}</div>
        </div>
      </div>

      {/* Add Product Modal Form */}
      {showAddProduct && (
        <form onSubmit={handleAddProductSubmit} style={{
          background: 'white',
          padding: '24px',
          borderRadius: '16px',
          border: '1px solid #10b981',
          marginBottom: '28px',
          boxShadow: 'var(--shadow-md)'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>✨ Add New Item to Dark Store</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700 }}>Item Name</label>
              <input type="text" required placeholder="e.g. Organic Avocado" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px' }} />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700 }}>Category</label>
              <select value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px' }}>
                <option value="Fruits & Vegetables">Fruits & Vegetables</option>
                <option value="Dairy & Bakery">Dairy & Bakery</option>
                <option value="Munchies & Snacks">Munchies & Snacks</option>
                <option value="Cold Drinks & Juices">Cold Drinks & Juices</option>
                <option value="Instant & Frozen">Instant & Frozen</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700 }}>MRP Price (₹)</label>
              <input type="number" required placeholder="100" value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px' }} />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 700 }}>Discount Price (₹)</label>
              <input type="number" required placeholder="80" value={newProduct.discountPrice} onChange={e => setNewProduct({ ...newProduct, discountPrice: e.target.value })} style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', marginTop: '4px' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button type="submit" className="add-btn" style={{ background: '#10b981', color: 'white', padding: '10px 20px' }}>Save Product</button>
            <button type="button" onClick={() => setShowAddProduct(false)} className="admin-toggle-btn">Cancel</button>
          </div>
        </form>
      )}

      {/* Orders Stream Table */}
      <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '16px' }}>📦 Live Order Fulfillment Workflow</h3>
      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        {orders.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#64748b' }}>No orders placed yet.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '14px 18px' }}>Order ID</th>
                <th style={{ padding: '14px 18px' }}>Customer</th>
                <th style={{ padding: '14px 18px' }}>Items</th>
                <th style={{ padding: '14px 18px' }}>Status</th>
                <th style={{ padding: '14px 18px' }}>Assigned Rider</th>
                <th style={{ padding: '14px 18px' }}>Store Admin Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.orderId || o._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 18px', fontWeight: '800' }}>{o.orderId}</td>
                  <td style={{ padding: '14px 18px' }}>{o.customerName || 'Rahul'}</td>
                  <td style={{ padding: '14px 18px' }}>{o.items?.length || 0} items (₹{o.totalAmount})</td>
                  <td style={{ padding: '14px 18px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '9999px',
                      fontSize: '12px',
                      fontWeight: '800',
                      background: o.status === 'delivered' ? '#ecfdf5' : '#fffbeb',
                      color: o.status === 'delivered' ? '#047857' : '#b45309'
                    }}>
                      {o.status.replace(/_/g, ' ').toUpperCase()}
                    </span>
                  </td>

                  <td style={{ padding: '14px 18px' }}>
                    {o.riderName ? (
                      <strong style={{ color: '#0f172a', fontSize: '13px' }}>🛵 {o.riderName}</strong>
                    ) : (
                      <span style={{ color: '#94a3b8', fontSize: '12px' }}>Unassigned</span>
                    )}
                  </td>

                  <td style={{ padding: '14px 18px' }}>
                    {o.status === 'placed' && (
                      <button
                        onClick={() => handleStatusChange(o.orderId || o._id, 'packing')}
                        style={{ background: '#3b82f6', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                      >
                        📦 Move to Packing
                      </button>
                    )}

                    {o.status === 'packing' && (
                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <select
                          value={selectedRiders[o.orderId || o._id] || 'Vikram Kumar'}
                          onChange={(e) => setSelectedRiders({ ...selectedRiders, [o.orderId || o._id]: e.target.value })}
                          style={{ padding: '6px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '12px' }}
                        >
                          <option value="Vikram Kumar">Vikram Kumar (EV Scooter)</option>
                          <option value="Amit Singh">Amit Singh (EV Bike)</option>
                          <option value="Priya Verma">Priya Verma (EV Scooter)</option>
                        </select>

                        <button
                          onClick={() => handleAssignRiderSubmit(o.orderId || o._id)}
                          style={{ background: '#10b981', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                        >
                          Assign Rider ➔
                        </button>
                      </div>
                    )}

                    {o.status === 'rider_assigned' && (
                      <span style={{ fontSize: '12px', color: '#64748b' }}>
                        Waiting for Rider Pick Up...
                      </span>
                    )}

                    {o.status === 'out_for_delivery' && (
                      <span style={{ fontSize: '12px', color: '#f59e0b', fontWeight: '700' }}>
                        🛵 Rider on the way (Rider Action Only)
                      </span>
                    )}

                    {o.status === 'delivered' && (
                      <span style={{ fontSize: '12px', color: '#10b981', fontWeight: '700' }}>
                        ✓ Delivered by {o.riderName || 'Rider'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
