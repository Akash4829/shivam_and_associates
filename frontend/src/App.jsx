import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';
import LegalDisclaimerModal from './components/legal/LegalDisclaimerModal';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { SITE, legalServiceSchema } from './constants/site';

class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-off-white px-6 py-24 text-center text-ink">
          <p className="font-display text-2xl">Mishra Juris Chamber</p>
          <p className="mt-3 text-muted">The page failed to load. Please refresh and try again.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

const HomePage = lazy(() => import('./pages/HomePage'));
const FocusAreasPage = lazy(() => import('./pages/FocusAreasPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const TestimonialsPage = lazy(() => import('./pages/TestimonialsPage'));
const CaseStudiesPage = lazy(() => import('./pages/CaseStudiesPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const InternshipPage = lazy(() => import('./pages/InternshipPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfUse = lazy(() => import('./pages/TermsOfUse'));
const Disclaimer = lazy(() => import('./pages/Disclaimer'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword'));
const ResetPassword = lazy(() => import('./pages/ResetPassword'));

function PageSkeleton() {
  return (
    <div className="min-h-[70vh] max-w-content mx-auto px-5 py-16 animate-pulse space-y-6">
      <div className="h-10 w-2/3 rounded-lg bg-white/10" />
      <div className="h-4 w-full max-w-xl rounded-lg bg-white/5" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-48 rounded-2xl border border-white/10 bg-white/5" />
        ))}
      </div>
    </div>
  );
}

const orgSchema = legalServiceSchema({
  url: typeof window !== 'undefined' ? window.location.origin : 'https://shivammishraassociates.com',
});

const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || '';

function AppRoutes() {
  return (
    <>
      <Helmet
        defaultTitle="Mishra Juris Chamber | Trusted Legal Counsel in India"
        titleTemplate="%s | Mishra Juris Chamber"
      >
        <meta name="theme-color" content="#F7F5F0" />
        <meta property="og:site_name" content={SITE.name} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(orgSchema)}</script>
      </Helmet>
      <LegalDisclaimerModal />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4500,
          style: {
            background: '#0B0F19',
            color: '#F8F6F2',
            border: '1px solid rgba(201, 162, 39, 0.25)',
          },
        }}
      />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Suspense fallback={<PageSkeleton />}><HomePage /></Suspense>} />
          <Route path="/focus-areas" element={<Suspense fallback={<PageSkeleton />}><FocusAreasPage /></Suspense>} />
          <Route path="/services" element={<Suspense fallback={<PageSkeleton />}><ServicesPage /></Suspense>} />
          <Route path="/testimonials" element={<Suspense fallback={<PageSkeleton />}><TestimonialsPage /></Suspense>} />
          <Route path="/case-studies" element={<Suspense fallback={<PageSkeleton />}><CaseStudiesPage /></Suspense>} />
          <Route path="/about" element={<Suspense fallback={<PageSkeleton />}><AboutPage /></Suspense>} />
          <Route
            path="/contact"
            element={
              <Suspense fallback={<PageSkeleton />}>
                <ContactPage />
              </Suspense>
            }
          />
          <Route
            path="/internship"
            element={
              <ProtectedRoute>
                <Suspense fallback={<PageSkeleton />}>
                  <InternshipPage />
                </Suspense>
              </ProtectedRoute>
            }
          />
          <Route path="/privacy-policy" element={<Suspense fallback={<PageSkeleton />}><PrivacyPolicy /></Suspense>} />
          <Route path="/terms-of-use" element={<Suspense fallback={<PageSkeleton />}><TermsOfUse /></Suspense>} />
          <Route path="/disclaimer" element={<Suspense fallback={<PageSkeleton />}><Disclaimer /></Suspense>} />
        </Route>
        <Route path="/blog" element={<Navigate to="/case-studies" replace />} />
        <Route path="/login" element={<Suspense fallback={<PageSkeleton />}><Login /></Suspense>} />
        <Route path="/register" element={<Suspense fallback={<PageSkeleton />}><Register /></Suspense>} />
        <Route path="/forgot-password" element={<Suspense fallback={<PageSkeleton />}><ForgotPassword /></Suspense>} />
        <Route path="/reset-password" element={<Suspense fallback={<PageSkeleton />}><ResetPassword /></Suspense>} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute requireAdmin>
              <Suspense fallback={<PageSkeleton />}>
                <AdminDashboard />
              </Suspense>
            </ProtectedRoute>
          }
        />
        <Route element={<MainLayout />}>
          <Route path="*" element={<Suspense fallback={<PageSkeleton />}><NotFoundPage /></Suspense>} />
        </Route>
      </Routes>
    </>
  );
}

function App() {
  const content = (
    <AppErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <AppRoutes />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </AppErrorBoundary>
  );

  if (googleClientId) {
    return <GoogleOAuthProvider clientId={googleClientId}>{content}</GoogleOAuthProvider>;
  }

  return content;
}

export default App;
