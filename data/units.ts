import { Unit } from '../types/learning';
import { languages } from './languages';

const baseUnits: Unit[] = [
  // Spanish Units
  {
    id: 'es-unit-1',
    languageId: 'es',
    order: 1,
    title: 'Unit 1: Basics & Greetings',
    description: 'Learn to say hello, ask how someone is, and introduce yourself in Spanish.',
  },
  {
    id: 'es-unit-2',
    languageId: 'es',
    order: 2,
    title: 'Unit 2: Food & Dining',
    description: 'Order food, describe meals, and talk about your favorite cuisines.',
  },

  // French Units
  {
    id: 'fr-unit-1',
    languageId: 'fr',
    order: 1,
    title: 'Unit 1: Introductions & Greetings',
    description: 'Greet others, introduce yourself, and master basic polite expressions.',
  },
  {
    id: 'fr-unit-2',
    languageId: 'fr',
    order: 2,
    title: 'Unit 2: Travel & Navigation',
    description: 'Ask for directions, buy tickets, and navigate a French city.',
  },

  // Japanese Units
  {
    id: 'ja-unit-1',
    languageId: 'ja',
    order: 1,
    title: 'Unit 1: Greetings & Hiragana',
    description: 'Learn fundamental Japanese greetings and the basics of hiragana characters.',
  },
  {
    id: 'ja-unit-2',
    languageId: 'ja',
    order: 2,
    title: 'Unit 2: Shopping & Numbers',
    description: 'Count objects, ask for prices, and shop at a Japanese convenience store.',
  },
];

// Generate units dynamically for any language that doesn't have them
const generatedUnits: Unit[] = [];
languages.forEach((lang) => {
  const hasUnits = baseUnits.some((u) => u.languageId === lang.id);
  if (!hasUnits) {
    generatedUnits.push(
      {
        id: `${lang.id}-unit-1`,
        languageId: lang.id,
        order: 1,
        title: `Unit 1: Basics & Greetings`,
        description: `Learn to say hello, ask how someone is, and introduce yourself in ${lang.name}.`,
      }
    );
  }
});

export const units: Unit[] = [...baseUnits, ...generatedUnits];

