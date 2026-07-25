import React, { useState } from 'react';
import { X, Plus, Minus, Heart, ArrowRight, ShieldCheck, MapPin, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { createOrderAPI } from '../services/api';
import confetti from 'canvas-confetti';

export default function CartDrawer({ setViewMode }) {
  const {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    clearCart,
    itemTotal,
    deliveryFee,
    handlingFee,
    tipAmount,
    setTipAmount,
    grandTotal,
    deliveryAddress,
    setDeliveryAddress,
    setActiveOrder
  } = useCart();

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('UPI Instant');

  if (!isCartOpen) return null;

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    setIsPlacingOrder(true);
    try {
      const orderPayload = {
        items: cartItems.map(i => ({
          product: i.name,
          price: i.discountPrice || i.price,
          quantity: i.quantity,
          image: i.image
        })),
        totalAmount: grandTotal,
        deliveryFee,
        tip: tipAmount,
        handlingFee,
        address: deliveryAddress,
        paymentMethod,
        customerName: 'Rahul Sharma',
        phone: '+91 98765 43210'
      };

      const newOrder = await createOrderAPI(orderPayload);

      // Trigger Confetti Celebration
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      setActiveOrder(newOrder);
      clearCart();
      setIsCartOpen(false);
      setViewMode('tracker');
    } catch (error) {
      alert('Order placement error. Please ensure backend is running.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  return (
    <div className="cart-overlay" onClick={() => setIsCartOpen(false)}>
      <div className="cart-drawer" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-title">
            🛒 My NexCart
          </div>
          <button className="close-btn" onClick={() => setIsCartOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="drawer-body">
          {cartItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🧺</div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', marginBottom: '8px' }}>
                Your Basket is Empty
              </h3>
              <p style={{ fontSize: '14px' }}>Add fresh fruits, veggies, and daily snacks to start your 10-minute delivery!</p>
            </div>
          ) : (
            <>
              {/* Delivery Address Banner */}
              <div style={{
                background: '#ecfdf5',
                border: '1px solid #a7f3d0',
                borderRadius: '12px',
                padding: '12px',
                marginBottom: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <MapPin size={18} className="text-emerald-600" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '12px', fontWeight: 800, color: '#047857' }}>Delivering to Home</div>
                  <input
                    type="text"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'transparent',
                      border: 'none',
                      fontSize: '12px',
                      color: '#064e3b',
                      fontWeight: 600,
                      outline: 'none'
                    }}
                  />
                </div>
              </div>

              {/* Items List */}
              <div className="cart-items">
                {cartItems.map((item) => (
                  <div key={item._id} className="cart-item">
                    <img src={item.image} alt={item.name} className="cart-item-img" />
                    <div className="cart-item-info">
                      <div className="cart-item-title">{item.name}</div>
                      <div className="cart-item-price">₹{item.discountPrice} / {item.unit}</div>
                    </div>
                    <div className="qty-counter">
                      <button className="qty-btn" onClick={() => removeFromCart(item._id)}>
                        <Minus size={12} />
                      </button>
                      <span>{item.quantity}</span>
                      <button className="qty-btn" onClick={() => addToCart(item)}>
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Delivery Tip Section */}
              <div className="tip-section">
                <div className="tip-title">
                  ❤️ Tip your delivery partner (100% goes to them)
                </div>
                <div className="tip-options">
                  {[10, 20, 30, 50].map((amount) => (
                    <button
                      key={amount}
                      className={`tip-btn ${tipAmount === amount ? 'active' : ''}`}
                      onClick={() => setTipAmount(amount)}
                    >
                      ₹{amount}
                    </button>
                  ))}
                </div>
              </div>

              {/* Payment Mode Selector */}
              <div style={{ margin: '16px 0' }}>
                <div style={{ fontSize: '13px', fontWeight: '700', marginBottom: '8px', color: '#0f172a' }}>
                  Select Payment Method
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['UPI Instant', 'Card', 'Cash on Delivery'].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setPaymentMethod(mode)}
                      style={{
                        flex: 1,
                        padding: '8px',
                        borderRadius: '8px',
                        border: paymentMethod === mode ? '2px solid #10b981' : '1px solid #e2e8f0',
                        background: paymentMethod === mode ? '#ecfdf5' : 'white',
                        fontSize: '12px',
                        fontWeight: '700',
                        cursor: 'pointer'
                      }}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bill Details Breakdown */}
              <div className="bill-details">
                <div style={{ fontWeight: '800', fontSize: '14px', marginBottom: '10px', color: '#0f172a' }}>
                  Bill Breakdown
                </div>
                <div className="bill-row">
                  <span>Item Total</span>
                  <span>₹{itemTotal}</span>
                </div>
                <div className="bill-row">
                  <span>Delivery Fee</span>
                  <span>{deliveryFee === 0 ? <strong style={{ color: '#10b981' }}>FREE</strong> : `₹${deliveryFee}`}</span>
                </div>
                <div className="bill-row">
                  <span>Handling Charge</span>
                  <span>₹{handlingFee}</span>
                </div>
                <div className="bill-row">
                  <span>Partner Tip</span>
                  <span>₹{tipAmount}</span>
                </div>
                <div className="bill-row total">
                  <span>To Pay</span>
                  <span>₹{grandTotal}</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer */}
        {cartItems.length > 0 && (
          <div className="drawer-footer">
            <button
              className="checkout-btn"
              onClick={handleCheckout}
              disabled={isPlacingOrder}
            >
              <div>
                <div style={{ fontSize: '12px', opacity: 0.9 }}>TOTAL: ₹{grandTotal}</div>
                <div>Proceed to Pay</div>
              </div>
              <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
