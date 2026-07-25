import React from 'react';
import { Plus, Minus, Clock, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
  const { addToCart, removeFromCart, getItemQuantity } = useCart();
  const quantity = getItemQuantity(product._id);

  const discountPercent = product.price > product.discountPrice
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0;

  return (
    <div className="product-card">
      <div className="card-top">
        {discountPercent > 0 && (
          <span className="badge-discount">{discountPercent}% OFF</span>
        )}
        <span className="badge-delivery">
          <Clock size={12} /> {product.deliveryTimeMinutes || 10} MINS
        </span>
        <div className="product-img-wrapper">
          <img
            src={product.image}
            alt={product.name}
            className="product-img"
            loading="lazy"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=500&auto=format&fit=crop&q=80';
            }}
          />
        </div>
      </div>

      <div>
        <div className="product-title" title={product.name}>{product.name}</div>
        <div className="product-unit">{product.unit}</div>
      </div>

      <div className="price-row">
        <div className="price-box">
          <span className="current-price">₹{product.discountPrice}</span>
          {product.price > product.discountPrice && (
            <span className="old-price">₹{product.price}</span>
          )}
        </div>

        {quantity === 0 ? (
          <button className="add-btn" onClick={() => addToCart(product)}>
            ADD
          </button>
        ) : (
          <div className="qty-counter">
            <button className="qty-btn" onClick={() => removeFromCart(product._id)}>
              <Minus size={14} />
            </button>
            <span>{quantity}</span>
            <button className="qty-btn" onClick={() => addToCart(product)}>
              <Plus size={14} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
