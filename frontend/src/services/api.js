import axios from 'axios';

// Smart API Base resolver: Localhost -> 5000, Deployed -> Render Backend API
const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

let rawUrl = import.meta.env.VITE_API_URL || (isLocal ? 'http://localhost:5000/api' : 'https://nexcart-backend-3nbq.onrender.com/api');

// Sanitize URL: remove trailing slashes and ensure /api suffix
rawUrl = rawUrl.trim().replace(/\/+$/, '');
if (!rawUrl.endsWith('/api')) {
  rawUrl = `${rawUrl}/api`;
}

const API_BASE = rawUrl;

console.log('⚡ NexCart Sanitized API Base:', API_BASE);

export const fetchProducts = async (category = 'All', search = '') => {
  try {
    const response = await axios.get(`${API_BASE}/products`, {
      params: { category, search }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching products from:', API_BASE, error);
    return [];
  }
};

export const createOrderAPI = async (orderData) => {
  try {
    const response = await axios.post(`${API_BASE}/orders`, orderData);
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

export const fetchOrdersAPI = async () => {
  try {
    const response = await axios.get(`${API_BASE}/orders`);
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
};

export const updateOrderStatusAPI = async (orderId, status, userRole = 'Customer') => {
  try {
    const response = await axios.put(`${API_BASE}/orders/${orderId}/status`, { status, userRole });
    return response.data;
  } catch (error) {
    console.error('Error updating order status:', error.response?.data?.message || error.message);
    throw error;
  }
};

export const assignRiderAPI = async (orderId, riderName = 'Vikram Kumar') => {
  try {
    const response = await axios.put(`${API_BASE}/orders/${orderId}/assign-rider`, { riderName });
    return response.data;
  } catch (error) {
    console.error('Error assigning rider:', error);
    throw error;
  }
};

export const updateRiderLocationAPI = async (orderId, distanceKm) => {
  try {
    const response = await axios.put(`${API_BASE}/orders/${orderId}/location`, { distanceKm });
    return response.data;
  } catch (error) {
    console.error('Error updating rider location:', error);
    throw error;
  }
};

export const createProductAPI = async (productData) => {
  try {
    const response = await axios.post(`${API_BASE}/products`, productData);
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};
