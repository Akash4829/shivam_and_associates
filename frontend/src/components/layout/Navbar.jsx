import React, { useEffect, useId, useRef, useState, useCallback } from 'react';
import { clearAllBodyScrollLocks, disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';
import { NavLink, Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useThemeMode } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { SITE } from '../../constants/site';
import Button from '../ui/Button';

const primaryNav = [
  { key: 'nav.about', path: '/about' },
  { key: 'nav.practiceAreas', path: '/focus-areas' },
  { key: 'nav.services', path: '/services' },
];

const resultsDropdown = [
  { key: 'nav.caseResults', path: '/case-studies' },
  { key: 'nav.testimonials', path: '/testimonials' },
];

function isResultsActive(pathname) {
  return resultsDropdown.some((item) => pathname === item.path || pathname.startsWith(`${item.path}/`));
}

function BrandMark({ compact = false, isLight, onClick }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className={`flex min-w-0 items-center gap-2.5 ${isLight ? 'text-ink' : 'text-off-white'}`}
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-navy text-[11px] font-semibold tracking-wide text-accent">
        {SITE.logoInitials}
      </span>
      {!compact && (
        <span className="font-display text-[15px] font-semibold leading-tight tracking-tight sm:text-base whitespace-nowrap">
          {SITE.name}
        </span>
      )}
    </Link>
  );
}

function LanguageToggle({ t, i18n, isLight, compact }) {
  const next = i18n.language === 'hi' ? 'en' : 'hi';
  const toggleLang = () => {
    i18n.changeLanguage(next);
    window.localStorage.setItem('firm-ui-lang', next);
  };

  return (
    <button
      type="button"
      onClick={toggleLang}
      className={`text-xs font-medium tracking-wide ${
        isLight ? 'text-muted hover:text-ink' : 'text-slate-400 hover:text-off-white'
      }`}
      aria-label={t('common.toggleLanguage')}
    >
      {compact ? (i18n.language === 'hi' ? 'EN' : 'हिन्दी') : i18n.language === 'hi' ? 'English / हिन्दी' : 'EN / हिन्दी'}
    </button>
  );
}

function ThemeToggle({ t, isLight, toggleTheme }) {
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`flex h-9 w-9 items-center justify-center rounded-md ${
        isLight ? 'text-muted hover:text-ink' : 'text-slate-400 hover:text-off-white'
      }`}
      aria-label={isLight ? t('theme.dark') : t('theme.light')}
      title={isLight ? t('theme.dark') : t('theme.light')}
    >
      <span aria-hidden>{isLight ? '☽' : '☀'}</span>
    </button>
  );
}

function ProfileMenu({ user, isAdmin, isLight, t, open, setOpen, onLogout, menuId }) {
  const ref = useRef(null);

  useEffect(() => {
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [setOpen]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex max-w-[11rem] items-center gap-1.5 text-sm font-medium ${
          isLight ? 'text-ink' : 'text-off-white'
        }`}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
      >
        <span className="truncate">{user.fullName || user.email}</span>
        <svg className={`h-3.5 w-3.5 shrink-0 ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            id={menuId}
            role="menu"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className={`absolute right-0 top-full z-50 mt-3 w-64 rounded-xl border py-2 shadow-depth-sm ${
              isLight ? 'border-border bg-white' : 'border-white/10 bg-secondary'
            }`}
          >
            <div className={`px-4 py-2.5 text-xs ${isLight ? 'text-muted' : 'text-slate-400'}`}>
              <p className={`font-medium truncate ${isLight ? 'text-ink' : 'text-off-white'}`}>{user.fullName}</p>
              <p className="truncate">{user.email}</p>
            </div>
            <div className={`my-1 h-px ${isLight ? 'bg-border' : 'bg-white/10'}`} />
            {isAdmin && (
              <Link
                to="/admin"
                role="menuitem"
                onClick={() => setOpen(false)}
                className={`block px-4 py-2.5 text-sm ${isLight ? 'text-ink hover:bg-navy/5' : 'text-off-white hover:bg-white/5'}`}
              >
                {t('nav.adminDashboard')}
              </Link>
            )}
            <button
              type="button"
              role="menuitem"
              onClick={onLogout}
              className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50"
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
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileResultsOpen, setMobileResultsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const drawerRef = useRef(null);
  const closeBtnRef = useRef(null);
  const dropdownRef = useRef(null);
  const drawerId = useId();
  const profileMenuId = useId();
  const resultsMenuId = useId();
  const isLight = theme === 'light';
  const resultsActive = isResultsActive(location.pathname);

  useEffect(() => {
    setDrawerOpen(false);
    setDropdownOpen(false);
    setProfileOpen(false);
    setMobileResultsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const drawer = drawerRef.current;
    if (!drawerOpen || !drawer) return undefined;
    disableBodyScroll(drawer);
    closeBtnRef.current?.focus();
    const onKey = (e) => {
      if (e.key === 'Escape') setDrawerOpen(false);
    };
    document.addEventListener('keydown', onKey);
    return () => {
      enableBodyScroll(drawer);
      clearAllBodyScrollLocks();
      document.removeEventListener('keydown', onKey);
    };
  }, [drawerOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = useCallback(async () => {
    await logout();
    setProfileOpen(false);
    setDrawerOpen(false);
    navigate('/');
  }, [logout, navigate]);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  const shell = isLight
    ? `${isScrolled ? 'bg-off-white/95 shadow-sm' : 'bg-off-white/90'} border-border`
    : `${isScrolled ? 'bg-primary/95' : 'bg-primary/90'} border-white/10`;

  const linkClass = (isActive) =>
    `text-[13px] font-medium tracking-wide pb-0.5 ${
      isActive ? 'text-accent nav-link-active' : isLight ? 'text-ink/75 hover:text-ink' : 'text-slate-300 hover:text-off-white'
    }`;

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-md ${shell}`}>
        <nav className="container-premium" aria-label={t('nav.menu')}>
          <div
            className={`grid items-center gap-4 ${
              isScrolled ? 'h-14' : 'h-16'
            } grid-cols-[auto_1fr_auto] lg:grid-cols-[minmax(0,1.1fr)_auto_minmax(0,1.1fr)]`}
          >
            <div className="min-w-0">
              <span className="hidden sm:block">
                <BrandMark isLight={isLight} />
              </span>
              <span className="sm:hidden">
                <BrandMark compact isLight={isLight} />
              </span>
            </div>

            <div className="hidden lg:flex items-center justify-center gap-7">
              {primaryNav.map((link) => (
                <NavLink key={link.path} to={link.path}>
                  {({ isActive }) => <span className={linkClass(isActive)}>{t(link.key)}</span>}
                </NavLink>
              ))}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setDropdownOpen((o) => !o)}
                  aria-expanded={dropdownOpen}
                  aria-haspopup="menu"
                  aria-controls={resultsMenuId}
                  className={`flex items-center gap-1 text-[13px] font-medium ${
                    resultsActive ? 'text-accent nav-link-active' : isLight ? 'text-ink/75 hover:text-ink' : 'text-slate-300 hover:text-off-white'
                  }`}
                >
                  {t('nav.results')}
                  <svg className={`h-3.5 w-3.5 ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      id={resultsMenuId}
                      role="menu"
                      initial={reduceMotion ? false : { opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      className={`absolute left-1/2 top-full z-50 mt-3 w-48 -translate-x-1/2 rounded-xl border py-1 shadow-depth-sm ${
                        isLight ? 'border-border bg-white' : 'border-white/10 bg-secondary'
                      }`}
                    >
                      {resultsDropdown.map((item) => (
                        <NavLink
                          key={item.key}
                          to={item.path}
                          role="menuitem"
                          onClick={() => setDropdownOpen(false)}
                          className={({ isActive }) =>
                            `block px-4 py-2.5 text-sm ${
                              isActive ? 'text-accent' : isLight ? 'text-ink hover:bg-navy/5' : 'text-off-white hover:bg-white/5'
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
            </div>

            <div className="hidden lg:flex items-center justify-end gap-3 xl:gap-4">
              <LanguageToggle t={t} i18n={i18n} isLight={isLight} />
              <ThemeToggle t={t} isLight={isLight} toggleTheme={toggleTheme} />
              {!authLoading && user ? (
                <ProfileMenu
                  user={user}
                  isAdmin={isAdmin}
                  isLight={isLight}
                  t={t}
                  open={profileOpen}
                  setOpen={setProfileOpen}
                  onLogout={handleLogout}
                  menuId={profileMenuId}
                />
              ) : (
                !authLoading && (
                  <Link to="/login" className={`text-sm ${isLight ? 'text-muted hover:text-ink' : 'text-slate-400 hover:text-off-white'}`}>
                    {t('auth.signIn')}
                  </Link>
                )
              )}
              <Button to="/contact" variant="primary" className="!py-2 !px-4 whitespace-nowrap">
                {t('nav.bookConsultation')}
              </Button>
            </div>

            <div className="flex justify-end lg:hidden">
              <button
                type="button"
                onClick={() => setDrawerOpen(true)}
                className={`flex h-11 w-11 items-center justify-center rounded-md ${isLight ? 'text-ink' : 'text-off-white'}`}
                aria-expanded={drawerOpen}
                aria-controls={drawerId}
                aria-label={t('nav.menu')}
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 7h16M4 12h16M4 17h16" />
                </svg>
              </button>
            </div>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {drawerOpen && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-navy/40 lg:hidden"
              onClick={closeDrawer}
              aria-label={t('common.closeMenu')}
            />
            <motion.nav
              id={drawerId}
              ref={drawerRef}
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
              className={`fixed top-0 right-0 z-[70] flex h-full w-[min(22rem,92vw)] flex-col border-l px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-4 lg:hidden ${
                isLight ? 'bg-off-white border-border' : 'bg-secondary border-white/10'
              }`}
              aria-label={t('nav.menu')}
            >
              <div className="mb-6 flex items-center justify-between">
                <BrandMark compact isLight={isLight} onClick={closeDrawer} />
                <button
                  ref={closeBtnRef}
                  type="button"
                  onClick={closeDrawer}
                  className={`flex h-11 w-11 items-center justify-center ${isLight ? 'text-ink' : 'text-off-white'}`}
                  aria-label={t('common.closeMenu')}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 space-y-1 overflow-y-auto">
                {primaryNav.map((link) => (
                  <NavLink key={link.path} to={link.path} onClick={closeDrawer}>
                    {({ isActive }) => (
                      <span className={`block rounded-lg px-3 py-3 text-base ${isActive ? 'text-accent' : isLight ? 'text-ink' : 'text-off-white'}`}>
                        {t(link.key)}
                      </span>
                    )}
                  </NavLink>
                ))}
                <button
                  type="button"
                  onClick={() => setMobileResultsOpen((o) => !o)}
                  className={`flex w-full items-center justify-between rounded-lg px-3 py-3 text-base ${
                    resultsActive ? 'text-accent' : isLight ? 'text-ink' : 'text-off-white'
                  }`}
                  aria-expanded={mobileResultsOpen}
                >
                  {t('nav.results')}
                  <span aria-hidden>{mobileResultsOpen ? '−' : '+'}</span>
                </button>
                {mobileResultsOpen &&
                  resultsDropdown.map((item) => (
                    <NavLink key={item.key} to={item.path} onClick={closeDrawer}>
                      {({ isActive }) => (
                        <span className={`block rounded-lg px-6 py-2.5 text-sm ${isActive ? 'text-accent' : isLight ? 'text-ink/80' : 'text-slate-300'}`}>
                          {t(item.key)}
                        </span>
                      )}
                    </NavLink>
                  ))}
                <NavLink to="/contact" onClick={closeDrawer}>
                  {({ isActive }) => (
                    <span className={`block rounded-lg px-3 py-3 text-base ${isActive ? 'text-accent' : isLight ? 'text-ink' : 'text-off-white'}`}>
                      {t('nav.contact')}
                    </span>
                  )}
                </NavLink>
              </div>

              <div className={`mt-4 space-y-4 border-t pt-4 ${isLight ? 'border-border' : 'border-white/10'}`}>
                <Button to="/contact" onClick={closeDrawer} className="w-full">
                  {t('nav.bookConsultation')}
                </Button>
                <div className="flex items-center justify-between">
                  <LanguageToggle t={t} i18n={i18n} isLight={isLight} />
                  <ThemeToggle t={t} isLight={isLight} toggleTheme={toggleTheme} />
                </div>
                {!authLoading && user ? (
                  <div className="space-y-2 text-sm">
                    <p className={isLight ? 'text-ink' : 'text-off-white'}>{user.fullName}</p>
                    {isAdmin && (
                      <Link to="/admin" onClick={closeDrawer} className="block text-accent">
                        {t('nav.adminDashboard')}
                      </Link>
                    )}
                    <button type="button" onClick={handleLogout} className="text-red-600">
                      {t('auth.logout')}
                    </button>
                  </div>
                ) : (
                  <Link to="/login" onClick={closeDrawer} className="block text-sm text-accent">
                    {t('auth.signIn')}
                  </Link>
                )}
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default Navbar;
