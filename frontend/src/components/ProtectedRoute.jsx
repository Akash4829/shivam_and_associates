import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';

function PageLoader() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
    </div>
  );
}

export function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();
  const { t } = useTranslation();

  if (loading) {
    return <PageLoader />;
  }

  if (!user) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return (
      <Navigate
        to={`/login?redirect=${redirect}`}
        state={{ from: location.pathname, message: t('auth.signInRequiredGeneric') }}
        replace
      />
    );
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
