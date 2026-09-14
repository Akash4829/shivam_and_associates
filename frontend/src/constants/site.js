export const SITE = {
  name: 'Mishra Juris Chamber',
  shortName: 'Mishra Juris Chamber',
  logoInitials: 'MJC',
  advocateName: 'Adv. Shivam Mishra',
  tagline: 'Trusted legal counsel before the High Court and other courts',
  phone: '+917081979737',
  phoneDisplay: '+91 70819 79737',
  whatsapp: '917459919737',
  whatsappDisplay: '+91 74599 19737',
  email: 'advshivammishra2124@gmail.com',
  address: 'Advocate General Chamber, B-Block, High Court, Lucknow',
  location: {
    street: 'Advocate General Chamber, B-Block, High Court',
    locality: 'Lucknow',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    postalCode: '226010',
    country: 'India',
    countryCode: 'IN',
    display: 'Advocate General Chamber, B-Block, High Court, Lucknow',
  },
  mapEmbed:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3562.09!2d81.0095!3d26.8718!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399bfd991f32b58b%3A0x95f901ba6ebfd00b!2sAllahabad+High+Court%2C+Lucknow+Bench!5e0!3m2!1sen!2sin!4v1718900000000!5m2!1sen!2sin',
  mapLink:
    'https://www.google.com/maps/dir/?api=1&destination=Allahabad+High+Court+Lucknow+Bench,+Faizabad+Road,+Vibhuti+Khand,+Gomti+Nagar,+Lucknow,+226010',
  hours: 'Monday – Sunday · 9:00 AM – 9:30 PM',
  hoursDays: 'Monday – Sunday',
  hoursTime: '9:00 AM – 9:30 PM',
  openingHours: 'Mo-Su 09:00-21:30',
  responseTime: 'Within 24 hours',
  social: {
    instagram: 'https://www.instagram.com/advocate.shivammishra',
    facebook: 'https://www.facebook.com/share/14odoD4Xz2R/',
    linkedin: 'https://www.linkedin.com/in/shivam-mishra-8a4810333',
  },
};

export const STATS = [
  { value: 2, suffix: '+', labelKey: 'stats.years' },
  { value: 130, suffix: '+', labelKey: 'stats.cases' },
  { value: 200, suffix: '+', labelKey: 'stats.clients' },
  { value: 2, suffix: '', labelKey: 'stats.benches' },
];

export function buildWhatsAppUrl(t) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(t('whatsapp.prefill'))}`;
}

export const TRUST_STRIP = [
  { titleKey: 'trust.stripPractice', descKey: 'trust.stripPracticeDesc' },
  { titleKey: 'trust.stripCourt', descKey: 'trust.stripCourtDesc' },
  { titleKey: 'trust.stripStrategy', descKey: 'trust.stripStrategyDesc' },
  { titleKey: 'trust.stripClient', descKey: 'trust.stripClientDesc' },
];

export const TRUST_METRICS = [
  { value: '2+', labelKey: 'trust.years' },
  { value: '130+', labelKey: 'trust.cases' },
  { value: '200+', labelKey: 'trust.clients' },
  { value: '2', labelKey: 'trust.benches' },
];

export function postalAddress() {
  return {
    '@type': 'PostalAddress',
    streetAddress: SITE.location.street,
    addressLocality: SITE.location.city,
    addressRegion: SITE.location.state,
    postalCode: SITE.location.postalCode,
    addressCountry: SITE.location.countryCode,
  };
}

export function legalServiceSchema({ description, url } = {}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LegalService',
    name: SITE.name,
    description: description || SITE.tagline,
    url: url || (typeof window !== 'undefined' ? window.location.origin : ''),
    telephone: SITE.phone,
    email: SITE.email,
    address: postalAddress(),
    areaServed: 'IN',
    openingHours: SITE.openingHours,
  };
}
