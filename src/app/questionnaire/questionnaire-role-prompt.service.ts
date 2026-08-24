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

    if (locale === 'es') {
      switch (role.id) {
        case 'participate': return `Con ${person}`;
        case 'give': return `Hacérselo a ${person}`;
        case 'receive': return `Que ${person} me lo haga`;
        case 'partner-state': return `En ${person}`;
        case 'partner-wears': return `Que lo lleve ${person}`;
        case 'watch': return `Ver a ${person}`;
        case 'be-watched': return `Que me vea ${person}`;
        case 'interest': return `En ${person}`;
        case 'use-on-partner': return `Usarlo con ${person}`;
        case 'partner-uses-on-me': return `Que ${person} lo use conmigo`;
        case 'use-together': return `Usarlo juntos con ${person}`;
        default: return `${fallbackRoleLabel} · ${person}`;
      }
    }

    switch (role.id) {
      case 'participate': return `With ${person}`;
      case 'give': return `Do it to ${person}`;
      case 'receive': return `Have ${person} do it to me`;
      case 'partner-state': return `For ${person}`;
      case 'partner-wears': return `Have ${person} wear it`;
      case 'watch': return `Watch ${person}`;
      case 'be-watched': return `Be watched by ${person}`;
      case 'interest': return `In ${person}`;
      case 'use-on-partner': return `Use it with ${person}`;
      case 'partner-uses-on-me': return `Have ${person} use it on me`;
      case 'use-together': return `Use it together with ${person}`;
      default: return `${fallbackRoleLabel} · ${person}`;
    }
  }

  private person(sex: Sex): string {
    if (this.i18n.locale() === 'es') return sex === 'male' ? 'un hombre' : 'una mujer';
    return sex === 'male' ? 'a man' : 'a woman';
  }
}
