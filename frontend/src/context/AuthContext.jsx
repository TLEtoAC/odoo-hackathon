import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';
import { initFirebase, subscribeAuth, firebaseLogin, firebaseRegister, firebaseLogout } from '../services/firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
    // If Firebase is enabled, sync auth state
    const { auth } = initFirebase();
    if (auth) {
      const unsub = subscribeAuth(async (fbUser) => {
        if (fbUser) {
          setUser({ id: fbUser.uid, email: fbUser.email, firstName: fbUser.displayName || 'User' });
        } else {
          setUser(null);
        }
      });
      return () => unsub && unsub();
    }
  }, []);

  const checkAuthStatus = async () => {
    try {
      const response = await authAPI.getProfile();
      setUser(response.data.data.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      setUser(response.data.data.user);
      return response;
    } catch (e) {
      console.error('Backend login failed:', e);
      throw e;
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register(userData);
      setUser(response.data.data.user);
      return response;
    } catch (e) {
      console.error('Backend registration failed:', e);
      throw e;
    }
  };

  const logout = async () => {
    try { await authAPI.logout(); } catch (e) {}
    try { await firebaseLogout(); } catch (e) {}
    setUser(null);
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};