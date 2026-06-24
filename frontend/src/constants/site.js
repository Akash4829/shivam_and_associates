export const SITE = {
  name: 'Shivam Mishra & Associates',
  shortName: 'SM & Associates',
  tagline: 'Trusted High Court legal counsel',
  phone: '+917081997937',
  phoneDisplay: '+91 70819 97937',
  whatsapp: '917081997937',
  email: 'advshivammishra2124@gmail.com',
  address: 'Advocate General Chamber, B-Block, High Court, Lucknow',
  mapEmbed:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3562.09!2d81.0095!3d26.8718!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399bfd991f32b58b%3A0x95f901ba6ebfd00b!2sAllahabad%20High%20Court%2C%20Lucknow%20Bench!5e0!3m2!1sen!2sin!4v1718900000000!5m2!1sen!2sin',
  mapLink:
    'https://www.google.com/maps/dir/?api=1&destination=Allahabad+High+Court+Lucknow+Bench,+Faizabad+Road,+Vibhuti+Khand,+Gomti+Nagar,+Lucknow,+226010',
  hours: 'Mon – Sun · 8:30 AM – 6:30 PM',
  responseTime: 'Within 24 hours',
  social: {
    linkedin: '#',
    instagram: '#',
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

export const TRUST_METRICS = [
  { value: '2+', labelKey: 'trust.years' },
  { value: '130+', labelKey: 'trust.cases' },
  { value: '200+', labelKey: 'trust.clients' },
  { value: '2', labelKey: 'trust.benches' },
  { value: '4.9', labelKey: 'trust.google' },
];
