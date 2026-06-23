import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/orders';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Submit order with files
export const submitOrder = async (formData, uploadedFiles) => {
  const data = new FormData();

  data.append('phone',       formData.phone);
  data.append('contentType', formData.contentType);
  data.append('printType',   formData.printType);
  data.append('copies',      formData.copies);
  data.append('paperSize',   formData.paperSize);
  data.append('binding',     formData.binding);
  data.append('description', formData.description || '');

  uploadedFiles.forEach(f => data.append('files', f.file));

  // 🔥 FIXED HERE (removed /orders)
  const response = await api.post('', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  return response.data;
};

// Get single order by ID
export const getOrderById = async (orderId) => {
  const response = await api.get(`/${orderId}`);
  return response.data;
};

// Get all orders
export const getAllOrders = async () => {
  const response = await api.get('');
  return response.data;
};

// Get single order by Tracking ID
export const getOrderByTrackingId = async (trackingId) => {
  const response = await api.get(`/track/${encodeURIComponent(trackingId)}`);
  return response.data;
};

// Update order status
export const updateOrderStatus = async (orderId, status) => {
  const response = await api.patch(`/${orderId}/status`, { status });
  return response.data;
};
