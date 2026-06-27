import axios from 'axios';

/**
 * Axios client used across the app.
 * - Adds the JWT bearer header when a token is in localStorage (dev fallback).
 * - Sends cookies for HTTP-only session cookie auth (production path).
 * - On 401 responses, clears local state and emits an `auth:expired` event so
 *   AuthContext can react without each call site having to handle it.
 */
function normalizeBaseUrl(url) {
  const raw = (url || 'http://localhost:5000').replace(/\/+$/, '');
  return raw.replace(/\/api$/, '');
}

const api = axios.create({
  baseURL: normalizeBaseUrl(process.env.REACT_APP_API_URL),
  withCredentials: true,
  timeout: 30000,
});

api.interceptors.request.use(
  (config) => {
    const token = typeof window !== 'undefined' ? window.localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isHandlingExpiry = false;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';

    if ((status === 401 || status === 403) && !url.endsWith('/api/auth/me') && !url.endsWith('/api/auth/login') && !url.endsWith('/api/auth/register') && !url.endsWith('/api/auth/google') && !url.endsWith('/api/auth/apple')) {
      if (!isHandlingExpiry && typeof window !== 'undefined') {
        isHandlingExpiry = true;
        window.localStorage.removeItem('token');
        window.localStorage.removeItem('user');
        window.dispatchEvent(new CustomEvent('auth:expired'));
        setTimeout(() => {
          isHandlingExpiry = false;
        }, 1000);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
