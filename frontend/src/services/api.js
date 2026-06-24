import axios from '../utils/axiosConfig';

export const appointmentsService = {
  create: (payload) => axios.post('/api/appointments', payload),
  list: ({ page = 1, limit = 10 } = {}) =>
    axios.get('/api/appointments', { params: { page, limit } }),
  updateStatus: (id, status) => axios.put(`/api/appointments/${id}`, { status }),
};

export const internshipService = {
  apply: (formData) => axios.post('/api/internship-applications', formData),
  list: ({ status, page = 1, limit = 20 } = {}) =>
    axios.get('/api/internship-applications', { params: { status, page, limit } }),
  getStats: () => axios.get('/api/internship-applications/stats'),
  update: (id, payload) => axios.patch(`/api/internship-applications/${id}`, payload),
  resumeUrl: (filename) => {
    if (!filename) return null;
    const base = axios.defaults.baseURL || '';
    return `${base}/api/uploads/resumes/${encodeURIComponent(filename)}`;
  },
  downloadResume: async (filename, downloadName) => {
    if (!filename) throw new Error('Resume not available');
    const response = await axios.get(`/api/uploads/resumes/${encodeURIComponent(filename)}`, {
      responseType: 'blob',
    });
    const blobUrl = window.URL.createObjectURL(response.data);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = downloadName || filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(blobUrl);
  },
};

export const caseStudiesService = {
  list: ({ page = 1, limit = 10 } = {}) =>
    axios.get('/api/case-studies', { params: { page, limit } }),
  getOne: (id) => axios.get(`/api/case-studies/${id}`),
  create: (payload) => axios.post('/api/case-studies', payload),
  update: (id, payload) => axios.put(`/api/case-studies/${id}`, payload),
  remove: (id) => axios.delete(`/api/case-studies/${id}`),
};

export const authService = {
  login: (credentials) => axios.post('/api/auth/login', credentials),
  register: (payload) => axios.post('/api/auth/register', payload),
  googleLogin: (credential) => axios.post('/api/auth/google', { credential }),
  logout: () => axios.post('/api/auth/logout'),
  me: () => axios.get('/api/auth/me'),
  forgotPassword: (email) => axios.post('/api/auth/forgot-password', { email }),
  resetPassword: (token, password) => axios.post('/api/auth/reset-password', { token, password }),
};

const services = {
  appointments: appointmentsService,
  internship: internshipService,
  caseStudies: caseStudiesService,
  auth: authService,
};

export default services;
