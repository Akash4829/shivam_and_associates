const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { OAuth2Client } = require('google-auth-library');
const { JWT_SECRET } = require('../config/jwt');
const { TOKEN_COOKIE_NAME, getCookieOptions, getClearCookieOptions } = require('../utils/cookies');
const { sendMail } = require('../utils/mail');

const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function sanitizeUser(row) {
  if (!row) return null;
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    avatarUrl: row.avatar_url,
    authProvider: row.auth_provider,
    role: row.role,
    emailVerified: row.email_verified,
    createdAt: row.created_at,
  };
}

function signToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

function setAuthCookie(res, token) {
  res.cookie(TOKEN_COOKIE_NAME, token, getCookieOptions());
}

async function register(req, res) {
  try {
    const { full_name, email, password } = req.body;

    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email.toLowerCase()]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: 'An account with this email already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const result = await pool.query(
      `INSERT INTO users (full_name, email, password_hash, auth_provider, email_verified)
       VALUES ($1, $2, $3, 'local', FALSE)
       RETURNING *`,
      [full_name, email.toLowerCase(), passwordHash]
    );

    const user = result.rows[0];
    const token = signToken(user);
    setAuthCookie(res, token);

    res.status(201).json({
      message: 'Account created successfully',
      user: sanitizeUser(user),
      token,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email.toLowerCase()]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const user = result.rows[0];

    if (user.auth_provider === 'google' && !user.password_hash) {
      return res.status(401).json({ error: 'This account uses Google Sign-In. Please continue with Google.' });
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = signToken(user);
    setAuthCookie(res, token);

    res.status(200).json({
      message: 'Login successful',
      user: sanitizeUser(user),
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function googleAuth(req, res) {
  try {
    const { credential } = req.body;

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email_verified) {
      return res.status(401).json({ error: 'Google email is not verified' });
    }

    const { email, name, picture, sub } = payload;

    let result = await pool.query('SELECT * FROM users WHERE email = $1 OR google_id = $2', [
      email.toLowerCase(),
      sub,
    ]);

    let user;
    if (result.rows.length === 0) {
      const insert = await pool.query(
        `INSERT INTO users (full_name, email, google_id, avatar_url, auth_provider, email_verified)
         VALUES ($1, $2, $3, $4, 'google', TRUE)
         RETURNING *`,
        [name, email.toLowerCase(), sub, picture || null]
      );
      user = insert.rows[0];
    } else {
      user = result.rows[0];
      if (!user.google_id) {
        await pool.query(
          `UPDATE users SET google_id = $1, avatar_url = COALESCE($2, avatar_url),
           auth_provider = 'google', email_verified = TRUE, updated_at = NOW()
           WHERE id = $3`,
          [sub, picture, user.id]
        );
        const updated = await pool.query('SELECT * FROM users WHERE id = $1', [user.id]);
        user = updated.rows[0];
      }
    }

    const token = signToken(user);
    setAuthCookie(res, token);

    res.status(200).json({
      message: 'Google authentication successful',
      user: sanitizeUser(user),
      token,
    });
  } catch (error) {
    console.error('Google auth error:', error);
    if (error.message && error.message.includes('Token used too late')) {
      return res.status(401).json({ error: 'Google token has expired. Please sign in again.' });
    }
    res.status(401).json({ error: 'Invalid or expired Google token' });
  }
}

async function logout(req, res) {
  res.clearCookie(TOKEN_COOKIE_NAME, getClearCookieOptions());
  res.status(200).json({ message: 'Logged out successfully' });
}

async function me(req, res) {
  try {
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [req.user.userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(200).json({ user: sanitizeUser(result.rows[0]) });
  } catch (error) {
    console.error('Me endpoint error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function forgotPassword(req, res) {
  try {
    const { email } = req.body;
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1 AND auth_provider = 'local'",
      [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
      return res.status(200).json({
        message: 'If an account exists with this email, a reset link has been sent.',
      });
    }

    const user = result.rows[0];
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = crypto.createHash('sha256').update(resetToken).digest('hex');
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    await pool.query(
      'UPDATE users SET reset_token_hash = $1, reset_token_expires = $2, updated_at = NOW() WHERE id = $3',
      [resetTokenHash, expires, user.id]
    );

    const clientUrl = process.env.CLIENT_URL || 'http://localhost:3000';
    const resetLink = `${clientUrl}/reset-password?token=${resetToken}`;

    await sendMail({
      to: user.email,
      subject: 'Password Reset — Shivam Mishra & Associates',
      html: `
        <h2>Password Reset Request</h2>
        <p>Hello ${user.full_name},</p>
        <p>Click the link below to reset your password. This link expires in 1 hour.</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p>If you did not request this, please ignore this email.</p>
      `,
    });

    res.status(200).json({
      message: 'If an account exists with this email, a reset link has been sent.',
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

async function resetPassword(req, res) {
  try {
    const { token, password } = req.body;
    const resetTokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const result = await pool.query(
      `SELECT * FROM users
       WHERE reset_token_hash = $1 AND reset_token_expires > NOW()`,
      [resetTokenHash]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    const user = result.rows[0];
    const passwordHash = await bcrypt.hash(password, 12);

    await pool.query(
      `UPDATE users SET password_hash = $1, reset_token_hash = NULL,
       reset_token_expires = NULL, updated_at = NOW() WHERE id = $2`,
      [passwordHash, user.id]
    );

    res.status(200).json({ message: 'Password reset successfully. You may now sign in.' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = {
  register,
  login,
  googleAuth,
  logout,
  me,
  forgotPassword,
  resetPassword,
  sanitizeUser,
};
