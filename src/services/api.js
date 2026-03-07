import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  getProfile: () => api.get('/auth/profile'),
};

export const studentAPI = {
  getRecommendations: () => api.get('/student/recommendations'),
  getApplications: () => api.get('/student/applications'),
  applyInternship: (internshipId) => api.post(`/student/apply/${internshipId}`),
  saveInternship: (internshipId) => api.post(`/student/save/${internshipId}`),
  getSavedInternships: () => api.get('/student/saved'),
  updateProfile: (data) => api.put('/student/profile', data),
  getStats: () => api.get('/student/stats'),
};

export const companyAPI = {
  getInternships: () => api.get('/company/internships'),
  createInternship: (data) => api.post('/company/internships', data),
  updateInternship: (id, data) => api.put(`/company/internships/${id}`, data),
  deleteInternship: (id) => api.delete(`/company/internships/${id}`),
  getApplicants: (internshipId) => api.get(`/company/internships/${internshipId}/applicants`),
  updateApplicationStatus: (applicationId, status) =>
    api.put(`/company/applications/${applicationId}`, { status }),
  getStats: () => api.get('/company/stats'),
};

export const adminAPI = {
  getStats: () => api.get('/admin/stats'),
  getAllStudents: () => api.get('/admin/students'),
  getAllCompanies: () => api.get('/admin/companies'),
  getAllInternships: () => api.get('/admin/internships'),
  refreshExternalInternships: () => api.post('/admin/refresh-internships'),
  getAnalytics: () => api.get('/admin/analytics'),
};

export const chatbotAPI = {
  sendMessage: (message) => api.post('/chatbot', { message }),
};

export default api;
