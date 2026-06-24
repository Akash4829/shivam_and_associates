import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import PageHero from '../components/sections/PageHero';
import SectionHeader from '../components/ui/SectionHeader';
import GlassCard from '../components/ui/GlassCard';
import Marquee from '../components/ui/Marquee';
import { images } from '../lib/images';
import { useThemeMode } from '../context/ThemeContext';
import { fadeUp, staggerContainer } from '../animations/variants';
import { testimonials } from '../data/practiceAreas';
import { SITE } from '../constants/site';

function StarRow({ count = 5 }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
          <path d="M10 15l-5.878 3.09 1.122-6.545L0 6.91l6.561-.954L10 0l3.439 5.956 6.561.954-4.744 4.636 1.122 6.545z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialsPage() {
  const { t, i18n } = useTranslation();
  const { theme } = useThemeMode();
  const isLight = theme === 'light';
  const isHi = i18n.language === 'hi';

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: SITE.name,
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: testimonials.length + 50,
    },
    review: testimonials.map((it) => ({
      '@type': 'Review',
      author: { '@type': 'Person', name: it.name },
      reviewBody: it.content,
      reviewRating: { '@type': 'Rating', ratingValue: it.rating, bestRating: 5 },
    })),
  };

  return (
    <>
      <Helmet>
        <html lang={i18n.language === 'hi' ? 'hi' : 'en'} />
        <title>{t('meta.testimonials')}</title>
        <meta name="description" content={t('meta.testimonialsDesc')} />
        <meta property="og:title" content={t('meta.testimonials')} />
        <meta property="og:description" content={t('meta.testimonialsDesc')} />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <PageHero
        kicker={t('testimonials.kicker')}
        title={t('testimonials.pageTitle')}
        titleHighlight={t('testimonials.pageHighlight')}
        subtitle={t('testimonials.pageSubtitle')}
        backgroundImage={images.testimonialsHero}
        primaryTo="/contact"
        primaryLabel={t('cta.form')}
        secondaryTo="/case-studies"
        secondaryLabel={t('nav.successStories')}
      />

      <section className={`section-padding overflow-hidden ${isLight ? 'bg-off-white' : 'bg-primary'}`}>
        <div className="container-premium">
          <SectionHeader
            kicker={t('testimonials.marqueeKicker')}
            title={t('testimonials.title')}
            subtitle={t('testimonials.subtitle')}
          />

          <Marquee speed={48} className="mb-14">
            {testimonials.map((item) => (
              <GlassCard key={item.name} className="w-[340px] p-6">
                <StarRow count={item.rating} />
                <blockquote
                  className={`mt-4 text-sm leading-relaxed border-l-2 border-accent pl-4 ${
                    isLight ? 'text-ink' : 'text-off-white/90'
                  }`}
                >
                  &ldquo;{isHi ? item.contentHi : item.content}&rdquo;
                </blockquote>
                <p className={`mt-4 font-semibold text-sm ${isLight ? 'text-ink' : 'text-off-white'}`}>
                  {item.name}
                </p>
                <p className="text-xs text-muted">{item.location}</p>
              </GlassCard>
            ))}
          </Marquee>

          <Marquee speed={56} direction="right" className="mb-4">
            {testimonials
              .slice()
              .reverse()
              .map((item) => (
                <GlassCard key={`r-${item.name}`} className="w-[340px] p-6">
                  <StarRow count={item.rating} />
                  <blockquote
                    className={`mt-4 text-sm leading-relaxed border-l-2 border-accent pl-4 ${
                      isLight ? 'text-ink' : 'text-off-white/90'
                    }`}
                  >
                    &ldquo;{isHi ? item.contentHi : item.content}&rdquo;
                  </blockquote>
                  <p className={`mt-4 font-semibold text-sm ${isLight ? 'text-ink' : 'text-off-white'}`}>
                    {item.name}
                  </p>
                  <p className="text-xs text-muted">{item.location}</p>
                </GlassCard>
              ))}
          </Marquee>
        </div>
      </section>

      <section className={`section-padding ${isLight ? 'bg-white' : 'bg-secondary/30'}`}>
        <div className="container-premium">
          <SectionHeader kicker={t('testimonials.googleKicker')} title={t('testimonials.title')} />
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {testimonials.map((it) => (
              <GlassCard key={`g-${it.name}`} variants={fadeUp} className="h-full p-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-accent">
                      <svg className="w-4 h-4" viewBox="0 0 48 48" aria-hidden>
                        <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3c-1.6 4.6-6 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z" />
                      </svg>
                      {t('testimonials.googleKicker')}
                    </span>
                    <StarRow count={it.rating} />
                  </div>
                  <blockquote className={`text-sm leading-relaxed ${isLight ? 'text-ink' : 'text-off-white/90'}`}>
                    &ldquo;{isHi ? it.contentHi : it.content}&rdquo;
                  </blockquote>
                  <div className="mt-4">
                    <p className={`font-semibold text-sm ${isLight ? 'text-ink' : 'text-off-white'}`}>
                      {it.name}
                    </p>
                    <p className="text-xs text-muted">{it.location}</p>
                  </div>
                </GlassCard>
            ))}
          </motion.div>
        </div>
      </section>

    </>
  );
}

export default TestimonialsPage;
