import React, { useEffect, useRef, useState } from 'react';
import { clearAllBodyScrollLocks, disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useThemeMode } from '../../context/ThemeContext';
import { SITE } from '../../constants/site';
import { bottomSheet, easePremium } from '../../animations/variants';
import { events } from '../../services/analytics';
import Button from '../ui/Button';

const navPaths = [
  { key: 'nav.home', path: '/' },
  { key: 'nav.services', path: '/services' },
  { key: 'nav.practiceAreas', path: '/focus-areas' },
  { key: 'nav.successStories', path: '/case-studies' },
  { key: 'nav.about', path: '/about' },
  { key: 'nav.internship', path: '/internship' },
  { key: 'nav.contact', path: '/contact' },
];

export function Navbar({ isScrolled }) {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useThemeMode();
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const [sheetOpen, setSheetOpen] = useState(false);
  const sheetRef = useRef(null);
  const isLight = theme === 'light';

  useEffect(() => {
    setSheetOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const sheet = sheetRef.current;
    if (!sheetOpen || !sheet) {
      return undefined;
    }

    disableBodyScroll(sheet);

    return () => {
      enableBodyScroll(sheet);
      clearAllBodyScrollLocks();
    };
  }, [sheetOpen]);

  const toggleLang = () => {
    const next = i18n.language === 'hi' ? 'en' : 'hi';
    i18n.changeLanguage(next);
    window.localStorage.setItem('firm-ui-lang', next);
    events.langChange(next);
  };

  const shell = isLight
    ? `${isScrolled ? 'bg-off-white/90 shadow-depth-sm' : 'bg-off-white/75'} border-navy/10`
    : `${isScrolled ? 'bg-primary/85 shadow-depth-dark' : 'bg-primary/70'} border-white/[0.08]`;

  const linkClass = (isActive) =>
    `relative text-sm font-medium transition-colors duration-300 pb-1 ${
      isActive
        ? 'text-accent nav-link-active'
        : isLight
          ? 'text-ink/70 hover:text-ink'
          : 'text-slate-300 hover:text-off-white'
    }`;

  return (
    <>
      <motion.header
        initial={reduceMotion ? false : { y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: easePremium }}
        className={`fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-2xl transition-all duration-500 ${shell}`}
      >
        <nav className="container-premium" aria-label="Primary">
          <motion.div
            layout
            className={`flex items-center justify-between transition-all duration-500 ${
              isScrolled ? 'h-14 md:h-15' : 'h-16 md:h-[4.25rem]'
            }`}
          >
            <Link
              to="/"
              className={`group flex items-center gap-3 min-w-0 ${isLight ? 'text-ink' : 'text-off-white'}`}
            >
              <motion.div
                whileHover={reduceMotion ? undefined : { scale: 1.05 }}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-amber-600 shadow-glow-accent ring-2 ring-white/10"
              >
                <span className="text-primary font-bold text-sm">SM</span>
              </motion.div>
              <span className="font-display font-semibold text-sm sm:text-base tracking-tight truncate">
                {SITE.shortName}
              </span>
            </Link>

            <motion.div className="hidden lg:flex items-center gap-7 xl:gap-8">
              {navPaths.map((link) => (
                <NavLink key={link.path} to={link.path} end={link.path === '/'}>
                  {({ isActive }) => <span className={linkClass(isActive)}>{t(link.key)}</span>}
                </NavLink>
              ))}
            </motion.div>

            <motion.div className="hidden lg:flex items-center gap-3">
              <button
                type="button"
                onClick={toggleLang}
                className={`flex min-h-[44px] items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-semibold transition-all ${
                  isLight
                    ? 'border-navy/15 text-ink hover:border-accent/40'
                    : 'border-white/10 text-off-white hover:border-accent/40'
                }`}
                aria-label={t('common.toggleLanguage')}
              >
                <span className={i18n.language === 'en' ? 'text-accent' : 'opacity-50'}>EN</span>
                <span className="opacity-30">|</span>
                <span className={i18n.language === 'hi' ? 'text-accent font-hindi' : 'opacity-50 font-hindi'}>
                  {'\u0939\u093F\u0902'}
                </span>
              </button>
              <button
                type="button"
                onClick={toggleTheme}
                className={`flex h-11 w-11 min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl border transition-colors ${
                  isLight ? 'border-navy/15 text-ink' : 'border-white/10 text-off-white'
                }`}
                aria-label={isLight ? t('theme.dark') : t('theme.light')}
              >
                <span className="text-accent text-base" aria-hidden>
                  {isLight ? '\u2600' : '\u263E'}
                </span>
              </button>
              <Button to="/contact" variant="primary" className="!py-2.5 !px-5">
                {t('nav.bookConsultation')}
              </Button>
            </motion.div>

            <motion.div className="flex items-center gap-2 lg:hidden">
              <button
                type="button"
                onClick={toggleLang}
                className={`flex h-11 w-11 min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl border text-xs font-semibold font-hindi ${
                  isLight ? 'border-navy/15 text-ink' : 'border-white/10 text-off-white'
                }`}
                aria-label={t('common.toggleLanguage')}
              >
                {i18n.language === 'hi' ? 'EN' : '\u0939\u093F\u0902'}
              </button>
              <button
                type="button"
                onClick={() => setSheetOpen(true)}
                className={`flex h-11 w-11 min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-xl border ${
                  isLight ? 'border-navy/10 text-ink' : 'border-white/10 text-off-white'
                }`}
                aria-expanded={sheetOpen}
                aria-label={t('nav.menu')}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </motion.div>
          </motion.div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {sheetOpen && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm lg:hidden"
              onClick={() => setSheetOpen(false)}
              aria-label={t('common.closeMenu')}
            />
            <motion.nav
              ref={sheetRef}
              initial="closed"
              animate="open"
              exit="closed"
              variants={bottomSheet}
              className={`fixed bottom-0 left-0 right-0 z-[70] rounded-t-3xl border-t px-4 pt-4 pb-[max(2rem,env(safe-area-inset-bottom))] max-h-[85vh] overflow-y-auto lg:hidden ${
                isLight ? 'bg-off-white border-navy/10' : 'bg-secondary border-white/10'
              }`}
              aria-label="Mobile navigation"
            >
              <motion.div className={`mx-auto mb-4 h-1 w-12 rounded-full ${isLight ? 'bg-navy/20' : 'bg-white/20'}`} />
              <div className="space-y-1">
                {navPaths.map((link, i) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 * i }}
                  >
                    <NavLink to={link.path} end={link.path === '/'} onClick={() => setSheetOpen(false)}>
                      {({ isActive }) => (
                        <span
                          className={`block rounded-xl px-4 py-4 text-base font-medium ${
                            isActive
                              ? 'bg-accent/15 text-accent border border-accent/30'
                              : isLight
                                ? 'text-ink'
                                : 'text-off-white'
                          }`}
                        >
                          {t(link.key)}
                        </span>
                      )}
                    </NavLink>
                  </motion.div>
                ))}
              </div>
              <motion.div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className={`flex min-h-[44px] flex-1 items-center justify-center rounded-xl border py-3 text-sm font-medium ${
                    isLight ? 'border-navy/15 text-ink' : 'border-white/10 text-off-white'
                  }`}
                >
                  {isLight ? t('theme.dark') : t('theme.light')}
                </button>
                <Link
                  to="/contact"
                  onClick={() => setSheetOpen(false)}
                  className="flex-1 rounded-xl bg-accent py-3 text-center text-sm font-semibold text-primary"
                >
                  {t('nav.bookConsultation')}
                </Link>
              </motion.div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
