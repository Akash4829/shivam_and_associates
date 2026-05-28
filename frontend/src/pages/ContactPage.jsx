import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import PageHero from '../components/sections/PageHero';
import SectionHeader from '../components/ui/SectionHeader';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import Icon from '../components/ui/Icons';
import Modal from '../components/ui/Modal';
import ConsultationForm from '../components/forms/ConsultationForm';
import { images } from '../lib/images';
import { SITE, buildWhatsAppUrl } from '../constants/site';
import { useThemeMode } from '../context/ThemeContext';
import { fadeUp, staggerContainer } from '../animations/variants';
import { events } from '../services/analytics';

const CALENDLY_URL = process.env.REACT_APP_CALENDLY_URL || '';

function ChannelCard({ icon, title, value, href, label, isLight, onClick }) {
  const inner = (
    <div className="flex items-center gap-4">
      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent/15 text-accent">
        <Icon name={icon} className="w-6 h-6" />
      </span>
      <div className="min-w-0">
        <p className={`text-xs font-semibold tracking-wider uppercase ${isLight ? 'text-muted' : 'text-slate-400'}`}>
          {title}
        </p>
        <p className={`mt-1 font-medium truncate ${isLight ? 'text-ink' : 'text-off-white'}`}>{value}</p>
      </div>
      <span className="ml-auto text-sm font-semibold text-accent shrink-0">{label} →</span>
    </div>
  );
  return (
    <a
      href={href}
      target={href.startsWith('http') ? '_blank' : undefined}
      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
      onClick={onClick}
      className="block transition-opacity hover:opacity-95"
    >
      <GlassCard className="p-5">{inner}</GlassCard>
    </a>
  );
}

function ContactPage() {
  const { t, i18n } = useTranslation();
  const { theme } = useThemeMode();
  const isLight = theme === 'light';
  const [bookingOpen, setBookingOpen] = useState(false);

  const whatsappUrl = buildWhatsAppUrl(t);

  const localBusiness = {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: SITE.name,
    image: images.hero,
    telephone: SITE.phone,
    email: SITE.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address,
      addressLocality: 'Prayagraj',
      addressRegion: 'Uttar Pradesh',
      postalCode: '211001',
      addressCountry: 'IN',
    },
    openingHours: 'Mo-Sa 10:00-19:00',
    areaServed: 'IN',
  };

  return (
    <>
      <Helmet>
        <html lang={i18n.language === 'hi' ? 'hi' : 'en'} />
        <title>{t('meta.contact')}</title>
        <meta name="description" content={t('meta.contactDesc')} />
        <meta property="og:title" content={t('meta.contact')} />
        <meta property="og:description" content={t('meta.contactDesc')} />
        <script type="application/ld+json">{JSON.stringify(localBusiness)}</script>
      </Helmet>

      <PageHero
        kicker={t('contact.channelsTitle')}
        title={t('contact.title')}
        titleHighlight={t('contact.titleHighlight')}
        subtitle={t('contact.subtitle')}
        backgroundImage={images.cta}
        primaryHref="#booking"
        primaryLabel={t('contact.booking')}
        secondaryTo="/services"
        secondaryLabel={t('nav.services')}
        minHeightClass="min-h-[55vh] md:min-h-[60vh]"
      />

      <section className={`section-padding ${isLight ? 'bg-off-white' : 'bg-primary'}`}>
        <div className="container-premium">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16"
          >
            <motion.div variants={fadeUp} className="space-y-6">
              <div>
                <p className="section-kicker">{t('contact.channelsTitle')}</p>
                <h2 className={`font-heading text-display-md mt-2 ${isLight ? 'text-ink' : 'text-off-white'}`}>
                  {t('contact.infoTitle')}
                </h2>
                <p className={`mt-3 text-base leading-relaxed ${isLight ? 'text-muted' : 'text-slate-400'}`}>
                  {t('contact.infoSubtitle')}
                </p>
              </div>

              <div className="space-y-3">
                <ChannelCard
                  icon="device"
                  title={t('contact.whatsapp')}
                  value={SITE.phoneDisplay}
                  href={whatsappUrl}
                  label={t('common.getStarted')}
                  onClick={() => events.ctaWhatsapp()}
                />
                <ChannelCard
                  icon="user"
                  title={t('contact.call')}
                  value={SITE.phoneDisplay}
                  href={`tel:${SITE.phone}`}
                  label={t('contact.call')}
                  onClick={() => events.ctaCall()}
                />
                <ChannelCard
                  icon="document"
                  title={t('contact.email')}
                  value={SITE.email}
                  href={`mailto:${SITE.email}`}
                  label={t('contact.send')}
                />
              </div>

              <GlassCard className="p-6 space-y-3">
                <p className={`text-sm font-semibold uppercase tracking-wider text-accent`}>
                  {t('contact.office')}
                </p>
                <p className={`text-sm ${isLight ? 'text-muted' : 'text-slate-300'}`}>{SITE.address}</p>
                <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-sm ${isLight ? 'text-muted' : 'text-slate-400'}`}>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-accent/80">{t('contact.hours')}</p>
                    <p className="mt-1">{SITE.hours}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-wider text-accent/80">{t('contact.response')}</p>
                    <p className="mt-1">{SITE.responseTime}</p>
                  </div>
                </div>
              </GlassCard>

              <GlassCard className="p-6 space-y-3">
                <p className="text-sm font-semibold uppercase tracking-wider text-accent">
                  {t('contact.calendlyTitle')}
                </p>
                <p className={`text-sm ${isLight ? 'text-muted' : 'text-slate-400'}`}>
                  {t('contact.calendlyDesc')}
                </p>
                <Button
                  onClick={() => {
                    setBookingOpen(true);
                    events.ctaConsultation();
                  }}
                  variant="secondary"
                  className="!py-3 !px-5"
                >
                  {t('contact.openCalendar')}
                </Button>
              </GlassCard>
            </motion.div>

            <motion.div id="booking" variants={fadeUp}>
              <ConsultationForm />
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className={`mt-14 rounded-2xl overflow-hidden border h-[320px] md:h-[420px] ${
              isLight ? 'border-navy/10' : 'border-white/10'
            }`}
          >
            <iframe
              title={t('contact.map')}
              src={SITE.mapEmbed}
              className="w-full h-full border-0 grayscale-[40%] hover:grayscale-0 transition-all duration-500"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>
      </section>

      <Modal
        open={bookingOpen}
        onClose={() => setBookingOpen(false)}
        title={t('contact.calendlyTitle')}
        size="lg"
      >
        {CALENDLY_URL ? (
          <div className="h-[560px] w-full overflow-hidden rounded-xl">
            <iframe
              title={t('contact.calendlyTitle')}
              src={CALENDLY_URL}
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>
        ) : (
          <div className={`p-4 rounded-xl border border-dashed border-accent/40 text-center text-sm ${
            isLight ? 'text-muted' : 'text-slate-400'
          }`}>
            <p>{t('contact.calendlyNote')}</p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <Button href={whatsappUrl} variant="whatsapp">
                {t('cta.whatsapp')}
              </Button>
              <Button href={`tel:${SITE.phone}`} variant="secondary">
                {t('cta.call')}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

export default ContactPage;
