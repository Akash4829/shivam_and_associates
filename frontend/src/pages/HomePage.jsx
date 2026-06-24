import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { SITE } from '../constants/site';
import HeroSection from '../components/sections/home/HeroSection';
import {
  TrustBar,
  PracticeAreasBento,
  TestimonialsSection,
  FinalCTA,
} from '../components/sections/home/HomeSections';

const SITE_URL = typeof window !== 'undefined' ? window.location.origin : 'https://shivammishraassociates.com';

function HomePage() {
  const { t, i18n } = useTranslation();
  const title = t('meta.home');
  const description = t('meta.homeDesc');

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: SITE.name,
    description,
    url: SITE_URL,
    telephone: SITE.phone,
    email: SITE.email,
    areaServed: 'IN',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Lucknow',
      addressRegion: 'Uttar Pradesh',
      addressCountry: 'IN',
    },
  };

  return (
    <>
      <Helmet>
        <html lang={i18n.language === 'hi' ? 'hi' : 'en'} />
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={SITE_URL} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={SITE_URL} />
        <meta property="og:locale" content={i18n.language === 'hi' ? 'hi_IN' : 'en_IN'} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <HeroSection />
      <TrustBar />
      <PracticeAreasBento />
      <TestimonialsSection />
      <FinalCTA />
    </>
  );
}

export default HomePage;
