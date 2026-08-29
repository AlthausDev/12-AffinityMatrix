import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UiPreferencesService } from './core/ui-preferences.service';
import { LanguageSwitcherComponent } from './i18n/language-switcher.component';
import { TranslationService } from './i18n/translation.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LanguageSwitcherComponent],
  template: `
    <a class="skip-link" href="#main-content" (click)="skipToMain($event)">{{ i18n.t('a11y.skipToMain') }}</a>
    <app-language-switcher />
    <router-outlet />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly i18n = inject(TranslationService);
  private readonly uiPreferences = inject(UiPreferencesService);
  private readonly document = inject(DOCUMENT);

  constructor() {
    this.uiPreferences.initialize();
  }

  skipToMain(event: Event): void {
    event.preventDefault();
    const main = this.document.querySelector<HTMLElement>('main');
    if (!main) return;

    if (!main.id) main.id = 'main-content';
    const previousTabIndex = main.getAttribute('tabindex');
    main.tabIndex = -1;
    main.focus({ preventScroll: true });
    main.scrollIntoView({ block: 'start', behavior: this.reducedMotion() ? 'auto' : 'smooth' });
    main.addEventListener('blur', () => {
      if (previousTabIndex === null) main.removeAttribute('tabindex');
      else main.setAttribute('tabindex', previousTabIndex);
    }, { once: true });
  }

  private reducedMotion(): boolean {
    return this.document.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  }
}
