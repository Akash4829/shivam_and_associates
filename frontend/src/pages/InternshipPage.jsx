import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import PageHero from '../components/sections/PageHero';
import FAQBlock from '../components/sections/FAQBlock';
import SectionHeader from '../components/ui/SectionHeader';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import InternshipApplicationForm from '../components/forms/InternshipApplicationForm';
import { images } from '../lib/images';
import { SITE } from '../constants/site';
import { useThemeMode } from '../context/ThemeContext';
import { fadeUp, staggerContainer } from '../animations/variants';
import { internshipScopeKeys, internshipLookForKeys, internshipFaqKeys } from '../data/services';

function InternshipPage() {
  const { t, i18n } = useTranslation();
  const { theme } = useThemeMode();
  const isLight = theme === 'light';

  useEffect(() => {
    if (window.location.hash === '#apply') {
      const el = document.getElementById('apply');
      if (el) setTimeout(() => el.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
    }
  }, []);

  const faqList = internshipFaqKeys.map((f, i) => ({
    id: i,
    question: t(f.qKey),
    answer: t(f.aKey),
  }));

  return (
    <>
      <Helmet>
        <html lang={i18n.language === 'hi' ? 'hi' : 'en'} />
        <title>{t('meta.internship')}</title>
        <meta name="description" content={t('meta.internshipDesc')} />
        <meta property="og:title" content={t('meta.internship')} />
        <meta property="og:description" content={t('meta.internshipDesc')} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'JobPosting',
            title: t('internship.programmeTitle'),
            description: t('internship.programmeDesc'),
            hiringOrganization: {
              '@type': 'Organization',
              name: SITE.name,
              sameAs: typeof window !== 'undefined' ? window.location.origin : '',
            },
            jobLocation: {
              '@type': 'Place',
              address: {
                '@type': 'PostalAddress',
                addressLocality: 'Lucknow',
                addressRegion: 'Uttar Pradesh',
                addressCountry: 'IN',
              },
            },
          })}
        </script>
      </Helmet>

      <PageHero
        kicker={t('internship.programmeKicker')}
        title={t('internship.title')}
        titleHighlight={t('internship.titleHighlight')}
        subtitle={t('internship.subtitle')}
        backgroundImage={images.internshipHero}
        primaryHref="#apply"
        primaryLabel={t('internship.applyNow')}
        secondaryTo="/contact"
        secondaryLabel={t('nav.bookConsultation')}
      />

      <section className={`section-padding ${isLight ? 'bg-off-white' : 'bg-primary'}`}>
        <div className="container-premium max-w-3xl text-center">
          <SectionHeader
            kicker={t('internship.programmeKicker')}
            title={t('internship.programmeTitle')}
            subtitle={t('internship.programmeDesc')}
            align="center"
          />
        </div>
      </section>

      <section id="apply" className={`section-padding ${isLight ? 'bg-white' : 'bg-secondary/30'}`}>
        <div className="container-premium">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            <div className="lg:col-span-7 space-y-12">
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                className="space-y-5"
              >
                <motion.h2
                  variants={fadeUp}
                  className={`font-heading text-2xl md:text-3xl ${isLight ? 'text-ink' : 'text-off-white'}`}
                >
                  {t('internship.scopeTitle')}
                </motion.h2>
                <motion.p
                  variants={fadeUp}
                  className={`text-base leading-relaxed ${isLight ? 'text-muted' : 'text-slate-400'}`}
                >
                  {t('internship.scopeIntro')}
                </motion.p>
                <motion.ul variants={fadeUp} className="space-y-2.5">
                  {internshipScopeKeys.map((k) => (
                    <li
                      key={k}
                      className={`flex gap-3 text-[15px] leading-relaxed ${
                        isLight ? 'text-ink/80' : 'text-slate-300'
                      }`}
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      {t(k)}
                    </li>
                  ))}
                </motion.ul>
              </motion.div>

              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                className="space-y-5"
              >
                <motion.h2
                  variants={fadeUp}
                  className={`font-heading text-2xl md:text-3xl ${isLight ? 'text-ink' : 'text-off-white'}`}
                >
                  {t('internship.lookForTitle')}
                </motion.h2>
                <motion.p
                  variants={fadeUp}
                  className={`text-base leading-relaxed ${isLight ? 'text-muted' : 'text-slate-400'}`}
                >
                  {t('internship.lookForIntro')}
                </motion.p>
                <motion.ul variants={fadeUp} className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                  {internshipLookForKeys.map((k) => (
                    <li
                      key={k}
                      className={`flex gap-3 text-[15px] leading-relaxed ${
                        isLight ? 'text-ink/80' : 'text-slate-300'
                      }`}
                    >
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                      {t(k)}
                    </li>
                  ))}
                </motion.ul>
              </motion.div>
            </div>
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-28">
                <InternshipApplicationForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`section-padding ${isLight ? 'bg-off-white' : 'bg-primary'}`}>
        <div className="container-premium max-w-3xl">
          <GlassCard className="p-10 text-center space-y-5">
            <h2 className={`font-heading text-2xl md:text-3xl ${isLight ? 'text-ink' : 'text-off-white'}`}>
              {t('internship.durationTitle')}
            </h2>
            <p className={`leading-relaxed ${isLight ? 'text-muted' : 'text-slate-300'}`}>
              {t('internship.durationP1')}
            </p>
            <p className={`text-sm leading-relaxed ${isLight ? 'text-muted' : 'text-slate-400'}`}>
              {t('internship.durationP2')}
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-4">
              <Button to="/contact">{t('internship.requestAppointment')}</Button>
              <Button href="#apply" variant="secondary">
                {t('internship.backToForm')}
              </Button>
            </div>
          </GlassCard>
        </div>
      </section>

      <FAQBlock kicker={t('faq.kicker')} title={t('internship.faqTitle')} items={faqList} />
    </>
  );
}

export default InternshipPage;
