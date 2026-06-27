import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import AuthLayout from '../components/auth/AuthLayout';
import OAuthSignInPanel from '../components/auth/OAuthSignInPanel';

function getRedirectPath(location) {
  const fromState = location.state?.from;
  const fromQuery = new URLSearchParams(location.search).get('redirect');
  const path = fromState || fromQuery || '/';
  return path.startsWith('/') ? path : '/';
}

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, googleLogin, appleLogin } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirectPath = getRedirectPath(location);
  const isProtectedRedirect = redirectPath === '/contact' || redirectPath === '/internship';

  const finishAuth = (data) => {
    toast.success(t('auth.loginSuccess'));
    navigate(data.user.role === 'admin' ? '/admin' : redirectPath, { replace: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await login(form);
      finishAuth(data);
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
      finishAuth(data);
    } catch (err) {
      setError(err.response?.data?.error || t('auth.googleFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSuccess = async (response) => {
    setLoading(true);
    setError('');
    try {
      const data = await appleLogin({
        id_token: response.authorization.id_token,
        user: response.user,
      });
      finishAuth(data);
    } catch (err) {
      setError(err.response?.data?.error || t('auth.appleFailed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      redirectNote={
        isProtectedRedirect
          ? t('auth.signInRequired', { page: t(redirectPath === '/contact' ? 'nav.contact' : 'nav.internship') })
          : null
      }
    >
      <OAuthSignInPanel
        mode="login"
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
