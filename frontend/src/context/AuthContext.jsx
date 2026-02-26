import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/auth.api';
import { buildLoginPayload, buildLogoutPayload } from '../services/auth.service';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserProfile = async () => {
    try {
      const { data } = await authApi.getProfile();
      setUser(data);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const register = async (formData) => {
    try {
      const { data } = await authApi.register(formData);
      const { user: u, profile } = data;
      // Do not store tokens or set user – redirect to login so they sign in after signup
      return { success: true, user: { ...u, profile } };
    } catch (error) {
      return { success: false, error: error.response?.data || { message: 'Registration failed' } };
    }
  };

  const login = async (formData) => {
    try {
      const { data } = await authApi.login(buildLoginPayload(formData));
      const { user: u, tokens, profile } = data;
      localStorage.setItem('access_token', tokens.access);
      localStorage.setItem('refresh_token', tokens.refresh);
      setUser({ ...u, profile });
      setIsAuthenticated(true);
      return { success: true, user: { ...u, profile } };
    } catch (error) {
      return { success: false, error: error.response?.data || { message: 'Login failed' } };
    }
  };

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        await authApi.logout(buildLogoutPayload(refreshToken));
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    register,
    login,
    logout,
    refreshUser: fetchUserProfile,
    isStudent: user?.role === 'STUDENT',
    isMentor: user?.role === 'MENTOR',
    isAdministrator: user?.role === 'ADMINISTRATOR',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
