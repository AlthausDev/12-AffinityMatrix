import { CATALOGUE_V3_CONTENT } from '../../infrastructure/catalogue/v3/content/final';
import {
  FINAL_CATALOGUE_GLOSSARY,
  splitFinalCatalogueGlossaryText,
} from './catalogue-glossary-final';
import { Locale } from './locale';

function catalogueCopy(locale: Locale): readonly string[] {
  return CATALOGUE_V3_CONTENT.flatMap((category) => {
    const categoryCopy = locale === 'es'
      ? [category.es, category.descriptionEs]
      : [category.en, category.descriptionEn];

    const practiceCopy = category.practices.flatMap((practice) => {
      const copy: string[] = locale === 'es'
        ? [practice.es, practice.descriptionEs ?? '']
        : [practice.en, practice.descriptionEn ?? ''];

      for (const role of practice.pairedRoles ?? []) copy.push(locale === 'es' ? role.es : role.en);
      for (const role of Object.values(practice.roleLabels ?? {})) {
        if (role) copy.push(locale === 'es' ? role.es : role.en);
      }
      return copy;
    });

    return [...categoryCopy, ...practiceCopy].filter((value) => value.length > 0);
  });
}

function usedGlossaryIds(locale: Locale): ReadonlySet<string> {
  return new Set(
    catalogueCopy(locale).flatMap((copy) =>
      splitFinalCatalogueGlossaryText(copy, locale)
        .flatMap((segment) => segment.termId ? [segment.termId] : []),
    ),
  );
}

describe('catalogue glossary consistency', () => {
  for (const locale of ['es', 'en'] as const) {
    it(`keeps every ${locale} glossary concept connected to current catalogue copy`, () => {
      const used = usedGlossaryIds(locale);
      const missing = FINAL_CATALOGUE_GLOSSARY
        .filter((entry) => !used.has(entry.id))
        .map((entry) => `${entry.id}: ${locale === 'es' ? entry.titleEs : entry.titleEn}`);

      expect(missing).withContext(
        'A glossary definition should not exist as orphan product vocabulary. Rename catalogue copy to the canonical term, or remove the obsolete glossary entry.',
      ).toEqual([]);
    });
  }
});
