import { describe, expect, it } from 'vitest';
import { AFFECTION_INTIMACY } from './content/soft';
import { CATALOGUE_V3_SUBCATEGORIES } from './catalogue-taxonomy';

describe('catalogue v3 questionnaire taxonomy', () => {
  it('assigns every migrated Affection & intimacy practice exactly once', () => {
    const sourceIds = AFFECTION_INTIMACY.practices.map((practice) => practice.id).sort();
    const taxonomyIds = CATALOGUE_V3_SUBCATEGORIES
      .filter((subcategory) => subcategory.categoryId === AFFECTION_INTIMACY.id)
      .flatMap((subcategory) => subcategory.practiceIds)
      .sort();

    expect(taxonomyIds).toEqual(sourceIds);
    expect(new Set(taxonomyIds).size).toBe(taxonomyIds.length);
  });

  it('uses unique subcategory ids and orders inside each category', () => {
    const ids = CATALOGUE_V3_SUBCATEGORIES.map((subcategory) => subcategory.id);
    expect(new Set(ids).size).toBe(ids.length);

    const categories = new Set(CATALOGUE_V3_SUBCATEGORIES.map((subcategory) => subcategory.categoryId));
    for (const categoryId of categories) {
      const orders = CATALOGUE_V3_SUBCATEGORIES
        .filter((subcategory) => subcategory.categoryId === categoryId)
        .map((subcategory) => subcategory.order);
      expect(new Set(orders).size).toBe(orders.length);
    }
  });
});
