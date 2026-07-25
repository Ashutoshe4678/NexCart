import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

export const fetchProducts = async (category = 'All', search = '') => {
  try {
    const response = await axios.get(`${API_BASE}/products`, {
      params: { category, search }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
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
