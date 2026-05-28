import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axiosConfig';
import { motion } from 'framer-motion';
import { easeSoft, springSoft } from '../lib/motion';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/api/auth/login', credentials);

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      navigate('/admin');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-16 px-4 sm:px-6 bg-gradient-to-br from-midnight via-slate-900 to-black relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[28rem] h-[28rem] bg-blue-600/10 rounded-full blur-3xl" aria-hidden />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" aria-hidden />
      <div className="absolute inset-0 bg-noise opacity-[0.07] mix-blend-overlay pointer-events-none" aria-hidden />

      <motion.div
        className="relative w-full max-w-md"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: easeSoft }}
      >
        <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-8 sm:p-10 shadow-depth-dark">
          <div className="text-center mb-8">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-300 to-amber-600 flex items-center justify-center mx-auto mb-4 ring-2 ring-white/10">
              <span className="text-midnight font-bold text-sm">SM</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Admin login</h1>
            <p className="mt-2 text-slate-400 text-sm">Shivam Mishra and Associates</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-400/30 text-red-200 text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={credentials.username}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white placeholder-slate-500 input-focus-glow"
                placeholder="Username"
                autoComplete="username"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={credentials.password}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 text-sm text-white placeholder-slate-500 input-focus-glow"
                placeholder="Password"
                autoComplete="current-password"
              />
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-[15px] font-medium text-midnight bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 ring-1 ring-inset ring-white/25 disabled:opacity-50 disabled:cursor-not-allowed"
              whileHover={!loading ? { scale: 1.01 } : {}}
              whileTap={!loading ? { scale: 0.99 } : {}}
              transition={springSoft}
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
