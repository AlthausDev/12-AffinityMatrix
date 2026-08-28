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

  it('keeps dense and socially complex categories reviewable without changing final coverage', () => {
    const orgasmGroups = CATALOGUE_V3_SUBCATEGORIES.filter((entry) => entry.categoryId === 'orgasm-control');
    const bodyGroups = CATALOGUE_V3_SUBCATEGORIES.filter((entry) => entry.categoryId === 'body-fetishes');
    const socialGroups = CATALOGUE_V3_SUBCATEGORIES.filter((entry) => entry.categoryId === 'groups');
    const roleplayGroups = CATALOGUE_V3_SUBCATEGORIES.filter((entry) => entry.categoryId === 'roleplay');
    const exhibitionismGroups = CATALOGUE_V3_SUBCATEGORIES.filter((entry) => entry.categoryId === 'exhibitionism');

    expect(orgasmGroups).toHaveLength(3);
    expect(orgasmGroups.flatMap((entry) => entry.practiceIds)).toHaveLength(11);
    expect(bodyGroups).toHaveLength(7);
    expect(bodyGroups.flatMap((entry) => entry.practiceIds)).toHaveLength(53);
    expect(socialGroups).toHaveLength(4);
    expect(socialGroups.flatMap((entry) => entry.practiceIds)).toHaveLength(17);
    expect(roleplayGroups).toHaveLength(5);
    expect(roleplayGroups.flatMap((entry) => entry.practiceIds)).toHaveLength(23);
    expect(exhibitionismGroups).toHaveLength(4);
    expect(exhibitionismGroups.flatMap((entry) => entry.practiceIds)).toHaveLength(20);
  });
});