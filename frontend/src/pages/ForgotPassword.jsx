import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { springSoft } from '../lib/motion';
import api from '../utils/axiosConfig';
import AuthLayout, { AuthInput, AuthError } from '../components/auth/AuthLayout';

export default function ForgotPassword() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/api/auth/forgot-password', { email });
      setSent(true);
      toast.success(t('auth.resetEmailSent'));
    } catch (err) {
      setError(err.response?.data?.error || t('auth.resetFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title={t('auth.forgotPasswordTitle')} subtitle={t('auth.forgotPasswordSubtitle')}>
      {sent ? (
        <div className="text-center space-y-4">
          <p className="text-slate-300 text-sm">{t('auth.resetEmailSent')}</p>
          <Link to="/login" className="text-accent hover:underline text-sm">
            {t('auth.backToLogin')}
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <AuthError message={error} />
          <AuthInput
            id="email"
            label={t('auth.email')}
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <motion.button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-xl text-[15px] font-medium text-midnight bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 ring-1 ring-inset ring-white/25 disabled:opacity-50"
            whileHover={!loading ? { scale: 1.01 } : {}}
            whileTap={!loading ? { scale: 0.99 } : {}}
            transition={springSoft}
          >
            {loading ? t('auth.sending') : t('auth.sendResetLink')}
          </motion.button>
          <p className="text-center text-sm text-slate-400">
            <Link to="/login" className="text-accent hover:underline">
              {t('auth.backToLogin')}
            </Link>
          </p>
        </form>
      )}
    </AuthLayout>
  );
}
