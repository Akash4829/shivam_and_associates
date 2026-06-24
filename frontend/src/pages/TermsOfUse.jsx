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

export default function TermsOfUse() {
  const { t } = useTranslation();

  return (
    <LegalPageLayout title={t('legal.termsTitle')} metaDesc={t('legal.termsMeta')}>
      <p>{t('legal.termsIntro', { firm: SITE.name })}</p>
      <section>
        <h2 className="font-display text-xl font-semibold mb-3">{t('legal.termsAcceptanceTitle')}</h2>
        <p>{t('legal.termsAcceptanceBody')}</p>
      </section>
      <section>
        <h2 className="font-display text-xl font-semibold mb-3">{t('legal.termsNoAdviceTitle')}</h2>
        <p>{t('legal.termsNoAdviceBody')}</p>
      </section>
      <section>
        <h2 className="font-display text-xl font-semibold mb-3">{t('legal.termsNoRelationshipTitle')}</h2>
        <p>{t('legal.termsNoRelationshipBody')}</p>
      </section>
      <section>
        <h2 className="font-display text-xl font-semibold mb-3">{t('legal.termsLiabilityTitle')}</h2>
        <p>{t('legal.termsLiabilityBody', { firm: SITE.name })}</p>
      </section>
      <section>
        <h2 className="font-display text-xl font-semibold mb-3">{t('legal.termsGoverningTitle')}</h2>
        <p>{t('legal.termsGoverningBody')}</p>
      </section>
      <section>
        <h2 className="font-display text-xl font-semibold mb-3">{t('legal.termsContactTitle')}</h2>
        <p>{t('legal.termsContactBody', { email: SITE.email })}</p>
      </section>
    </LegalPageLayout>
  );
}
