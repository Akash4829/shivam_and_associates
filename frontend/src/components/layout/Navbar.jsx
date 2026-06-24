import React, { useEffect, useRef, useState, useCallback } from 'react';
import { clearAllBodyScrollLocks, disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useThemeMode } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { SITE } from '../../constants/site';
import { bottomSheet, easePremium } from '../../animations/variants';
import { events } from '../../services/analytics';
import Button from '../ui/Button';

const primaryNav = [
  { key: 'nav.about', path: '/about' },
  { key: 'nav.practiceAreas', path: '/focus-areas' },
];

const resultsDropdown = [
  { key: 'nav.successStories', path: '/case-studies' },
  { key: 'nav.testimonials', path: '/testimonials' },
  { key: 'nav.caseResults', path: '/case-studies' },
];

function isResultsActive(pathname) {
  return resultsDropdown.some(
    (item) => pathname === item.path || pathname.startsWith(`${item.path}/`)
  );
}

function AuthControls({ mobile, user, isAdmin, isLight, t, profileRef, profileOpen, setProfileOpen, handleLogout, closeSheet }) {
  if (!user) {
    // Desktop: a single, understated "Sign In" link (the primary action in the
    // bar is "Book Consultation"). Registration is reachable from the login
    // page. Mobile sheet shows both, since there is room.
    if (!mobile) {
      return (
        <Link
          to="/login"
          onClick={closeSheet}
          className={`inline-flex items-center gap-1.5 text-sm font-medium transition-colors ${
            isLight ? 'text-ink/70 hover:text-ink' : 'text-slate-300 hover:text-off-white'
          }`}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 12H3m0 0l4-4m-4 4l4 4M21 4v16" />
          </svg>
          {t('auth.signIn')}
        </Link>
      );
    }
    return (
      <div className="flex items-center gap-2 w-full">
        <Link
          to="/login"
          onClick={closeSheet}
          className={`flex-1 text-center py-3 rounded-xl border text-sm font-medium transition-colors ${
            isLight ? 'text-ink/80 border-navy/15' : 'text-slate-200 border-white/10'
          }`}
        >
          {t('auth.signIn')}
        </Link>
        <Link
          to="/register"
          onClick={closeSheet}
          className="flex-1 text-center py-3 rounded-xl bg-accent text-primary text-sm font-semibold transition-opacity hover:opacity-90"
        >
          {t('auth.createAccount')}
        </Link>
      </div>
    );
  }

  return (
    <div className={`relative ${mobile ? 'w-full' : ''}`} ref={mobile ? null : profileRef}>
      <button
        type="button"
        onClick={() => setProfileOpen((o) => !o)}
        className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
          isLight
            ? 'border-navy/15 text-ink hover:border-accent/40'
            : 'border-white/10 text-off-white hover:border-accent/40'
        } ${mobile ? 'w-full justify-between' : ''}`}
        aria-expanded={profileOpen}
        aria-haspopup="menu"
      >
        <span className="truncate max-w-[140px]">{user.fullName || user.email}</span>
        <svg
          className={`w-4 h-4 shrink-0 transition-transform ${profileOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <AnimatePresence>
        {profileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className={`${
              mobile ? 'mt-2 relative' : 'absolute right-0 top-full mt-2 z-50'
            } min-w-[200px] rounded-xl border py-1 shadow-lg ${
              isLight ? 'bg-white border-navy/10' : 'bg-secondary border-white/10'
            }`}
            role="menu"
          >
            <div className={`px-4 py-2.5 border-b text-xs ${isLight ? 'border-navy/10 text-muted' : 'border-white/10 text-slate-400'}`}>
              <p className="font-medium truncate">{user.fullName}</p>
              <p className="truncate">{user.email}</p>
            </div>
            {isAdmin && (
              <Link
                to="/admin"
                role="menuitem"
                onClick={() => {
                  setProfileOpen(false);
                  closeSheet();
                }}
                className={`block px-4 py-2.5 text-sm transition-colors ${
                  isLight ? 'text-ink hover:bg-navy/5' : 'text-off-white hover:bg-white/5'
                }`}
              >
                {t('auth.dashboard')}
              </Link>
            )}
            <button
              type="button"
              role="menuitem"
              onClick={handleLogout}
              className={`w-full text-left px-4 py-2.5 text-sm text-red-500 transition-colors ${
                isLight ? 'hover:bg-red-50' : 'hover:bg-red-500/10'
              }`}
            >
              {t('auth.logout')}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function Navbar({ isScrolled }) {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useThemeMode();
  const { user, isAdmin, logout, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const [sheetOpen, setSheetOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileResultsOpen, setMobileResultsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const sheetRef = useRef(null);
  const dropdownRef = useRef(null);
  const profileRef = useRef(null);
  const isLight = theme === 'light';
  const resultsActive = isResultsActive(location.pathname);

  useEffect(() => {
    setSheetOpen(false);
    setDropdownOpen(false);
    setProfileOpen(false);
    setMobileResultsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const sheet = sheetRef.current;
    if (!sheetOpen || !sheet) return undefined;
    disableBodyScroll(sheet);
    return () => {
      enableBodyScroll(sheet);
      clearAllBodyScrollLocks();
    };
  }, [sheetOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleLang = () => {
    const next = i18n.language === 'hi' ? 'en' : 'hi';
    i18n.changeLanguage(next);
    window.localStorage.setItem('firm-ui-lang', next);
    events.langChange(next);
  };

  const handleLogout = useCallback(async () => {
    await logout();
    setProfileOpen(false);
    setSheetOpen(false);
    navigate('/');
  }, [logout, navigate]);

  const closeSheet = useCallback(() => setSheetOpen(false), []);

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

  const handleDropdownKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      setDropdownOpen(false);
      return;
    }
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      const items = dropdownRef.current?.querySelectorAll('[role="menuitem"]');
      if (!items?.length) return;
      const current = Array.from(items).findIndex((el) => el === document.activeElement);
      const next =
        e.key === 'ArrowDown'
          ? (current + 1) % items.length
          : (current <= 0 ? items.length : current) - 1;
      items[next]?.focus();
    }
  }, []);

  const authProps = {
    user,
    isAdmin,
    isLight,
    t,
    profileRef,
    profileOpen,
    setProfileOpen,
    handleLogout,
    closeSheet,
  };

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
              className={`group flex items-center gap-3 min-w-0 ${
                isLight ? 'text-ink' : 'text-off-white'
              }`}
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
              {primaryNav.map((link) => (
                <NavLink key={link.path} to={link.path}>
                  {({ isActive }) => <span className={linkClass(isActive)}>{t(link.key)}</span>}
                </NavLink>
              ))}

              <div className="relative" ref={dropdownRef} onKeyDown={handleDropdownKeyDown}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen((o) => !o)}
                  aria-expanded={dropdownOpen}
                  aria-haspopup="menu"
                  className={`flex items-center gap-1 text-sm font-medium pb-1 transition-colors ${
                    resultsActive
                      ? 'text-accent nav-link-active'
                      : isLight
                        ? 'text-ink/70 hover:text-ink'
                        : 'text-slate-300 hover:text-off-white'
                  }`}
                >
                  {t('nav.results')}
                  <svg
                    className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      role="menu"
                      className={`absolute left-0 top-full mt-3 min-w-[200px] rounded-xl border py-1 shadow-lg ${
                        isLight ? 'bg-white border-navy/10' : 'bg-secondary border-white/10'
                      }`}
                    >
                      {resultsDropdown.map((item) => (
                        <NavLink
                          key={item.key}
                          to={item.path}
                          role="menuitem"
                          onClick={() => setDropdownOpen(false)}
                          className={({ isActive }) =>
                            `block px-4 py-2.5 text-sm transition-colors ${
                              isActive
                                ? 'text-accent bg-accent/10'
                                : isLight
                                  ? 'text-ink hover:bg-navy/5'
                                  : 'text-off-white hover:bg-white/5'
                            }`
                          }
                        >
                          {t(item.key)}
                        </NavLink>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <NavLink to="/contact">
                {({ isActive }) => <span className={linkClass(isActive)}>{t('nav.contact')}</span>}
              </NavLink>
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
                <span
                  className={
                    i18n.language === 'hi'
                      ? 'text-accent font-hindi'
                      : 'opacity-50 font-hindi'
                  }
                >
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
              {!authLoading && <AuthControls {...authProps} />}
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
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
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
              onClick={closeSheet}
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
              <motion.div
                className={`mx-auto mb-4 h-1 w-12 rounded-full ${
                  isLight ? 'bg-navy/20' : 'bg-white/20'
                }`}
              />
              <div className="space-y-1">
                {primaryNav.map((link, i) => (
                  <motion.div
                    key={link.path}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.04 * i }}
                  >
                    <NavLink to={link.path} onClick={closeSheet}>
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

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 }}
                >
                  <button
                    type="button"
                    onClick={() => setMobileResultsOpen((o) => !o)}
                    className={`flex w-full items-center justify-between rounded-xl px-4 py-4 text-base font-medium ${
                      resultsActive
                        ? 'bg-accent/15 text-accent border border-accent/30'
                        : isLight
                          ? 'text-ink'
                          : 'text-off-white'
                    }`}
                    aria-expanded={mobileResultsOpen}
                  >
                    {t('nav.results')}
                    <svg
                      className={`w-5 h-5 transition-transform ${
                        mobileResultsOpen ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>
                  {mobileResultsOpen && (
                    <div className="ml-4 mt-1 space-y-1 border-l-2 border-accent/30 pl-3">
                      {resultsDropdown.map((item) => (
                        <NavLink key={item.key} to={item.path} onClick={closeSheet}>
                          {({ isActive }) => (
                            <span
                              className={`block rounded-lg px-3 py-3 text-sm ${
                                isActive
                                  ? 'text-accent font-medium'
                                  : isLight
                                    ? 'text-ink/80'
                                    : 'text-slate-300'
                              }`}
                            >
                              {t(item.key)}
                            </span>
                          )}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </motion.div>

                <NavLink to="/contact" onClick={closeSheet}>
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
                      {t('nav.contact')}
                    </span>
                  )}
                </NavLink>
              </div>

              <motion.div className="mt-6 space-y-3">
                {!authLoading && <AuthControls {...authProps} mobile />}
                <div className="flex gap-3">
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
                    onClick={closeSheet}
                    className="flex-1 rounded-xl bg-accent py-3 text-center text-sm font-semibold text-primary"
                  >
                    {t('nav.bookConsultation')}
                  </Link>
                </div>
              </motion.div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
