import axios from '../utils/axiosConfig';

export const appointmentsService = {
  create: (payload) => axios.post('/api/appointments', payload),
  list: ({ page = 1, limit = 10 } = {}) =>
    axios.get('/api/appointments', { params: { page, limit } }),
};

export const internshipService = {
  apply: (payload) => axios.post('/api/internship-applications', payload),
};

export const caseStudiesService = {
  list: ({ page = 1, limit = 10 } = {}) =>
    axios.get('/api/case-studies', { params: { page, limit } }),
};

export const newsletterService = {
  subscribe: (email) => axios.post('/api/newsletter', { email }).catch(() => null),
};

export default {
  appointments: appointmentsService,
  internship: internshipService,
  caseStudies: caseStudiesService,
  newsletter: newsletterService,
};
