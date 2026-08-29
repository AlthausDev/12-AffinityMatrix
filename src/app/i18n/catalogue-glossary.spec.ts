import { splitCatalogueGlossaryText } from './catalogue-glossary';

describe('catalogue glossary', () => {
  it('finds reserved terms without losing surrounding copy', () => {
    const text = 'Creampie vaginal y edging prolongado';
    const segments = splitCatalogueGlossaryText(text, 'es');
    expect(segments.map((segment) => segment.text).join('')).toBe(text);
    expect(segments.filter((segment) => segment.termId).map((segment) => segment.termId))
      .toEqual(['creampie', 'edging']);
  });

  it('matches Spanish and English aliases case-insensitively', () => {
    expect(splitCatalogueGlossaryText('Voyeurismo y HOTWIFE', 'es')
      .filter((segment) => segment.termId)
      .map((segment) => segment.termId))
      .toEqual(['voyeurism', 'hotwife']);
  });

  it('returns localized definitions for high-context vocabulary', () => {
    const spanish = splitCatalogueGlossaryText('CNC', 'es').find((segment) => segment.termId === 'cnc');
    const english = splitCatalogueGlossaryText('CNC', 'en').find((segment) => segment.termId === 'cnc');
    expect(spanish?.definition).toContain('previamente acordado');
    expect(english?.definition).toContain('pre-agreed');
  });
});
