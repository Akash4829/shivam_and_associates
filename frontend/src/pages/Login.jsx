import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { springSoft } from '../lib/motion';
import { useAuth } from '../context/AuthContext';
import AuthLayout, { AuthInput, AuthError, AuthDivider } from '../components/auth/AuthLayout';

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, googleLogin } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const from = location.state?.from || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await login(form);
      toast.success(t('auth.loginSuccess'));
      navigate(data.user.role === 'admin' ? '/admin' : from, { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.errors?.[0]?.message ||
        t('auth.loginFailed');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (response) => {
    setLoading(true);
    setError('');
    try {
      const data = await googleLogin(response.credential);
      toast.success(t('auth.loginSuccess'));
      navigate(data.user.role === 'admin' ? '/admin' : from, { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || t('auth.googleFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title={t('auth.signIn')} subtitle={t('auth.signInSubtitle')}>
      <div className="space-y-5">
        <AuthError message={error} />

        {process.env.REACT_APP_GOOGLE_CLIENT_ID && (
          <>
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => setError(t('auth.googleFailed'))}
                theme="filled_black"
                size="large"
                width="100%"
                text="continue_with"
              />
            </div>
            <AuthDivider label={t('auth.or')} />
          </>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <AuthInput
            id="email"
            label={t('auth.email')}
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <AuthInput
            id="password"
            label={t('auth.password')}
            type="password"
            required
            autoComplete="current-password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />

          <div className="text-right">
            <Link to="/forgot-password" className="text-sm text-accent hover:underline">
              {t('auth.forgotPassword')}
            </Link>
          </div>

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-[15px] font-medium text-midnight bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 ring-1 ring-inset ring-white/25 disabled:opacity-50"
            whileHover={!loading ? { scale: 1.01 } : {}}
            whileTap={!loading ? { scale: 0.99 } : {}}
            transition={springSoft}
          >
            {loading ? t('auth.signingIn') : t('auth.signIn')}
          </motion.button>
        </form>

        <p className="text-center text-sm text-slate-400">
          {t('auth.noAccount')}{' '}
          <Link to="/register" className="text-accent hover:underline">
            {t('auth.createAccount')}
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
