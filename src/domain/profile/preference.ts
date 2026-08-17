export const PREFERENCE_VALUES = [
  'favorite',
  'like',
  'depends',
  'curious',
  'neutral',
  'not-interested',
  'boundary',
] as const;

export type Preference = (typeof PREFERENCE_VALUES)[number];

export function isPreference(value: unknown): value is Preference {
  return typeof value === 'string' && PREFERENCE_VALUES.includes(value as Preference);
}
