'use client';
// Vragen die starten als je op een object klikt. Pas ze gerust aan.
export const OBJECT_PROMPTS = {
  quadCortex: 'What sound do you use for Pink Ties?',
  turntable: 'Which records shaped your taste in music?',
  palley: 'What is the story behind Step Up and those keychains?',
  mug: 'What does a typical workday look like?',
  setlist: 'Which song do you love playing live?',
  cable: 'Why purple?',
} as const;

/** Suggesties in een lege chat. */
export const SUGGESTIONS = ['Who are you?', 'What do you like working on?', OBJECT_PROMPTS.quadCortex, OBJECT_PROMPTS.palley];
