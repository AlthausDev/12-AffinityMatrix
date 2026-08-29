import { CatalogueCategorySeed } from './types';
import { FINAL_CATALOGUE_PRACTICE_GROUP_ORDER } from './final-practice-order';

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

const ACCESSORY_ORIGINAL_IDS = [
  'penis-sleeve',
  'cock-ring',
  'vibrating-cock-ring',
  'masturbator-sleeve',
  'automatic-masturbator',
  'penis-pump',
  'clitoral-suction-toy',
  'kegel-balls',
  'nipple-suction-cups',
  'pinwheel',
  'sex-machine',
  'sex-swing',
  'positioning-pillow',
] as const;

const SEXUAL_STYLE_RELEASE_ORDER = [
  ...FINAL_CATALOGUE_PRACTICE_GROUP_ORDER['sexual-style'],
  'spontaneous-sex',
  'planned-sex',
  'quiet-sex',
  'vocal-expressive-sex',
  'immersive-focused-sex',
  'energetic-sex',
];

const TOYS_RELEASE_AUDIT_ORDER = without(
  FINAL_CATALOGUE_PRACTICE_GROUP_ORDER['toys'],
  ACCESSORY_ORIGINAL_IDS,
);

const SEXUAL_ACCESSORIES_RELEASE_AUDIT_ORDER = [
  ...FINAL_CATALOGUE_PRACTICE_GROUP_ORDER['toys'].filter((id) => ACCESSORY_ORIGINAL_IDS.includes(id as never)),
  'everyday-object-play',
  'everyday-object-vaginal-penetration',
  'everyday-object-anal-penetration',
];

const ORGASM_RELEASE_ORDER = [
  ...FINAL_CATALOGUE_PRACTICE_GROUP_ORDER['orgasm-control'],
  'orgasm-on-command',
  'orgasm-permission',
  'orgasm-count-control',
];

const GROUPS_RELEASE_ORDER = [
  ...FINAL_CATALOGUE_PRACTICE_GROUP_ORDER['groups'],
  'group-oral-focus',
  'group-worship-focus',
  'group-masturbation-circle',
  'group-shared-toy-play',
];

const PLACES_RELEASE_ORDER = [
  ...FINAL_CATALOGUE_PRACTICE_GROUP_ORDER['places-settings'],
  'sex-private-pool-hot-tub',
  'sex-on-boat-private',
  'sex-on-rooftop-private',
  'sex-on-private-balcony',
  'sex-in-camper-rv',
  'sex-in-train-private-cabin',
  'sex-in-changing-room-controlled',
  'sex-in-elevator-after-hours',
  'sex-in-studio-warehouse',
  'sex-in-secluded-forest',
  'sex-at-secluded-viewpoint',
  'sex-in-private-sauna-spa',
];

const POWER_RELEASE_ORDER = insertAfter(
  FINAL_CATALOGUE_PRACTICE_GROUP_ORDER['power'],
  'fetish-gear-service',
  [
    'oral-service',
    'manual-pleasure-service',
    'orgasm-service',
    'intimate-grooming-service',
    'fetish-scent-service',
    'toilet-service-fantasy',
  ],
);

const SURREALISM_RELEASE_ORDER = [
  ...FINAL_CATALOGUE_PRACTICE_GROUP_ORDER['surrealism'],
  'clone-duplication-fantasy',
  'possession-fantasy',
  'slime-creature-fantasy',
  'oviposition-fantasy',
  'object-transformation-fantasy',
  'living-symbiote-fantasy',
];

const FLUIDS_WITHOUT_FOOD_BODY = without(
  FINAL_CATALOGUE_PRACTICE_GROUP_ORDER['fluids'],
  ['food-body-play'],
);
const FLUIDS_RELEASE_AUDIT_ORDER = insertBefore(FLUIDS_WITHOUT_FOOD_BODY, 'sweat-play', [
  'food-body-play',
  'erotic-feeding',
  'food-from-body',
  'food-vaginal-penetration',
  'food-anal-penetration',
]);

const EDGE_RELEASE_AUDIT_ORDER = insertAfter(
  FINAL_CATALOGUE_PRACTICE_GROUP_ORDER['edge'],
  'pussy-torture',
  ['vaginal-torture', 'urethral-torture'],
);

export const RELEASE_AUDIT_CATALOGUE_PRACTICE_GROUP_ORDER: Readonly<Record<string, readonly string[]>> = {
  ...FINAL_CATALOGUE_PRACTICE_GROUP_ORDER,
  'sexual-style': SEXUAL_STYLE_RELEASE_ORDER,
  toys: TOYS_RELEASE_AUDIT_ORDER,
  'sexual-accessories': SEXUAL_ACCESSORIES_RELEASE_AUDIT_ORDER,
  'orgasm-control': ORGASM_RELEASE_ORDER,
  groups: GROUPS_RELEASE_ORDER,
  'places-settings': PLACES_RELEASE_ORDER,
  power: POWER_RELEASE_ORDER,
  fluids: FLUIDS_RELEASE_AUDIT_ORDER,
  surrealism: SURREALISM_RELEASE_ORDER,
  edge: EDGE_RELEASE_AUDIT_ORDER,
};

export function applyCatalogueReleaseAuditOrder(
  content: readonly CatalogueCategorySeed[],
): readonly CatalogueCategorySeed[] {
  return content.map((category) => {
    const preferredOrder = RELEASE_AUDIT_CATALOGUE_PRACTICE_GROUP_ORDER[category.id];
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
