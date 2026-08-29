import { CatalogueCategorySeed } from './types';

/**
 * Final display-only cleanup.
 *
 * This pass deliberately changes no applicability, role, scope or taxonomy data. Parentheses in
 * catalogue titles are reserved for compact abbreviations such as CNC or CBT and short special
 * names; explanatory qualifiers belong in the practice description instead of the title.
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
      isAllowedParenthetical(inner) ? full : '')
    .replace(/\s{2,}/gu, ' ')
    .trim();
}

export function isAllowedParenthetical(value: string): boolean {
  const trimmed = value.trim();
  const compact = trimmed.replace(/\s+/gu, '');
  const abbreviation = compact.length >= 2
    && compact.length <= 12
    && /^[A-Z0-9ÁÉÍÓÚÜÑ+&/.-]+$/u.test(compact);
  const specialName = trimmed.length >= 2
    && trimmed.length <= 24
    && !/\s/u.test(trimmed)
    && /^[A-ZÁÉÍÓÚÜÑ][\p{L}\p{M}\p{N}.'’+-]+$/u.test(trimmed);
  return abbreviation || specialName;
}
