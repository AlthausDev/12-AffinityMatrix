import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { isLocale } from './locale';
import { TranslationService } from './translation.service';

@Component({
  selector: 'app-language-switcher',
  template: `
    <label class="language-switcher">
      <span>{{ i18n.t('language.selectorLabel') }}</span>
      <select
        [value]="i18n.locale()"
        [attr.aria-label]="i18n.t('language.selectorLabel')"
        (change)="changeLanguage($event)"
      >
        @for (locale of i18n.supportedLocales; track locale.id) {
          <option [value]="locale.id">{{ locale.nativeLabel }}</option>
        }
      </select>
    </label>
  `,
  styles: `
    :host {
      position: fixed;
      top: 0.75rem;
      right: 0.75rem;
      z-index: 20;
    }
    .language-switcher {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.4rem 0.5rem;
      border: 1px solid var(--border-subtle);
      border-radius: 0.5rem;
      background: var(--surface-panel);
      color: var(--text-secondary);
      font-size: 0.75rem;
    }
    .language-switcher select {
      padding: 0.25rem 0.35rem;
      border: 1px solid var(--border-strong);
      border-radius: 0.35rem;
      background: var(--surface-elevated);
      color: var(--text-primary);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitcherComponent {
  readonly i18n = inject(TranslationService);

  changeLanguage(event: Event): void {
    const value = (event.target as HTMLSelectElement).value;
    if (isLocale(value)) this.i18n.setLocale(value);
  }
}
