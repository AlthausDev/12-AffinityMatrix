import { describe, expect, it } from 'vitest';
import { CATALOGUE_V3_CONTENT } from './final';
import { EXPANDED_SEXUAL_POSITIONS } from './sexual-position-additions';

describe('expanded sexual positions', () => {
  it('keeps the eight expanded positions inside the final 24-position category', () => {
    const category = CATALOGUE_V3_CONTENT.find((entry) => entry.id === 'sexual-positions');
    expect(category).toBeDefined();
    expect(category!.practices).toHaveLength(24);

    const ids = category!.practices.map((practice) => practice.id);
    for (const addition of EXPANDED_SEXUAL_POSITIONS) {
      expect(ids, addition.id).toContain(addition.id);
      expect(addition.kind).toBe('mutual');
      expect(addition.counterpartScoped).toBe(true);
      expect(addition.descriptionEs?.length, addition.id).toBeGreaterThan(80);
      expect(addition.descriptionEn?.length, addition.id).toBeGreaterThan(80);
    }
  });

  it('keeps every final sexual-position id unique', () => {
    const category = CATALOGUE_V3_CONTENT.find((entry) => entry.id === 'sexual-positions');
    const ids = category!.practices.map((practice) => practice.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
