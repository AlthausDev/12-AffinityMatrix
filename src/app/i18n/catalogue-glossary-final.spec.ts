import { localizedFinalCatalogueGlossary, splitFinalCatalogueGlossaryText } from './catalogue-glossary-final';

describe('final catalogue glossary', () => {
  it('removes hotwife and replaces it with a distinct compersion concept', () => {
    const ids = localizedFinalCatalogueGlossary('es').map((entry) => entry.id);
    expect(ids).not.toContain('hotwife');
    expect(ids).toContain('compersion');
    expect(splitFinalCatalogueGlossaryText('Compersión erótica', 'es').find((part) => part.termId)?.termId)
      .toBe('compersion');
  });

  it('covers difficult BDSM furniture vocabulary with short mental models', () => {
    const glossary = localizedFinalCatalogueGlossary('es');
    for (const id of ['stocks', 'st-andrews-cross', 'bondage-bench', 'bondage-chair', 'cage-confinement']) {
      const entry = glossary.find((candidate) => candidate.id === id);
      expect(entry, id).toBeDefined();
      expect(entry!.definition.length, id).toBeGreaterThan(35);
      expect(entry!.definition.length, id).toBeLessThan(260);
    }
    expect(glossary.find((entry) => entry.id === 'stocks')?.definition).toContain('aberturas');
  });

  it('keeps place-specific vocabulary reusable for a future glossary screen', () => {
    const glossary = localizedFinalCatalogueGlossary('es');
    expect(glossary.find((entry) => entry.id === 'dungeon')?.category).toBe('places-settings');
    expect(glossary.find((entry) => entry.id === 'glory-hole')?.category).toBe('places-settings');
  });

  it('defines voyeurism without implying non-consensual spying', () => {
    const definition = localizedFinalCatalogueGlossary('es').find((entry) => entry.id === 'voyeurism')?.definition;
    expect(definition).toContain('sabe que está siendo observada');
    expect(definition).toContain('preacordada');
  });
});
