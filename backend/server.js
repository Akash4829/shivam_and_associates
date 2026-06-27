// Load .env before any module that initialises the DB pool (config/db.js).
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('./config/jwt');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const hpp = require('hpp');
const sanitizeRequest = require('./middleware/sanitizeRequest');

const appointmentRoutes = require('./routes/appointments');
const caseStudyRoutes = require('./routes/case-studies');
const authRoutes = require('./routes/auth');
const internshipRoutes = require('./routes/internship');
const { resumeDownload } = require('./controllers/internshipController');
const { authenticateToken } = require('./middleware/authMiddleware');
const { adminMiddleware } = require('./middleware/adminMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;
const isProduction = process.env.NODE_ENV === 'production';

function getAllowedOrigins() {
  const fromList = (process.env.CLIENT_URLS || '')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);
  const primary = (process.env.CLIENT_URL || 'http://localhost:3000').trim();
  return [...new Set([primary, ...fromList].filter(Boolean))];
}

const allowedOrigins = getAllowedOrigins();

// Google Sign-In redirect POSTs back with this Origin header
const OAUTH_PROVIDER_ORIGINS = ['https://accounts.google.com'];

function isOriginAllowed(origin) {
  if (!origin) return true;
  if (allowedOrigins.includes(origin)) return true;
  if (OAUTH_PROVIDER_ORIGINS.includes(origin)) return true;
  if (process.env.ALLOW_VERCEL_PREVIEWS === 'true') {
    try {
      const { hostname } = new URL(origin);
      if (hostname.endsWith('.vercel.app')) return true;
    } catch {
      /* ignore malformed origin */
    }
  }
  return false;
}

app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use(
  cors({
    origin(origin, callback) {
      if (isOriginAllowed(origin)) return callback(null, true);
      if (!isProduction) {
        console.warn(`CORS blocked origin: ${origin}. Allowed: ${allowedOrigins.join(', ')}`);
      }
      return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 204,
  })
);

app.use(
  helmet({
    contentSecurityPolicy: isProduction
      ? {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", 'https://accounts.google.com', 'https://apis.google.com'],
            scriptSrcElem: ["'self'", 'https://accounts.google.com', 'https://apis.google.com'],
            styleSrc: ["'self'", "'unsafe-inline'", 'https://accounts.google.com'],
            imgSrc: ["'self'", 'data:', 'https:'],
            connectSrc: ["'self'", 'https://accounts.google.com', 'https://www.googleapis.com'],
            frameSrc: ["'self'", 'https://accounts.google.com'],
            fontSrc: ["'self'", 'https:', 'data:'],
            objectSrc: ["'none'"],
            baseUri: ["'self'"],
            formAction: ["'self'"],
            upgradeInsecureRequests: [],
          },
        }
      : false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    frameguard: { action: 'deny' },
    hsts: isProduction
      ? { maxAge: 31536000, includeSubDomains: true, preload: true }
      : false,
    xssFilter: true,
    referrerPolicy: { policy: 'no-referrer-when-downgrade' },
  })
);

app.use(compression());
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(hpp({ whitelist: ['status'] }));
app.use(sanitizeRequest);

app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/case-studies', caseStudyRoutes);
app.use('/api/internship-applications', internshipRoutes);

// Protected resume downloads (admin-only). Files are NOT served via express.static
// to prevent unauthenticated enumeration of resumes by filename.
app.get(
  '/api/uploads/resumes/:filename',
  authenticateToken,
  adminMiddleware,
  resumeDownload
);

app.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'Endpoint not found' });
  }
  next();
});

app.use((err, _req, res, _next) => {
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({ error: 'Origin not allowed' });
  }
  if (err instanceof Error && err.message === 'Only PDF or DOC/DOCX files are allowed') {
    return res.status(400).json({ error: err.message });
  }
  if (err && err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'Resume must be 5 MB or smaller' });
  }
  if (err && err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Malformed JSON in request body' });
  }
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} (${isProduction ? 'production' : 'development'})`);
});
