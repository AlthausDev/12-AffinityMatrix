import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, signal } from '@angular/core';
import { splitCatalogueGlossaryText } from '../i18n/catalogue-glossary';
import { TranslationService } from '../i18n/translation.service';

@Component({
  selector: 'app-catalogue-glossary-text',
  template: `
    @for (segment of segments(); track $index) {
      @if (segment.termId; as termId) {
        <span class="glossary-wrap">
          <button
            type="button"
            class="glossary-term"
            [attr.aria-expanded]="isVisible(termId)"
            (mouseenter)="hoveredTerm.set(termId)"
            (mouseleave)="clearHover(termId)"
            (focus)="hoveredTerm.set(termId)"
            (blur)="clearHover(termId)"
            (click)="togglePinned(termId)"
            (pointerdown)="startLongPress(termId, $event)"
            (pointerup)="cancelLongPress()"
            (pointercancel)="cancelLongPress()"
            (pointerleave)="cancelLongPress()"
          >{{ segment.text }}</button>
          @if (isVisible(termId)) {
            <span class="glossary-popup" role="tooltip">{{ segment.definition }}</span>
          }
        </span>
      } @else {
        {{ segment.text }}
      }
    }
  `,
  styles: `
    :host { display: contents; }
    .glossary-wrap { position: relative; display: inline; }
    .glossary-term {
      display: inline;
      margin: 0;
      padding: 0;
      border: 0;
      border-bottom: 1px dotted color-mix(in srgb, var(--neon-cyan) 58%, currentColor);
      background: transparent;
      color: inherit;
      cursor: help;
      font: inherit;
      font-weight: inherit;
      line-height: inherit;
      text-align: inherit;
      text-decoration: none;
      text-underline-offset: 0.16em;
    }
    .glossary-term:hover,
    .glossary-term:focus-visible,
    .glossary-term[aria-expanded='true'] {
      color: color-mix(in srgb, currentColor 78%, var(--neon-cyan));
      border-bottom-color: color-mix(in srgb, var(--neon-cyan) 82%, white);
      outline: none;
    }
    .glossary-popup {
      position: absolute;
      left: 50%;
      bottom: calc(100% + 0.48rem);
      z-index: 80;
      width: max-content;
      max-width: min(19rem, calc(100vw - 2rem));
      padding: 0.62rem 0.72rem;
      transform: translateX(-50%);
      border: 1px solid color-mix(in srgb, var(--border-strong) 58%, var(--neon-cyan));
      border-radius: 0.58rem;
      background: color-mix(in srgb, var(--surface-elevated) 96%, #0f2444 4%);
      box-shadow: 0 0.7rem 1.8rem rgba(0, 0, 0, 0.38);
      color: var(--text-primary);
      font-size: 0.76rem;
      font-weight: 500;
      line-height: 1.42;
      text-align: left;
      white-space: normal;
    }
    .glossary-popup::after {
      content: '';
      position: absolute;
      left: 50%;
      top: 100%;
      width: 0.55rem;
      height: 0.55rem;
      transform: translate(-50%, -50%) rotate(45deg);
      border-right: 1px solid color-mix(in srgb, var(--border-strong) 58%, var(--neon-cyan));
      border-bottom: 1px solid color-mix(in srgb, var(--border-strong) 58%, var(--neon-cyan));
      background: color-mix(in srgb, var(--surface-elevated) 96%, #0f2444 4%);
    }
    @media (max-width: 720px) {
      .glossary-term { cursor: pointer; }
      .glossary-popup { max-width: min(17rem, calc(100vw - 1.5rem)); font-size: 0.78rem; }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogueGlossaryTextComponent {
  private readonly i18n = inject(TranslationService);
  private readonly destroyRef = inject(DestroyRef);
  private longPressTimer: ReturnType<typeof setTimeout> | undefined;

  readonly text = input.required<string>();
  readonly hoveredTerm = signal<string | null>(null);
  readonly pinnedTerm = signal<string | null>(null);
  readonly segments = computed(() => splitCatalogueGlossaryText(this.text(), this.i18n.locale()));

  constructor() {
    this.destroyRef.onDestroy(() => this.cancelLongPress());
  }

  isVisible(termId: string): boolean {
    return this.hoveredTerm() === termId || this.pinnedTerm() === termId;
  }

  clearHover(termId: string): void {
    if (this.hoveredTerm() === termId) this.hoveredTerm.set(null);
  }

  togglePinned(termId: string): void {
    this.cancelLongPress();
    this.pinnedTerm.set(this.pinnedTerm() === termId ? null : termId);
  }

  startLongPress(termId: string, event: PointerEvent): void {
    if (event.pointerType !== 'touch') return;
    this.cancelLongPress();
    this.longPressTimer = setTimeout(() => {
      this.longPressTimer = undefined;
      this.pinnedTerm.set(termId);
    }, 450);
  }

  cancelLongPress(): void {
    if (this.longPressTimer === undefined) return;
    clearTimeout(this.longPressTimer);
    this.longPressTimer = undefined;
  }
}
