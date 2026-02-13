import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = localStorage.getItem('refresh_token');
        const response = await axios.post(
          `${API_BASE_URL}/accounts/token/refresh/`,
          { refresh: refreshToken }
        );
        
        const { access } = response.data;
        localStorage.setItem('access_token', access);
        originalRequest.headers.Authorization = `Bearer ${access}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (data) => api.post('/accounts/register/', data),
  login: (data) => api.post('/accounts/login/', data),
  logout: (data) => api.post('/accounts/logout/', data),
  getProfile: () => api.get('/accounts/profile/'),
  updateProfile: (data) => api.put('/accounts/profile/', data),
  getStudentProfile: () => api.get('/accounts/student-profile/'),
  updateStudentProfile: (data) => api.put('/accounts/student-profile/', data),
  getMentorProfile: () => api.get('/accounts/mentor-profile/'),
  updateMentorProfile: (data) => api.put('/accounts/mentor-profile/', data),
  getStudents: () => api.get('/accounts/students/'),
  getMentors: () => api.get('/accounts/mentors/'),
  getDomains: () => api.get('/accounts/domains/'),
  // Forgot password (OTP expires in 2 minutes)
  sendPasswordResetOTP: (email) => api.post('/accounts/forgot-password/send-otp/', { email }),
  verifyPasswordResetOTP: (email, otp) => api.post('/accounts/forgot-password/verify-otp/', { email, otp }),
  resetPassword: (email, otp, new_password, new_password_confirm) =>
    api.post('/accounts/forgot-password/reset/', { email, otp, new_password, new_password_confirm }),
  resendPasswordResetOTP: (email) => api.post('/accounts/forgot-password/resend-otp/', { email }),
};

export default api;

