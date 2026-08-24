import { describe, expect, it } from 'vitest';
import { CATALOGUE_INSIGHT_TAGS, CATALOGUE_V3_PRACTICE_INSIGHTS } from './catalogue-insights';
import { CATALOGUE_V3_SUBCATEGORIES } from './catalogue-taxonomy';

describe('catalogue v3 insight signals', () => {
  it('defines each semantic tag once', () => {
    const ids = CATALOGUE_INSIGHT_TAGS.map((tag) => tag.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('tags every practice in the migrated affection category exactly once', () => {
    const migratedPracticeIds = CATALOGUE_V3_SUBCATEGORIES
      .filter((subcategory) => subcategory.categoryId === 'affection-intimacy')
      .flatMap((subcategory) => subcategory.practiceIds);
    const taggedPracticeIds = CATALOGUE_V3_PRACTICE_INSIGHTS.map((entry) => entry.practiceId);

    expect(new Set(taggedPracticeIds).size).toBe(taggedPracticeIds.length);
    expect([...taggedPracticeIds].sort()).toEqual([...migratedPracticeIds].sort());
  });

  it('uses bounded non-zero semantic strengths', () => {
    for (const entry of CATALOGUE_V3_PRACTICE_INSIGHTS) {
      const strengths = Object.values(entry.signals);
      expect(strengths.length).toBeGreaterThan(0);
      for (const strength of strengths) {
        expect(strength).toBeGreaterThan(0);
        expect(strength).toBeLessThanOrEqual(1);
      }
    }
  });
});
