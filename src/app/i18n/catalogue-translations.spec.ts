import { CURRENT_CATALOGUE_SNAPSHOT } from '../../infrastructure/catalogue/catalogue-v2';
import {
  categoryDescriptionKey,
  categoryLabelKey,
  practiceDescriptionKey,
  practiceLabelKey,
  roleLabelKey,
} from './catalogue-text.service';
import { EN_TRANSLATIONS } from './en.translations';
import { ES_TRANSLATIONS } from './es.translations';

const resources: Readonly<Record<string, Readonly<Record<string, string>>>> = {
  es: ES_TRANSLATIONS,
  en: EN_TRANSLATIONS,
};

describe('current catalogue translations', () => {
  for (const [locale, translations] of Object.entries(resources)) {
    it(`covers every current catalogue label and description in ${locale}`, () => {
      const missing: string[] = [];

      for (const category of CURRENT_CATALOGUE_SNAPSHOT.catalogue.categories) {
        requireKey(translations, categoryLabelKey(category.id), missing);
        if (category.description) requireKey(translations, categoryDescriptionKey(category.id), missing);
      }

      for (const practice of CURRENT_CATALOGUE_SNAPSHOT.catalogue.practices) {
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
