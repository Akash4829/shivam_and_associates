export const serviceCatalog = [
  {
    id: 'litigation',
    icon: 'scale',
    titleKey: 'serviceItems.litigation.title',
    descKey: 'serviceItems.litigation.desc',
    longKey: 'serviceItems.litigation.long',
    faqKeys: ['faq.q1', 'faq.q4', 'faq.q5'],
    span: 'md:col-span-2 lg:col-span-2',
    related: ['advisory', 'urgent'],
  },
  {
    id: 'advisory',
    icon: 'document',
    titleKey: 'serviceItems.advisory.title',
    descKey: 'serviceItems.advisory.desc',
    longKey: 'serviceItems.advisory.long',
    faqKeys: ['faq.q4', 'faq.q5'],
    span: 'md:col-span-2 lg:col-span-1',
    related: ['litigation', 'compliance'],
  },
  {
    id: 'filing',
    icon: 'document',
    titleKey: 'serviceItems.filing.title',
    descKey: 'serviceItems.filing.desc',
    longKey: 'serviceItems.filing.long',
    faqKeys: ['faq.q2', 'faq.q3'],
    span: 'md:col-span-2 lg:col-span-1',
    related: ['litigation', 'urgent'],
  },
  {
    id: 'compliance',
    icon: 'eye',
    titleKey: 'serviceItems.compliance.title',
    descKey: 'serviceItems.compliance.desc',
    longKey: 'serviceItems.compliance.long',
    faqKeys: ['faq.q4'],
    span: 'md:col-span-2 lg:col-span-1',
    related: ['advisory', 'settlements'],
  },
  {
    id: 'settlements',
    icon: 'handshake',
    titleKey: 'serviceItems.settlements.title',
    descKey: 'serviceItems.settlements.desc',
    longKey: 'serviceItems.settlements.long',
    faqKeys: ['faq.q5'],
    span: 'md:col-span-2 lg:col-span-2',
    related: ['advisory', 'litigation'],
  },
  {
    id: 'urgent',
    icon: 'bolt',
    titleKey: 'serviceItems.urgent.title',
    descKey: 'serviceItems.urgent.desc',
    longKey: 'serviceItems.urgent.long',
    faqKeys: ['faq.q1'],
    span: 'md:col-span-2 lg:col-span-1',
    related: ['litigation', 'filing'],
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
    id: 'civil',
    icon: 'building',
    titleKey: 'focus.civilTitle',
    headlineKey: 'focus.civilHeadline',
    bulletsKeys: ['focus.civilP1', 'focus.civilP2'],
  },
  {
    id: 'appellate',
    icon: 'court',
    titleKey: 'focus.appellateTitle',
    headlineKey: 'focus.appellateHeadline',
    bulletsKeys: ['focus.appellateP1', 'focus.appellateP2'],
  },
  {
    id: 'property',
    icon: 'document',
    titleKey: 'practice.property',
    headlineKey: 'practice.propertyDesc',
    bulletsKeys: ['focus.civilP1'],
  },
  {
    id: 'family',
    icon: 'heart',
    titleKey: 'practice.family',
    headlineKey: 'practice.familyDesc',
    bulletsKeys: ['focus.civilP2'],
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
