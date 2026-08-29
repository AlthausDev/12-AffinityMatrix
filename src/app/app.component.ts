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
  styles: `
    .skip-link {
      position: fixed;
      z-index: 2000;
      top: 0.55rem;
      left: 0.55rem;
      padding: 0.6rem 0.8rem;
      transform: translateY(calc(-100% - 1rem));
      border: 2px solid var(--focus-ring);
      border-radius: 0.5rem;
      background: var(--surface-elevated);
      color: var(--text-primary);
      font-weight: 750;
      text-decoration: none;
      transition: transform 120ms ease;
    }
    .skip-link:focus { transform: translateY(0); }
    @media (prefers-reduced-motion: reduce) {
      .skip-link { transition: none; }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  readonly i18n = inject(TranslationService);
  private readonly uiPreferences = inject(UiPreferencesService);
  private readonly document = inject(DOCUMENT);

  constructor() {
    this.uiPreferences.initialize();
    this.installMobileScrollRecovery();
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

  private installMobileScrollRecovery(): void {
    const window = this.document.defaultView;
    if (!window?.matchMedia?.('(max-width: 760px)').matches) return;

    const storageKey = `desiresync-scroll:${window.location.pathname}${window.location.search}`;
    const savePosition = (): void => {
      try {
        window.sessionStorage.setItem(storageKey, String(Math.round(window.scrollY)));
      } catch {
        // Storage can be unavailable in hardened/private browser contexts; scrolling still works.
      }
    };

    this.document.addEventListener('visibilitychange', () => {
      if (this.document.visibilityState === 'hidden') savePosition();
    }, { passive: true });
    window.addEventListener('pagehide', savePosition, { passive: true });

    let savedPosition = 0;
    try {
      savedPosition = Number(window.sessionStorage.getItem(storageKey) ?? 0);
    } catch {
      return;
    }
    if (!Number.isFinite(savedPosition) || savedPosition <= 0) return;

    // A discarded Android tab recreates the Angular tree asynchronously. Retry once after the
    // dashboard has had time to recover its real height instead of restoring against a short shell.
    window.setTimeout(() => window.scrollTo({ top: savedPosition, behavior: 'auto' }), 180);
    window.setTimeout(() => window.scrollTo({ top: savedPosition, behavior: 'auto' }), 650);
  }

  private reducedMotion(): boolean {
    return this.document.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
  }
}
