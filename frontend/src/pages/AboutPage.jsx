import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import PageHero from '../components/sections/PageHero';
import SectionHeader from '../components/ui/SectionHeader';
import GlassCard from '../components/ui/GlassCard';
import Icon from '../components/ui/Icons';
import { images } from '../lib/images';
import { fadeUp, staggerContainer } from '../animations/variants';
import { useThemeMode } from '../context/ThemeContext';
import { aboutValues } from '../data/services';
import { journeySteps } from '../data/practiceAreas';
import { SITE } from '../constants/site';

function AboutPage() {
  const { t, i18n } = useTranslation();
  const { theme } = useThemeMode();
  const isLight = theme === 'light';

  const commitments = ['about.commitment1', 'about.commitment2', 'about.commitment3', 'about.commitment4'];
  const growthItems = ['about.growth1', 'about.growth2', 'about.growth3', 'about.growth4'];

  return (
    <>
      <Helmet>
        <html lang={i18n.language === 'hi' ? 'hi' : 'en'} />
        <title>{t('meta.about')}</title>
        <meta name="description" content={t('meta.aboutDesc')} />
        <meta property="og:title" content={t('meta.about')} />
        <meta property="og:description" content={t('meta.aboutDesc')} />
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LegalService',
            name: SITE.name,
            description: t('meta.aboutDesc'),
            url: typeof window !== 'undefined' ? window.location.origin : '',
            telephone: SITE.phone,
            email: SITE.email,
            address: {
              '@type': 'PostalAddress',
              streetAddress: SITE.address,
              addressLocality: 'Lucknow',
              addressRegion: 'Uttar Pradesh',
              addressCountry: 'IN',
            },
          })}
        </script>
      </Helmet>

      <PageHero
        kicker={t('about.storyKicker')}
        title={t('about.title')}
        titleHighlight={t('about.titleHighlight')}
        subtitle={t('about.subtitle')}
        backgroundImage={images.aboutHero}
        primaryTo="/contact"
        primaryLabel={t('nav.bookConsultation')}
        secondaryTo="/focus-areas"
        secondaryLabel={t('nav.practiceAreas')}
      />

      <section className={`section-padding border-b ${isLight ? 'bg-white border-navy/10' : 'bg-secondary/20 border-white/[0.06]'}`}>
        <div className="container-premium">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center"
          >
            <motion.div variants={fadeUp} className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-3 rounded-3xl bg-gradient-to-br from-accent/25 via-transparent to-accent/10 blur-sm" aria-hidden />
                <img
                  src={images.advocateCourtCorridor}
                  alt={t('about.advocateAlt')}
                  className="relative w-full rounded-2xl object-cover object-top aspect-[3/4] shadow-depth-lg ring-1 ring-white/10"
                  loading="eager"
                />
                <div className={`absolute bottom-4 left-4 right-4 rounded-xl border px-4 py-3 backdrop-blur-md ${
                  isLight ? 'border-navy/10 bg-off-white/90' : 'border-white/10 bg-primary/80'
                }`}>
                  <p className={`font-heading text-sm ${isLight ? 'text-ink' : 'text-off-white'}`}>{t('about.advocateName')}</p>
                  <p className="text-xs text-accent mt-0.5">{t('about.advocateRole')}</p>
                </div>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} className="lg:col-span-7 space-y-6">
              <div>
                <p className="section-kicker">{t('about.advocateKicker')}</p>
                <h2 className={`font-heading text-display-sm mt-3 ${isLight ? 'text-ink' : 'text-off-white'}`}>
                  {t('about.advocateName')}
                </h2>
                <p className="mt-2 text-sm font-medium text-accent">{t('about.advocateRole')}</p>
              </div>
              <p className={`text-lg leading-relaxed ${isLight ? 'text-muted' : 'text-slate-300'}`}>
                {t('about.advocateBio')}
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {[
                  { value: '2+', label: t('stats.years') },
                  { value: '130+', label: t('stats.cases') },
                  { value: '200+', label: t('stats.clients') },
                ].map((stat) => (
                  <GlassCard key={stat.label} className="p-4 text-center">
                    <p className="font-heading text-2xl text-accent tabular-nums">{stat.value}</p>
                    <p className={`mt-1 text-xs ${isLight ? 'text-muted' : 'text-slate-400'}`}>{stat.label}</p>
                  </GlassCard>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className={`section-padding ${isLight ? 'bg-off-white' : 'bg-primary'}`}>
        <div className="container-premium">
          <SectionHeader
            kicker={t('about.storyKicker')}
            title={t('about.storyTitle')}
            align="left"
          />
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
          >
            <motion.div variants={fadeUp} className="space-y-5 order-2 lg:order-1">
              <p className={`text-lg leading-relaxed ${isLight ? 'text-muted' : 'text-slate-300'}`}>
                {t('about.storyP1')}
              </p>
              <p className={`text-lg leading-relaxed ${isLight ? 'text-muted' : 'text-slate-300'}`}>
                {t('about.storyP2')}
              </p>
              <ul className="space-y-3 text-sm">
                {growthItems.map((k) => (
                  <li key={k} className={`flex gap-3 ${isLight ? 'text-muted' : 'text-slate-300'}`}>
                    <span className="text-accent shrink-0">→</span> {t(k)}
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={fadeUp} className="space-y-5 order-1 lg:order-2">
              <img
                src={images.advocateOffice}
                alt={t('about.officeAlt')}
                className="w-full rounded-2xl object-cover aspect-[4/3] shadow-depth-md ring-1 ring-white/10"
                loading="lazy"
              />
              <GlassCard className="p-8 space-y-6">
                <h3 className={`font-heading text-xl ${isLight ? 'text-ink' : 'text-off-white'}`}>
                  {t('about.commitmentTitle')}
                </h3>
                <ul className="space-y-3 text-sm">
                  {commitments.map((k) => (
                    <li
                      key={k}
                      className={`flex gap-3 ${isLight ? 'text-muted' : 'text-slate-300'}`}
                    >
                      <span className="text-accent">✓</span> {t(k)}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className={`section-padding ${isLight ? 'bg-white' : 'bg-secondary/30'}`}>
        <div className="container-premium">
          <SectionHeader
            kicker={t('about.valuesKicker')}
            title={t('about.valuesTitle')}
          />
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5"
          >
            {aboutValues.map((v) => (
              <GlassCard key={v.key} variants={fadeUp} className="h-full p-6 space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/15 text-accent">
                    <Icon name={v.icon} className="w-6 h-6" />
                  </div>
                  <h3 className={`font-display font-semibold text-lg ${isLight ? 'text-ink' : 'text-off-white'}`}>
                    {t(`about.${v.key}`)}
                  </h3>
                  <p className={`text-sm leading-relaxed ${isLight ? 'text-muted' : 'text-slate-400'}`}>
                    {t(`about.${v.key}Desc`)}
                  </p>
                </GlassCard>
            ))}
          </motion.div>
        </div>
      </section>

      <section className={`section-padding ${isLight ? 'bg-off-white' : 'bg-primary'}`}>
        <div className="container-premium">
          <SectionHeader kicker={t('journey.kicker')} title={t('journey.title')} />
          <div className="relative">
            <div
              className="hidden md:block absolute top-8 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent"
              aria-hidden
            />
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-5 gap-8"
            >
              {journeySteps.map((step) => (
                <motion.div key={step.step} variants={fadeUp} className="text-center md:text-left">
                  <div className="mx-auto md:mx-0 flex h-16 w-16 items-center justify-center rounded-2xl border border-accent/30 bg-accent/10 font-heading text-xl text-accent mb-4">
                    {step.step}
                  </div>
                  <h3 className={`font-semibold ${isLight ? 'text-ink' : 'text-off-white'}`}>
                    {t(step.titleKey)}
                  </h3>
                  <p className={`mt-2 text-sm ${isLight ? 'text-muted' : 'text-slate-400'}`}>
                    {t(step.descKey)}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

    </>
  );
}

export default AboutPage;
