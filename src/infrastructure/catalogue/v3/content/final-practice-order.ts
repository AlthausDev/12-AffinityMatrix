import { CatalogueCategorySeed } from './types';
import { CATALOGUE_PRACTICE_GROUP_ORDER } from './practice-group-order';

const base = (categoryId: string): readonly string[] => CATALOGUE_PRACTICE_GROUP_ORDER[categoryId] ?? [];
const without = (order: readonly string[], removed: readonly string[]): readonly string[] =>
  order.filter((id) => !removed.includes(id));
const insertAfter = (order: readonly string[], anchor: string, inserted: readonly string[]): readonly string[] => {
  const index = order.indexOf(anchor);
  if (index < 0) return [...order, ...inserted];
  return [...order.slice(0, index + 1), ...inserted, ...order.slice(index + 1)];
};
const insertBefore = (order: readonly string[], anchor: string, inserted: readonly string[]): readonly string[] => {
  const index = order.indexOf(anchor);
  if (index < 0) return [...order, ...inserted];
  return [...order.slice(0, index), ...inserted, ...order.slice(index)];
};

const BODY_FOCUS_FINAL_ORDER = [
  'lips',
  'tongue',
  'hair',
  'hair-length-short',
  'hair-length-medium',
  'hair-length-long',
  'shaved-bald-head',
  'facial-hair',
  'ears',
  'neck',
  'chest',
  'breast-size-small',
  'breast-size-average',
  'breast-size-large',
  'nipples',
  'muscles',
  'slim-build',
  'curvy-build',
  'stocky-build',
  'stature-short',
  'stature-average',
  'stature-tall',
  'hands',
  'fingers',
  'bellies',
  'navel',
  'buttocks',
  'buttocks-size-small',
  'buttocks-size-average',
  'buttocks-size-large',
  'legs',
  'thighs',
  'feet',
  'toes',
  'penis',
  'penis-size-small',
  'penis-size-average',
  'penis-size-large',
  'testicles',
  'vulva',
  'pubic-hair',
  'body-hair',
  'armpits',
  'body-scent',
  'sweat',
  'underwear',
  'worn-underwear',
  'tattoos',
  'piercings',
  'facial-piercings',
  'body-piercings',
  'nipple-piercings',
  'genital-piercings',
] as const;

const PENETRATION_FINAL_ORDER = insertAfter(base('penetration'), 'double-anal-penetration', [
  'simultaneous-vaginal-anal-penetration',
  'simultaneous-vaginal-oral-penetration',
  'simultaneous-anal-oral-penetration',
  'simultaneous-vaginal-anal-oral-penetration',
]);

const TOYS_FINAL_ORDER = insertAfter(
  without(base('toys'), ['realistic-dildo', 'glass-dildo', 'metal-dildo']),
  'dildo',
  ['special-material-dildo', 'fantasy-shaped-dildo'],
);

const ROLEPLAY_WITH_TABOO = insertAfter(base('roleplay'), 'roleplay-general', [
  'adult-taboo-fantasy',
  'surreal-fantasy-roleplay',
]);
const ROLEPLAY_FINAL_ORDER = insertAfter(
  ROLEPLAY_WITH_TABOO,
  'teacher-student-adult-roleplay',
  ['caregiver-little-adult-roleplay'],
);

const EXHIBITIONISM_FINAL_ORDER = insertAfter(
  without(base('exhibitionism'), ['curtains-open-private']),
  'voyeurism',
  ['risk-of-being-seen'],
);

const RESTRAINT_FINAL_ORDER = insertBefore(base('restraint'), 'gag', ['hand-over-mouth']);

/** Final deliberate order, extending the base grouping only where final review changes content. */
export const FINAL_CATALOGUE_PRACTICE_GROUP_ORDER: Readonly<Record<string, readonly string[]>> = {
  ...CATALOGUE_PRACTICE_GROUP_ORDER,
  'manual-masturbation': without(base('manual-masturbation'), ['hand-over-mouth']),
  penetration: PENETRATION_FINAL_ORDER,
  toys: TOYS_FINAL_ORDER,
  'body-fetishes': BODY_FOCUS_FINAL_ORDER,
  roleplay: ROLEPLAY_FINAL_ORDER,
  exhibitionism: EXHIBITIONISM_FINAL_ORDER,
  restraint: RESTRAINT_FINAL_ORDER,
};

export function groupFinalCataloguePractices(
  content: readonly CatalogueCategorySeed[],
): readonly CatalogueCategorySeed[] {
  return content.map((category) => {
    const preferredOrder = FINAL_CATALOGUE_PRACTICE_GROUP_ORDER[category.id];
    if (!preferredOrder) return category;
    const indexById = new Map(preferredOrder.map((id, index) => [id, index]));
    return {
      ...category,
      practices: [...category.practices].sort((left, right) =>
        (indexById.get(left.id) ?? Number.MAX_SAFE_INTEGER)
        - (indexById.get(right.id) ?? Number.MAX_SAFE_INTEGER)),
    };
  });
}
