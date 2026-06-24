import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { springSoft } from '../lib/motion';
import { useAuth } from '../context/AuthContext';
import AuthLayout, { AuthInput, AuthError, AuthDivider, PasswordStrength } from '../components/auth/AuthLayout';

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, googleLogin } = useAuth();
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(form);
      toast.success(t('auth.registerSuccess'));
      navigate('/');
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.errors?.map((e) => e.message).join('. ') ||
        t('auth.registerFailed');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (response) => {
    setLoading(true);
    setError('');
    try {
      await googleLogin(response.credential);
      toast.success(t('auth.registerSuccess'));
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || t('auth.googleFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title={t('auth.createAccount')} subtitle={t('auth.registerSubtitle')}>
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
            id="full_name"
            label={t('auth.fullName')}
            required
            autoComplete="name"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          />
          <AuthInput
            id="email"
            label={t('auth.email')}
            type="email"
            required
            autoComplete="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <div>
            <AuthInput
              id="password"
              label={t('auth.password')}
              type="password"
              required
              autoComplete="new-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <PasswordStrength password={form.password} />
          </div>
          <AuthInput
            id="confirmPassword"
            label={t('auth.confirmPassword')}
            type="password"
            required
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          />

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-[15px] font-medium text-midnight bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 ring-1 ring-inset ring-white/25 disabled:opacity-50"
            whileHover={!loading ? { scale: 1.01 } : {}}
            whileTap={!loading ? { scale: 0.99 } : {}}
            transition={springSoft}
          >
            {loading ? t('auth.creating') : t('auth.createAccount')}
          </motion.button>
        </form>

        <p className="text-center text-sm text-slate-400">
          {t('auth.haveAccount')}{' '}
          <Link to="/login" className="text-accent hover:underline">
            {t('auth.signIn')}
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
