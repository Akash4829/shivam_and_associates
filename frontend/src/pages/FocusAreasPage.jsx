import React from 'react';
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
import { practiceAreas, faqItems } from '../data/practiceAreas';
import { focusAreas } from '../data/services';
function FocusAreasPage() {
  const { t, i18n } = useTranslation();
  const { theme } = useThemeMode();
  const isLight = theme === 'light';
  const faqList = faqItems.map((f, i) => ({ id: i, question: t(f.qKey), answer: t(f.aKey) }));

  return (
    <>
      <Helmet>
        <html lang={i18n.language === 'hi' ? 'hi' : 'en'} />
        <title>{t('meta.focus')}</title>
        <meta name="description" content={t('meta.focusDesc')} />
        <meta property="og:title" content={t('meta.focus')} />
        <meta property="og:description" content={t('meta.focusDesc')} />
      </Helmet>

      <PageHero
        kicker={t('focus.kicker')}
        title={t('focus.title')}
        titleHighlight={t('focus.titleHighlight')}
        subtitle={t('focus.subtitle')}
        backgroundImage={images.courtSteps}
        primaryTo="/contact"
        primaryLabel={t('cta.form')}
        secondaryTo="/case-studies"
        secondaryLabel={t('nav.successStories')}
      />

      <section className={`section-padding ${isLight ? 'bg-off-white' : 'bg-primary'}`}>
        <div className="container-premium">
          <SectionHeader kicker={t('focus.kicker')} title={t('practice.title')} subtitle={t('practice.subtitle')} />
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[minmax(200px,auto)]"
          >
            {practiceAreas.map((area) => (
              <motion.div key={area.id} variants={fadeUp} className={area.span}>
                <BentoCard
                  icon={area.icon}
                  title={t(area.titleKey)}
                  description={t(area.descKey)}
                  to={area.to}
                  ctaLabel={t('practice.learnMore')}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section className={`section-padding ${isLight ? 'bg-white' : 'bg-secondary/30'}`}>
        <div className="container-premium space-y-16">
          {focusAreas.map((f, idx) => (
            <motion.div
              key={f.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6 }}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-10 items-center ${
                idx % 2 === 1 ? 'lg:[&>*:first-child]:order-2' : ''
              }`}
            >
              <div className="lg:col-span-5">
                <GlassCard className="aspect-[5/4] flex items-center justify-center bg-gradient-to-br from-accent/15 via-transparent to-accent/5">
                  <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-accent/20 text-accent">
                    <Icon name={f.icon} className="w-9 h-9" />
                  </div>
                </GlassCard>
              </div>
              <div className="lg:col-span-7 space-y-5">
                <p className="section-kicker">{t(f.titleKey)}</p>
                <h2 className={`font-heading text-display-md ${isLight ? 'text-ink' : 'text-off-white'}`}>
                  {t(f.headlineKey)}
                </h2>
                <ul className="space-y-3">
                  {f.bulletsKeys.map((bk) => (
                    <li
                      key={bk}
                      className={`flex gap-3 text-base leading-relaxed ${
                        isLight ? 'text-muted' : 'text-slate-300'
                      }`}
                    >
                      <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-accent shrink-0" />
                      {t(bk)}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <FAQBlock kicker={t('faq.kicker')} title={t('faq.title')} items={faqList} />

    </>
  );
}

export default FocusAreasPage;
