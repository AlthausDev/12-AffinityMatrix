import { CATALOGUE_V3_CONTENT } from './v3/content/final';
import { cleanDisplayTitle, isAllowedParenthetical } from './v3/content/final-presentation-cleanup';

function parentheticalContents(title: string): string[] {
  return [...title.matchAll(/\(([^()]*)\)/gu)].map((match) => match[1] ?? '');
}

describe('Catalogue V3 presentation cleanup', () => {
  it('removes explanatory parentheticals while retaining abbreviations and special names', () => {
    expect(cleanDisplayTitle('Public-use fantasy (controlled simulation)')).toBe('Public-use fantasy');
    expect(cleanDisplayTitle('Fantasía de muerte / cadáver (roleplay)')).toBe('Fantasía de muerte / cadáver');
    expect(cleanDisplayTitle('Consensual non-consent (CNC)')).toBe('Consensual non-consent (CNC)');
    expect(cleanDisplayTitle('Cock and ball torture (CBT)')).toBe('Cock and ball torture (CBT)');
    expect(cleanDisplayTitle('Rope style (Shibari)')).toBe('Rope style (Shibari)');
  });

  it('leaves only allowed compact parentheticals in final catalogue titles', () => {
    for (const category of CATALOGUE_V3_CONTENT) {
      const titles = [
        category.en,
        category.es,
        ...category.practices.flatMap((practice) => [practice.en, practice.es]),
      ];
      for (const title of titles) {
        for (const parenthetical of parentheticalContents(title)) {
          expect(isAllowedParenthetical(parenthetical), title).toBe(true);
        }
      }
    }
  });
});
