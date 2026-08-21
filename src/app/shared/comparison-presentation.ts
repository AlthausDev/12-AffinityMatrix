import { ComparisonClassification, RoleRelation } from '../../domain/comparison/comparison';
import { PREFERENCE_VALUES, Preference } from '../../domain/profile/preference';

export interface PreferencePresentation {
  readonly label: string;
  readonly symbol: string;
}

/** Shared questionnaire/comparison presentation for preference states. */
export const PREFERENCE_PRESENTATION: Readonly<Record<Preference, PreferencePresentation>> = {
  favorite: { label: 'Favorite', symbol: '★' },
  like: { label: 'Like', symbol: '●' },
  depends: { label: 'Depends', symbol: '?' },
  curious: { label: 'Curious', symbol: '◇' },
  neutral: { label: 'Neutral', symbol: '—' },
  'not-interested': { label: 'Not interested', symbol: '×' },
  boundary: { label: 'Boundary', symbol: '!' },
};

export const PREFERENCE_LABELS = Object.fromEntries(
  PREFERENCE_VALUES.map((preference) => [preference, PREFERENCE_PRESENTATION[preference].label]),
) as Readonly<Record<Preference, string>>;

export const COMPARISON_CLASSIFICATION_LABELS: Readonly<Record<ComparisonClassification, string>> = {
  'strong-match': 'Strong match',
  explorable: 'Worth exploring',
  conditioned: 'Depends / discuss',
  'intensity-mismatch': 'Different intensity',
  neutral: 'Neutral',
  'not-shared': 'Not shared',
  boundary: 'Boundary',
};

export const ROLE_RELATION_LABELS: Readonly<Record<RoleRelation, string>> = {
  mutual: 'Mutual role',
  complementary: 'Complementary roles',
};
