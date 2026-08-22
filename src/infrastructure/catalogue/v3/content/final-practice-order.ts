import { CatalogueCategorySeed } from './types';
import { CATALOGUE_PRACTICE_GROUP_ORDER } from './practice-group-order';

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
  'breasts',
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
] as const;

/** Final deliberate order, extending the base grouping only where this last review adds content. */
export const FINAL_CATALOGUE_PRACTICE_GROUP_ORDER: Readonly<Record<string, readonly string[]>> = {
  ...CATALOGUE_PRACTICE_GROUP_ORDER,
  'body-fetishes': BODY_FOCUS_FINAL_ORDER,
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
