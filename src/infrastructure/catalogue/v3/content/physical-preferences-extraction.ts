import { CatalogueCategorySeed } from './types';

/**
 * Appearance dimensions now belong to the optional profile-level physical preference map.
 * The questionnaire keeps body-focused erotic and sensory fetishes instead of duplicating
 * neutral partner-appearance ratings as sexual-practice questions.
 */
export const PROFILE_PHYSICAL_PREFERENCE_PRACTICE_IDS = new Set<string>([
  'hair-length-short',
  'hair-length-medium',
  'hair-length-long',
  'shaved-bald-head',
  'facial-hair',
  'breast-size-small',
  'breast-size-average',
  'breast-size-large',
  'muscles',
  'slim-build',
  'curvy-build',
  'stocky-build',
  'stature-short',
  'stature-average',
  'stature-tall',
  'buttocks-size-small',
  'buttocks-size-average',
  'buttocks-size-large',
  'penis-size-small',
  'penis-size-average',
  'penis-size-large',
  'tattoos',
  'piercings',
  'facial-piercings',
  'body-piercings',
  'nipple-piercings',
  'genital-piercings',
]);

export function extractPhysicalPreferencesFromCatalogue(
  content: readonly CatalogueCategorySeed[],
): readonly CatalogueCategorySeed[] {
  return content.map((category) => {
    if (category.id !== 'body-fetishes') return category;
    return {
      ...category,
      en: 'Body fetishes & sensory attraction',
      es: 'Fetiches corporales y sensoriales',
      descriptionEn: 'Erotic focus on body areas, scent, sweat, body hair and worn personal items.',
      descriptionEs: 'Foco erótico en zonas corporales, olor, sudor, vello y prendas personales usadas.',
      practices: category.practices.filter((practice) => !PROFILE_PHYSICAL_PREFERENCE_PRACTICE_IDS.has(practice.id)),
    };
  });
}
