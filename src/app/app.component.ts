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
    <button
      class="support-dock"
      type="button"
      disabled
      [attr.aria-label]="i18n.t('settings.support.action')"
      [attr.title]="i18n.t('settings.support.action')"
    >
      <span aria-hidden="true">♡</span>
      {{ i18n.t('settings.support.title') }}
    </button>
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
    .support-dock { display: none; }
    @media (min-width: 1180px) {
      .support-dock {
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
      .support-dock:disabled { cursor: default; opacity: 0.82; }
      .support-dock span { color: var(--neon-rose); font-size: 1rem; line-height: 1; }
    }
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
