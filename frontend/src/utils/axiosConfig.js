import axios from 'axios';

/**
 * API origin only (no trailing /api). Request paths use `/api/...` so URLs resolve to
 * `http://host:port/api/...` without duplicating the `/api` segment.
 * Supports `REACT_APP_API_URL` values like `http://localhost:5000` or `http://localhost:5000/api`.
 */
function normalizeBaseUrl(url) {
  const raw = (url || 'http://localhost:5000').replace(/\/$/, '');
  return raw.replace(/\/api$/, '');
}

const api = axios.create({
  baseURL: normalizeBaseUrl(process.env.REACT_APP_API_URL),
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
