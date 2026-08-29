import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  inject,
  input,
  signal,
  computed,
  ViewChild,
} from '@angular/core';
import { splitCatalogueGlossaryText } from '../i18n/catalogue-glossary';
import { TranslationService } from '../i18n/translation.service';

interface GlossaryPopupPlacement {
  readonly left: number;
  readonly top: number;
  readonly above: boolean;
}

@Component({
  selector: 'app-catalogue-glossary-text',
  template: `
    @for (segment of segments(); track $index) {
      @if (segment.termId; as termId) {
        <button
          type="button"
          class="glossary-term"
          [attr.aria-expanded]="isVisible(termId)"
          (mouseenter)="showHover(termId, segment.definition ?? '', $event)"
          (mouseleave)="clearHover(termId)"
          (focus)="showHover(termId, segment.definition ?? '', $event)"
          (blur)="clearHover(termId)"
          (click)="togglePinned(termId, segment.definition ?? '', $event)"
          (pointerdown)="startLongPress(termId, segment.definition ?? '', $event)"
          (pointerup)="cancelLongPress()"
          (pointercancel)="cancelLongPress()"
          (pointerleave)="cancelLongPress()"
        >{{ segment.text }}</button>
      } @else {
        {{ segment.text }}
      }
    }

    <span
      #popup
      class="glossary-popup"
      popover="manual"
      role="tooltip"
      [class.is-above]="placement().above"
      [class.fallback-open]="fallbackOpen()"
      [style.left.px]="placement().left"
      [style.top.px]="placement().top"
    >{{ activeDefinition() }}</span>
  `,
  styles: `
    :host { display: contents; }
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
      position: fixed;
      z-index: 1000;
      display: none;
      width: max-content;
      max-width: min(21rem, calc(100vw - 1rem));
      max-height: min(15rem, calc(100vh - 1rem));
      margin: 0;
      padding: 0.64rem 0.74rem;
      transform: translateX(-50%);
      overflow: auto;
      border: 1px solid color-mix(in srgb, var(--border-strong) 58%, var(--neon-cyan));
      border-radius: 0.58rem;
      background: color-mix(in srgb, var(--surface-elevated) 97%, #0f2444 3%);
      box-shadow: 0 0.7rem 1.8rem rgba(0, 0, 0, 0.42);
      color: var(--text-primary);
      font-size: 0.76rem;
      font-weight: 500;
      line-height: 1.42;
      text-align: left;
      white-space: normal;
    }
    .glossary-popup:popover-open,
    .glossary-popup.fallback-open { display: block; }
    .glossary-popup.is-above { transform: translate(-50%, -100%); }
    @media (max-width: 720px) {
      .glossary-term { cursor: pointer; }
      .glossary-popup {
        max-width: min(19rem, calc(100vw - 0.75rem));
        max-height: min(13rem, calc(100vh - 0.75rem));
        font-size: 0.78rem;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogueGlossaryTextComponent {
  private readonly i18n = inject(TranslationService);
  private readonly destroyRef = inject(DestroyRef);
  private longPressTimer: ReturnType<typeof setTimeout> | undefined;
  private longPressTriggered = false;

  @ViewChild('popup', { static: true }) private popup?: ElementRef<HTMLElement>;

  readonly text = input.required<string>();
  readonly hoveredTerm = signal<string | null>(null);
  readonly pinnedTerm = signal<string | null>(null);
  readonly activeDefinition = signal('');
  readonly fallbackOpen = signal(false);
  readonly placement = signal<GlossaryPopupPlacement>({ left: 0, top: 0, above: true });
  readonly segments = computed(() => splitCatalogueGlossaryText(this.text(), this.i18n.locale()));

  constructor() {
    this.destroyRef.onDestroy(() => {
      this.cancelLongPress();
      this.hidePopup();
    });
  }

  isVisible(termId: string): boolean {
    return this.hoveredTerm() === termId || this.pinnedTerm() === termId;
  }

  showHover(termId: string, definition: string, event: Event): void {
    if (this.pinnedTerm() && this.pinnedTerm() !== termId) return;
    this.hoveredTerm.set(termId);
    this.openPopup(definition, event.currentTarget);
  }

  clearHover(termId: string): void {
    if (this.hoveredTerm() === termId) this.hoveredTerm.set(null);
    if (!this.pinnedTerm()) this.hidePopup();
  }

  togglePinned(termId: string, definition: string, event: Event): void {
    this.cancelLongPress();
    if (this.longPressTriggered) {
      this.longPressTriggered = false;
      return;
    }

    if (this.pinnedTerm() === termId) {
      this.pinnedTerm.set(null);
      if (!this.hoveredTerm()) this.hidePopup();
      return;
    }

    this.pinnedTerm.set(termId);
    this.openPopup(definition, event.currentTarget);
  }

  startLongPress(termId: string, definition: string, event: PointerEvent): void {
    if (event.pointerType !== 'touch') return;
    this.cancelLongPress();
    this.longPressTriggered = false;
    const target = event.currentTarget;
    this.longPressTimer = setTimeout(() => {
      this.longPressTimer = undefined;
      this.longPressTriggered = true;
      this.pinnedTerm.set(termId);
      this.openPopup(definition, target);
    }, 450);
  }

  cancelLongPress(): void {
    if (this.longPressTimer === undefined) return;
    clearTimeout(this.longPressTimer);
    this.longPressTimer = undefined;
  }

  @HostListener('window:resize')
  @HostListener('window:scroll')
  closeOnViewportChange(): void {
    this.hoveredTerm.set(null);
    this.pinnedTerm.set(null);
    this.hidePopup();
  }

  private openPopup(definition: string, target: EventTarget | null): void {
    const anchor = target instanceof HTMLElement ? target : null;
    const popup = this.popup?.nativeElement;
    if (!anchor || !popup || !definition) return;

    this.activeDefinition.set(definition);
    this.placement.set(positionPopup(anchor));

    // Popover uses the browser top layer, so accordion/card overflow cannot clip the definition.
    const popover = popup as HTMLElement & { showPopover?: () => void; hidePopover?: () => void };
    if (popover.showPopover) {
      closeOtherGlossaryPopovers(popup);
      try {
        if (!popup.matches(':popover-open')) popover.showPopover();
        this.fallbackOpen.set(false);
      } catch {
        this.fallbackOpen.set(true);
      }
      return;
    }
    this.fallbackOpen.set(true);
  }

  private hidePopup(): void {
    const popup = this.popup?.nativeElement;
    if (!popup) return;
    const popover = popup as HTMLElement & { hidePopover?: () => void };
    if (popover.hidePopover) {
      try {
        if (popup.matches(':popover-open')) popover.hidePopover();
      } catch {
        // Older DOM implementations may not understand :popover-open; the fallback class is enough.
      }
    }
    this.fallbackOpen.set(false);
  }
}

function positionPopup(anchor: HTMLElement): GlossaryPopupPlacement {
  const rect = anchor.getBoundingClientRect();
  const viewportWidth = typeof window === 'undefined' ? 1024 : window.innerWidth;
  const viewportHeight = typeof window === 'undefined' ? 768 : window.innerHeight;
  const popupWidth = Math.min(336, Math.max(160, viewportWidth - 16));
  const half = popupWidth / 2;
  const margin = 8;
  const center = rect.left + rect.width / 2;
  const left = Math.min(viewportWidth - half - margin, Math.max(half + margin, center));
  const above = rect.top > Math.min(190, viewportHeight * 0.38);
  const top = above ? Math.max(margin, rect.top - margin) : Math.min(viewportHeight - margin, rect.bottom + margin);
  return { left, top, above };
}

function closeOtherGlossaryPopovers(current: HTMLElement): void {
  if (typeof document === 'undefined') return;
  let open: NodeListOf<HTMLElement>;
  try {
    open = document.querySelectorAll<HTMLElement>('.glossary-popup:popover-open');
  } catch {
    return;
  }
  for (const popup of open) {
    if (popup === current) continue;
    const hide = (popup as HTMLElement & { hidePopover?: () => void }).hidePopover;
    if (hide) hide.call(popup);
  }
}
