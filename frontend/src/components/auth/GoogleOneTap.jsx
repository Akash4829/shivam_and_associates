import React, { useCallback } from 'react';
import { useGoogleOneTapLogin } from '@react-oauth/google';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

const AUTH_PATHS = ['/login', '/register', '/forgot-password', '/reset-password', '/admin'];

export function GoogleOneTap() {
  const { t } = useTranslation();
  const location = useLocation();
  const { user, loading, googleLogin } = useAuth();
  const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;

  const handleSuccess = useCallback(
    async (response) => {
      try {
        await googleLogin(response.credential);
        toast.success(t('auth.loginSuccess'));
      } catch {
        /* user can sign in manually */
      }
    },
    [googleLogin, t]
  );

  const disabled =
    !clientId ||
    loading ||
    Boolean(user) ||
    AUTH_PATHS.some((p) => location.pathname.startsWith(p));

  useGoogleOneTapLogin({
    onSuccess: handleSuccess,
    onError: () => {},
    disabled,
    cancel_on_tap_outside: false,
    auto_select: true,
  });

  return null;
}

export default GoogleOneTap;
