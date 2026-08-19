export type CatalogueVersion = number;

export const CATALOGUE_VERSION_V1 = 1 as const;
export const CATALOGUE_VERSION_V2 = 2 as const;
export const CURRENT_CATALOGUE_VERSION = CATALOGUE_VERSION_V2;

export function isCatalogueVersion(value: unknown): value is CatalogueVersion {
  return Number.isInteger(value) && (value as number) > 0;
}
