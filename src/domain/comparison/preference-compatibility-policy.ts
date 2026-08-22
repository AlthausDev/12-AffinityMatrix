import { Preference } from '../profile/preference';
import { PreferenceCompatibility } from './comparison';

type PreferenceDisposition =
  | 'positive'
  | 'exploratory'
  | 'conditional'
  | 'negative'
  | 'boundary';

interface PreferenceDescriptor {
  readonly intensity: number;
  readonly disposition: PreferenceDisposition;
}

/**
 * Single source of truth for how questionnaire states participate in comparison.
 * Adding a new preference state intentionally fails compilation here until its
 * comparison semantics are defined.
 */
export const PREFERENCE_COMPARISON_DESCRIPTORS: Readonly<Record<Preference, PreferenceDescriptor>> = {
  favorite: { intensity: 4, disposition: 'positive' },
  like: { intensity: 3, disposition: 'positive' },
  curious: { intensity: 2, disposition: 'exploratory' },
  depends: { intensity: 2, disposition: 'conditional' },
  'not-interested': { intensity: 0, disposition: 'negative' },
  boundary: { intensity: 0, disposition: 'boundary' },
};

export abstract class PreferenceCompatibilityPolicy {
  abstract compare(left: Preference, right: Preference): PreferenceCompatibility;
}

export class DefaultPreferenceCompatibilityPolicy extends PreferenceCompatibilityPolicy {
  override compare(left: Preference, right: Preference): PreferenceCompatibility {
    const leftDescriptor = PREFERENCE_COMPARISON_DESCRIPTORS[left];
    const rightDescriptor = PREFERENCE_COMPARISON_DESCRIPTORS[right];
    const dispositions = [leftDescriptor.disposition, rightDescriptor.disposition] as const;

    if (dispositions.includes('boundary')) {
      return {
        classification: 'boundary',
        score: 0,
        commonGround: false,
        requiresConversation: true,
      };
    }

    if (dispositions.includes('negative')) {
      return {
        classification: 'not-shared',
        score: 0,
        commonGround: false,
        requiresConversation: false,
      };
    }

    if (dispositions.includes('conditional')) {
      const bothConditional = leftDescriptor.disposition === 'conditional' && rightDescriptor.disposition === 'conditional';
      const other = leftDescriptor.disposition === 'conditional' ? rightDescriptor : leftDescriptor;
      const score = bothConditional ? 60 : other.disposition === 'exploratory' ? 60 : 70;
      return {
        classification: 'conditioned',
        score,
        commonGround: true,
        requiresConversation: true,
      };
    }

    if (dispositions.includes('exploratory')) {
      const difference = Math.abs(leftDescriptor.intensity - rightDescriptor.intensity);
      return {
        classification: 'explorable',
        score: Math.max(55, 75 - difference * 10),
        commonGround: true,
        requiresConversation: true,
      };
    }

    const difference = Math.abs(leftDescriptor.intensity - rightDescriptor.intensity);
    return {
      classification: 'strong-match',
      score: Math.max(85, 100 - difference * 10),
      commonGround: true,
      requiresConversation: false,
    };
  }
}

export const defaultPreferenceCompatibilityPolicy = new DefaultPreferenceCompatibilityPolicy();
