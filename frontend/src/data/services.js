export const serviceCatalog = [
  {
    id: 'regularBail',
    icon: 'scale',
    titleKey: 'serviceItems.regularBail.title',
    descKey: 'serviceItems.regularBail.desc',
    longKey: 'serviceItems.regularBail.long',
    faqKeys: ['faq.q1', 'faq.q4', 'faq.q5'],
    span: 'md:col-span-2 lg:col-span-2',
    related: ['anticipatoryBail', 'urgent'],
  },
  {
    id: 'anticipatoryBail',
    icon: 'bolt',
    titleKey: 'serviceItems.anticipatoryBail.title',
    descKey: 'serviceItems.anticipatoryBail.desc',
    longKey: 'serviceItems.anticipatoryBail.long',
    faqKeys: ['faq.q1', 'faq.q5'],
    span: 'md:col-span-2 lg:col-span-1',
    related: ['regularBail', 'crpc482'],
  },
  {
    id: 'crpc482',
    icon: 'document',
    titleKey: 'serviceItems.crpc482.title',
    descKey: 'serviceItems.crpc482.desc',
    longKey: 'serviceItems.crpc482.long',
    faqKeys: ['faq.q2', 'faq.q3'],
    span: 'md:col-span-2 lg:col-span-1',
    related: ['criminalAppeals', 'criminalLitigation'],
  },
  {
    id: 'criminalAppeals',
    icon: 'court',
    titleKey: 'serviceItems.criminalAppeals.title',
    descKey: 'serviceItems.criminalAppeals.desc',
    longKey: 'serviceItems.criminalAppeals.long',
    faqKeys: ['faq.q3', 'faq.q4'],
    span: 'md:col-span-2 lg:col-span-1',
    related: ['crpc482', 'criminalLitigation'],
  },
  {
    id: 'criminalLitigation',
    icon: 'briefcase',
    titleKey: 'serviceItems.criminalLitigation.title',
    descKey: 'serviceItems.criminalLitigation.desc',
    longKey: 'serviceItems.criminalLitigation.long',
    faqKeys: ['faq.q4', 'faq.q5'],
    span: 'md:col-span-2 lg:col-span-2',
    related: ['regularBail', 'criminalAppeals'],
  },
  {
    id: 'urgent',
    icon: 'bolt',
    titleKey: 'serviceItems.urgent.title',
    descKey: 'serviceItems.urgent.desc',
    longKey: 'serviceItems.urgent.long',
    faqKeys: ['faq.q1'],
    span: 'md:col-span-2 lg:col-span-1',
    related: ['anticipatoryBail', 'regularBail'],
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
    id: 'regularBail',
    icon: 'scale',
    titleKey: 'practice.regularBail',
    headlineKey: 'practice.regularBailDesc',
    bulletsKeys: ['focus.bailP1', 'focus.bailP2'],
  },
  {
    id: 'anticipatoryBail',
    icon: 'bolt',
    titleKey: 'practice.anticipatoryBail',
    headlineKey: 'practice.anticipatoryBailDesc',
    bulletsKeys: ['focus.anticipatoryP1', 'focus.anticipatoryP2'],
  },
  {
    id: 'crpc482',
    icon: 'document',
    titleKey: 'practice.crpc482',
    headlineKey: 'practice.crpc482Desc',
    bulletsKeys: ['focus.crpc482P1', 'focus.crpc482P2'],
  },
  {
    id: 'criminalAppeals',
    icon: 'court',
    titleKey: 'practice.criminalAppeals',
    headlineKey: 'practice.criminalAppealsDesc',
    bulletsKeys: ['focus.appealsP1', 'focus.appealsP2'],
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
