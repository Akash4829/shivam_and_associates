import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { legalServiceSchema } from '../constants/site';
import HeroSection from '../components/sections/home/HeroSection';
import {
  TrustBar,
  PracticeAreasBento,
  AboutAdvocate,
  HomeServices,
  WhyChooseUs,
  CaseResults,
  TestimonialsSection,
  FinalCTA,
} from '../components/sections/home/HomeSections';

function HomePage() {
  const { t, i18n } = useTranslation();
  const title = t('meta.home');
  const description = t('meta.homeDesc');
  const url = typeof window !== 'undefined' ? window.location.origin : 'https://shivammishraassociates.com';

  return (
    <>
      <Helmet>
        <html lang={i18n.language === 'hi' ? 'hi' : 'en'} />
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={url} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:locale" content={i18n.language === 'hi' ? 'hi_IN' : 'en_IN'} />
        <meta name="twitter:card" content="summary_large_image" />
        <script type="application/ld+json">{JSON.stringify(legalServiceSchema({ description, url }))}</script>
      </Helmet>

      <HeroSection />
      <TrustBar />
      <PracticeAreasBento />
      <AboutAdvocate />
      <HomeServices />
      <WhyChooseUs />
      <CaseResults />
      <TestimonialsSection />
      <FinalCTA />
    </>
  );
}

export default HomePage;
