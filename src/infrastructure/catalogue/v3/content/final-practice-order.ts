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
  'chest-general',
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
  'vagina',
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

const SEXUAL_POSITIONS_FINAL_ORDER = [
  'missionary',
  'side-by-side-face-to-face',
  'kneeling-face-to-face',
  'seated-penetration',
  'lotus-position',
  'cowgirl',
  'reverse-cowgirl',
  'doggy-style',
  'prone-rear-entry',
  'spooning-penetration',
  'legs-on-shoulders',
  'butterfly-position',
  't-position',
  'standing-penetration',
  'against-wall',
  'standing-carry',
  'wheelbarrow-position',
  'bridge-position',
  'sixty-nine',
  'face-sitting',
] as const;

const TOYS_FINAL_ORDER = insertAfter(
  without(base('toys'), ['realistic-dildo', 'glass-dildo', 'metal-dildo']),
  'dildo',
  ['special-material-dildo', 'fantasy-shaped-dildo'],
);

const ROLEPLAY_WITH_MEDICAL = insertAfter(
  without(base('roleplay'), ['doctor-patient-roleplay', 'nurse-patient-roleplay']),
  'teacher-student-adult-roleplay',
  ['medical-professional-patient-roleplay', 'doctor-nurse-roleplay'],
);
const ROLEPLAY_WITH_TABOO = insertAfter(ROLEPLAY_WITH_MEDICAL, 'roleplay-general', [
  'adult-taboo-fantasy',
  'surreal-fantasy-roleplay',
]);
const ROLEPLAY_BEFORE_RELEASE = insertAfter(
  ROLEPLAY_WITH_TABOO,
  'teacher-student-adult-roleplay',
  ['caregiver-little-adult-roleplay'],
);
const ROLEPLAY_WITHOUT_RELEASE_MOVES = without(ROLEPLAY_BEFORE_RELEASE, [
  'adult-taboo-fantasy',
  'surreal-fantasy-roleplay',
  'caregiver-little-adult-roleplay',
  'consensual-non-consent-roleplay',
  'sleep-roleplay',
  'monster-roleplay',
  'pet-play',
]);
const ROLEPLAY_FINAL_ORDER = insertAfter(
  ROLEPLAY_WITHOUT_RELEASE_MOVES,
  'vampire-roleplay',
  ['pet-play-soft', 'pet-play-intense'],
);

const TABOO_FINAL_ORDER = [
  'adult-taboo-fantasy',
  'cheating-fantasy',
  'adult-ageplay-roleplay',
  'caregiver-little-adult-roleplay',
  'family-role-taboo-fantasy',
  'religious-taboo-fantasy',
  'extremist-war-symbolism-fantasy',
  'consensual-non-consent-roleplay',
  'free-use-unaware-roleplay',
  'sleep-roleplay',
  'public-use-fantasy',
  'death-corpse-roleplay',
] as const;

const SURREALISM_FINAL_ORDER = [
  'surreal-fantasy-roleplay',
  'futanari-fantasy',
  'transformation-fantasy',
  'size-change-fantasy',
  'extra-anatomy-fantasy',
  'tentacle-fantasy',
  'furry-anthro-fantasy',
  'monster-roleplay',
  'alien-fantasy',
  'vore-fantasy',
] as const;

const EXHIBITIONISM_FINAL_ORDER = [
  'voyeurism',
  'watching-undressing',
  'mirrors',
  'lights-on',
  'risk-of-being-seen',
  'erotic-selfies',
  'taking-erotic-photos',
  'partner-erotic-photography',
  'erotic-photo-session-together',
  'private-recording',
  'watch-private-recording-together',
  'video-call-sex',
  'webcam-performance-private',
] as const;

const POWER_WITH_SERVICE = insertAfter(base('power'), 'domestic-service', [
  'body-care-service',
  'hospitality-service',
  'ritual-attendance-service',
]);
const POWER_FINAL_ORDER = insertAfter(POWER_WITH_SERVICE, 'leash-control', [
  'ownership-token',
  'temporary-ownership-marking',
  'assigned-submissive-name',
]);

const RESTRAINT_FINAL_ORDER = insertBefore(base('restraint'), 'gag', ['hand-over-mouth']);
const FLUIDS_WITH_SQUIRTING = insertAfter(base('fluids'), 'female-ejaculation', ['squirting-on-partner']);
const FLUIDS_WITH_EXTERNAL_OTHER = insertAfter(FLUIDS_WITH_SQUIRTING, 'semen-on-buttocks', ['semen-on-other-body']);
const FLUIDS_WITH_OWN_URINE = insertAfter(FLUIDS_WITH_EXTERNAL_OTHER, 'urine-drinking', ['own-urine-play']);
const FLUIDS_WITH_OWN_BLOOD = insertAfter(FLUIDS_WITH_OWN_URINE, 'blood-drinking', ['own-blood-play']);
const FLUIDS_FINAL_ORDER = insertAfter(FLUIDS_WITH_OWN_BLOOD, 'scat-ingestion', ['own-scat-play']);
const EDGE_WITH_SEPARATE_GENITALS = insertBefore(
  without(base('edge'), ['genital-torture']),
  'cock-and-ball-torture',
  ['pussy-torture'],
);
const EDGE_FINAL_ORDER = [...EDGE_WITH_SEPARATE_GENITALS, 'ordeal-scene', 'extreme-helplessness-fantasy'];

/** Final deliberate order, extending the base grouping only where final review changes content. */
export const FINAL_CATALOGUE_PRACTICE_GROUP_ORDER: Readonly<Record<string, readonly string[]>> = {
  ...CATALOGUE_PRACTICE_GROUP_ORDER,
  'manual-masturbation': without(base('manual-masturbation'), ['hand-over-mouth']),
  penetration: PENETRATION_FINAL_ORDER,
  'sexual-positions': SEXUAL_POSITIONS_FINAL_ORDER,
  toys: TOYS_FINAL_ORDER,
  'body-fetishes': BODY_FOCUS_FINAL_ORDER,
  roleplay: ROLEPLAY_FINAL_ORDER,
  exhibitionism: EXHIBITIONISM_FINAL_ORDER,
  power: POWER_FINAL_ORDER,
  restraint: RESTRAINT_FINAL_ORDER,
  fluids: FLUIDS_FINAL_ORDER,
  'taboo-fantasies': TABOO_FINAL_ORDER,
  surrealism: SURREALISM_FINAL_ORDER,
  edge: EDGE_FINAL_ORDER,
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
