import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from local storage
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem('cyber_token');
      const storedUser = localStorage.getItem('cyber_user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch (err) {
      console.error('Failed to parse auth state:', err);
      localStorage.removeItem('cyber_token');
      localStorage.removeItem('cyber_user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { user: userData, token: tokenData } = res.data;
      
      setUser(userData);
      setToken(tokenData);
      localStorage.setItem('cyber_token', tokenData);
      localStorage.setItem('cyber_user', JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please verify credentials.';
      return { success: false, message: msg };
    }
  };

  const register = async (name, email, password, phone, role = 'citizen') => {
    try {
      const res = await api.post('/auth/register', { name, email, password, phone, role });
      const { user: userData, token: tokenData } = res.data;
      
      setUser(userData);
      setToken(tokenData);
      localStorage.setItem('cyber_token', tokenData);
      localStorage.setItem('cyber_user', JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      return { success: false, message: msg };
    }
  };

  const loginWithToken = (tokenData, userData) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem('cyber_token', tokenData);
    localStorage.setItem('cyber_user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('cyber_token');
    localStorage.removeItem('cyber_user');
  };

  const updateUser = (updatedUserData) => {
    setUser((prev) => {
      const merged = { ...(prev || {}), ...updatedUserData };
      localStorage.setItem('cyber_user', JSON.stringify(merged));
      return merged;
    });
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'admin',
    login,
    loginWithToken,
    register,
    logout,
    updateUser,
    updateUserProfile: updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
