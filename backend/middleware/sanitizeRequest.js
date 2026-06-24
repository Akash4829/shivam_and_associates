/**
 * Global request sanitizer middleware.
 * Replaces the deprecated `xss-clean` package which is incompatible with
 * newer Express body-parser internals.
 *
 * Strategy: walk req.body and req.params, strip HTML tags and `javascript:`
 * URI schemes from every string value. `req.query` is left untouched
 * because Express 5 marks it read-only.
 */
function sanitizeString(value) {
  return value
    .replace(/<\s*script[^>]*>[\s\S]*?<\s*\/\s*script\s*>/gi, '')
    .replace(/<[^>]*>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/\bon\w+\s*=/gi, '');
}

function walk(value) {
  if (value == null) return value;
  if (typeof value === 'string') return sanitizeString(value);
  if (Array.isArray(value)) return value.map(walk);
  if (typeof value === 'object') {
    const out = {};
    for (const key of Object.keys(value)) {
      out[key] = walk(value[key]);
    }
    return out;
  }
  return value;
}

function sanitizeRequest(req, _res, next) {
  if (req.body && typeof req.body === 'object') {
    req.body = walk(req.body);
  }
  if (req.params && typeof req.params === 'object') {
    for (const key of Object.keys(req.params)) {
      if (typeof req.params[key] === 'string') {
        req.params[key] = sanitizeString(req.params[key]);
      }
    }
  }
  next();
}

module.exports = sanitizeRequest;
