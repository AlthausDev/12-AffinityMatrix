export const SUPPORTED_LOCALES = [
  { id: 'es', nativeLabel: 'Español' },
  { id: 'en', nativeLabel: 'English' },
] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number]['id'];

export const DEFAULT_LOCALE: Locale = 'es';
export const LOCALE_STORAGE_KEY = 'preference-profile.locale';

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && SUPPORTED_LOCALES.some((locale) => locale.id === value);
}
