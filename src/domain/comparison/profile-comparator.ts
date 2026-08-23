import { CatalogueSnapshot } from '../catalogue/catalogue-snapshot';
import { Practice, PracticeRole } from '../catalogue/practice';
import { AnswerKey, PracticeAnswer } from '../profile/profile-answer';
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
        leftSexMissing: !left.metadata.sex && this.hasCounterpartScopedAnswers(right),
        rightSexMissing: !right.metadata.sex && this.hasCounterpartScopedAnswers(left),
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

      interactions.push(...this.compareOrientation(practice, leftRole, rightRole, left, right));

      if (leftRole.id !== rightRole.id) {
        interactions.push(...this.compareOrientation(practice, rightRole, leftRole, left, right));
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
  ): readonly ComparisonInteraction[] {
    const leftAnswers = this.findAnswers(left, practice.id, leftRole, right.metadata.sex);
    const rightAnswers = this.findAnswers(right, practice.id, rightRole, left.metadata.sex);
    const roleRelation: RoleRelation = leftRole.id === rightRole.id ? 'mutual' : 'complementary';
    const interactions: ComparisonInteraction[] = [];

    for (const leftAnswer of leftAnswers) {
      for (const rightAnswer of rightAnswers) {
        if (!this.scopesCanInteract(leftRole, rightRole, leftAnswer.answer, rightAnswer.answer)) continue;

        const compatibility = this.preferencePolicy.compare(
          leftAnswer.answer.preference,
          rightAnswer.answer.preference,
        );
        interactions.push({
          id: `${practice.id}::${leftAnswer.answerKey}=>${rightAnswer.answerKey}`,
          categoryId: practice.categoryId,
          practiceId: practice.id,
          roleRelation,
          left: leftAnswer,
          right: rightAnswer,
          compatibility,
        });
      }
    }

    return interactions;
  }

  private findAnswers(
    subject: ComparisonSubject,
    practiceId: string,
    role: PracticeRole,
    counterpartSex: Sex | undefined,
  ): readonly ComparedAnswer[] {
    const requiresCounterpartSex = role.contextAxes?.includes('counterpartSex') ?? false;
    const requiresTargetSite = role.contextAxes?.includes('targetSite') ?? false;
    if (requiresCounterpartSex && !counterpartSex) return [];

    const allowedTargetSites = role.contextValues?.targetSite;
    return Object.entries(subject.answers)
      .filter((entry): entry is [AnswerKey, PracticeAnswer] => {
        const [, answer] = entry;
        if (answer.practiceId !== practiceId || answer.roleId !== role.id) return false;

        if (requiresCounterpartSex) {
          if (answer.scope?.counterpartSex !== counterpartSex) return false;
        } else if (answer.scope?.counterpartSex !== undefined) {
          return false;
        }

        if (requiresTargetSite) {
          const site = answer.scope?.targetSite;
          if (!site || (allowedTargetSites && !allowedTargetSites.includes(site))) return false;
        } else if (answer.scope?.targetSite !== undefined) {
          return false;
        }

        return true;
      })
      .map(([answerKey, answer]) => ({ answerKey, roleId: role.id, answer }));
  }

  private scopesCanInteract(
    leftRole: PracticeRole,
    rightRole: PracticeRole,
    leftAnswer: PracticeAnswer,
    rightAnswer: PracticeAnswer,
  ): boolean {
    const leftUsesTargetSite = leftRole.contextAxes?.includes('targetSite') ?? false;
    const rightUsesTargetSite = rightRole.contextAxes?.includes('targetSite') ?? false;
    if (!leftUsesTargetSite && !rightUsesTargetSite) return true;
    return leftAnswer.scope?.targetSite === rightAnswer.scope?.targetSite;
  }

  private countClassifications(
    interactions: readonly ComparisonInteraction[],
  ): ComparisonClassificationCounts {
    const counts = emptyClassificationCounts();
    for (const interaction of interactions) counts[interaction.compatibility.classification] += 1;
    return counts;
  }

  private averageScore(interactions: readonly ComparisonInteraction[]): number | null {
    if (interactions.length === 0) return null;
    const total = interactions.reduce((sum, interaction) => sum + interaction.compatibility.score, 0);
    return Math.round(total / interactions.length);
  }

  private hasCounterpartScopedAnswers(subject: ComparisonSubject): boolean {
    return Object.values(subject.answers).some(
      (answer: PracticeAnswer) => answer.scope?.counterpartSex !== undefined,
    );
  }
}

export const profileComparator = new ProfileComparator();
