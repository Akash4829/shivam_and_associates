import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { SITE, TRUST_STRIP } from '../../../constants/site';
import { practiceAreas, whyChooseItems, testimonials, caseResults } from '../../../data/practiceAreas';
import { servicePhases } from '../../../data/services';
import { images } from '../../../lib/images';
import { fadeUp, staggerContainer } from '../../../animations/variants';
import SectionHeader from '../../ui/SectionHeader';
import Icon from '../../ui/Icons';
import Button from '../../ui/Button';
import { useThemeMode } from '../../../context/ThemeContext';

function surface(isLight) {
  return isLight ? 'bg-off-white' : 'bg-primary';
}
function altSurface(isLight) {
  return isLight ? 'bg-white' : 'bg-secondary';
}
function card(isLight) {
  return isLight ? 'border-border bg-white' : 'border-white/10 bg-secondary';
}
function titleCls(isLight) {
  return isLight ? 'text-ink' : 'text-off-white';
}
function mutedCls(isLight) {
  return isLight ? 'text-muted' : 'text-slate-400';
}

export function TrustBar() {
  const { t } = useTranslation();
  const { theme } = useThemeMode();
  const isLight = theme === 'light';

  return (
    <section className={`border-y py-10 md:py-12 ${isLight ? 'border-border bg-white' : 'border-white/10 bg-secondary'}`}>
      <div className="container-premium grid grid-cols-2 gap-8 md:grid-cols-4">
        {TRUST_STRIP.map((item) => (
          <div key={item.titleKey} className="text-center md:text-left">
            <p className="font-heading text-lg text-accent">{t(item.titleKey)}</p>
            <p className={`mt-1 text-sm ${mutedCls(isLight)}`}>{t(item.descKey)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function PracticeAreasBento() {
  const { t } = useTranslation();
  const { theme } = useThemeMode();
  const isLight = theme === 'light';

  return (
    <section className={`section-padding ${surface(isLight)}`}>
      <div className="container-premium">
        <SectionHeader kicker={t('practice.kicker')} title={t('practice.title')} subtitle={t('practice.subtitle')} />
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4"
        >
          {practiceAreas.map((area) => (
            <motion.div key={area.id} variants={fadeUp}>
              <Link
                to={area.to}
                className={`group flex h-full flex-col rounded-xl border p-6 transition-colors hover:border-accent/50 ${card(isLight)}`}
              >
                <span className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                  <Icon name={area.icon} className="h-5 w-5" />
                </span>
                <h3 className={`font-heading text-lg ${titleCls(isLight)}`}>{t(area.titleKey)}</h3>
                <p className={`mt-2 flex-1 text-sm leading-relaxed ${mutedCls(isLight)}`}>{t(area.descKey)}</p>
                <span className="mt-4 text-sm font-semibold text-accent">{t('practice.learnMore')} →</span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export function AboutAdvocate() {
  const { t } = useTranslation();
  const { theme } = useThemeMode();
  const isLight = theme === 'light';

  return (
    <section className={`section-padding ${altSurface(isLight)}`}>
      <div className="container-premium grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <img
            src={images.advocatePortrait}
            alt={t('about.advocateAlt')}
            className="aspect-[4/5] w-full rounded-xl object-cover object-top"
            loading="lazy"
          />
        </div>
        <div className="lg:col-span-7">
          <p className="section-kicker">{t('about.storyKicker')}</p>
          <h2 className={`font-heading text-display-md mt-2 ${titleCls(isLight)}`}>{t('homeAbout.title')}</h2>
          <p className={`mt-4 max-w-2xl text-base leading-relaxed ${mutedCls(isLight)}`}>{t('about.subtitle')}</p>
          <p className={`mt-4 max-w-2xl text-base leading-relaxed ${mutedCls(isLight)}`}>{t('homeAbout.body')}</p>
          <p className={`mt-4 text-sm font-medium ${titleCls(isLight)}`}>{SITE.advocateName}</p>
          <p className={`text-sm ${mutedCls(isLight)}`}>{t('hero.trustBadge')}</p>
          <div className="mt-8">
            <Button to="/about" variant="secondary">
              {t('homeAbout.cta')}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomeServices() {
  const { t } = useTranslation();
  const { theme } = useThemeMode();
  const isLight = theme === 'light';

  return (
    <section className={`section-padding ${surface(isLight)}`}>
      <div className="container-premium">
        <SectionHeader kicker={t('services.phasesKicker')} title={t('homeServices.title')} subtitle={t('homeServices.subtitle')} />
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {servicePhases.map((phase) => (
            <div key={phase.id} className={`rounded-xl border p-6 ${card(isLight)}`}>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-accent">0{phase.id}</p>
              <h3 className={`mt-3 font-heading text-lg ${titleCls(isLight)}`}>{t(phase.titleKey)}</h3>
              <p className={`mt-2 text-sm leading-relaxed ${mutedCls(isLight)}`}>{t(phase.descKey)}</p>
            </div>
          ))}
        </div>
        <p className="mt-8 text-center">
          <Link to="/services" className="text-sm font-semibold text-accent hover:underline">
            {t('homeServices.viewAll')} →
          </Link>
        </p>
      </div>
    </section>
  );
}

export function WhyChooseUs() {
  const { t } = useTranslation();
  const { theme } = useThemeMode();
  const isLight = theme === 'light';
  const items = whyChooseItems.slice(0, 5);

  return (
    <section className={`section-padding ${altSurface(isLight)}`}>
      <div className="container-premium">
        <SectionHeader kicker={t('whyChoose.kicker')} title={t('whyChoose.title')} subtitle={t('whyChoose.subtitle')} />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {items.map((item) => (
            <div key={item.key}>
              <h3 className={`font-heading text-base ${titleCls(isLight)}`}>{t(`whyChoose.${item.key}`)}</h3>
              <p className={`mt-2 text-sm leading-relaxed ${mutedCls(isLight)}`}>{t(`whyChoose.${item.key}Desc`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function CaseResults() {
  const { t, i18n } = useTranslation();
  const { theme } = useThemeMode();
  const isLight = theme === 'light';
  const isHi = i18n.language === 'hi';

  return (
    <section className={`section-padding ${surface(isLight)}`}>
      <div className="container-premium">
        <SectionHeader kicker={t('cases.kicker')} title={t('cases.title')} subtitle={t('cases.subtitle')} />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {caseResults.map((c) => (
            <article key={c.type} className={`rounded-xl border p-6 ${card(isLight)}`}>
              <p className="text-xs font-semibold uppercase tracking-wider text-accent">{isHi ? c.typeHi : c.type}</p>
              <h3 className={`mt-3 font-heading text-lg ${titleCls(isLight)}`}>{isHi ? c.resultHi : c.result}</h3>
              <p className={`mt-3 text-sm ${mutedCls(isLight)}`}>{isHi ? c.highlightHi : c.highlight}</p>
              <p className={`mt-4 text-xs ${mutedCls(isLight)}`}>
                {t('cases.timeline')}: {isHi ? c.timelineHi : c.timeline}
              </p>
            </article>
          ))}
        </div>
        <p className="mt-8 text-center">
          <Link to="/case-studies" className="text-sm font-semibold text-accent hover:underline">
            {t('cases.viewAll')} →
          </Link>
        </p>
      </div>
    </section>
  );
}

export function TestimonialsSection() {
  const { t, i18n } = useTranslation();
  const { theme } = useThemeMode();
  const isLight = theme === 'light';
  const isHi = i18n.language === 'hi';
  const featured = testimonials.slice(0, 3);

  return (
    <section className={`section-padding ${altSurface(isLight)}`}>
      <div className="container-premium">
        <SectionHeader kicker={t('testimonials.kicker')} title={t('testimonials.title')} subtitle={t('testimonials.subtitle')} />
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {featured.map((item) => (
            <blockquote key={item.name} className={`rounded-xl border p-6 ${card(isLight)}`}>
              <p className={`text-sm leading-relaxed ${titleCls(isLight)}`}>
                “{isHi ? item.contentHi : item.content}”
              </p>
              <footer className="mt-5">
                <cite className={`not-italic text-sm font-semibold ${titleCls(isLight)}`}>{item.name}</cite>
                <p className={`text-xs ${mutedCls(isLight)}`}>{item.location}</p>
              </footer>
            </blockquote>
          ))}
        </div>
        <p className="mt-8 text-center">
          <Link to="/testimonials" className="text-sm font-semibold text-accent hover:underline">
            {t('testimonials.readAll')} →
          </Link>
        </p>
      </div>
    </section>
  );
}

export function FinalCTA() {
  const { t } = useTranslation();
  const { theme } = useThemeMode();
  const isLight = theme === 'light';
  const reduceMotion = useReducedMotion();

  return (
    <section className={`section-padding ${surface(isLight)}`}>
      <motion.div
        className={`container-premium rounded-xl border px-6 py-12 text-center md:px-12 ${card(isLight)}`}
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <p className="section-kicker">{t('cta.kicker')}</p>
        <h2 className={`font-heading text-display-md mt-2 ${titleCls(isLight)}`}>{t('cta.title')}</h2>
        <p className={`mx-auto mt-3 max-w-xl ${mutedCls(isLight)}`}>{t('cta.subtitle')}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button to="/contact">{t('cta.form')}</Button>
          <Button href={`tel:${SITE.phone}`} variant="secondary">
            {t('cta.call')}
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
