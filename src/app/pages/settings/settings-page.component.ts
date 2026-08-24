import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FontScale, UiPreferencesService } from '../../core/ui-preferences.service';
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
        <div class="settings-group">
          <div>
            <strong>{{ i18n.t('settings.fontScale.title') }}</strong>
            <p class="muted option-description">{{ i18n.t('settings.fontScale.description') }}</p>
          </div>
          <div class="font-scale-options" role="group" [attr.aria-label]="i18n.t('settings.fontScale.aria')">
            <button type="button" [class.selected]="preferences.fontScale() === 'normal'" [attr.aria-pressed]="preferences.fontScale() === 'normal'" (click)="setFontScale('normal')">
              <span class="font-preview normal-preview" aria-hidden="true">Aa</span>
              <span>{{ i18n.t('settings.fontScale.normal') }}</span>
            </button>
            <button type="button" [class.selected]="preferences.fontScale() === 'large'" [attr.aria-pressed]="preferences.fontScale() === 'large'" (click)="setFontScale('large')">
              <span class="font-preview large-preview" aria-hidden="true">Aa</span>
              <span>{{ i18n.t('settings.fontScale.large') }}</span>
            </button>
            <button type="button" [class.selected]="preferences.fontScale() === 'extra-large'" [attr.aria-pressed]="preferences.fontScale() === 'extra-large'" (click)="setFontScale('extra-large')">
              <span class="font-preview extra-large-preview" aria-hidden="true">Aa</span>
              <span>{{ i18n.t('settings.fontScale.extraLarge') }}</span>
            </button>
          </div>
        </div>

        <label class="check-field settings-option">
          <input type="checkbox" [checked]="preferences.confirmQuestionnaireExit()" (change)="toggleQuestionnaireExitConfirmation($event)" />
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
    .settings-group { display: grid; gap: 0.85rem; padding: 1rem; border: 1px solid var(--border-subtle); border-radius: 0.5rem; background: color-mix(in srgb, var(--surface-elevated) 70%, transparent); }
    .option-description { margin: 0.3rem 0 0; font-size: 0.85rem; line-height: 1.45; }
    .font-scale-options { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.6rem; }
    .font-scale-options button { display: grid; min-height: 4.8rem; place-items: center; gap: 0.25rem; padding: 0.65rem; border: 1px solid var(--border-subtle); border-radius: 0.5rem; background: color-mix(in srgb, var(--surface-page) 58%, var(--surface-elevated)); color: var(--text-primary); cursor: pointer; transition: border-color 140ms ease, background 140ms ease, box-shadow 140ms ease, transform 140ms ease; }
    .font-scale-options button:hover { border-color: var(--focus-ring); background: color-mix(in srgb, var(--focus-ring) 10%, var(--surface-elevated)); transform: translateY(-1px); }
    .font-scale-options button.selected { border-color: var(--focus-ring); background: color-mix(in srgb, var(--focus-ring) 16%, var(--surface-elevated)); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--focus-ring) 55%, transparent), 0 0 0.8rem color-mix(in srgb, var(--focus-ring) 18%, transparent); }
    .font-preview { display: block; font-weight: 800; line-height: 1; }
    .normal-preview { font-size: 1rem; }
    .large-preview { font-size: 1.18rem; }
    .extra-large-preview { font-size: 1.36rem; }
    .settings-option { background: color-mix(in srgb, var(--surface-elevated) 70%, transparent); }
    .local-note { margin: 0; font-size: 0.85rem; }
    @media (max-width: 640px) {
      .font-scale-options { grid-template-columns: 1fr; }
      .font-scale-options button { min-height: 3.7rem; grid-template-columns: auto 1fr; justify-items: start; }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettingsPageComponent {
  readonly i18n = inject(TranslationService);
  readonly preferences = inject(UiPreferencesService);
  private readonly route = inject(ActivatedRoute);

  readonly profileId = this.route.snapshot.paramMap.get('id') ?? '';

  setFontScale(scale: FontScale): void {
    this.preferences.setFontScale(scale);
  }

  toggleQuestionnaireExitConfirmation(event: Event): void {
    this.preferences.setConfirmQuestionnaireExit((event.target as HTMLInputElement).checked);
  }
}
