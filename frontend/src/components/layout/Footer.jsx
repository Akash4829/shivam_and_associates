import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useThemeMode } from '../../context/ThemeContext';
import { SITE } from '../../constants/site';
const practiceLinks = [
  { key: 'practice.litigation', to: '/services' },
  { key: 'practice.advisory', to: '/services' },
  { key: 'practice.dispute', to: '/focus-areas' },
  { key: 'practice.property', to: '/focus-areas' },
  { key: 'practice.corporate', to: '/services' },
  { key: 'practice.family', to: '/focus-areas' },
];

const quickLinks = [
  { label: 'nav.services', to: '/services' },
  { label: 'nav.practiceAreas', to: '/focus-areas' },
  { label: 'nav.successStories', to: '/case-studies' },
  { label: 'nav.about', to: '/about' },
  { label: 'nav.internship', to: '/internship' },
  { label: 'nav.contact', to: '/contact' },
];

export function Footer() {
  const { t } = useTranslation();
  const { theme } = useThemeMode();
  const isLight = theme === 'light';
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const whatsappUrl = `https://wa.me/${SITE.whatsapp}`;
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
      <div className="container-premium py-20 md:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-10">
          <div className="lg:col-span-4 space-y-5">
            <Link to="/" className="inline-flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-accent to-amber-600">
                <span className="text-primary font-bold">SM</span>
              </div>
              <span className="font-display font-semibold text-lg">{SITE.name}</span>
            </Link>
            <p className={`text-sm leading-relaxed max-w-sm ${mutedText}`}>{t('footer.tagline')}</p>
            <p className="text-xs font-semibold tracking-widest uppercase text-accent">{t('footer.trusted')}</p>
            <div className="flex gap-3 pt-2">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex h-10 w-10 items-center justify-center rounded-xl border border-accent/30 text-accent hover:bg-accent/10" aria-label="WhatsApp">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
              </a>
            </div>
          </div>
          <div className="lg:col-span-2">
            <h4 className="section-kicker !mb-4">{t('footer.practiceAreas')}</h4>
            <ul className="space-y-2.5 text-sm">
              {practiceLinks.map((l) => (
                <li key={l.key}><Link to={l.to} className={linkHover}>{t(l.key)}</Link></li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-2">
            <h4 className="section-kicker !mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2.5 text-sm">
              {quickLinks.map((l) => (
                <li key={l.to}><Link to={l.to} className={linkHover}>{t(l.label)}</Link></li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-4 space-y-6">
            <div>
              <h4 className="section-kicker !mb-4">{t('footer.contact')}</h4>
              <div className={`space-y-2 text-sm ${mutedText}`}>
                <p><a href={`tel:${SITE.phone}`} className="hover:text-accent">{SITE.phoneDisplay}</a></p>
                <p><a href={`mailto:${SITE.email}`} className="hover:text-accent break-all">{SITE.email}</a></p>
                <p>{SITE.address}</p>
                <p>{SITE.hours}</p>
              </div>
            </div>
            <div>
              <h4 className="section-kicker !mb-3">{t('footer.newsletter')}</h4>
              <p className={`text-xs mb-3 ${isLight ? 'text-muted' : 'text-slate-500'}`}>{t('footer.newsletterDesc')}</p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email.trim()) {
                    setSubscribed(true);
                    setEmail('');
                  }
                }}
                className="flex gap-2"
              >
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('footer.emailPlaceholder')} className={`flex-1 rounded-xl border px-4 py-2.5 text-sm ${isLight ? 'border-navy/15 bg-white text-ink' : 'border-white/10 bg-white/5 text-off-white'}`} />
                <button type="submit" className="rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-primary">{t('footer.subscribe')}</button>
              </form>
              {subscribed && (
                <p className="mt-2 text-xs font-medium text-accent">{t('footer.subscribed')}</p>
              )}
            </div>
          </div>
        </div>
        <div className={`mt-16 pt-8 border-t flex flex-col sm:flex-row justify-between gap-4 text-xs ${isLight ? 'border-navy/10 text-muted' : 'border-white/[0.06] text-slate-600'}`}>
          <p>© {new Date().getFullYear()} {SITE.name}. {t('footer.rights')}</p>
          <div className="flex gap-6">
            <Link to="/contact" className="hover:text-accent">{t('footer.privacy')}</Link>
            <Link to="/contact" className="hover:text-accent">{t('footer.terms')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
