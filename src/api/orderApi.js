import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';


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

  // Append each file
  uploadedFiles.forEach(f => data.append('files', f.file));

  const response = await api.post('/orders', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

  return response.data; // { orderId, totalPrice, status, message }
};

// Get single order by ID
export const getOrderById = async (orderId) => {
  const response = await api.get(`/orders/${orderId}`);
  return response.data;
};

// Get all orders (admin)
export const getAllOrders = async () => {
  const response = await api.get('/orders');
  return response.data;
};

// Get orders by phone number
export const getOrdersByPhone = async (phone) => {
  const response = await api.get(`/orders/phone/${phone}`);
  return response.data;
};

// Update order status
export const updateOrderStatus = async (orderId, status) => {
  const response = await api.patch(`/orders/${orderId}/status`, { status });
  return response.data;
};