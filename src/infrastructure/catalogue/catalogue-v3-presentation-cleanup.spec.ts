import { CATALOGUE_V3_CONTENT } from './v3/content/final';
import { cleanDisplayTitle } from './v3/content/final-presentation-cleanup';

function parentheticalContents(title: string): string[] {
  return [...title.matchAll(/\(([^()]*)\)/gu)].map((match) => match[1] ?? '');
}

describe('Catalogue V3 presentation cleanup', () => {
  it('removes explanatory parentheticals while retaining compact abbreviations', () => {
    expect(cleanDisplayTitle('Public-use fantasy (controlled simulation)')).toBe('Public-use fantasy');
    expect(cleanDisplayTitle('Fantasía de muerte / cadáver (roleplay)')).toBe('Fantasía de muerte / cadáver');
    expect(cleanDisplayTitle('Consensual non-consent (CNC)')).toBe('Consensual non-consent (CNC)');
    expect(cleanDisplayTitle('Cock and ball torture (CBT)')).toBe('Cock and ball torture (CBT)');
  });

  it('leaves only compact abbreviations inside final catalogue title parentheses', () => {
    for (const category of CATALOGUE_V3_CONTENT) {
      for (const title of [category.en, category.es, ...category.practices.flatMap((practice) => [practice.en, practice.es])]) {
        for (const parenthetical of parentheticalContents(title)) {
          expect(parenthetical.replace(/\s+/gu, ''), title)
            .toMatch(/^[A-Z0-9ÁÉÍÓÚÜÑ+&/.-]{2,12}$/u);
        }
      }
    }
  });
});
