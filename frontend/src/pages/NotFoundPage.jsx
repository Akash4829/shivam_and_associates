import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useThemeMode } from '../context/ThemeContext';
import Button from '../components/ui/Button';

export default function NotFoundPage() {
  const { t } = useTranslation();
  const { theme } = useThemeMode();
  const isLight = theme === 'light';

  return (
    <>
      <Helmet>
        <title>{t('notFound.title')}</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <section className={`section-padding ${isLight ? 'bg-off-white' : 'bg-primary'}`}>
        <div className="container-premium max-w-xl py-16 text-center">
          <p className="section-kicker">{t('notFound.kicker')}</p>
          <h1 className={`font-heading text-display-md mt-3 ${isLight ? 'text-ink' : 'text-off-white'}`}>
            {t('notFound.title')}
          </h1>
          <p className={`mt-4 ${isLight ? 'text-muted' : 'text-slate-400'}`}>{t('notFound.body')}</p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button to="/">{t('notFound.home')}</Button>
            <Button to="/contact" variant="secondary">
              {t('nav.contact')}
            </Button>
          </div>
          <p className="mt-6">
            <Link to="/about" className="text-sm text-accent hover:underline">
              {t('nav.about')}
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
