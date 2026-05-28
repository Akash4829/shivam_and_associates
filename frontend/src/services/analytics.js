export function trackEvent(name, payload = {}) {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag === 'function') {
    window.gtag('event', name, payload);
  } else if (process.env.NODE_ENV !== 'production') {

    console.debug('[analytics]', name, payload);
  }
}

export const events = {
  ctaWhatsapp: () => trackEvent('cta_whatsapp_click'),
  ctaCall: () => trackEvent('cta_call_click'),
  ctaConsultation: () => trackEvent('cta_consultation_click'),
  formSubmit: (form) => trackEvent('form_submit', { form }),
  langChange: (lang) => trackEvent('language_change', { lang }),
};
