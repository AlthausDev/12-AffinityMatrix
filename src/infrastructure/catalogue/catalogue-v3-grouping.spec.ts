import { CATALOGUE_V3_CONTENT } from './v3/content/final';
import { CATALOGUE_PRACTICE_GROUP_ORDER } from './v3/content/practice-group-order';

describe('Catalogue V3 in-category grouping', () => {
  it('defines an explicit complete order for every final category', () => {
    expect(Object.keys(CATALOGUE_PRACTICE_GROUP_ORDER)).toHaveLength(CATALOGUE_V3_CONTENT.length);

    for (const category of CATALOGUE_V3_CONTENT) {
      const expected = CATALOGUE_PRACTICE_GROUP_ORDER[category.id];
      const actual = category.practices.map((practice) => practice.id);

      expect(expected, `${category.id} is missing an explicit group order`).toBeDefined();
      expect(new Set(expected).size, `${category.id} group order contains duplicate ids`).toBe(expected?.length);
      expect(new Set(expected), `${category.id} group order does not cover the current practices`)
        .toEqual(new Set(actual));
      expect(actual, `${category.id} is not rendered in its deliberate group order`).toEqual(expected);
    }
  });
});
