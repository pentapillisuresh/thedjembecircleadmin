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

// ===================== SIMPLIFIED COUPONS CRUD OPERATIONS =====================

// Get all coupons with optional filtering
export const getCoupons = (params) => 
  axiosInstance.get('/admin/coupons', { params });

// Get a single coupon by ID
export const getCoupon = (id) => 
  axiosInstance.get(`/admin/coupons/${id}`);

// Create a new coupon
export const createCoupon = (data) => 
  axiosInstance.post('/admin/coupons', data);

// Update an existing coupon
export const updateCoupon = (id, data) => 
  axiosInstance.put(`/admin/coupons/${id}`, data);

// Delete a coupon
export const deleteCoupon = (id) => 
  axiosInstance.delete(`/admin/coupons/${id}`);

// Toggle coupon status (active/inactive)
export const toggleCouponStatus = (id) => 
  axiosInstance.put(`/admin/coupons/${id}/toggle`);

// Validate a coupon code (for frontend validation before applying)
export const validateCoupon = (code, eventId) => 
  axiosInstance.post('/admin/coupons/validate', { code, eventId });

// ===================== END COUPONS CRUD =====================