export type RouteVariant = 'services' | 'appointments' | 'new-patients' | 'resources' | 'visit' | 'our-clinic';

export type RouteItem = {
  label: string;
  title: string;
  copy: string;
  detail?: string;
  href?: string;
};

export type RouteStory = {
  variant: RouteVariant;
  kicker: string;
  title: string;
  lead: string;
  asset: string;
  assetId: string;
  alt: string;
  sceneLabel: string;
  sectionKicker: string;
  sectionTitle: string;
  items: RouteItem[];
  finalTitle: string;
  finalCopy: string;
};

export const clinic = {
  name: 'Canby Community Clinic',
  organization: 'Pura Vida Community Clinic',
  phoneDisplay: '(818) 674-4414',
  phoneHref: 'tel:+18186744414',
  addressLine1: '7601 Canby Ave #6B',
  addressLine2: 'Reseda, CA 91335',
  hours: 'Monday–Friday · 9 AM–5 PM',
  directions: 'https://www.google.com/maps/search/?api=1&query=7601+Canby+Ave+%236B+Reseda+CA+91335',
};

export const stories: Record<RouteVariant, RouteStory> = {
  services: {
    variant: 'services',
    kicker: 'Care services · one connected practice',
    title: 'Care for what brings you in.',
    lead: 'Start with the question affecting life today. We help you understand the available care, the limits of that care, and the next useful step.',
    asset: '/assets/scenes/s-01-consultation.png',
    assetId: 'S-01',
    alt: 'A representative clinician listening to a patient in a community clinic consultation room.',
    sceneLabel: 'The care hallway',
    sectionKicker: 'Six care destinations',
    sectionTitle: 'Choose the room that feels closest.',
    items: [
      { label: 'Everyday concerns · follow-up', title: 'Primary care', copy: 'Discuss new symptoms, ongoing concerns, and practical follow-up in one conversation.', detail: 'Availability and scope vary. Call before visiting to confirm the care you need.' },
      { label: 'Screening · planning', title: 'Preventive care', copy: 'Make room for screening conversations and measurements that can support earlier action.', detail: 'Recommended services depend on age, history, eligibility, and current clinical guidance.' },
      { label: 'Lists · access · safer use', title: 'Medication support', copy: 'Review prescriptions, supplements, access concerns, and questions about safer use.', detail: 'Bring an up-to-date medication list or the original containers when possible.' },
      { label: 'Labs · imaging · specialists', title: 'Testing and referrals', copy: 'Understand what an outside test or referral is for and what should happen afterward.', detail: 'Outside availability, eligibility, and authorization may affect timing.' },
      { label: 'Plain language · practical tools', title: 'Health education', copy: 'Turn medical instructions into steps that make sense in everyday life.', detail: 'Education supports care but does not replace individualized medical evaluation.' },
      { label: 'Results · pharmacies · follow-through', title: 'Care navigation', copy: 'Connect the people and services involved so the next step does not disappear.', detail: 'The clinic can help explain a pathway but cannot guarantee outside availability.' },
    ],
    finalTitle: 'Unsure where to begin?',
    finalCopy: 'Call the clinic. A team member can help you understand which starting point may fit your question and what availability to confirm.',
  },
  appointments: {
    variant: 'appointments',
    kicker: 'Appointments · a clear entrance',
    title: 'A clear way to begin.',
    lead: 'A visit starts with a request, continues with confirmation, and becomes easier when you know what to bring.',
    asset: '/assets/scenes/a-01-entrance.png',
    assetId: 'A-01',
    alt: 'An open accessible clinic entrance leading toward a modest reception desk.',
    sceneLabel: 'The entrance sequence',
    sectionKicker: 'Four moments in order',
    sectionTitle: 'From request to arrival.',
    items: [
      { label: '01 · Request', title: 'Tell us what you need.', copy: 'Share a reason for the visit and a preferred day and time.', detail: 'A request is not a confirmed appointment.' },
      { label: '02 · Confirm', title: 'Wait for the clinic response.', copy: 'A clinic team member confirms availability and explains the next step.', detail: 'If you have not received confirmation, call before traveling to the clinic.' },
      { label: '03 · Prepare', title: 'Bring the useful details.', copy: 'Photo ID, a medication list, and relevant records may help the conversation.', detail: 'Ask about accommodations, language help, or other access needs before the visit.' },
      { label: '04 · Arrive', title: 'Enter with a clear plan.', copy: 'Use the verified address and allow time to find Suite 6B.', detail: 'For emergencies, call 911. This website is not monitored for emergency care.' },
    ],
    finalTitle: 'The request is the beginning.',
    finalCopy: 'Call to request a visit. The clinic will explain availability and confirmation.',
  },
  'new-patients': {
    variant: 'new-patients',
    kicker: 'New patients · your first visit',
    title: 'Your first visit, made familiar.',
    lead: 'Know what to share, what to bring, what to ask, and what confirmation means before you leave home.',
    asset: '/assets/scenes/n-01-preparation.png',
    assetId: 'N-01',
    alt: 'Hands preparing a blank identification card, medication containers, records, glasses, and a pen on a table.',
    sceneLabel: 'The first-visit table',
    sectionKicker: 'Four things to prepare',
    sectionTitle: 'Bring what makes the conversation clearer.',
    items: [
      { label: 'Before', title: 'Reason for your visit', copy: 'Describe the main question or concern in your own words.', detail: 'You do not need to diagnose yourself before calling.' },
      { label: 'Bring', title: 'ID, medications, records', copy: 'Bring photo ID, an updated medication list, and relevant records when available.', detail: 'Do not send sensitive medical information through an unapproved form.' },
      { label: 'Ask', title: 'Questions that matter', copy: 'Write down the questions you do not want to forget.', detail: 'Ask for plain-language explanations whenever something is unclear.' },
      { label: 'Leave with', title: 'A visible next step', copy: 'Confirm what happens next, when to follow up, and who to contact.', detail: 'Before leaving, ask how results or referrals will be communicated.' },
    ],
    finalTitle: 'You do not have to arrive knowing everything.',
    finalCopy: 'Bring the information you have and the questions that matter. The first job is to begin the conversation.',
  },
  resources: {
    variant: 'resources',
    kicker: 'Patient resources · information with direction',
    title: 'Clear information for what comes next.',
    lead: 'Use the resource desk to prepare for a visit, ask better questions, and understand practical follow-through.',
    asset: '/assets/scenes/r-01-resources.png',
    assetId: 'R-01',
    alt: 'A hand selecting one of six blank patient resource folders from a wooden clinic organizer.',
    sceneLabel: 'The resource desk',
    sectionKicker: 'Six practical guides',
    sectionTitle: 'Choose what you need now.',
    items: [
      { label: 'Guide', title: 'Prepare for your first visit', copy: 'What to bring, what to write down, and what to ask before arriving.' },
      { label: 'Check', title: 'Confirm before you go', copy: 'Why a request is not confirmation and when calling again is useful.' },
      { label: 'Learn', title: 'Understand everyday health', copy: 'Use plain-language information to support—not replace—a clinical conversation.' },
      { label: 'Review', title: 'Medication questions', copy: 'Organize prescriptions, supplements, access concerns, and questions about safer use.' },
      { label: 'Follow through', title: 'Know what happens after', copy: 'Track results, referrals, medication changes, warning signs, and follow-up.' },
      { label: 'Rights', title: 'Privacy and patient rights', copy: 'Find accessibility, nondiscrimination, privacy, and patient-rights information.' },
    ],
    finalTitle: 'Information should lead somewhere.',
    finalCopy: 'If a guide does not answer your question, call the clinic and ask what to do next.',
  },
  visit: {
    variant: 'visit',
    kicker: 'Visit · Reseda, California',
    title: 'Care, close to home.',
    lead: 'Move from the neighborhood to Canby Avenue, then use the verified address and directions for the final approach.',
    asset: '/assets/scenes/v-01-reseda.png',
    assetId: 'V-01',
    alt: 'A representative elevated view of a low-rise Reseda neighborhood street approaching a community clinic.',
    sceneLabel: 'The Reseda approach',
    sectionKicker: 'Three arrival checks',
    sectionTitle: 'Know where you are going.',
    items: [
      { label: 'Address', title: '7601 Canby Ave #6B', copy: 'Reseda, CA 91335', detail: 'Confirm the address when the clinic schedules or confirms your visit.' },
      { label: 'Hours', title: 'Monday–Friday', copy: '9 AM–5 PM', detail: 'Hours and availability can change. Call before visiting.' },
      { label: 'Before leaving', title: 'Confirm your visit', copy: 'A request alone does not guarantee an appointment.', detail: 'Ask about parking, the accessible entrance, and Suite 6B if you need help arriving.' },
    ],
    finalTitle: 'Make the last turn with confidence.',
    finalCopy: 'Open directions or call the clinic before traveling.',
  },
  'our-clinic': {
    variant: 'our-clinic',
    kicker: 'Our clinic · rooted in Reseda',
    title: 'Care shaped around real life.',
    lead: 'Canby Community Clinic is presented here as a place for clear conversation, practical guidance, and community-centered care.',
    asset: '/assets/scenes/o-01-team.png',
    assetId: 'O-01',
    alt: 'A representative fictional clinic team preparing a consultation room before opening.',
    sceneLabel: 'People in place',
    sectionKicker: 'What the experience should feel like',
    sectionTitle: 'Human, clear, connected.',
    items: [
      { label: 'Listen', title: 'Begin with the person', copy: 'Questions are easier to solve when the conversation begins with daily life and immediate needs.' },
      { label: 'Explain', title: 'Use plain language', copy: 'Care instructions should make the next step more visible, not more confusing.' },
      { label: 'Connect', title: 'Keep the path together', copy: 'Results, medication questions, referrals, and follow-up should remain part of one understandable path.' },
    ],
    finalTitle: 'Meet the clinic through verified information.',
    finalCopy: 'Provider names, biographies, languages, and organization details must be confirmed by the clinic before publication.',
  },
};
