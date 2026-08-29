import { Injectable, inject } from '@angular/core';
import { PracticeRole } from '../../domain/catalogue/practice';
import { AnswerScope } from '../../domain/profile/profile-answer';
import { Sex } from '../../domain/profile/profile-metadata';
import { TranslationService } from '../i18n/translation.service';

@Injectable({ providedIn: 'root' })
export class QuestionnaireRolePromptService {
  private readonly i18n = inject(TranslationService);

  prompt(role: PracticeRole, scope: AnswerScope | undefined, fallbackRoleLabel: string): string {
    const sex = scope?.counterpartSex;
    if (!sex) return fallbackRoleLabel;

    const person = this.person(sex);
    const locale = this.i18n.locale();
    const partnerScopedRole = [
      'give', 'receive', 'partner-state', 'partner-wears', 'use-on-partner', 'partner-uses-on-me',
    ].includes(role.id);

    if (locale === 'es') {
      if (role.id === 'interest') return `${fallbackRoleLabel} · en ${person}`;
      if (role.id === 'participate' || role.id === 'use-together') return `${fallbackRoleLabel} · con ${person}`;
      if (partnerScopedRole) return `${fallbackRoleLabel} · pareja: ${person}`;
      return `${fallbackRoleLabel} · con ${person}`;
    }

    if (role.id === 'interest') return `${fallbackRoleLabel} · in ${person}`;
    if (role.id === 'participate' || role.id === 'use-together') return `${fallbackRoleLabel} · with ${person}`;
    if (partnerScopedRole) return `${fallbackRoleLabel} · partner: ${person}`;
    return `${fallbackRoleLabel} · with ${person}`;
  }

  private person(sex: Sex): string {
    if (this.i18n.locale() === 'es') return sex === 'male' ? 'un hombre' : 'una mujer';
    return sex === 'male' ? 'a man' : 'a woman';
  }
}
