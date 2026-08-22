import { ComparisonClassification, RoleRelation } from '../../domain/comparison/comparison';
import { PREFERENCE_VALUES, Preference } from '../../domain/profile/preference';
import { TranslationKey } from '../i18n/es.translations';

export interface PreferencePresentation {
  readonly labelKey: TranslationKey;
  readonly symbol: string;
}

/** Shared questionnaire/comparison presentation metadata for preference states. */
export const PREFERENCE_PRESENTATION: Readonly<Record<Preference, PreferencePresentation>> = {
  favorite: { labelKey: 'preference.favorite', symbol: '★' },
  like: { labelKey: 'preference.like', symbol: '●' },
  depends: { labelKey: 'preference.depends', symbol: '?' },
  curious: { labelKey: 'preference.curious', symbol: '◇' },
  neutral: { labelKey: 'preference.neutral', symbol: '—' },
  'not-interested': { labelKey: 'preference.notInterested', symbol: '×' },
  boundary: { labelKey: 'preference.boundary', symbol: '!' },
};

export const PREFERENCE_LABEL_KEYS = Object.fromEntries(
  PREFERENCE_VALUES.map((preference) => [preference, PREFERENCE_PRESENTATION[preference].labelKey]),
) as Readonly<Record<Preference, TranslationKey>>;

export const COMPARISON_CLASSIFICATION_LABEL_KEYS: Readonly<Record<ComparisonClassification, TranslationKey>> = {
  'strong-match': 'comparison.classification.strongMatch',
  explorable: 'comparison.classification.explorable',
  conditioned: 'comparison.classification.conditioned',
  'intensity-mismatch': 'comparison.classification.intensityMismatch',
  neutral: 'comparison.classification.neutral',
  'not-shared': 'comparison.classification.notShared',
  boundary: 'comparison.classification.boundary',
};

export const ROLE_RELATION_LABEL_KEYS: Readonly<Record<RoleRelation, TranslationKey>> = {
  mutual: 'comparison.roleRelation.mutual',
  complementary: 'comparison.roleRelation.complementary',
};
