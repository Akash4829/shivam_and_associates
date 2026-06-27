import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useThemeMode } from '../../context/ThemeContext';
import { SITE } from '../../constants/site';
import { practiceAreas } from '../../data/practiceAreas';
import SocialLinks from '../ui/SocialLinks';

const quickLinks = [
  { label: 'footer.aboutUs', to: '/about' },
  { label: 'nav.successStories', to: '/case-studies' },
  { label: 'nav.testimonials', to: '/testimonials' },
  { label: 'nav.contact', to: '/contact' },
  { label: 'footer.careers', to: '/internship' },
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
  const mutedText = isLight ? 'text-muted' : 'text-slate-400';
  const linkHover = isLight ? 'text-muted hover:text-accent' : 'text-slate-400 hover:text-accent';

  return (
    <footer
      className={`relative border-t mt-auto ${
        isLight
          ? 'border-navy/10 bg-gradient-to-b from-off-white to-white text-ink'
          : 'border-white/[0.06] bg-gradient-to-b from-primary via-secondary to-black text-off-white'
      }`}
    >
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" aria-hidden />
      <div className="container-premium py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-10">
          <div className="lg:col-span-4 space-y-5">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent to-amber-600">
                <span className="text-primary font-bold">{SITE.logoInitials}</span>
              </div>
              <span className="font-display font-semibold text-lg">{SITE.name}</span>
            </Link>
            <p className={`text-sm leading-relaxed max-w-sm ${mutedText}`}>{t('footer.tagline')}</p>
            <p className="text-xs font-semibold tracking-widest uppercase text-accent">{t('footer.trusted')}</p>
            <SocialLinks className="pt-2" />
          </div>

          <div className="lg:col-span-2">
            <h4 className="section-kicker !mb-4">{t('footer.practiceAreas')}</h4>
            <ul className="space-y-2.5 text-sm">
              {practiceAreas.map((area) => (
                <li key={area.id}>
                  <Link to={area.to} className={linkHover}>
                    {t(area.titleKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="section-kicker !mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className={linkHover}>
                    {t(l.label)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h4 className="section-kicker !mb-4">{t('footer.contact')}</h4>
            <div className={`space-y-2 text-sm ${mutedText}`}>
              <p>
                <a href={`tel:${SITE.phone}`} className="hover:text-accent">
                  {SITE.phoneDisplay}
                </a>
              </p>
              <p>
                <a href={`mailto:${SITE.email}`} className="hover:text-accent break-all">
                  {SITE.email}
                </a>
              </p>
              <p>{SITE.address}</p>
              <p className={`text-xs ${mutedText}`}>{SITE.hours}</p>
            </div>
          </div>
        </div>

        <div
          className={`mt-12 pt-8 border-t flex flex-col sm:flex-row justify-between gap-4 text-xs ${
            isLight ? 'border-navy/10 text-muted' : 'border-white/[0.06] text-slate-600'
          }`}
        >
          <p>
            © {new Date().getFullYear()} {SITE.name}. {t('footer.rights')}
          </p>
          <div className="flex flex-wrap gap-4 sm:gap-6">
            {legalLinks.map((l) => (
              <Link key={l.to} to={l.to} className="hover:text-accent">
                {t(l.label)}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
