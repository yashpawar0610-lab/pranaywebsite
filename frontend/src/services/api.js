import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`
  : '/api';

const API = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' }
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('fitzone_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Redirect to login on 401
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('fitzone_token');
      localStorage.removeItem('fitzone_user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ── Auth ──────────────────────────────────────────────────
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
};

// ── Users ─────────────────────────────────────────────────
export const userAPI = {
  getProfile: () => API.get('/users/profile'),
  updateProfile: (data) => API.put('/users/profile', data),
  changePassword: (data) => API.put('/users/change-password', data),
  getDashboard: () => API.get('/users/dashboard'),
};

// ── Memberships ───────────────────────────────────────────
export const membershipAPI = {
  getPlans: () => API.get('/memberships/plans'),
  subscribe: (planId) => API.post('/memberships/subscribe', { planId }),
  getMyMembership: () => API.get('/memberships/my'),
  // Admin
  getAllMemberships: (params) => API.get('/memberships', { params }),
  createPlan: (data) => API.post('/memberships/plans', data),
  updatePlan: (id, data) => API.put(`/memberships/plans/${id}`, data),
  deletePlan: (id) => API.delete(`/memberships/plans/${id}`),
};

// ── Programs ──────────────────────────────────────────────
export const programAPI = {
  getPrograms: (params) => API.get('/programs', { params }),
  getProgram: (id) => API.get(`/programs/${id}`),
  enrollProgram: (id) => API.post(`/programs/${id}/enroll`),
  getEnrolled: () => API.get('/programs/enrolled'),
  // Admin
  createProgram: (data) => API.post('/programs', data),
  updateProgram: (id, data) => API.put(`/programs/${id}`, data),
  deleteProgram: (id) => API.delete(`/programs/${id}`),
};

// ── Trainers ──────────────────────────────────────────────
export const trainerAPI = {
  getTrainers: () => API.get('/trainers'),
  getTrainer: (id) => API.get(`/trainers/${id}`),
  // Admin
  createTrainer: (data) => API.post('/trainers', data),
  updateTrainer: (id, data) => API.put(`/trainers/${id}`, data),
  deleteTrainer: (id) => API.delete(`/trainers/${id}`),
};

// ── Bookings ──────────────────────────────────────────────
export const bookingAPI = {
  createBooking: (data) => API.post('/bookings', data),
  getMyBookings: () => API.get('/bookings/my'),
  cancelBooking: (id, reason) => API.put(`/bookings/${id}/cancel`, { reason }),
  // Admin
  getAllBookings: (params) => API.get('/bookings', { params }),
  updateBookingStatus: (id, status) => API.put(`/bookings/${id}/status`, { status }),
};

// ── Progress ──────────────────────────────────────────────
export const progressAPI = {
  logProgress: (data) => API.post('/progress', data),
  getMyProgress: (params) => API.get('/progress/my', { params }),
  deleteProgress: (id) => API.delete(`/progress/${id}`),
};

// ── Contact ───────────────────────────────────────────────
export const contactAPI = {
  submit: (data) => API.post('/contact', data),
  // Admin
  getMessages: (params) => API.get('/contact', { params }),
  markAsRead: (id) => API.put(`/contact/${id}/read`),
  deleteMessage: (id) => API.delete(`/contact/${id}`),
};

// ── Admin ─────────────────────────────────────────────────
export const adminAPI = {
  getStats: () => API.get('/admin/stats'),
  getAllUsers: (params) => API.get('/admin/users', { params }),
  updateUser: (id, data) => API.put(`/admin/users/${id}`, data),
  deleteUser: (id) => API.delete(`/admin/users/${id}`),
};

export default API;
