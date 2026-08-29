import { describe, expect, it } from 'vitest';
import {
  firstPendingSubcategoryId,
  initialSubcategoryId,
  isSubcategoryComplete,
  nextPendingSubcategoryId,
} from './questionnaire-subcategory-flow';

describe('questionnaire subcategory progression', () => {
  const sections = [
    { id: 'first', answered: 3, total: 3 },
    { id: 'second', answered: 1, total: 3 },
    { id: 'third', answered: 0, total: 2 },
  ] as const;

  it('treats a fully answered subcategory as complete', () => {
    expect(isSubcategoryComplete(sections[0])).toBe(true);
    expect(isSubcategoryComplete(sections[1])).toBe(false);
  });

  it('opens the first pending subcategory when entering a category', () => {
    expect(firstPendingSubcategoryId(sections)).toBe('second');
  });

  it('honours a visible direct subcategory target before normal progression', () => {
    expect(initialSubcategoryId(sections, 'third')).toBe('third');
    expect(initialSubcategoryId(sections, 'first')).toBe('first');
  });

  it('falls back to the first pending section when a direct target is unknown', () => {
    expect(initialSubcategoryId(sections, 'missing')).toBe('second');
  });

  it('returns no initial section when the category is complete', () => {
    expect(firstPendingSubcategoryId([
      { id: 'first', answered: 2, total: 2 },
      { id: 'second', answered: 4, total: 4 },
    ])).toBeNull();
  });

  it('advances to the next pending subcategory after completing the current one', () => {
    expect(nextPendingSubcategoryId(sections, 'first')).toBe('second');
    expect(nextPendingSubcategoryId(sections, 'second')).toBe('third');
  });

  it('wraps to an earlier pending subcategory after manual out-of-order completion', () => {
    expect(nextPendingSubcategoryId([
      { id: 'first', answered: 0, total: 2 },
      { id: 'second', answered: 2, total: 2 },
      { id: 'third', answered: 1, total: 1 },
    ], 'third')).toBe('first');
  });

  it('returns no next section when every subcategory is complete', () => {
    expect(nextPendingSubcategoryId([
      { id: 'first', answered: 2, total: 2 },
      { id: 'second', answered: 3, total: 3 },
    ], 'first')).toBeNull();
  });
});
