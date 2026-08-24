import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslationService } from '../i18n/translation.service';
import { QuestionnaireShellComponent } from './questionnaire-shell.component';

@Component({
  selector: 'app-questionnaire-category-navigation',
  imports: [RouterLink],
  template: `
    <nav class="questionnaire-nav" [attr.aria-label]="i18n.t('questionnaire.navigationAria')">
      <div>
        @if (previousCategoryId(); as previousId) {
          <a
            class="button secondary"
            [routerLink]="['/profiles', profileId(), 'questionnaire', previousId]"
            [queryParams]="includeFiltered() ? { filtered: '1' } : null"
          >{{ i18n.t('questionnaire.previous') }}</a>
        }
      </div>

      <a
        class="button secondary"
        [routerLink]="['/profiles', profileId(), 'questionnaire']"
        [queryParams]="includeFiltered() ? { filtered: '1' } : null"
      >{{ i18n.t('common.categories') }}</a>

      <div class="next-slot">
        @if (nextCategoryId(); as nextId) {
          <a
            class="button secondary"
            [routerLink]="['/profiles', profileId(), 'questionnaire', nextId]"
            [queryParams]="includeFiltered() ? { filtered: '1' } : null"
          >{{ i18n.t('questionnaire.next') }}</a>
        } @else {
          <button class="button final-finish-button" type="button" (click)="finish()">{{ i18n.t('questionnaire.finish.action') }}</button>
        }
      </div>
    </nav>
  `,
  styles: `
    :host { display: block; }
    .questionnaire-nav {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      gap: 0.75rem;
    }
    .next-slot { text-align: right; }
    .final-finish-button {
      border-color: color-mix(in srgb, var(--completion-low) 68%, var(--border-strong));
      background: linear-gradient(135deg, color-mix(in srgb, var(--completion-low) 42%, #5b3041), color-mix(in srgb, var(--preference-boundary) 24%, #5e3859));
      color: #fff8f1;
      box-shadow: 0 0.35rem 0.9rem color-mix(in srgb, var(--completion-low) 12%, transparent);
    }
    .final-finish-button:hover {
      border-color: color-mix(in srgb, var(--completion-low) 82%, white);
      box-shadow: 0 0.55rem 1.2rem color-mix(in srgb, var(--completion-low) 20%, transparent);
    }
    .final-finish-button:active {
      transform: translateY(0);
      box-shadow: 0 0.2rem 0.55rem color-mix(in srgb, var(--completion-low) 18%, transparent);
    }
    @media (max-width: 720px) {
      :host { display: none; }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionnaireCategoryNavigationComponent {
  readonly i18n = inject(TranslationService);
  readonly profileId = input.required<string>();
  readonly previousCategoryId = input<string | undefined>();
  readonly nextCategoryId = input<string | undefined>();
  readonly includeFiltered = input(false);
  private readonly shell = inject(QuestionnaireShellComponent, { optional: true });
  private readonly router = inject(Router);

  finish(): void {
    if (this.shell) {
      this.shell.requestCompletion();
      return;
    }
    void this.router.navigate(['/profiles', this.profileId()]);
  }
}
