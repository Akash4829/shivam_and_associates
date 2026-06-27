export const practiceAreas = [
  {
    id: 'highCourt',
    titleKey: 'practice.highCourt',
    descKey: 'practice.highCourtDesc',
    icon: 'building',
    to: '/focus-areas',
    span: 'col-span-1',
    imageKey: 'practiceHighCourt',
  },
  {
    id: 'civilLitigation',
    titleKey: 'practice.civilLitigation',
    descKey: 'practice.civilLitigationDesc',
    icon: 'scale',
    to: '/focus-areas',
    span: 'col-span-1',
    imageKey: 'practiceCivil',
  },
  {
    id: 'familyLaw',
    titleKey: 'practice.familyLaw',
    descKey: 'practice.familyLawDesc',
    icon: 'heart',
    to: '/focus-areas',
    span: 'col-span-1',
    imageKey: 'practiceFamily',
  },
  {
    id: 'propertyDisputes',
    titleKey: 'practice.propertyDisputes',
    descKey: 'practice.propertyDisputesDesc',
    icon: 'briefcase',
    to: '/focus-areas',
    span: 'col-span-1',
    imageKey: 'practiceProperty',
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
    type: 'High Court petition allowed',
    typeHi: 'हाई कोर्ट याचिका स्वीकृत',
    result: 'CPC 482 / BNSS 528 proceedings set aside',
    resultHi: 'धारा 482 / BNSS 528 कार्यवाही निरस्त',
    timeline: '6 weeks',
    timelineHi: '6 सप्ताह',
    highlight: 'Abuse of process petition allowed with favourable order',
    highlightHi: 'दुरुपयोग याचिका पर अनुकूल आदेश',
  },
  {
    type: 'Civil recovery decree',
    typeHi: 'दीवानी वसूली डिक्री',
    result: 'Recovery suit decreed in favour of client',
    resultHi: 'वसूली मुकदमे में ग्राहक के पक्ष में डिक्री',
    timeline: '4 months',
    timelineHi: '4 महीने',
    highlight: 'Structured evidence and injunction strategy secured recovery',
    highlightHi: 'साक्ष्य और निषेधाज्ञा रणनीति से वसूली सुनिश्चित',
  },
  {
    type: 'Family maintenance order',
    typeHi: 'पारिवारिक भरण-पोषण आदेश',
    result: 'Interim maintenance granted',
    resultHi: 'अंतरिम भरण-पोषण प्रदान',
    timeline: '3 weeks',
    timelineHi: '3 सप्ताह',
    highlight: 'Timely relief for dependent family members',
    highlightHi: 'आश्रित परिवार के लिए समय पर राहत',
  },
];

export const testimonials = [
  {
    name: 'Rajesh Kumar',
    location: 'Prayagraj',
    content:
      'Mishra Juris Chamber provided clear guidance and strong representation in my High Court matter. Professional, responsive, and trustworthy throughout.',
    contentHi: 'मिश्रा ज्यूरिस चैंबर ने हाई कोर्ट मामले में स्पष्ट मार्गदर्शन और मजबूत पैरवी प्रदान की। पूरी प्रक्रिया में व्यावसायिक और विश्वसनीय।',
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    location: 'Lucknow',
    content:
      'Excellent handling of my family law dispute. They explained every step patiently and achieved a fair outcome in maintenance proceedings.',
    contentHi: 'पारिवारिक विवाद का उत्कृष्ट निपटारा। हर चरण को धैर्यपूर्वक समझाया और भरण-पोषण में न्यायसंगत परिणाम मिला।',
    rating: 5,
  },
  {
    name: 'Amit Verma',
    location: 'Kanpur',
    content:
      'Our property partition matter was handled with thorough documentation and effective courtroom advocacy. Highly recommended.',
    contentHi: 'संपत्ति विभाजन मामले में पूर्ण दस्तावेज़ीकरण और प्रभावी न्यायालय पैरवी। अत्यधिक अनुशंसित।',
    rating: 5,
  },
  {
    name: 'Sunita Devi',
    location: 'Allahabad',
    content:
      'Honest advice, transparent fees, and dedicated follow-through. Mishra Juris Chamber treats clients with respect and urgency.',
    contentHi: 'ईमानदार सलाह, पारदर्शी शुल्क और समर्पित अनुवर्तन। मिश्रा ज्यूरिस चैंबर ग्राहकों के प्रति सम्मानजनक और तत्पर।',
    rating: 5,
  },
  {
    name: 'Vikram Singh',
    location: 'Varanasi',
    content:
      'Civil suit for contract dispute resolved favourably. The team prepared meticulously and kept us informed at every hearing.',
    contentHi: 'अनुबंध विवाद का दीवानी मुकदमा अनुकूल रूप से निपटा। टीम ने सावधानीपूर्वक तैयारी की और हर सुनवाई पर सूचित रखा।',
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
    titleKey: 'practice.highCourt',
    descKey: 'practice.highCourtDesc',
    image: 'practiceHighCourt',
    faqKeys: ['faq.q1', 'faq.q5'],
  },
  {
    titleKey: 'practice.civilLitigation',
    descKey: 'practice.civilLitigationDesc',
    image: 'practiceCivil',
    faqKeys: ['faq.q2', 'faq.q4'],
  },
  {
    titleKey: 'practice.familyLaw',
    descKey: 'practice.familyLawDesc',
    image: 'practiceFamily',
    faqKeys: ['faq.q3', 'faq.q4'],
  },
  {
    titleKey: 'practice.propertyDisputes',
    descKey: 'practice.propertyDisputesDesc',
    image: 'practiceProperty',
    faqKeys: ['faq.q4', 'faq.q5'],
  },
];
