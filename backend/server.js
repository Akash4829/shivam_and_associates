// Load .env before any module that initialises the DB pool (config/db.js).
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('./config/jwt');

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const appointmentRoutes = require('./routes/appointments');
const caseStudyRoutes = require('./routes/case-studies');
const authRoutes = require('./routes/auth');
const internshipRoutes = require('./routes/internship');

const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = (process.env.CLIENT_URLS || process.env.CLIENT_URL || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(helmet());
app.use(compression());
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/case-studies', caseStudyRoutes);
app.use('/api/internship-applications', internshipRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Server is running' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
