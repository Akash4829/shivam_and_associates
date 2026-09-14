const { isAdminEmail } = require('../utils/adminEmails');

const adminMiddleware = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  if (req.user.role === 'admin' || isAdminEmail(req.user.email)) {
    return next();
  }
  return res.status(403).json({ error: 'Admin access required' });
};

module.exports = { adminMiddleware };
