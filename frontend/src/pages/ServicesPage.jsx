import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import PageHero from '../components/sections/PageHero';
import FAQBlock from '../components/sections/FAQBlock';
import SectionHeader from '../components/ui/SectionHeader';
import GlassCard from '../components/ui/GlassCard';
import BentoCard from '../components/ui/BentoCard';
import Icon from '../components/ui/Icons';
import { images } from '../lib/images';
import { useThemeMode } from '../context/ThemeContext';
import { fadeUp, staggerContainer } from '../animations/variants';
import { serviceCatalog, servicePhases } from '../data/services';
import { faqItems } from '../data/practiceAreas';
import { SITE } from '../constants/site';

function ServicesPage() {
  const { t, i18n } = useTranslation();
  const { theme } = useThemeMode();
  const isLight = theme === 'light';
  const [activeId, setActiveId] = useState(serviceCatalog[0].id);
  const active = serviceCatalog.find((s) => s.id === activeId) || serviceCatalog[0];

  const faqList = faqItems.map((f, i) => ({ id: i, question: t(f.qKey), answer: t(f.aKey) }));

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Legal services',
    provider: {
      '@type': 'LegalService',
      name: SITE.name,
      address: SITE.address,
    },
    areaServed: 'IN',
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: t('services.title'),
      itemListElement: serviceCatalog.map((s) => ({
        '@type': 'Offer',
        itemOffered: { '@type': 'Service', name: t(s.titleKey), description: t(s.descKey) },
      })),
    },
  };

  return (
    <>
      <Helmet>
        <html lang={i18n.language === 'hi' ? 'hi' : 'en'} />
        <title>{t('meta.services')}</title>
        <meta name="description" content={t('meta.servicesDesc')} />
        <meta property="og:title" content={t('meta.services')} />
        <meta property="og:description" content={t('meta.servicesDesc')} />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <PageHero
        kicker={t('practice.kicker')}
        title={t('services.title')}
        titleHighlight={t('services.titleHighlight')}
        subtitle={t('services.subtitle')}
        backgroundImage={images.servicesHero}
        primaryTo="/contact"
        primaryLabel={t('nav.bookConsultation')}
        secondaryTo="/case-studies"
        secondaryLabel={t('nav.successStories')}
      />

      <section className={`section-padding ${isLight ? 'bg-off-white' : 'bg-primary'}`}>
        <div className="container-premium">
          <SectionHeader
            kicker={t('practice.kicker')}
            title={t('services.title')}
            subtitle={t('services.subtitle')}
            align="center"
          />
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.05 }}
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6"
          >
            {serviceCatalog.map((s) => (
              <motion.div key={s.id} variants={fadeUp} className={s.span}>
                <BentoCard
                  icon={s.icon}
                  image={images[s.imageKey]}
                  title={t(s.titleKey)}
                  description={t(s.descKey)}
                  ctaLabel={t('practice.learnMore')}
                  active={activeId === s.id}
                  onClick={() => setActiveId(s.id)}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className={`section-padding ${isLight ? 'bg-white' : 'bg-secondary/30'}`}>
        <div className="container-premium grid grid-cols-1 lg:grid-cols-12 gap-10">
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-28 space-y-4">
              <p className="section-kicker">{t('services.navTitle')}</p>
              <nav aria-label={t('services.navTitle')} className="space-y-1.5">
                {serviceCatalog.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setActiveId(s.id)}
                    className={`w-full text-left flex items-center gap-3 rounded-xl border px-4 py-3 transition-all ${
                      activeId === s.id
                        ? 'border-accent/40 bg-accent/10 text-accent'
                        : isLight
                          ? 'border-navy/10 text-ink hover:bg-navy/5'
                          : 'border-white/10 text-off-white hover:bg-white/5'
                    }`}
                  >
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/15 text-accent">
                      <Icon name={s.icon} className="w-4 h-4" />
                    </span>
                    <span className="text-sm font-medium">{t(s.titleKey)}</span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          <div className="lg:col-span-8 space-y-12">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="space-y-6"
            >
              <div className="relative h-48 sm:h-56 rounded-2xl overflow-hidden ring-1 ring-white/10">
                <img
                  src={images[active.imageKey]}
                  alt=""
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" aria-hidden />
              </div>
              <p className="section-kicker">{t('practice.kicker')}</p>
              <h2 className={`font-heading text-display-md ${isLight ? 'text-ink' : 'text-off-white'}`}>
                {t(active.titleKey)}
              </h2>
              <p className={`text-base sm:text-lg leading-relaxed ${isLight ? 'text-muted' : 'text-slate-300'}`}>
                {t(active.longKey)}
              </p>

              <h3 className={`font-display font-semibold text-lg pt-2 ${isLight ? 'text-ink' : 'text-off-white'}`}>
                {t('services.relatedTitle')}
              </h3>
              <motion.div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {active.related.map((rid) => {
                  const r = serviceCatalog.find((x) => x.id === rid);
                  if (!r) return null;
                  return (
                    <BentoCard
                      key={r.id}
                      icon={r.icon}
                      image={images[r.imageKey]}
                      title={t(r.titleKey)}
                      description={t(r.descKey)}
                      ctaLabel={t('practice.learnMore')}
                      onClick={() => setActiveId(r.id)}
                    />
                  );
                })}
              </motion.div>

              <motion.div className="pt-4">
                <h3 className={`font-display font-semibold text-lg mb-4 ${isLight ? 'text-ink' : 'text-off-white'}`}>
                  {t('services.faqTitle')}
                </h3>
                <FAQBlock
                  items={active.faqKeys.map((k, i) => ({
                    id: `${active.id}-${i}`,
                    question: t(k),
                    answer: t(k.replace('q', 'a')),
                  }))}
                  injectSchema={false}
                  className="!py-0 !bg-transparent"
                />
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className={`section-padding ${isLight ? 'bg-off-white' : 'bg-primary'}`}>
        <div className="container-premium">
          <SectionHeader
            kicker={t('services.phasesKicker')}
            title={t('services.phasesTitle')}
            subtitle={t('services.phasesSubtitle')}
            align="center"
          />
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {servicePhases.map((p) => (
              <GlassCard key={p.id} variants={fadeUp} className="h-full p-6 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/15 text-accent font-heading">
                    {p.id}
                  </span>
                  <Icon name={p.icon} className="w-5 h-5 text-accent/80" />
                </div>
                <h3 className={`font-display font-semibold text-base ${isLight ? 'text-ink' : 'text-off-white'}`}>
                  {t(p.titleKey)}
                </h3>
                <p className={`text-sm leading-relaxed ${isLight ? 'text-muted' : 'text-slate-400'}`}>
                  {t(p.descKey)}
                </p>
              </GlassCard>
            ))}
          </motion.div>
        </div>
      </section>

      <FAQBlock kicker={t('faq.kicker')} title={t('faq.title')} items={faqList} />

    </>
  );
}

export default ServicesPage;
