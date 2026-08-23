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
          <button class="button" type="button" (click)="finish()">{{ i18n.t('questionnaire.finish.action') }}</button>
        }
      </div>
    </nav>
  `,
  styles: `
    .questionnaire-nav {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      gap: 0.75rem;
    }
    .next-slot { text-align: right; }
    @media (max-width: 720px) {
      .questionnaire-nav { grid-template-columns: 1fr; }
      .questionnaire-nav .button { width: 100%; }
      .next-slot { text-align: left; }
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
      this.shell.requestFinish();
      return;
    }
    void this.router.navigate(['/profiles', this.profileId()]);
  }
}
