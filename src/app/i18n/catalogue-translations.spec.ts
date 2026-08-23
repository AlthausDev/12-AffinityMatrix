import { CURRENT_CATALOGUE_SNAPSHOT as CATALOGUE_V2_SNAPSHOT } from '../../infrastructure/catalogue/catalogue-v2';
import {
  categoryDescriptionKey,
  categoryLabelKey,
  practiceDescriptionKey,
  practiceLabelKey,
  roleLabelKey,
} from './catalogue-text.service';
import { EN_CATALOGUE_TRANSLATIONS } from './catalogue/en-catalogue.translations';
import { ES_CATALOGUE_TRANSLATIONS } from './catalogue/es-catalogue.translations';

const resources: Readonly<Record<string, Readonly<Record<string, string>>>> = {
  es: ES_CATALOGUE_TRANSLATIONS,
  en: EN_CATALOGUE_TRANSLATIONS,
};

describe('legacy v2 catalogue translation tables', () => {
  for (const [locale, translations] of Object.entries(resources)) {
    it(`covers every v2 catalogue label and description in ${locale}`, () => {
      const missing: string[] = [];

      for (const category of CATALOGUE_V2_SNAPSHOT.catalogue.categories) {
        requireKey(translations, categoryLabelKey(category.id), missing);
        if (category.description) requireKey(translations, categoryDescriptionKey(category.id), missing);
      }

      for (const practice of CATALOGUE_V2_SNAPSHOT.catalogue.practices) {
        requireKey(translations, practiceLabelKey(practice.id), missing);
        if (practice.description) requireKey(translations, practiceDescriptionKey(practice.id), missing);
        for (const role of practice.roles) {
          requireKey(translations, roleLabelKey(practice.id, role.id), missing);
        }
      }

      expect(missing).toEqual([]);
    });
  }
});

function requireKey(
  translations: Readonly<Record<string, string>>,
  key: string,
  missing: string[],
): void {
  if (!Object.hasOwn(translations, key) || translations[key]?.trim().length === 0) {
    missing.push(key);
  }
}
