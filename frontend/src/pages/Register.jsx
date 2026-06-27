import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/auth/AuthLayout';
import OAuthSignInPanel from '../components/auth/OAuthSignInPanel';

function getRedirectPath(location) {
  const fromQuery = new URLSearchParams(location.search).get('redirect');
  const path = fromQuery || '/';
  return path.startsWith('/') ? path : '/';
}

export default function Register() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { register, googleLogin, appleLogin } = useAuth();
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectPath = getRedirectPath(location);

  const finishAuth = () => {
    toast.success(t('auth.registerSuccess'));
    navigate(redirectPath, { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(form);
      finishAuth();
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
    if (!response?.credential) {
      setError(t('auth.googleFailed'));
      return;
    }
    setLoading(true);
    setError('');
    try {
      await googleLogin(response.credential);
      finishAuth();
    } catch (err) {
      const msg = err.response?.data?.error || t('auth.googleFailed');
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSuccess = async (response) => {
    setLoading(true);
    setError('');
    try {
      await appleLogin({
        id_token: response.authorization.id_token,
        user: response.user,
      });
      finishAuth();
    } catch (err) {
      setError(err.response?.data?.error || t('auth.appleFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <OAuthSignInPanel
        mode="register"
        error={error}
        loading={loading}
        form={form}
        setForm={setForm}
        onSubmit={handleSubmit}
        onGoogleSuccess={handleGoogleSuccess}
        onAppleSuccess={handleAppleSuccess}
        onAppleError={setError}
        redirectPath={redirectPath}
      />
    </AuthLayout>
  );
}
