import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { springSoft } from '../lib/motion';
import api from '../utils/axiosConfig';
import AuthLayout, { AuthInput, AuthError, PasswordStrength } from '../components/auth/AuthLayout';

export default function ResetPassword() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) {
      setError(t('auth.invalidResetToken'));
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post('/api/auth/reset-password', { token, password });
      toast.success(t('auth.passwordResetSuccess'));
      navigate('/login');
    } catch (err) {
      const msg =
        err.response?.data?.error ||
        err.response?.data?.errors?.map((e) => e.message).join('. ') ||
        t('auth.resetFailed');
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title={t('auth.resetPasswordTitle')} subtitle={t('auth.resetPasswordSubtitle')}>
      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthError message={error} />
        <div>
          <AuthInput
            id="password"
            label={t('auth.newPassword')}
            type="password"
            required
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <PasswordStrength password={password} />
        </div>
        <motion.button
          type="submit"
          disabled={loading || !token}
          className="w-full py-3.5 rounded-xl text-[15px] font-medium text-midnight bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 ring-1 ring-inset ring-white/25 disabled:opacity-50"
          whileHover={!loading ? { scale: 1.01 } : {}}
          whileTap={!loading ? { scale: 0.99 } : {}}
          transition={springSoft}
        >
          {loading ? t('auth.resetting') : t('auth.resetPassword')}
        </motion.button>
        <p className="text-center text-sm text-slate-400">
          <Link to="/login" className="text-accent hover:underline">
            {t('auth.backToLogin')}
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
