import { images } from '../lib/images';

export const practiceAreas = [
  {
    id: 'litigation',
    titleKey: 'practice.litigation',
    descKey: 'practice.litigationDesc',
    icon: 'scale',
    to: '/services',
    span: 'col-span-1 md:col-span-2 row-span-1',
    image: images.card1,
  },
  {
    id: 'advisory',
    titleKey: 'practice.advisory',
    descKey: 'practice.advisoryDesc',
    icon: 'document',
    to: '/services',
    span: 'col-span-1',
    image: images.card2,
  },
  {
    id: 'dispute',
    titleKey: 'practice.dispute',
    descKey: 'practice.disputeDesc',
    icon: 'handshake',
    to: '/focus-areas',
    span: 'col-span-1',
    image: images.card3,
  },
  {
    id: 'property',
    titleKey: 'practice.property',
    descKey: 'practice.propertyDesc',
    icon: 'building',
    to: '/focus-areas',
    span: 'col-span-1',
    image: images.documents,
  },
  {
    id: 'corporate',
    titleKey: 'practice.corporate',
    descKey: 'practice.corporateDesc',
    icon: 'briefcase',
    to: '/services',
    span: 'col-span-1 md:col-span-2',
    image: images.cityLegal,
  },
  {
    id: 'family',
    titleKey: 'practice.family',
    descKey: 'practice.familyDesc',
    icon: 'heart',
    to: '/focus-areas',
    span: 'col-span-1',
    image: images.meeting,
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
    type: 'Property dispute',
    typeHi: 'संपत्ति विवाद',
    result: 'Favorable injunction granted',
    resultHi: 'अनुकूल निषेधाज्ञा प्रदान',
    timeline: '4 months',
    timelineHi: '4 महीने',
    highlight: 'Client retained possession during proceedings',
    highlightHi: 'कार्यवाही के दौरान ग्राहक ने कब्जा बनाए रखा',
  },
  {
    type: 'High Court appeal',
    typeHi: 'हाई कोर्ट अपील',
    result: 'Appeal allowed, matter remanded',
    resultHi: 'अपील स्वीकार, मामला वापस',
    timeline: '6 months',
    timelineHi: '6 महीने',
    highlight: 'Strategic written submissions cited by bench',
    highlightHi: 'बेंच ने रणनीतिक लिखित प्रस्तुतियों का उल्लेख किया',
  },
  {
    type: 'Commercial recovery',
    typeHi: 'वाणिज्यिक वसूली',
    result: '₹42L recovered via settlement',
    resultHi: 'समझौते से ₹42L वसूली',
    timeline: '3 months',
    timelineHi: '3 महीने',
    highlight: 'Avoided prolonged litigation costs',
    highlightHi: 'लंबी मुकदमेबाजी लागत से बचा',
  },
];

export const testimonials = [
  {
    name: 'Rajesh Kumar',
    location: 'Prayagraj',
    content:
      'Always available when needed. The team provided excellent guidance throughout my legal proceedings.',
    contentHi: 'जरूरत पड़ने पर हमेशा उपलब्ध। पूरी कानूनी प्रक्रिया में उत्कृष्ट मार्गदर्शन।',
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    location: 'Allahabad',
    content:
      'Strategic approach to my complex property dispute resulted in a favorable outcome.',
    contentHi: 'जटिल संपत्ति विवाद में रणनीतिक दृष्टिकोण से अनुकूल परिणाम मिला।',
    rating: 5,
  },
  {
    name: 'Amit Verma',
    location: 'Kanpur',
    content: 'Complete honesty and transparency throughout. Realistic advice and dedicated representation.',
    contentHi: 'पूरी प्रक्रिया में ईमानदारी और पारदर्शिता। यथार्थ सलाह और समर्पित पैरवी।',
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
    titleKey: 'practice.litigation',
    descKey: 'practice.litigationDesc',
    image: 'card1',
    faqKeys: ['faq.q1', 'faq.q4'],
  },
  {
    titleKey: 'practice.advisory',
    descKey: 'practice.advisoryDesc',
    image: 'card2',
    faqKeys: ['faq.q4', 'faq.q5'],
  },
  {
    titleKey: 'practice.dispute',
    descKey: 'practice.disputeDesc',
    image: 'card3',
    faqKeys: ['faq.q1', 'faq.q3'],
  },
  {
    titleKey: 'practice.property',
    descKey: 'practice.propertyDesc',
    image: 'documents',
    faqKeys: ['faq.q2', 'faq.q3'],
  },
  {
    titleKey: 'practice.corporate',
    descKey: 'practice.corporateDesc',
    image: 'meeting',
    faqKeys: ['faq.q4'],
  },
  {
    titleKey: 'practice.family',
    descKey: 'practice.familyDesc',
    image: 'lawLibrary',
    faqKeys: ['faq.q5'],
  },
];
