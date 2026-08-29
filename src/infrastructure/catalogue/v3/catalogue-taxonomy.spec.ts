import { describe, expect, it } from 'vitest';
import { CATALOGUE_V3_SUBCATEGORIES } from './catalogue-taxonomy';
import { CATALOGUE_V3_CONTENT } from './content/final';

describe('catalogue v3 questionnaire taxonomy', () => {
  it('assigns every practice in every final category exactly once', () => {
    const migratedCategoryIds = [...new Set(
      CATALOGUE_V3_SUBCATEGORIES.map((subcategory) => subcategory.categoryId),
    )];
    const finalCategoryIds = CATALOGUE_V3_CONTENT.map((category) => category.id);

    expect(migratedCategoryIds).toEqual(finalCategoryIds);

    for (const categoryId of migratedCategoryIds) {
      const category = CATALOGUE_V3_CONTENT.find((entry) => entry.id === categoryId);
      expect(category, `Missing final category ${categoryId}`).toBeDefined();

      const sourceIds = category!.practices.map((practice) => practice.id).sort();
      const taxonomyIds = CATALOGUE_V3_SUBCATEGORIES
        .filter((subcategory) => subcategory.categoryId === categoryId)
        .flatMap((subcategory) => subcategory.practiceIds)
        .sort();

      expect(taxonomyIds, `Taxonomy coverage mismatch for ${categoryId}`).toEqual(sourceIds);
      expect(new Set(taxonomyIds).size, `Duplicate taxonomy practice in ${categoryId}`)
        .toBe(taxonomyIds.length);
    }
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

  it('keeps the larger final categories reviewable with the final release coverage', () => {
    const expected: Readonly<Record<string, readonly [number, number]>> = {
      toys: [8, 34],
      'orgasm-control': [3, 11],
      'body-fetishes': [7, 54],
      groups: [4, 17],
      roleplay: [5, 23],
      exhibitionism: [2, 16],
      'places-settings': [3, 16],
      power: [4, 31],
      restraint: [6, 36],
      psychological: [4, 22],
      sensation: [4, 29],
      fluids: [7, 37],
      'taboo-fantasies': [2, 12],
      surrealism: [2, 10],
      edge: [5, 26],
    };

    for (const [categoryId, [subcategoryCount, practiceCount]] of Object.entries(expected)) {
      const groups = CATALOGUE_V3_SUBCATEGORIES.filter((entry) => entry.categoryId === categoryId);
      expect(groups, `Unexpected subcategory count for ${categoryId}`).toHaveLength(subcategoryCount);
      expect(groups.flatMap((entry) => entry.practiceIds), `Unexpected practice count for ${categoryId}`)
        .toHaveLength(practiceCount);
    }
  });
});
