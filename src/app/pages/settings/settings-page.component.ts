import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { UiPreferencesService } from '../../core/ui-preferences.service';
import { TranslationService } from '../../i18n/translation.service';

@Component({
  selector: 'app-settings-page',
  imports: [RouterLink],
  template: `
    <main class="page narrow-page">
      <a class="back-link" [routerLink]="['/profiles', profileId]">{{ i18n.t('settings.backProfile') }}</a>

      <header class="page-header">
        <p class="eyebrow">{{ i18n.t('settings.eyebrow') }}</p>
        <h1>{{ i18n.t('settings.title') }}</h1>
        <p class="muted lead">{{ i18n.t('settings.description') }}</p>
      </header>

      <section class="panel settings-panel">
        <label class="check-field settings-option">
          <input
            type="checkbox"
            [checked]="preferences.confirmQuestionnaireExit()"
            (change)="toggleQuestionnaireExitConfirmation($event)"
          />
          <span>
            <strong>{{ i18n.t('settings.questionnaireExit.title') }}</strong>
            <small>{{ i18n.t('settings.questionnaireExit.description') }}</small>
          </span>
        </label>
        <p class="muted local-note">{{ i18n.t('settings.localOnly') }}</p>
      </section>
    </main>
  `,
  styles: `
    .settings-panel { display: grid; gap: 1rem; }
    .settings-option { background: color-mix(in srgb, var(--surface-elevated) 70%, transparent); }
    .local-note { margin: 0; font-size: 0.85rem; }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPageComponent {
  readonly i18n = inject(TranslationService);
  readonly preferences = inject(UiPreferencesService);
  private readonly route = inject(ActivatedRoute);

  readonly profileId = this.route.snapshot.paramMap.get('id') ?? '';

  toggleQuestionnaireExitConfirmation(event: Event): void {
    this.preferences.setConfirmQuestionnaireExit((event.target as HTMLInputElement).checked);
  }
}
