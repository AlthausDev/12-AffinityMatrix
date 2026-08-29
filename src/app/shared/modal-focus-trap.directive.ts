import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Directive, ElementRef, HostListener, OnDestroy, inject } from '@angular/core';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

@Directive({
  selector: '[appModalFocusTrap]',
  standalone: true,
})
export class ModalFocusTrapDirective implements AfterViewInit, OnDestroy {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly document = inject(DOCUMENT);
  private readonly previouslyFocused = this.document.activeElement instanceof HTMLElement
    ? this.document.activeElement
    : null;

  ngAfterViewInit(): void {
    queueMicrotask(() => this.focusInitialElement());
  }

  ngOnDestroy(): void {
    const target = this.previouslyFocused;
    if (target?.isConnected) queueMicrotask(() => target.focus({ preventScroll: true }));
  }

  @HostListener('keydown', ['$event'])
  trapTab(event: KeyboardEvent): void {
    if (event.key !== 'Tab') return;
    const focusable = this.focusableElements();
    if (focusable.length === 0) {
      event.preventDefault();
      this.host.nativeElement.focus({ preventScroll: true });
      return;
    }

    const active = this.document.activeElement;
    const first = focusable[0];
    const last = focusable.at(-1)!;

    if (event.shiftKey && (active === first || !this.host.nativeElement.contains(active))) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && (active === last || !this.host.nativeElement.contains(active))) {
      event.preventDefault();
      first.focus();
    }
  }

  private focusInitialElement(): void {
    const host = this.host.nativeElement;
    const autofocus = host.querySelector<HTMLElement>('[autofocus]');
    const target = autofocus ?? this.focusableElements()[0] ?? host;
    if (target === host && !host.hasAttribute('tabindex')) host.tabIndex = -1;
    target.focus({ preventScroll: true });
  }

  private focusableElements(): HTMLElement[] {
    return [...this.host.nativeElement.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)]
      .filter((element) => !element.hasAttribute('hidden') && element.getAttribute('aria-hidden') !== 'true');
  }
}
