export const SITE = {
  name: 'Shivam Mishra & Associates',
  shortName: 'SM & Associates',
  tagline: 'Premium legal counsel for modern India',
  phone: '+919876543210',
  phoneDisplay: '+91 98765 43210',
  whatsapp: '919876543210',
  email: 'contact@shivammishraassociates.com',
  address: 'Allahabad High Court Area, Prayagraj, Uttar Pradesh 211001',
  mapEmbed:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3609.5!2d81.85!3d25.4358!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjXCsDI2JzA4LjkiTiA4McKwNTEnMDAuMCJF!5e0!3m2!1sen!2sin!4v1',
  hours: 'Mon – Sat · 10:00 AM – 7:00 PM',
  responseTime: 'Within 24 hours',
  social: {
    linkedin: '#',
    instagram: '#',
  },
};

export const STATS = [
  { value: 8, suffix: '+', labelKey: 'stats.years' },
  { value: 500, suffix: '+', labelKey: 'stats.cases' },
  { value: 94, suffix: '%', labelKey: 'stats.success' },
  { value: 1200, suffix: '+', labelKey: 'stats.clients' },
];

export function buildWhatsAppUrl(t) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(t('whatsapp.prefill'))}`;
}

export const TRUST_METRICS = [
  { value: '4.9', labelKey: 'trust.google' },
  { value: '94%', labelKey: 'trust.successRate' },
  { value: '15+', labelKey: 'trust.courts' },
  { value: '1200+', labelKey: 'trust.clients' },
  { value: '8+', labelKey: 'trust.years' },
];
