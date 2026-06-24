import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { SITE } from '../constants/site';

function LegalPageLayout({ title, metaDesc, children }) {
  const { i18n } = useTranslation();
  const canonical =
    typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : '';

  return (
    <>
      <Helmet>
        <html lang={i18n.language === 'hi' ? 'hi' : 'en'} />
        <title>{title}</title>
        <meta name="description" content={metaDesc} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={metaDesc} />
        <link rel="canonical" href={canonical} />
      </Helmet>
      <article className="section-padding">
        <div className="container-premium max-w-3xl">
          <h1 className="font-display text-3xl sm:text-4xl font-semibold mb-8">{title}</h1>
          <div className="prose-legal space-y-6 text-sm sm:text-base leading-relaxed opacity-90">
            {children}
          </div>
          <p className="mt-12 text-xs opacity-60">
            Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </article>
    </>
  );
}

export default function PrivacyPolicy() {
  const { t } = useTranslation();

  return (
    <LegalPageLayout title={t('legal.privacyTitle')} metaDesc={t('legal.privacyMeta')}>
      <p>{t('legal.privacyIntro', { firm: SITE.name })}</p>
      <section>
        <h2 className="font-display text-xl font-semibold mb-3">{t('legal.privacyCollectionTitle')}</h2>
        <p>{t('legal.privacyCollectionBody')}</p>
      </section>
      <section>
        <h2 className="font-display text-xl font-semibold mb-3">{t('legal.privacyUseTitle')}</h2>
        <p>{t('legal.privacyUseBody')}</p>
      </section>
      <section>
        <h2 className="font-display text-xl font-semibold mb-3">{t('legal.privacySharingTitle')}</h2>
        <p>{t('legal.privacySharingBody')}</p>
      </section>
      <section>
        <h2 className="font-display text-xl font-semibold mb-3">{t('legal.privacyRightsTitle')}</h2>
        <p>{t('legal.privacyRightsBody', { email: SITE.email })}</p>
      </section>
      <section>
        <h2 className="font-display text-xl font-semibold mb-3">{t('legal.privacySecurityTitle')}</h2>
        <p>{t('legal.privacySecurityBody')}</p>
      </section>
    </LegalPageLayout>
  );
}
