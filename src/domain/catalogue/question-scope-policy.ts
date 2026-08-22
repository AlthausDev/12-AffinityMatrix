import { AnswerScope } from '../profile/profile-answer';
import { SEX_VALUES } from '../profile/profile-metadata';
import { PracticeRole, RoleContextAxis } from './practice';

export abstract class QuestionScopePolicy {
  abstract getScopes(role: PracticeRole): readonly AnswerScope[];
}

/**
 * Expands the context axes declared by a role into canonical answer scopes.
 * The policy owns the cartesian product so questionnaire components stay axis-agnostic.
 */
export class DeclaredQuestionScopePolicy extends QuestionScopePolicy {
  override getScopes(role: PracticeRole): readonly AnswerScope[] {
    const axes = role.contextAxes ?? [];
    if (axes.length === 0) return [{}];

    return axes.reduce<readonly AnswerScope[]>(
      (scopes, axis) => scopes.flatMap((scope) => this.expandAxis(role, scope, axis)),
      [{}],
    );
  }

  private expandAxis(
    role: PracticeRole,
    scope: AnswerScope,
    axis: RoleContextAxis,
  ): readonly AnswerScope[] {
    switch (axis) {
      case 'counterpartSex':
        return SEX_VALUES.map((counterpartSex) => ({ ...scope, counterpartSex }));
      case 'targetSite':
        return (role.contextValues?.targetSite ?? []).map((targetSite) => ({ ...scope, targetSite }));
    }
  }
}

export const defaultQuestionScopePolicy = new DeclaredQuestionScopePolicy();
