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

const TOYS_RELEASE_AUDIT_ORDER = [
  ...FINAL_CATALOGUE_PRACTICE_GROUP_ORDER['toys'],
  'everyday-object-play',
  'everyday-object-vaginal-penetration',
  'everyday-object-anal-penetration',
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
  toys: TOYS_RELEASE_AUDIT_ORDER,
  fluids: FLUIDS_RELEASE_AUDIT_ORDER,
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
