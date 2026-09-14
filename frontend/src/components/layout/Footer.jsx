import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useThemeMode } from '../../context/ThemeContext';
import { SITE, buildWhatsAppUrl } from '../../constants/site';
import SocialLinks from '../ui/SocialLinks';

const quickLinks = [
  { label: 'nav.about', to: '/about' },
  { label: 'nav.practiceAreas', to: '/focus-areas' },
  { label: 'nav.services', to: '/services' },
  { label: 'nav.caseResults', to: '/case-studies' },
  { label: 'nav.testimonials', to: '/testimonials' },
  { label: 'nav.contact', to: '/contact' },
];

const legalLinks = [
  { label: 'footer.privacy', to: '/privacy-policy' },
  { label: 'footer.terms', to: '/terms-of-use' },
  { label: 'footer.disclaimer', to: '/disclaimer' },
];

export function Footer() {
  const { t } = useTranslation();
  const { theme } = useThemeMode();
  const isLight = theme === 'light';
  const muted = isLight ? 'text-muted' : 'text-slate-400';
  const year = new Date().getFullYear();

  return (
    <footer className={`mt-auto border-t ${isLight ? 'border-border bg-white' : 'border-white/10 bg-primary'}`}>
      <div className="container-premium py-14 md:py-16">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="font-display text-lg font-semibold">{SITE.name}</p>
            <p className={`mt-3 max-w-sm text-sm leading-relaxed ${muted}`}>{t('footer.tagline')}</p>
            <div className="mt-5">
              <SocialLinks />
            </div>
          </div>

          <div className="lg:col-span-3">
            <h2 className="section-kicker">{t('footer.quickLinks')}</h2>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className={`${muted} hover:text-accent`}>
                    {t(l.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h2 className="section-kicker">{t('footer.contact')}</h2>
            <ul className={`space-y-2.5 text-sm ${muted}`}>
              <li>
                <a href={`tel:${SITE.phone}`} className="hover:text-accent">
                  {SITE.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={buildWhatsAppUrl(t)} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={`mailto:${SITE.email}`} className="hover:text-accent">
                  {SITE.email}
                </a>
              </li>
              <li>{SITE.location.display}</li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h2 className="section-kicker">{t('footer.legal')}</h2>
            <ul className="space-y-2.5 text-sm">
              {legalLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className={`${muted} hover:text-accent`}>
                    {t(l.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className={`mt-12 border-t pt-6 text-xs ${isLight ? 'border-border text-muted' : 'border-white/10 text-slate-500'}`}>
          © {year} {SITE.name}. {t('footer.rights')}
        </p>
      </div>
    </footer>
  );
}

export default Footer;
