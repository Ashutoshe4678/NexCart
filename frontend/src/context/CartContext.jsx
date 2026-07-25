import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('snapbasket_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [tipAmount, setTipAmount] = useState(20);
  const [deliveryAddress, setDeliveryAddress] = useState('House #402, Block B, Green Heights');
  const [activeOrder, setActiveOrder] = useState(null);
  const [userRole, setUserRole] = useState('Customer'); // 'Customer' | 'Store Admin' | 'Delivery Partner' | 'Super Admin'

  useEffect(() => {
    localStorage.setItem('snapbasket_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item._id === product._id);
      if (existing) {
        return prev.map(item =>
          item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prev => {
      const existing = prev.find(item => item._id === productId);
      if (existing && existing.quantity > 1) {
        return prev.map(item =>
          item._id === productId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return prev.filter(item => item._id !== productId);
    });
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getItemQuantity = (productId) => {
    const item = cartItems.find(i => i._id === productId);
    return item ? item.quantity : 0;
  };

  const itemTotal = cartItems.reduce((acc, item) => acc + (item.discountPrice || item.price) * item.quantity, 0);
  const totalItemCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const deliveryFee = itemTotal > 299 || itemTotal === 0 ? 0 : 15;
  const handlingFee = itemTotal > 0 ? 5 : 0;
  const grandTotal = itemTotal > 0 ? itemTotal + deliveryFee + handlingFee + tipAmount : 0;

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      clearCart,
      getItemQuantity,
      isCartOpen,
      setIsCartOpen,
      tipAmount,
      setTipAmount,
      deliveryAddress,
      setDeliveryAddress,
      itemTotal,
      totalItemCount,
      deliveryFee,
      handlingFee,
      grandTotal,
      activeOrder,
      setActiveOrder,
      userRole,
      setUserRole
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
