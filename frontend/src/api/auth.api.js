import { client } from './client';

export const authApi = {
  register: (data) => client.post('/auth/register/', data),
  login: (data) => client.post('/auth/login/', data),
  logout: (data) => client.post('/auth/logout/', data),
  getProfile: () => client.get('/auth/profile/'),
  updateProfile: (data) => client.put('/auth/profile/', data),
  sendPasswordResetOtp: (email) => client.post('/auth/forgot-password/send-otp/', { email }),
  verifyPasswordResetOtp: (email, otp) =>
    client.post('/auth/forgot-password/verify-otp/', { email, otp }),
  resetPassword: (payload) => client.post('/auth/forgot-password/reset/', payload),
  resendPasswordResetOtp: (email) => client.post('/auth/forgot-password/resend-otp/', { email }),
};
