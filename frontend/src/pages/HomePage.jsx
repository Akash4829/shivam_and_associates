import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import HeroSection from '../components/sections/home/HeroSection';
import {
  TrustBar,
  WhyChooseUs,
  PracticeAreasBento,
  ClientJourney,
  CaseResults,
  TestimonialsSection,
  FAQSection,
} from '../components/sections/home/HomeSections';

function HomePage() {
  const { t, i18n } = useTranslation();

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: 'Shivam Mishra & Associates',
    description: t('meta.homeDesc'),
    areaServed: 'IN',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Prayagraj',
      addressRegion: 'Uttar Pradesh',
      addressCountry: 'IN',
    },
  };

  return (
    <>
      <Helmet>
        <html lang={i18n.language === 'hi' ? 'hi' : 'en'} />
        <title>{t('meta.home')}</title>
        <meta name="description" content={t('meta.homeDesc')} />
        <meta property="og:title" content={t('meta.home')} />
        <meta property="og:description" content={t('meta.homeDesc')} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content={i18n.language === 'hi' ? 'hi_IN' : 'en_IN'} />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <HeroSection />
      <TrustBar />
      <WhyChooseUs />
      <PracticeAreasBento />
      <ClientJourney />
      <CaseResults />
      <TestimonialsSection />
      <FAQSection />
    </>
  );
}

export default HomePage;
