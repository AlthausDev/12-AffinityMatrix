import {
  CATALOGUE_GLOSSARY,
  catalogueGlossaryEntry,
  localizedCatalogueGlossary,
  splitCatalogueGlossaryText,
} from './catalogue-glossary';

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

  it('does not match glossary aliases inside ordinary words', () => {
    const text = 'El protocolo y la propiedad se describen de forma normal.';
    const terms = splitCatalogueGlossaryText(text, 'es').filter((segment) => segment.termId);
    expect(terms.map((segment) => segment.text)).toEqual(['protocolo']);
  });

  it('returns localized definitions for high-context vocabulary', () => {
    const spanish = catalogueGlossaryEntry('cnc', 'es');
    const english = catalogueGlossaryEntry('cnc', 'en');
    expect(spanish?.definition).toContain('previamente acordado');
    expect(english?.definition).toContain('pre-agreed');
  });

  it('makes hotwife and cuckold explicitly distinguishable', () => {
    const hotwife = catalogueGlossaryEntry('hotwife', 'es');
    const cuckold = catalogueGlossaryEntry('cuckold', 'es');
    expect(hotwife?.definition).toContain('foco está en la mujer');
    expect(hotwife?.definition).toContain('cuckold');
    expect(cuckold?.definition).toContain('foco está en el hombre');
    expect(cuckold?.definition).toContain('hotwife');
  });

  it('exposes the same glossary as reusable localized product data', () => {
    const ids = CATALOGUE_GLOSSARY.map((entry) => entry.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(CATALOGUE_GLOSSARY.length).toBeGreaterThan(50);

    const localized = localizedCatalogueGlossary('es');
    expect(localized).toHaveLength(CATALOGUE_GLOSSARY.length);
    expect(localized.every((entry) => entry.title.length > 0 && entry.definition.length > 0)).toBe(true);
    expect(localized.some((entry) => entry.category === 'edge')).toBe(true);
    expect(localized.some((entry) => entry.category === 'groups-non-monogamy')).toBe(true);
  });
});
