import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { springSoft } from '../../lib/motion';
import { AuthInput, AuthError, AuthDivider, PasswordStrength } from './AuthLayout';
import AppleSignInButton from './AppleSignInButton';
import GoogleSignInButton from './GoogleSignInButton';

export function OAuthSignInPanel({
  mode = 'login',
  error,
  loading,
  onGoogleSuccess,
  onAppleSuccess,
  onAppleError,
  form,
  setForm,
  onSubmit,
  redirectPath = '/',
}) {
  const { t } = useTranslation();
  const hasGoogle = Boolean(process.env.REACT_APP_GOOGLE_CLIENT_ID);
  const hasApple = Boolean(process.env.REACT_APP_APPLE_CLIENT_ID);
  const [showEmail, setShowEmail] = useState(!hasGoogle && !hasApple);
  const registerPath = `/register?redirect=${encodeURIComponent(redirectPath)}`;

  const handleGoogleError = () => {
    const message = t('auth.googlePopupBlocked');
    onAppleError?.(message);
    toast.error(message);
  };

  return (
    <div className="space-y-5">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-semibold text-slate-900">
          {mode === 'login' ? t('auth.signInGateTitle') : t('auth.registerGateTitle')}
        </h2>
        <p className="text-sm text-slate-500 leading-relaxed">
          {mode === 'login' ? t('auth.signInGateSubtitle') : t('auth.registerGateSubtitle')}
        </p>
      </div>

      <AuthError message={error} />

      {!showEmail && (
        <div className="space-y-3">
          {hasGoogle && (
            <>
              <GoogleSignInButton
                onSuccess={onGoogleSuccess}
                onError={handleGoogleError}
                disabled={loading}
              />
              <p className="text-xs text-center text-slate-400 leading-relaxed px-2">
                {t('auth.googlePopupHint')}
              </p>
            </>
          )}

          {hasApple && (
            <AppleSignInButton
              label={t('auth.continueApple')}
              disabled={loading}
              onSuccess={onAppleSuccess}
              onError={() => onAppleError?.(t('auth.appleFailed'))}
            />
          )}

          <button
            type="button"
            onClick={() => setShowEmail(true)}
            className="w-full py-3.5 rounded-xl border border-slate-300 bg-white text-[15px] font-medium text-slate-800 hover:bg-slate-50 transition-colors"
          >
            {t('auth.continueEmail')}
          </button>
        </div>
      )}

      {showEmail && (
        <>
          {(hasGoogle || hasApple) && <AuthDivider label={t('auth.or')} />}
          <form onSubmit={onSubmit} className="space-y-4">
            {mode === 'register' && (
              <AuthInput
                id="full_name"
                label={t('auth.fullName')}
                required
                autoComplete="name"
                value={form.full_name || ''}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
              />
            )}
            <AuthInput
              id="email"
              label={t('auth.email')}
              type="email"
              required
              autoComplete="email"
              value={form.email || ''}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <AuthInput
              id="password"
              label={t('auth.password')}
              type="password"
              required
              autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              value={form.password || ''}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            {mode === 'register' && <PasswordStrength password={form.password || ''} />}
            {mode === 'register' && (
              <AuthInput
                id="confirmPassword"
                label={t('auth.confirmPassword')}
                type="password"
                required
                autoComplete="new-password"
                value={form.confirmPassword || ''}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              />
            )}

            {mode === 'login' && (
              <div className="text-right">
                <Link to="/forgot-password" className="text-sm text-accent hover:underline">
                  {t('auth.forgotPassword')}
                </Link>
              </div>
            )}

            <motion.button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl text-[15px] font-medium text-midnight bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 ring-1 ring-inset ring-white/25 disabled:opacity-50"
              whileHover={!loading ? { scale: 1.01 } : {}}
              whileTap={!loading ? { scale: 0.99 } : {}}
              transition={springSoft}
            >
              {loading
                ? mode === 'login'
                  ? t('auth.signingIn')
                  : t('auth.creating')
                : mode === 'login'
                  ? t('auth.signIn')
                  : t('auth.createAccount')}
            </motion.button>
          </form>

          {(hasGoogle || hasApple) && (
            <button
              type="button"
              onClick={() => setShowEmail(false)}
              className="w-full text-sm text-slate-500 hover:text-slate-700"
            >
              ← {t('auth.backToSocial')}
            </button>
          )}
        </>
      )}

      <p className="text-center text-sm text-slate-500">
        {mode === 'login' ? (
          <>
            {t('auth.noAccount')}{' '}
            <Link to={registerPath} className="text-accent font-medium hover:underline">
              {t('auth.createAccount')}
            </Link>
          </>
        ) : (
          <>
            {t('auth.haveAccount')}{' '}
            <Link
              to={`/login?redirect=${encodeURIComponent(redirectPath)}`}
              className="text-accent font-medium hover:underline"
            >
              {t('auth.signIn')}
            </Link>
          </>
        )}
      </p>
    </div>
  );
}

export default OAuthSignInPanel;
