import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import api from '../utils/axiosConfig';

const AuthContext = createContext(null);

const SESSION_HINT_KEY = 'auth_session_hint';

function readSessionHint() {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(SESSION_HINT_KEY) === '1';
}

function writeSessionHint(value) {
  if (typeof window === 'undefined') return;
  if (value) window.localStorage.setItem(SESSION_HINT_KEY, '1');
  else window.localStorage.removeItem(SESSION_HINT_KEY);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchUser = useCallback(async () => {
    try {
      const response = await api.get('/api/auth/me');
      if (mountedRef.current) setUser(response.data.user);
      writeSessionHint(true);
      return response.data.user;
    } catch {
      if (mountedRef.current) setUser(null);
      writeSessionHint(false);
      return null;
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams(window.location.search);
    const signedIn = params.get('signed_in') === '1';
    const authError = params.get('auth_error');
    const urlToken = params.get('token');

    if (authError) {
      params.delete('auth_error');
      const clean = `${window.location.pathname}${params.toString() ? `?${params}` : ''}`;
      window.history.replaceState({}, '', clean);
      setLoading(false);
      return;
    }

    if (signedIn) {
      if (urlToken) {
        window.localStorage.setItem('token', urlToken);
      }
      writeSessionHint(true);
      params.delete('signed_in');
      params.delete('token');
      const clean = `${window.location.pathname}${params.toString() ? `?${params}` : ''}`;
      window.history.replaceState({}, '', clean);
      fetchUser().finally(() => {
        if (mountedRef.current) setLoading(false);
      });
      return;
    }

    // Avoid an unnecessary 401 request on first-ever visit.
    const hasToken = Boolean(window.localStorage.getItem('token'));
    const hasSession = readSessionHint();
    if (!hasToken && !hasSession) {
      setLoading(false);
      return;
    }
    fetchUser().finally(() => {
      if (mountedRef.current) setLoading(false);
    });
  }, [fetchUser]);

  useEffect(() => {
    const handleExpired = () => {
      writeSessionHint(false);
      setUser(null);
    };
    window.addEventListener('auth:expired', handleExpired);
    return () => window.removeEventListener('auth:expired', handleExpired);
  }, []);

  const persistAuth = useCallback((data) => {
    if (data?.token && typeof window !== 'undefined') {
      window.localStorage.setItem('token', data.token);
    }
    if (data?.user) {
      writeSessionHint(true);
      setUser(data.user);
    }
  }, []);

  const login = useCallback(async (credentials) => {
    const response = await api.post('/api/auth/login', credentials);
    persistAuth(response.data);
    return response.data;
  }, [persistAuth]);

  const register = useCallback(async (data) => {
    const response = await api.post('/api/auth/register', data);
    persistAuth(response.data);
    return response.data;
  }, [persistAuth]);

  const googleLogin = useCallback(async (credential) => {
    const response = await api.post('/api/auth/google', { credential });
    persistAuth(response.data);
    return response.data;
  }, [persistAuth]);

  const appleLogin = useCallback(async (payload) => {
    const response = await api.post('/api/auth/apple', payload);
    persistAuth(response.data);
    return response.data;
  }, [persistAuth]);

  const logout = useCallback(async () => {
    try {
      await api.post('/api/auth/logout');
    } catch {
      /* ignore */
    } finally {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('user');
      }
      writeSessionHint(false);
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === 'admin',
      login,
      register,
      googleLogin,
      appleLogin,
      logout,
      refreshUser: fetchUser,
    }),
    [user, loading, login, register, googleLogin, appleLogin, logout, fetchUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

export default AuthContext;
