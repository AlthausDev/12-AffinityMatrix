import { CatalogueSnapshot } from '../../domain/catalogue/catalogue-snapshot';
import {
  defaultQuestionVisibilityPolicy,
  ProfileQuestionContext,
  QuestionVisibilityPolicy,
} from '../../domain/catalogue/profile-filter';
import { Practice, PracticeCategory, PracticeRole } from '../../domain/catalogue/practice';
import { createAnswerKey, PracticeAnswer } from '../../domain/profile/profile-answer';
import { Profile } from '../../domain/profile/profile';

export interface QuestionnaireCategorySummary {
  readonly category: PracticeCategory;
  readonly answered: number;
  readonly total: number;
  readonly filtered: number;
  readonly completionPercentage: number;
}

export interface QuestionnaireRoleView {
  readonly role: PracticeRole;
  readonly answer?: PracticeAnswer;
  readonly filtered: boolean;
}

export interface QuestionnairePracticeView {
  readonly practice: Practice;
  readonly roles: readonly QuestionnaireRoleView[];
}

export interface QuestionnaireCategoryView extends QuestionnaireCategorySummary {
  readonly practices: readonly QuestionnairePracticeView[];
}

export interface QuestionnaireNeighbours {
  readonly previousCategoryId?: string;
  readonly nextCategoryId?: string;
}

export type CatalogueRelationship = 'current' | 'profile-older' | 'profile-newer';

export class QuestionnaireService {
  constructor(
    private readonly visibilityPolicy: QuestionVisibilityPolicy = defaultQuestionVisibilityPolicy,
  ) {}

  getCategorySummaries(
    snapshot: CatalogueSnapshot,
    profile: Profile,
    includeFiltered = false,
  ): readonly QuestionnaireCategorySummary[] {
    return this.sortedCategories(snapshot).map((category) =>
      this.summarizeCategory(snapshot, profile, category, includeFiltered),
    );
  }

  getCategory(
    snapshot: CatalogueSnapshot,
    profile: Profile,
    categoryId: string,
    includeFiltered = false,
  ): QuestionnaireCategoryView | undefined {
    const category = snapshot.catalogue.categories.find((candidate) => candidate.id === categoryId);
    if (!category) {
      return undefined;
    }

    const context = this.context(profile);
    const practices = snapshot.catalogue.practices
      .filter((practice) => practice.categoryId === category.id)
      .map((practice) => this.projectPractice(profile, practice, context, includeFiltered))
      .filter((practice): practice is QuestionnairePracticeView => practice !== undefined);

    return {
      ...this.summarizeCategory(snapshot, profile, category, includeFiltered),
      practices,
    };
  }

  getNeighbours(snapshot: CatalogueSnapshot, categoryId: string): QuestionnaireNeighbours {
    const categories = this.sortedCategories(snapshot);
    const index = categories.findIndex((category) => category.id === categoryId);
    if (index < 0) {
      return {};
    }

    return {
      ...(index > 0 ? { previousCategoryId: categories[index - 1]?.id } : {}),
      ...(index < categories.length - 1 ? { nextCategoryId: categories[index + 1]?.id } : {}),
    };
  }

  getCatalogueRelationship(snapshot: CatalogueSnapshot, profile: Profile): CatalogueRelationship {
    if (profile.catalogueVersion < snapshot.version) {
      return 'profile-older';
    }
    if (profile.catalogueVersion > snapshot.version) {
      return 'profile-newer';
    }
    return 'current';
  }

  countUnknownAnswers(snapshot: CatalogueSnapshot, profile: Profile): number {
    const knownKeys = new Set(
      snapshot.catalogue.practices.flatMap((practice) =>
        practice.roles.map((role) => createAnswerKey(practice.id, role.id)),
      ),
    );

    return Object.keys(profile.answers).filter((key) => !knownKeys.has(key as ReturnType<typeof createAnswerKey>)).length;
  }

  private summarizeCategory(
    snapshot: CatalogueSnapshot,
    profile: Profile,
    category: PracticeCategory,
    includeFiltered: boolean,
  ): QuestionnaireCategorySummary {
    const context = this.context(profile);
    let answered = 0;
    let total = 0;
    let filtered = 0;

    for (const practice of snapshot.catalogue.practices) {
      if (practice.categoryId !== category.id) {
        continue;
      }

      for (const role of practice.roles) {
        const visible = this.visibilityPolicy.isRoleVisible(role, context);
        if (!visible) {
          filtered += 1;
        }
        if (!visible && !includeFiltered) {
          continue;
        }

        total += 1;
        if (profile.answers[createAnswerKey(practice.id, role.id)]) {
          answered += 1;
        }
      }
    }

    return {
      category,
      answered,
      total,
      filtered,
      completionPercentage: total === 0 ? 0 : Math.round((answered / total) * 100),
    };
  }

  private projectPractice(
    profile: Profile,
    practice: Practice,
    context: ProfileQuestionContext,
    includeFiltered: boolean,
  ): QuestionnairePracticeView | undefined {
    const roles = practice.roles.flatMap((role): QuestionnaireRoleView[] => {
      const visible = this.visibilityPolicy.isRoleVisible(role, context);
      if (!visible && !includeFiltered) {
        return [];
      }

      const answer = profile.answers[createAnswerKey(practice.id, role.id)];
      return [{
        role,
        ...(answer ? { answer } : {}),
        filtered: !visible,
      }];
    });

    return roles.length > 0 ? { practice, roles } : undefined;
  }

  private sortedCategories(snapshot: CatalogueSnapshot): readonly PracticeCategory[] {
    return [...snapshot.catalogue.categories].sort((left, right) => left.order - right.order);
  }

  private context(profile: Profile): ProfileQuestionContext {
    return {
      metadata: profile.metadata,
      settings: profile.settings,
    };
  }
}
