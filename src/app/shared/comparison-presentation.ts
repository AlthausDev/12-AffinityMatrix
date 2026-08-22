import { ComparisonClassification, RoleRelation } from '../../domain/comparison/comparison';
import { PREFERENCE_VALUES, Preference } from '../../domain/profile/preference';
import { TranslationKey } from '../i18n/translation.service';

export type PreferenceTone =
  | 'favorite'
  | 'positive'
  | 'conditional'
  | 'curious'
  | 'negative'
  | 'boundary';

export interface PreferencePresentation {
  readonly labelKey: TranslationKey;
  readonly hintKey: TranslationKey;
  readonly symbol: string;
  readonly tone: PreferenceTone;
}

/** Shared questionnaire/comparison presentation metadata for preference states. */
export const PREFERENCE_PRESENTATION: Readonly<Record<Preference, PreferencePresentation>> = {
  favorite: {
    labelKey: 'preference.favorite',
    hintKey: 'preference.favorite.hint',
    symbol: '★',
    tone: 'favorite',
  },
  like: {
    labelKey: 'preference.like',
    hintKey: 'preference.like.hint',
    symbol: '●',
    tone: 'positive',
  },
  depends: {
    labelKey: 'preference.depends',
    hintKey: 'preference.depends.hint',
    symbol: '?',
    tone: 'conditional',
  },
  curious: {
    labelKey: 'preference.curious',
    hintKey: 'preference.curious.hint',
    symbol: '◇',
    tone: 'curious',
  },
  'not-interested': {
    labelKey: 'preference.notInterested',
    hintKey: 'preference.notInterested.hint',
    symbol: '×',
    tone: 'negative',
  },
  boundary: {
    labelKey: 'preference.boundary',
    hintKey: 'preference.boundary.hint',
    symbol: '!',
    tone: 'boundary',
  },
};

export const PREFERENCE_LABEL_KEYS = Object.fromEntries(
  PREFERENCE_VALUES.map((preference) => [preference, PREFERENCE_PRESENTATION[preference].labelKey]),
) as Readonly<Record<Preference, TranslationKey>>;

export const COMPARISON_CLASSIFICATION_LABEL_KEYS: Readonly<Record<ComparisonClassification, TranslationKey>> = {
  'strong-match': 'comparison.classification.strongMatch',
  explorable: 'comparison.classification.explorable',
  conditioned: 'comparison.classification.conditioned',
  'intensity-mismatch': 'comparison.classification.intensityMismatch',
  'not-shared': 'comparison.classification.notShared',
  boundary: 'comparison.classification.boundary',
};

export const ROLE_RELATION_LABEL_KEYS: Readonly<Record<RoleRelation, TranslationKey>> = {
  mutual: 'comparison.roleRelation.mutual',
  complementary: 'comparison.roleRelation.complementary',
};
