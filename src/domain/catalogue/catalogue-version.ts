export type CatalogueVersion = number;

export const CURRENT_CATALOGUE_VERSION = 1 as const;

export function isCatalogueVersion(value: unknown): value is CatalogueVersion {
  return Number.isInteger(value) && (value as number) > 0;
}
