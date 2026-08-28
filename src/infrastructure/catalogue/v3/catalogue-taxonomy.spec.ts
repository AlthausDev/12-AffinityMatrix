import { describe, expect, it } from 'vitest';
import { CATALOGUE_V3_SUBCATEGORIES } from './catalogue-taxonomy';
import { CATALOGUE_V3_CONTENT } from './content/final';

describe('catalogue v3 questionnaire taxonomy', () => {
  it('assigns every practice in each migrated final category exactly once', () => {
    const migratedCategoryIds = [...new Set(
      CATALOGUE_V3_SUBCATEGORIES.map((subcategory) => subcategory.categoryId),
    )];

    expect(migratedCategoryIds).toEqual([
      'affection-intimacy',
      'sexual-style',
      'clothing-appearance',
      'manual-masturbation',
      'oral',
      'penetration',
      'sexual-positions',
      'toys',
      'orgasm-control',
      'body-fetishes',
      'groups',
      'roleplay',
      'exhibitionism',
      'places-settings',
      'power',
    ]);

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

  it('keeps migrated categories reviewable without changing final coverage', () => {
    const orgasmGroups = CATALOGUE_V3_SUBCATEGORIES.filter((entry) => entry.categoryId === 'orgasm-control');
    const bodyGroups = CATALOGUE_V3_SUBCATEGORIES.filter((entry) => entry.categoryId === 'body-fetishes');
    const socialGroups = CATALOGUE_V3_SUBCATEGORIES.filter((entry) => entry.categoryId === 'groups');
    const roleplayGroups = CATALOGUE_V3_SUBCATEGORIES.filter((entry) => entry.categoryId === 'roleplay');
    const exhibitionismGroups = CATALOGUE_V3_SUBCATEGORIES.filter((entry) => entry.categoryId === 'exhibitionism');
    const placeGroups = CATALOGUE_V3_SUBCATEGORIES.filter((entry) => entry.categoryId === 'places-settings');
    const powerGroups = CATALOGUE_V3_SUBCATEGORIES.filter((entry) => entry.categoryId === 'power');

    expect(orgasmGroups).toHaveLength(3);
    expect(orgasmGroups.flatMap((entry) => entry.practiceIds)).toHaveLength(11);
    expect(bodyGroups).toHaveLength(7);
    expect(bodyGroups.flatMap((entry) => entry.practiceIds)).toHaveLength(53);
    expect(socialGroups).toHaveLength(4);
    expect(socialGroups.flatMap((entry) => entry.practiceIds)).toHaveLength(17);
    expect(roleplayGroups).toHaveLength(5);
    expect(roleplayGroups.flatMap((entry) => entry.practiceIds)).toHaveLength(23);
    expect(exhibitionismGroups).toHaveLength(2);
    expect(exhibitionismGroups.flatMap((entry) => entry.practiceIds)).toHaveLength(8);
    expect(placeGroups).toHaveLength(3);
    expect(placeGroups.flatMap((entry) => entry.practiceIds)).toHaveLength(12);
    expect(powerGroups).toHaveLength(4);
    expect(powerGroups.flatMap((entry) => entry.practiceIds)).toHaveLength(24);
  });
});
