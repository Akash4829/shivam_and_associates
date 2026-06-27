const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '30d';

function parseExpiryToMs(expiry) {
  const match = String(expiry).match(/^(\d+)([dhms])$/);
  if (!match) return 7 * 24 * 60 * 60 * 1000;
  const value = parseInt(match[1], 10);
  const unit = match[2];
  const multipliers = { d: 86400000, h: 3600000, m: 60000, s: 1000 };
  return value * (multipliers[unit] || 86400000);
}

function getCookieOptions() {
  const isProduction = process.env.NODE_ENV === 'production';
  // Cross-domain deployments (e.g. frontend on Vercel, API on Render) need
  // SameSite=None so the cookie is sent on cross-site requests. SameSite=None
  // requires Secure. Allow an explicit override for same-domain setups.
  const sameSite = (process.env.COOKIE_SAMESITE || (isProduction ? 'none' : 'lax')).toLowerCase();
  const secure = isProduction || sameSite === 'none';
  return {
    httpOnly: true,
    secure,
    sameSite,
    maxAge: parseExpiryToMs(JWT_EXPIRES_IN),
    path: '/',
  };
}

function getClearCookieOptions() {
  const { maxAge, ...rest } = getCookieOptions();
  return rest;
}

const TOKEN_COOKIE_NAME = 'auth_token';

module.exports = {
  TOKEN_COOKIE_NAME,
  getCookieOptions,
  getClearCookieOptions,
};
