export const serviceCatalog = [
  {
    id: 'highCourt',
    icon: 'building',
    imageKey: 'practiceHighCourt',
    titleKey: 'serviceItems.highCourt.title',
    descKey: 'serviceItems.highCourt.desc',
    longKey: 'serviceItems.highCourt.long',
    faqKeys: ['faq.q1', 'faq.q3', 'faq.q5'],
    span: 'col-span-1',
    related: ['civilLitigation', 'familyLaw'],
  },
  {
    id: 'civilLitigation',
    icon: 'scale',
    imageKey: 'practiceCivil',
    titleKey: 'serviceItems.civilLitigation.title',
    descKey: 'serviceItems.civilLitigation.desc',
    longKey: 'serviceItems.civilLitigation.long',
    faqKeys: ['faq.q2', 'faq.q4'],
    span: 'col-span-1',
    related: ['propertyDisputes', 'highCourt'],
  },
  {
    id: 'familyLaw',
    icon: 'heart',
    imageKey: 'practiceFamily',
    titleKey: 'serviceItems.familyLaw.title',
    descKey: 'serviceItems.familyLaw.desc',
    longKey: 'serviceItems.familyLaw.long',
    faqKeys: ['faq.q3', 'faq.q4'],
    span: 'col-span-1',
    related: ['civilLitigation', 'highCourt'],
  },
  {
    id: 'propertyDisputes',
    icon: 'briefcase',
    imageKey: 'practiceProperty',
    titleKey: 'serviceItems.propertyDisputes.title',
    descKey: 'serviceItems.propertyDisputes.desc',
    longKey: 'serviceItems.propertyDisputes.long',
    faqKeys: ['faq.q4', 'faq.q5'],
    span: 'col-span-1',
    related: ['civilLitigation', 'highCourt'],
  },
];

export const servicePhases = [
  { id: 1, titleKey: 'services.phase1', descKey: 'services.phase1Desc', icon: 'document' },
  { id: 2, titleKey: 'services.phase2', descKey: 'services.phase2Desc', icon: 'eye' },
  { id: 3, titleKey: 'services.phase3', descKey: 'services.phase3Desc', icon: 'briefcase' },
  { id: 4, titleKey: 'services.phase4', descKey: 'services.phase4Desc', icon: 'handshake' },
];

export const focusAreas = [
  {
    id: 'highCourt',
    icon: 'building',
    imageKey: 'practiceHighCourt',
    titleKey: 'practice.highCourt',
    headlineKey: 'practice.highCourtDesc',
    bulletsKeys: ['focus.highCourtP1', 'focus.highCourtP2', 'focus.highCourtP3', 'focus.highCourtP4'],
  },
  {
    id: 'civilLitigation',
    icon: 'scale',
    imageKey: 'practiceCivil',
    titleKey: 'practice.civilLitigation',
    headlineKey: 'practice.civilLitigationDesc',
    bulletsKeys: ['focus.civilP1', 'focus.civilP2', 'focus.civilP3', 'focus.civilP4', 'focus.civilP5'],
  },
  {
    id: 'familyLaw',
    icon: 'heart',
    imageKey: 'practiceFamily',
    titleKey: 'practice.familyLaw',
    headlineKey: 'practice.familyLawDesc',
    bulletsKeys: ['focus.familyP1', 'focus.familyP2', 'focus.familyP3', 'focus.familyP4', 'focus.familyP5'],
  },
  {
    id: 'propertyDisputes',
    icon: 'briefcase',
    imageKey: 'practiceProperty',
    titleKey: 'practice.propertyDisputes',
    headlineKey: 'practice.propertyDisputesDesc',
    bulletsKeys: ['focus.propertyP1', 'focus.propertyP2', 'focus.propertyP3', 'focus.propertyP4', 'focus.propertyP5'],
  },
];

export const aboutValues = [
  { key: 'value1', icon: 'eye' },
  { key: 'value2', icon: 'lock' },
  { key: 'value3', icon: 'briefcase' },
  { key: 'value4', icon: 'heart' },
];

export const internshipScopeKeys = [
  'internship.scope1',
  'internship.scope2',
  'internship.scope3',
  'internship.scope4',
  'internship.scope5',
];

export const internshipLookForKeys = [
  'internship.lookFor1',
  'internship.lookFor2',
  'internship.lookFor3',
  'internship.lookFor4',
  'internship.lookFor5',
  'internship.lookFor6',
];

export const internshipFaqKeys = [
  { qKey: 'internship.faq1Q', aKey: 'internship.faq1A' },
  { qKey: 'internship.faq2Q', aKey: 'internship.faq2A' },
  { qKey: 'internship.faq3Q', aKey: 'internship.faq3A' },
  { qKey: 'internship.faq4Q', aKey: 'internship.faq4A' },
  { qKey: 'internship.faq5Q', aKey: 'internship.faq5A' },
  { qKey: 'internship.faq6Q', aKey: 'internship.faq6A' },
];
