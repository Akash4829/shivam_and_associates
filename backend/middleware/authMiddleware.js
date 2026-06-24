const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/jwt');
const { TOKEN_COOKIE_NAME } = require('../utils/cookies');

const authenticateToken = (req, res, next) => {
  const cookieToken = req.cookies && req.cookies[TOKEN_COOKIE_NAME];
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const token = cookieToken || bearerToken;

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

const optionalAuth = (req, res, next) => {
  const cookieToken = req.cookies && req.cookies[TOKEN_COOKIE_NAME];
  const authHeader = req.headers.authorization;
  const bearerToken = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  const token = cookieToken || bearerToken;

  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    req.user = err ? null : user;
    next();
  });
};

module.exports = {
  authenticateToken,
  optionalAuth,
};
