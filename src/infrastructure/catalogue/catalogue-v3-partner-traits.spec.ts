import { CATALOGUE_V3_CONTENT, RETIRED_V3_PRACTICE_IDS } from './v3/content/final';
import { bodyTraitRefinementGroup } from './v3/content/body-trait-refinements';

describe('Catalogue V3 partner physical traits', () => {
  const category = () => CATALOGUE_V3_CONTENT.find((candidate) => candidate.id === 'body-fetishes');
  const seed = (id: string) => category()?.practices.find((practice) => practice.id === id);

  it('keeps broad physical-trait preferences while compacting repetitive variants', () => {
    expect(category()?.es).toBe('Cuerpo, rasgos físicos y fetiches');
    expect(category()?.en).toBe('Body, physical traits & fetishes');

    for (const parent of ['hair', 'chest-general', 'buttocks', 'penis', 'piercings']) {
      expect(seed(parent), parent).toBeDefined();
      expect(bodyTraitRefinementGroup(parent), parent).toBeDefined();
    }

    const compacted = [
      'penis-size-small',
      'penis-size-average',
      'penis-size-large',
      'breast-size-small',
      'breast-size-average',
      'breast-size-large',
      'buttocks-size-small',
      'buttocks-size-average',
      'buttocks-size-large',
      'hair-length-short',
      'hair-length-medium',
      'hair-length-long',
      'shaved-bald-head',
      'facial-piercings',
      'body-piercings',
      'nipple-piercings',
      'genital-piercings',
    ];

    for (const id of compacted) {
      expect(seed(id), id).toBeUndefined();
      expect(RETIRED_V3_PRACTICE_IDS.has(id), id).toBe(true);
    }

    // Stature and build remain first-class questions until they have a semantically clean parent.
    expect(seed('stature-short')).toBeDefined();
    expect(seed('stature-average')).toBeDefined();
    expect(seed('stature-tall')).toBeDefined();
    expect(seed('slim-build')).toBeDefined();
    expect(seed('curvy-build')).toBeDefined();
    expect(seed('stocky-build')).toBeDefined();
  });

  it('preserves sex-specific meaning on refinement options', () => {
    const breastOptions = bodyTraitRefinementGroup('chest-general')?.options ?? [];
    const penisOptions = bodyTraitRefinementGroup('penis')?.options ?? [];
    const hairOptions = bodyTraitRefinementGroup('hair')?.options ?? [];

    expect(breastOptions.map((option) => option.id)).toEqual([
      'breast-size-small', 'breast-size-average', 'breast-size-large',
    ]);
    expect(breastOptions.every((option) => option.partnerSex === 'female')).toBe(true);
    expect(penisOptions.map((option) => option.id)).toEqual([
      'penis-size-small', 'penis-size-average', 'penis-size-large',
    ]);
    expect(penisOptions.every((option) => option.partnerSex === 'male')).toBe(true);
    expect(hairOptions.every((option) => option.partnerSex === undefined)).toBe(true);
  });
});
