import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { Helmet } from 'react-helmet-async';
import MainLayout from './layouts/MainLayout';
import PrivateRoute from './components/PrivateRoute';
import { ThemeProvider } from './context/ThemeContext';
import { SITE } from './constants/site';

const HomePage = lazy(() => import('./pages/HomePage'));
const FocusAreasPage = lazy(() => import('./pages/FocusAreasPage'));
const ServicesPage = lazy(() => import('./pages/ServicesPage'));
const TestimonialsPage = lazy(() => import('./pages/TestimonialsPage'));
const CaseStudiesPage = lazy(() => import('./pages/CaseStudiesPage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const InternshipPage = lazy(() => import('./pages/InternshipPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const Login = lazy(() => import('./components/Login'));

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

const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'LegalService',
  name: SITE.name,
  url: typeof window !== 'undefined' ? window.location.origin : 'https://shivammishraassociates.com',
  telephone: SITE.phone,
  email: SITE.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: SITE.address,
    addressLocality: 'Prayagraj',
    addressRegion: 'Uttar Pradesh',
    postalCode: '211001',
    addressCountry: 'IN',
  },
  areaServed: 'IN',
  priceRange: '$$',
  openingHours: 'Mo-Sa 10:00-19:00',
};

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Helmet
          defaultTitle="Shivam Mishra and Associates | Premium Legal Counsel"
          titleTemplate="%s | Shivam Mishra & Associates"
        >
          <meta name="theme-color" content="#0B0F19" />
          <meta property="og:site_name" content={SITE.name} />
          <meta property="og:type" content="website" />
          <meta name="twitter:card" content="summary_large_image" />
          <script type="application/ld+json">{JSON.stringify(orgSchema)}</script>
        </Helmet>
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
            <Route path="/contact" element={<Suspense fallback={<PageSkeleton />}><ContactPage /></Suspense>} />
            <Route path="/internship" element={<Suspense fallback={<PageSkeleton />}><InternshipPage /></Suspense>} />
          </Route>
          <Route path="/blog" element={<Navigate to="/case-studies" replace />} />
          <Route path="/login" element={<Suspense fallback={<PageSkeleton />}><Login /></Suspense>} />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <Suspense fallback={<PageSkeleton />}>
                  <AdminDashboard />
                </Suspense>
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
