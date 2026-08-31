import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { isLocale, Locale } from './locale';
import { LocaleFlagComponent } from './locale-flag.component';
import { TranslationService } from './translation.service';

@Component({
  selector: 'app-language-switcher',
  imports: [LocaleFlagComponent],
  template: `
    <div
      class="language-switcher"
      [class.is-open]="menuOpen()"
      (mouseenter)="openMenu()"
      (mouseleave)="closeMenu()"
      (focusin)="openMenu()"
      (focusout)="handleFocusOut($event)"
      (keydown.escape)="closeMenuAndReturnFocus($event)"
    >
      <button
        class="language-trigger"
        type="button"
        aria-controls="language-options"
        [attr.aria-expanded]="menuOpen()"
        [attr.aria-label]="i18n.t('language.selectorLabel')"
        (click)="toggleMenu()"
      >
        <app-locale-flag class="language-mark" [locale]="i18n.locale()" />
        <span class="language-current-label">{{ currentLocaleLabel() }}</span>
        <span class="language-chevron" aria-hidden="true">⌄</span>
      </button>

      <div class="language-menu">
        <div
          id="language-options"
          class="language-menu-surface"
          role="group"
          [attr.aria-label]="i18n.t('language.selectorLabel')"
        >
          @for (locale of i18n.supportedLocales; track locale.id) {
            <button
              class="language-option"
              type="button"
              [attr.aria-pressed]="i18n.locale() === locale.id"
              [class.is-selected]="i18n.locale() === locale.id"
              (click)="selectLanguage(locale.id)"
            >
              <span class="language-option-copy">
                <app-locale-flag class="language-option-flag" [locale]="locale.id" />
                <span>{{ locale.nativeLabel }}</span>
              </span>
              @if (i18n.locale() === locale.id) {
                <span class="language-check" aria-hidden="true">✓</span>
              }
            </button>
          }
        </div>
      </div>
    </div>
  `,
  styles: `
    :host {
      position: fixed;
      top: 0.75rem;
      right: 0.75rem;
      z-index: 30;
    }
    .language-switcher {
      position: relative;
      min-width: 7.8rem;
    }
    .language-trigger {
      display: flex;
      width: 100%;
      min-height: 2.35rem;
      align-items: center;
      justify-content: space-between;
      gap: 0.5rem;
      padding: 0.4rem 0.58rem;
      border: 1px solid color-mix(in srgb, var(--neon-cyan) 24%, var(--border-subtle));
      border-radius: 0.65rem;
      background: linear-gradient(145deg, rgba(12, 28, 59, 0.78), rgba(31, 20, 62, 0.78));
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 0.55rem 1.35rem rgba(2, 6, 22, 0.16);
      color: var(--text-primary);
      font-size: 0.75rem;
      font-weight: 760;
      cursor: pointer;
      backdrop-filter: blur(12px) saturate(128%);
      transition: border-color 140ms ease, box-shadow 140ms ease, background 140ms ease;
    }
    .language-switcher.is-open .language-trigger,
    .language-trigger:hover {
      border-color: color-mix(in srgb, var(--neon-violet) 46%, var(--neon-cyan));
      background: linear-gradient(145deg, rgba(18, 45, 85, 0.84), rgba(47, 25, 82, 0.84));
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.11),
        0 0 0.7rem rgba(54, 186, 255, 0.12),
        0 0 1.1rem rgba(140, 92, 255, 0.09);
    }
    .language-mark { --locale-flag-width: 1.55rem; }
    .language-chevron {
      color: var(--text-secondary);
      font-size: 0.9rem;
      transform: translateY(-0.08rem);
      transition: transform 140ms ease, color 140ms ease;
    }
    .language-switcher.is-open .language-chevron {
      transform: translateY(0.08rem) rotate(180deg);
      color: var(--neon-cyan);
    }
    .language-menu {
      position: absolute;
      top: 100%;
      right: 0;
      width: max-content;
      min-width: 100%;
      padding-top: 0.42rem;
      opacity: 0;
      visibility: hidden;
      pointer-events: none;
      transform: translateY(-0.3rem) scale(0.98);
      transform-origin: top right;
      transition: opacity 120ms ease, transform 120ms ease, visibility 120ms ease;
    }
    .language-menu-surface {
      display: grid;
      min-width: 100%;
      gap: 0.18rem;
      padding: 0.3rem;
      border: 1px solid color-mix(in srgb, var(--neon-violet) 38%, var(--border-subtle));
      border-radius: 0.62rem;
      background: rgba(7, 15, 37, 0.94);
      box-shadow: 0 0.8rem 2rem rgba(1, 4, 16, 0.42), 0 0 1rem rgba(140, 92, 255, 0.12);
      backdrop-filter: blur(16px) saturate(132%);
    }
    .language-switcher.is-open .language-menu {
      opacity: 1;
      visibility: visible;
      pointer-events: auto;
      transform: translateY(0) scale(1);
    }
    .language-option {
      display: flex;
      min-width: 8.5rem;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.5rem 0.58rem;
      border: 1px solid transparent;
      border-radius: 0.42rem;
      background: transparent;
      color: var(--text-secondary);
      text-align: left;
      font-size: 0.75rem;
      font-weight: 700;
      cursor: pointer;
      transition: background 120ms ease, border-color 120ms ease, color 120ms ease;
    }
    .language-option-copy {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }
    .language-option-flag { --locale-flag-width: 1.42rem; }
    .language-option:hover,
    .language-option:focus-visible {
      border-color: rgba(54, 186, 255, 0.18);
      background: linear-gradient(90deg, rgba(54, 186, 255, 0.12), rgba(140, 92, 255, 0.1));
      color: var(--text-primary);
    }
    .language-option.is-selected { color: #e6f2ff; }
    .language-check {
      color: var(--neon-cyan);
      text-shadow: 0 0 0.6rem rgba(54, 186, 255, 0.55);
    }
    @media (max-width: 520px) {
      :host { top: 0.5rem; right: 0.5rem; }
      .language-switcher { min-width: 0; }
      .language-trigger {
        width: 2.35rem;
        min-height: 2.35rem;
        justify-content: center;
        padding: 0;
        border-radius: 0.58rem;
        clip-path: polygon(14% 0, 86% 0, 100% 14%, 100% 86%, 86% 100%, 14% 100%, 0 86%, 0 14%);
      }
      .language-current-label,
      .language-chevron { display: none; }
      .language-mark { --locale-flag-width: 1.68rem; }
      .language-menu { min-width: 8.5rem; }
    }
    @media (prefers-reduced-motion: reduce) {
      .language-trigger,
      .language-chevron,
      .language-menu,
      .language-option { transition: none; }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSwitcherComponent {
  readonly i18n = inject(TranslationService);
  readonly menuOpen = signal(false);

  currentLocaleLabel(): string {
    return this.i18n.supportedLocales.find((locale) => locale.id === this.i18n.locale())?.nativeLabel
      ?? this.i18n.locale();
  }

  openMenu(): void {
    this.menuOpen.set(true);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }

  toggleMenu(): void {
    this.menuOpen.update((open) => !open);
  }

  handleFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget;
    const current = event.currentTarget;
    if (current instanceof HTMLElement && next instanceof Node && current.contains(next)) return;
    this.closeMenu();
  }

  closeMenuAndReturnFocus(event: Event): void {
    event.stopPropagation();
    const switcher = event.currentTarget;
    if (switcher instanceof HTMLElement) {
      switcher.querySelector<HTMLButtonElement>('.language-trigger')?.focus();
    }
    this.closeMenu();
  }

  selectLanguage(locale: Locale): void {
    if (isLocale(locale)) this.i18n.setLocale(locale);
    this.closeMenu();
  }
}
