import { CatalogueSnapshot } from '../catalogue/catalogue-snapshot';
import { Practice, PracticeRole } from '../catalogue/practice';
import { createAnswerKey, PracticeAnswer } from '../profile/profile-answer';
import { Sex } from '../profile/profile-metadata';
import {
  CategoryComparison,
  ComparedAnswer,
  ComparisonClassificationCounts,
  ComparisonInteraction,
  ComparisonSubject,
  emptyClassificationCounts,
  ProfileComparisonResult,
  RoleRelation,
} from './comparison';
import {
  defaultPreferenceCompatibilityPolicy,
  PreferenceCompatibilityPolicy,
} from './preference-compatibility-policy';

export class ProfileComparator {
  constructor(
    private readonly preferencePolicy: PreferenceCompatibilityPolicy = defaultPreferenceCompatibilityPolicy,
  ) {}

  compare(
    snapshot: CatalogueSnapshot,
    left: ComparisonSubject,
    right: ComparisonSubject,
  ): ProfileComparisonResult {
    const interactions = snapshot.catalogue.practices.flatMap((practice) =>
      this.comparePractice(practice, left, right),
    );

    const categories = [...snapshot.catalogue.categories]
      .sort((leftCategory, rightCategory) => leftCategory.order - rightCategory.order)
      .map((category): CategoryComparison => {
        const categoryInteractions = interactions.filter((interaction) => interaction.categoryId === category.id);
        const classifications = this.countClassifications(categoryInteractions);
        const affinityBasis = categoryInteractions.filter(
          (interaction) => interaction.compatibility.classification !== 'boundary',
        );
        const commonGroundCount = categoryInteractions.filter(
          (interaction) => interaction.compatibility.commonGround,
        ).length;

        return {
          categoryId: category.id,
          answeredInteractionCount: categoryInteractions.length,
          affinityBasisCount: affinityBasis.length,
          commonGroundCount,
          boundaryCount: classifications.boundary,
          affinityPercentage: this.averageScore(affinityBasis),
          classifications,
          interactions: categoryInteractions,
        };
      });

    const classifications = this.countClassifications(interactions);

    return {
      categories,
      interactions,
      answeredInteractionCount: interactions.length,
      commonGroundCount: interactions.filter((interaction) => interaction.compatibility.commonGround).length,
      boundaryCount: classifications.boundary,
      classifications,
      contextIssues: {
        leftSexMissing: !left.metadata.sex && this.hasScopedAnswers(right),
        rightSexMissing: !right.metadata.sex && this.hasScopedAnswers(left),
      },
    };
  }

  private comparePractice(
    practice: Practice,
    left: ComparisonSubject,
    right: ComparisonSubject,
  ): readonly ComparisonInteraction[] {
    const interactions: ComparisonInteraction[] = [];

    for (const pair of practice.compatibleRolePairs) {
      const leftRole = practice.roles.find((role) => role.id === pair.leftRoleId);
      const rightRole = practice.roles.find((role) => role.id === pair.rightRoleId);
      if (!leftRole || !rightRole) continue;

      const first = this.compareOrientation(practice, leftRole, rightRole, left, right);
      if (first) interactions.push(first);

      if (leftRole.id !== rightRole.id) {
        const reverse = this.compareOrientation(practice, rightRole, leftRole, left, right);
        if (reverse) interactions.push(reverse);
      }
    }

    return interactions;
  }

  private compareOrientation(
    practice: Practice,
    leftRole: PracticeRole,
    rightRole: PracticeRole,
    left: ComparisonSubject,
    right: ComparisonSubject,
  ): ComparisonInteraction | undefined {
    const leftAnswer = this.findAnswer(left, practice.id, leftRole, right.metadata.sex);
    const rightAnswer = this.findAnswer(right, practice.id, rightRole, left.metadata.sex);
    if (!leftAnswer || !rightAnswer) return undefined;

    const roleRelation: RoleRelation = leftRole.id === rightRole.id ? 'mutual' : 'complementary';
    const compatibility = this.preferencePolicy.compare(
      leftAnswer.answer.preference,
      rightAnswer.answer.preference,
    );

    return {
      id: `${practice.id}::${leftAnswer.answerKey}=>${rightAnswer.answerKey}`,
      categoryId: practice.categoryId,
      practiceId: practice.id,
      roleRelation,
      left: leftAnswer,
      right: rightAnswer,
      compatibility,
    };
  }

  private findAnswer(
    subject: ComparisonSubject,
    practiceId: string,
    role: PracticeRole,
    counterpartSex: Sex | undefined,
  ): ComparedAnswer | undefined {
    const requiresCounterpartSex = role.contextAxes?.includes('counterpartSex') ?? false;
    if (requiresCounterpartSex && !counterpartSex) return undefined;

    const scope = requiresCounterpartSex && counterpartSex ? { counterpartSex } : undefined;
    const answerKey = createAnswerKey(practiceId, role.id, scope);
    const answer = subject.answers[answerKey];
    if (!answer) return undefined;

    return {
      answerKey,
      roleId: role.id,
      answer,
    };
  }

  private countClassifications(
    interactions: readonly ComparisonInteraction[],
  ): ComparisonClassificationCounts {
    const counts = emptyClassificationCounts();
    for (const interaction of interactions) {
      counts[interaction.compatibility.classification] += 1;
    }
    return counts;
  }

  private averageScore(interactions: readonly ComparisonInteraction[]): number | null {
    if (interactions.length === 0) return null;
    const total = interactions.reduce((sum, interaction) => sum + interaction.compatibility.score, 0);
    return Math.round(total / interactions.length);
  }

  private hasScopedAnswers(subject: ComparisonSubject): boolean {
    return Object.values(subject.answers).some((answer: PracticeAnswer) => answer.scope?.counterpartSex !== undefined);
  }
}

export const profileComparator = new ProfileComparator();
