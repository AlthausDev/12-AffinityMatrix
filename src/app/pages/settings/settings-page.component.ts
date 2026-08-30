import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FontScale, UiPreferencesService } from '../../core/ui-preferences.service';
import { TranslationService } from '../../i18n/translation.service';
import { BrandMarkComponent } from '../../shared/brand-mark.component';

@Component({
  selector: 'app-settings-page',
  imports: [RouterLink, BrandMarkComponent],
  template: `
    <main class="page narrow-page">
      <a class="back-link" [routerLink]="['/profiles', profileId]">{{ i18n.t('settings.backProfile') }}</a>

      <header class="page-header">
        <p class="eyebrow">{{ i18n.t('settings.eyebrow') }}</p>
        <div class="subpage-title-row">
          <app-brand-mark />
          <h1>{{ i18n.t('settings.title') }}</h1>
        </div>
        <p class="muted lead">{{ i18n.t('settings.description') }}</p>
      </header>

      <button
        class="settings-support-dock"
        type="button"
        disabled
        [attr.aria-label]="i18n.t('settings.support.action')"
        [attr.title]="i18n.t('settings.support.action')"
      >
        <span aria-hidden="true">♡</span>
        {{ i18n.t('settings.support.title') }}
      </button>

      <section class="panel settings-panel">
        <section class="settings-section" aria-labelledby="settings-appearance-title">
          <header class="settings-section-heading">
            <h2 id="settings-appearance-title">{{ i18n.t('settings.appearance.title') }}</h2>
            <p class="muted">{{ i18n.t('settings.appearance.description') }}</p>
          </header>

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
            <input type="checkbox" [checked]="preferences.highContrast()" (change)="toggleHighContrast($event)" />
            <span>
              <strong>{{ i18n.t('settings.highContrast.title') }}</strong>
              <small>{{ i18n.t('settings.highContrast.description') }}</small>
            </span>
          </label>

          <label class="check-field settings-option">
            <input type="checkbox" [checked]="preferences.reduceVisualEffects()" (change)="toggleVisualEffects($event)" />
            <span>
              <strong>{{ i18n.t('settings.visualEffects.title') }}</strong>
              <small>{{ i18n.t('settings.visualEffects.description') }}</small>
            </span>
          </label>
        </section>

        <section class="settings-section" aria-labelledby="settings-help-title">
          <header class="settings-section-heading">
            <h2 id="settings-help-title">{{ i18n.t('settings.help.title') }}</h2>
            <p class="muted">{{ i18n.t('settings.help.description') }}</p>
          </header>

          <label class="check-field settings-option">
            <input type="checkbox" [checked]="preferences.showGlossaryHints()" (change)="toggleGlossaryHints($event)" />
            <span>
              <strong>{{ i18n.t('settings.glossaryHints.title') }}</strong>
              <small>{{ i18n.t('settings.glossaryHints.description') }}</small>
            </span>
          </label>

          <a class="settings-link" [routerLink]="['/profiles', profileId, 'glossary']">
            <span>
              <strong>{{ i18n.t('settings.glossaryLink.title') }}</strong>
              <small>{{ i18n.t('settings.glossaryLink.description') }}</small>
            </span>
            <span aria-hidden="true">→</span>
          </a>
        </section>

        <section class="settings-section" aria-labelledby="settings-behaviour-title">
          <header class="settings-section-heading">
            <h2 id="settings-behaviour-title">{{ i18n.t('settings.behaviour.title') }}</h2>
            <p class="muted">{{ i18n.t('settings.behaviour.description') }}</p>
          </header>

          <label class="check-field settings-option">
            <input type="checkbox" [checked]="preferences.confirmQuestionnaireExit()" (change)="toggleQuestionnaireExitConfirmation($event)" />
            <span>
              <strong>{{ i18n.t('settings.questionnaireExit.title') }}</strong>
              <small>{{ i18n.t('settings.questionnaireExit.description') }}</small>
            </span>
          </label>
        </section>

        <section class="settings-section support-settings support-settings-inline" aria-labelledby="settings-support-title">
          <header class="settings-section-heading">
            <h2 id="settings-support-title">{{ i18n.t('settings.support.title') }}</h2>
            <p class="muted">{{ i18n.t('settings.support.description') }}</p>
          </header>
          <button class="button secondary support-settings-action" type="button" disabled>
            {{ i18n.t('settings.support.action') }}
          </button>
        </section>

        <p class="muted local-note">{{ i18n.t('settings.localOnly') }}</p>
      </section>
    </main>
  `,
  styles: `
    .settings-group { display: grid; gap: 0.85rem; }
    .option-description { margin: 0.3rem 0 0; font-size: 0.88rem; line-height: 1.45; }
    .font-scale-options { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.6rem; }
    .font-scale-options button { display: grid; min-height: 4.8rem; place-items: center; gap: 0.25rem; padding: 0.65rem; border: 1px solid var(--border-subtle); border-radius: 0.58rem; background: color-mix(in srgb, var(--surface-page) 58%, var(--surface-elevated)); color: var(--text-primary); cursor: pointer; transition: border-color 140ms ease, background 140ms ease, box-shadow 140ms ease, transform 140ms ease; }
    .font-scale-options button:hover { border-color: var(--focus-ring); background: color-mix(in srgb, var(--focus-ring) 10%, var(--surface-elevated)); transform: translateY(-1px); }
    .font-scale-options button.selected { border-color: var(--focus-ring); background: color-mix(in srgb, var(--focus-ring) 16%, var(--surface-elevated)); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--focus-ring) 55%, transparent), 0 0 0.8rem color-mix(in srgb, var(--focus-ring) 18%, transparent); }
    .font-preview { display: block; font-weight: 800; line-height: 1; }
    .normal-preview { font-size: 1rem; }
    .large-preview { font-size: 1.2rem; }
    .extra-large-preview { font-size: 1.42rem; }
    .settings-link { display: flex; align-items: center; justify-content: space-between; gap: 1rem; min-height: 4.2rem; padding: 0.9rem 1rem; border: 1px solid var(--border-subtle); border-radius: 0.58rem; background: color-mix(in srgb, var(--surface-elevated) 52%, transparent); color: var(--text-primary); text-decoration: none; }
    .settings-link:hover { border-color: var(--border-strong); background: color-mix(in srgb, var(--surface-elevated) 72%, transparent); }
    .settings-link span:first-child { display: grid; gap: 0.2rem; }
    .settings-link small { color: var(--text-secondary); font-size: 0.84rem; line-height: 1.4; }
    .support-settings-action { width: fit-content; }
    .support-settings-action:disabled { opacity: 0.78; }
    .settings-support-dock { display: none; }
    .local-note { font-size: 0.88rem; }

    @media (min-width: 1180px) {
      .support-settings-inline { display: none; }
      .settings-support-dock {
        position: fixed;
        z-index: 70;
        right: 0.85rem;
        top: 50%;
        display: inline-flex;
        min-height: 2.45rem;
        align-items: center;
        gap: 0.42rem;
        padding: 0.48rem 0.72rem;
        transform: translateY(-50%);
        border: 1px solid color-mix(in srgb, var(--neon-magenta) 34%, var(--border-subtle));
        border-radius: 0.65rem;
        background: linear-gradient(145deg, rgba(16, 33, 67, 0.82), rgba(48, 25, 68, 0.82));
        box-shadow: inset 0 1px 0 rgba(255,255,255,.08), 0 .45rem 1.2rem rgba(2,6,22,.18);
        color: color-mix(in srgb, var(--text-primary) 88%, var(--neon-rose));
        font-size: 0.82rem;
        font-weight: 760;
      }
      .settings-support-dock:disabled { cursor: default; opacity: 0.82; }
      .settings-support-dock span { color: var(--neon-rose); font-size: 1rem; line-height: 1; }
    }

    @media (max-width: 640px) {
      .font-scale-options { grid-template-columns: 1fr; }
      .font-scale-options button { min-height: 3.7rem; grid-template-columns: auto 1fr; justify-items: start; }
      .support-settings-action { width: 100%; }
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

  toggleVisualEffects(event: Event): void {
    this.preferences.setReduceVisualEffects((event.target as HTMLInputElement).checked);
  }

  toggleHighContrast(event: Event): void {
    this.preferences.setHighContrast((event.target as HTMLInputElement).checked);
  }

  toggleGlossaryHints(event: Event): void {
    this.preferences.setShowGlossaryHints((event.target as HTMLInputElement).checked);
  }

  toggleQuestionnaireExitConfirmation(event: Event): void {
    this.preferences.setConfirmQuestionnaireExit((event.target as HTMLInputElement).checked);
  }
}
