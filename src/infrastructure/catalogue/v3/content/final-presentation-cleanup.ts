import { CatalogueCategorySeed } from './types';

/**
 * Final display-only cleanup.
 *
 * This pass deliberately changes no applicability, role, scope or taxonomy data. Parentheses in
 * catalogue titles are reserved for compact abbreviations such as CNC or CBT; explanatory
 * qualifiers belong in the practice description instead of the title.
 */
export function applyFinalPresentationCleanup(
  content: readonly CatalogueCategorySeed[],
): readonly CatalogueCategorySeed[] {
  return content.map((category) => ({
    ...category,
    en: cleanDisplayTitle(category.en),
    es: cleanDisplayTitle(category.es),
    practices: category.practices.map((practice) => ({
      ...practice,
      en: cleanDisplayTitle(practice.en),
      es: cleanDisplayTitle(practice.es),
    })),
  }));
}

export function cleanDisplayTitle(title: string): string {
  return title
    .replace(/\s*\(([^()]*)\)/gu, (full, inner: string) =>
      isCompactAbbreviation(inner) ? full : '')
    .replace(/\s{2,}/gu, ' ')
    .trim();
}

function isCompactAbbreviation(value: string): boolean {
  const compact = value.replace(/\s+/gu, '');
  return compact.length >= 2
    && compact.length <= 12
    && /^[A-Z0-9ÁÉÍÓÚÜÑ+&/.-]+$/u.test(compact);
}
