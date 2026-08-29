import { CATALOGUE_V3_CONTENT, RETIRED_V3_PRACTICE_IDS } from './v3/content/final';
import { PROFILE_PHYSICAL_PREFERENCE_PRACTICE_IDS } from './v3/content/physical-preferences-extraction';

describe('Catalogue V3 body fetishes after physical preference extraction', () => {
  const category = () => CATALOGUE_V3_CONTENT.find((candidate) => candidate.id === 'body-fetishes');
  const seed = (id: string) => category()?.practices.find((practice) => practice.id === id);

  it('keeps erotic body focuses while moving neutral appearance dimensions to the profile', () => {
    expect(category()?.es).toBe('Fetiches corporales y sensoriales');
    expect(category()?.en).toBe('Body fetishes & sensory attraction');

    for (const fetishFocus of [
      'lips', 'tongue', 'hair', 'neck', 'chest-general', 'nipples', 'buttocks',
      'feet', 'penis', 'vulva', 'pubic-hair', 'body-hair', 'body-scent', 'sweat',
      'underwear', 'worn-underwear',
    ]) {
      expect(seed(fetishFocus), fetishFocus).toBeDefined();
    }

    for (const id of PROFILE_PHYSICAL_PREFERENCE_PRACTICE_IDS) {
      expect(seed(id), id).toBeUndefined();
      expect(RETIRED_V3_PRACTICE_IDS.has(id), id).toBe(true);
    }
  });

  it('extracts proportions, overall appearance and aesthetic styling instead of sexualizing them as practices', () => {
    for (const id of [
      'hair-length-short', 'hair-length-medium', 'hair-length-long', 'shaved-bald-head',
      'facial-hair', 'stature-short', 'stature-average', 'stature-tall',
      'slim-build', 'curvy-build', 'stocky-build', 'muscles',
      'breast-size-small', 'breast-size-average', 'breast-size-large',
      'buttocks-size-small', 'buttocks-size-average', 'buttocks-size-large',
      'penis-size-small', 'penis-size-average', 'penis-size-large',
      'tattoos', 'piercings', 'facial-piercings', 'body-piercings', 'nipple-piercings', 'genital-piercings',
    ]) {
      expect(PROFILE_PHYSICAL_PREFERENCE_PRACTICE_IDS.has(id), id).toBe(true);
    }
  });
});
