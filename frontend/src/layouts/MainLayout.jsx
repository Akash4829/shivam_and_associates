import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, LazyMotion, domAnimation, motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useThemeMode } from '../context/ThemeContext';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import FloatingActions from '../components/layout/FloatingActions';
import ScrollProgress from '../components/layout/ScrollProgress';
import GoogleOneTap from '../components/auth/GoogleOneTap';
import { pageTransition } from '../animations/variants';

function AnimatedOutlet() {
  const location = useLocation();
  const reduceMotion = useReducedMotion();

  return (
    <LazyMotion features={domAnimation}>
      <AnimatePresence mode={reduceMotion ? 'sync' : 'wait'}>
        <motion.div key={location.pathname} {...(reduceMotion ? {} : pageTransition)}>
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </LazyMotion>
  );
}

function MainLayout() {
  const { t } = useTranslation();
  const { theme } = useThemeMode();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const isLight = theme === 'light';

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [location.pathname]);

  useEffect(() => {
    document.documentElement.classList.toggle('light', isLight);
    document.documentElement.classList.toggle('dark', !isLight);
  }, [isLight]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div
      className={`min-h-screen flex flex-col antialiased selection:bg-accent/25 selection:text-primary ${
        isLight ? 'bg-off-white text-ink' : 'bg-primary text-off-white'
      }`}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-xl focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-primary focus:shadow-glow-accent"
      >
        {t('nav.skipToContent')}
      </a>
      <ScrollProgress />
      {process.env.REACT_APP_GOOGLE_CLIENT_ID ? <GoogleOneTap /> : null}
      <Navbar isScrolled={isScrolled} />
      <main id="main-content" className="flex-1 w-full pt-16 md:pt-[4.25rem]" tabIndex={-1}>
        <AnimatedOutlet />
      </main>
      <Footer />
      <FloatingActions />
    </div>
  );
}

export default MainLayout;
