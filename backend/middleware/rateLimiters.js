const rateLimit = require('express-rate-limit');

function createLimiter({ windowMs, max, message }) {
  return rateLimit({
    windowMs,
    max,
    standardHeaders: true,
    legacyHeaders: false,
    handler: (req, res) => {
      res.status(429).json({
        error: message,
        code: 'RATE_LIMIT_EXCEEDED',
      });
    },
  });
}

const formSubmissionLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: 'Too many submissions from this IP. Please try again in one hour.',
});

const authLimiter = createLimiter({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: 'Too many authentication attempts. Please try again in one hour.',
});

module.exports = {
  formSubmissionLimiter,
  authLimiter,
};
