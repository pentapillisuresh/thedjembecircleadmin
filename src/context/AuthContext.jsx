import React, { createContext, useState, useEffect } from 'react';
import { getAdminProfile } from '../api/admin';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(sessionStorage.getItem('adminToken'));

  const login = (adminData, token) => {
    sessionStorage.setItem('adminToken', token);
    sessionStorage.setItem('adminData', JSON.stringify(adminData));
    setToken(token);
    setAdmin(adminData);
  };

  const logout = () => {
    sessionStorage.removeItem('adminToken');
    sessionStorage.removeItem('adminData');
    setToken(null);
    setAdmin(null);
    toast.success('Logged out successfully');
  };

  const loadProfile = async () => {
    try {
      const response = await getAdminProfile();
      if (response.data.success) {
        setAdmin(response.data.data);
        sessionStorage.setItem('adminData', JSON.stringify(response.data.data));
      }
    } catch (error) {
      console.error('Failed to load profile:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const value = {
    admin,
    token,
    loading,
    login,
    logout,
    loadProfile,
    isAuthenticated: !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};