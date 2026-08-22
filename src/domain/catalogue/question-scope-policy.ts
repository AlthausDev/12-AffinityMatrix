import { AnswerScope } from '../profile/profile-answer';
import { SEX_VALUES } from '../profile/profile-metadata';
import { PracticeRole, RoleContextAxis } from './practice';

export abstract class QuestionScopePolicy {
  abstract getScopes(role: PracticeRole): readonly AnswerScope[];
}

/**
 * Expands the context axes declared by a role into canonical answer scopes.
 * New axes can be added here without changing questionnaire components or answer identity.
 */
export class DeclaredQuestionScopePolicy extends QuestionScopePolicy {
  override getScopes(role: PracticeRole): readonly AnswerScope[] {
    const axes = role.contextAxes ?? [];
    if (axes.length === 0) {
      return [{}];
    }

    return axes.reduce<readonly AnswerScope[]>(
      (scopes, axis) => scopes.flatMap((scope) => this.expandAxis(scope, axis)),
      [{}],
    );
  }

  private expandAxis(scope: AnswerScope, axis: RoleContextAxis): readonly AnswerScope[] {
    switch (axis) {
      case 'counterpartSex':
        return SEX_VALUES.map((counterpartSex) => ({ ...scope, counterpartSex }));
    }
  }
}

export const defaultQuestionScopePolicy = new DeclaredQuestionScopePolicy();
