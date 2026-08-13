import axiosInstance from './axios';

// Auth APIs
export const adminLogin = (phone, pin) => 
  axiosInstance.post('/auth/admin/login', { phone, pin });

export const adminResetPin = (phone, newPin) => 
  axiosInstance.post('/auth/admin/reset-pin', { phone, newPin });

export const adminChangePin = (oldPin, newPin) => 
  axiosInstance.put('/admin/change-pin', { oldPin, newPin });

export const getAdminProfile = () => 
  axiosInstance.get('/admin/profile');

export const updateAdminProfile = (data) => 
  axiosInstance.put('/admin/profile', data);

// Dashboard
export const getDashboardStats = () => 
  axiosInstance.get('/admin/dashboard');

// Events
export const getEvents = (params) => 
  axiosInstance.get('/admin/events', { params });

export const getEvent = (id) => 
  axiosInstance.get(`/admin/events/${id}`);

export const createEvent = (data) => 
  axiosInstance.post('/admin/events', data);

export const updateEvent = (id, data) => 
  axiosInstance.put(`/admin/events/${id}`, data);

export const deleteEvent = (id) => 
  axiosInstance.delete(`/admin/events/${id}`);

// Ticket Classes
export const getTicketClasses = (params) => 
  axiosInstance.get('/admin/ticket-classes', { params });

export const createTicketClass = (data) => 
  axiosInstance.post('/admin/ticket-classes', data);

export const updateTicketClass = (id, data) => 
  axiosInstance.put(`/admin/ticket-classes/${id}`, data);

export const deleteTicketClass = (id) => 
  axiosInstance.delete(`/admin/ticket-classes/${id}`);

// Users
export const getUsers = (params) => 
  axiosInstance.get('/admin/users', { params });

export const getUser = (id) => 
  axiosInstance.get(`/admin/users/${id}`);

export const toggleUserStatus = (id, isActive) => 
  axiosInstance.put(`/admin/users/${id}/status`, { isActive });

// Orders
export const getOrders = (params) => 
  axiosInstance.get('/admin/orders', { params });

export const getOrder = (id) => 
  axiosInstance.get(`/admin/orders/${id}`);

export const updateOrderStatus = (id, status) => 
  axiosInstance.put(`/admin/orders/${id}/status`, { status });

// Gallery - UPDATED to use admin routes from adminController
export const getGalleryItems = (params) => 
  axiosInstance.get('/admin/gallery', { params });

export const getGalleryItem = (id) => 
  axiosInstance.get(`/admin/gallery/${id}`);

export const createGalleryItem = (data) => 
  axiosInstance.post('/admin/gallery', data);

export const updateGalleryItem = (id, data) => 
  axiosInstance.put(`/admin/gallery/${id}`, data);

export const deleteGalleryItem = (id) => 
  axiosInstance.delete(`/admin/gallery/${id}`);

export const toggleGalleryItem = (id) => 
  axiosInstance.put(`/admin/gallery/${id}/toggle`);

// File Upload for Gallery - UPDATED to use admin routes
export const uploadGalleryFile = (file, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  
  return axiosInstance.post('/admin/gallery/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentCompleted);
      }
    }
  });
};






export const uploadGalleryVideo = (file, onProgress) => {
  const formData = new FormData();
  formData.append('video', file);
  
  return axiosInstance.post('/admin/gallery/upload-video', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (onProgress) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percentCompleted);
      }
    }
  });
};

// src/api/admin.js



// ===================== COUPONS CRUD OPERATIONS =====================

// Get all coupons with optional filtering
export const getCoupons = async (params) => {
  try {
    const response = await axiosInstance.get('/admin/coupons', { params });
    // Response formatter wraps data in { success, data, message }
    // The actual coupons array is in response.data.data
    return response.data?.data || [];
  } catch (error) {
    console.error('Error fetching coupons:', error);
    throw error;
  }
};

// Get a single coupon by ID
export const getCoupon = async (id) => {
  const response = await axiosInstance.get(`/admin/coupons/${id}`);
  return response.data?.data || null;
};

// Create a new coupon
export const createCoupon = async (data) => {
  const response = await axiosInstance.post('/admin/coupons', data);
  return response.data?.data || null;
};

// Update an existing coupon
export const updateCoupon = async (id, data) => {
  const response = await axiosInstance.put(`/admin/coupons/${id}`, data);
  return response.data?.data || null;
};

// Delete a coupon
export const deleteCoupon = async (id) => {
  const response = await axiosInstance.delete(`/admin/coupons/${id}`);
  return response.data;
};

// Toggle coupon status (active/inactive)
export const toggleCouponStatus = async (id) => {
  const response = await axiosInstance.put(`/admin/coupons/${id}/toggle`);
  return response.data?.data || null;
};

// Validate a coupon code (for frontend validation before applying)
export const validateCoupon = async (code, eventId) => {
  const response = await axiosInstance.post('/coupons/validate', { code, eventId });
  return response.data?.data || null;
};

// Apply coupon to order
export const applyCoupon = async (code, orderId) => {
  const response = await axiosInstance.post('/coupons/apply', { code, orderId });
  return response.data?.data || null;
};

// ===================== END COUPONS CRUD =====================