import { Preference } from '../../../domain/profile/preference';

/**
 * Shared orientative weight used by dashboard insight views. It intentionally preserves the
 * difference between positive, conditional and exploratory answers without treating a negative
 * answer as evidence for an opposite preference.
 */
export const PREFERENCE_AFFINITY: Readonly<Record<Preference, number>> = {
  favorite: 1,
  like: 0.78,
  curious: 0.5,
  depends: 0.38,
  'not-interested': 0,
  boundary: 0,
};

export function preferenceAffinity(preference: Preference): number {
  return PREFERENCE_AFFINITY[preference];
}
