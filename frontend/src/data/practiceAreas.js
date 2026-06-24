import { images } from '../lib/images';

export const practiceAreas = [
  {
    id: 'regularBail',
    titleKey: 'practice.regularBail',
    descKey: 'practice.regularBailDesc',
    icon: 'scale',
    to: '/focus-areas',
    span: 'col-span-1 md:col-span-2 row-span-1',
    image: images.card1,
  },
  {
    id: 'anticipatoryBail',
    titleKey: 'practice.anticipatoryBail',
    descKey: 'practice.anticipatoryBailDesc',
    icon: 'bolt',
    to: '/focus-areas',
    span: 'col-span-1',
    image: images.card2,
  },
  {
    id: 'crpc482',
    titleKey: 'practice.crpc482',
    descKey: 'practice.crpc482Desc',
    icon: 'document',
    to: '/focus-areas',
    span: 'col-span-1',
    image: images.card3,
  },
  {
    id: 'criminalAppeals',
    titleKey: 'practice.criminalAppeals',
    descKey: 'practice.criminalAppealsDesc',
    icon: 'court',
    to: '/focus-areas',
    span: 'col-span-1',
    image: images.card4,
  },
  {
    id: 'criminalLitigation',
    titleKey: 'practice.criminalLitigation',
    descKey: 'practice.criminalLitigationDesc',
    icon: 'briefcase',
    to: '/services',
    span: 'col-span-1 md:col-span-2',
    image: images.card5,
  },
  {
    id: 'highCourt',
    titleKey: 'practice.highCourt',
    descKey: 'practice.highCourtDesc',
    icon: 'building',
    to: '/about',
    span: 'col-span-1',
    image: images.card6,
  },
];

export const whyChooseItems = [
  { key: 'fast', icon: 'bolt' },
  { key: 'confidential', icon: 'lock' },
  { key: 'transparent', icon: 'eye' },
  { key: 'personalized', icon: 'user' },
  { key: 'highCourt', icon: 'court' },
  { key: 'digital', icon: 'device' },
];

export const journeySteps = [
  { step: 1, titleKey: 'journey.step1', descKey: 'journey.step1Desc' },
  { step: 2, titleKey: 'journey.step2', descKey: 'journey.step2Desc' },
  { step: 3, titleKey: 'journey.step3', descKey: 'journey.step3Desc' },
  { step: 4, titleKey: 'journey.step4', descKey: 'journey.step4Desc' },
  { step: 5, titleKey: 'journey.step5', descKey: 'journey.step5Desc' },
];

export const caseResults = [
  {
    type: 'Regular bail granted',
    typeHi: 'नियमित जमानत प्रदान',
    result: 'Bail allowed in serious IPC matter',
    resultHi: 'गंभीर IPC मामले में जमानत स्वीकृत',
    timeline: '3 weeks',
    timelineHi: '3 सप्ताह',
    highlight: 'Client released with favourable conditions',
    highlightHi: 'अनुकूल शर्तों पर ग्राहक रिहा',
  },
  {
    type: 'Anticipatory bail',
    typeHi: 'अग्रिम जमानत',
    result: 'Protection from arrest secured',
    resultHi: 'गिरफ्तारी से सुरक्षा प्राप्त',
    timeline: '10 days',
    timelineHi: '10 दिन',
    highlight: 'Pre-arrest relief before Allahabad High Court',
    highlightHi: 'इलाहाबाद हाई कोर्ट में गिरफ्तारी से पहले राहत',
  },
  {
    type: 'CrPC Section 482 petition',
    typeHi: 'धारा 482 याचिका',
    result: 'FIR quashed / proceedings set aside',
    resultHi: 'FIR निरस्त / कार्यवाही रद्द',
    timeline: '2 months',
    timelineHi: '2 महीने',
    highlight: 'Inherent powers invoked successfully',
    highlightHi: 'अंतर्निहित शक्तियों का सफल उपयोग',
  },
];

export const testimonials = [
  {
    name: 'Rajesh Kumar',
    location: 'Prayagraj',
    content:
      'Always available when needed. Clear guidance and strong representation in my bail matter before the High Court.',
    contentHi: 'जरूरत पड़ने पर हमेशा उपलब्ध। जमानत मामले में स्पष्ट मार्गदर्शन और मजबूत पैरवी।',
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    location: 'Allahabad',
    content:
      'Strategic approach to my criminal appeal resulted in a favourable outcome at the Lucknow Bench.',
    contentHi: 'आपराधिक अपील में रणनीतिक दृष्टिकोण से लखनऊ बेंच पर अनुकूल परिणाम मिला।',
    rating: 5,
  },
  {
    name: 'Amit Verma',
    location: 'Kanpur',
    content: 'Complete honesty and transparency throughout. Realistic advice and dedicated courtroom advocacy.',
    contentHi: 'पूरी प्रक्रिया में ईमानदारी और पारदर्शिता। यथार्थ सलाह और समर्पित न्यायालय पैरवी।',
    rating: 5,
  },
];

export const faqItems = [
  { qKey: 'faq.q1', aKey: 'faq.a1' },
  { qKey: 'faq.q2', aKey: 'faq.a2' },
  { qKey: 'faq.q3', aKey: 'faq.a3' },
  { qKey: 'faq.q4', aKey: 'faq.a4' },
  { qKey: 'faq.q5', aKey: 'faq.a5' },
];

export const servicesList = [
  {
    titleKey: 'practice.regularBail',
    descKey: 'practice.regularBailDesc',
    image: 'card1',
    faqKeys: ['faq.q1', 'faq.q4'],
  },
  {
    titleKey: 'practice.anticipatoryBail',
    descKey: 'practice.anticipatoryBailDesc',
    image: 'card2',
    faqKeys: ['faq.q1', 'faq.q5'],
  },
  {
    titleKey: 'practice.crpc482',
    descKey: 'practice.crpc482Desc',
    image: 'card3',
    faqKeys: ['faq.q2', 'faq.q3'],
  },
  {
    titleKey: 'practice.criminalAppeals',
    descKey: 'practice.criminalAppealsDesc',
    image: 'documents',
    faqKeys: ['faq.q3', 'faq.q4'],
  },
  {
    titleKey: 'practice.criminalLitigation',
    descKey: 'practice.criminalLitigationDesc',
    image: 'meeting',
    faqKeys: ['faq.q4'],
  },
  {
    titleKey: 'practice.highCourt',
    descKey: 'practice.highCourtDesc',
    image: 'lawLibrary',
    faqKeys: ['faq.q5'],
  },
];
