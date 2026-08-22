import { PracticeAnswer, AnswerKey } from '../profile/profile-answer';
import { ProfileMetadata } from '../profile/profile-metadata';

export type ComparisonClassification =
  | 'strong-match'
  | 'explorable'
  | 'conditioned'
  | 'intensity-mismatch'
  | 'not-shared'
  | 'boundary';

export type RoleRelation = 'mutual' | 'complementary';

/** Minimal profile shape needed by the pure comparison engine. */
export interface ComparisonSubject {
  readonly metadata: ProfileMetadata;
  readonly answers: Readonly<Record<AnswerKey, PracticeAnswer>>;
}

export interface PreferenceCompatibility {
  readonly classification: ComparisonClassification;
  readonly score: number;
  readonly commonGround: boolean;
  readonly requiresConversation: boolean;
}

export interface ComparedAnswer {
  readonly answerKey: AnswerKey;
  readonly roleId: string;
  readonly answer: PracticeAnswer;
}

/**
 * Language-neutral comparison interaction. Human-readable catalogue text is resolved by the UI
 * from the stable category/practice/role ids so the domain never owns localized presentation.
 */
export interface ComparisonInteraction {
  readonly id: string;
  readonly categoryId: string;
  readonly practiceId: string;
  readonly roleRelation: RoleRelation;
  readonly left: ComparedAnswer;
  readonly right: ComparedAnswer;
  readonly compatibility: PreferenceCompatibility;
}

export type ComparisonClassificationCounts = Readonly<Record<ComparisonClassification, number>>;

export interface CategoryComparison {
  readonly categoryId: string;
  readonly answeredInteractionCount: number;
  readonly affinityBasisCount: number;
  readonly commonGroundCount: number;
  readonly boundaryCount: number;
  readonly affinityPercentage: number | null;
  readonly classifications: ComparisonClassificationCounts;
  readonly interactions: readonly ComparisonInteraction[];
}

export interface ComparisonContextIssues {
  readonly leftSexMissing: boolean;
  readonly rightSexMissing: boolean;
}

export interface ProfileComparisonResult {
  readonly categories: readonly CategoryComparison[];
  readonly interactions: readonly ComparisonInteraction[];
  readonly answeredInteractionCount: number;
  readonly commonGroundCount: number;
  readonly boundaryCount: number;
  readonly classifications: ComparisonClassificationCounts;
  readonly contextIssues: ComparisonContextIssues;
}

export function emptyClassificationCounts(): Record<ComparisonClassification, number> {
  return {
    'strong-match': 0,
    explorable: 0,
    conditioned: 0,
    'intensity-mismatch': 0,
    'not-shared': 0,
    boundary: 0,
  };
}
