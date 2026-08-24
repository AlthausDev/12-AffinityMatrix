import { DOCUMENT } from '@angular/common';
import { DestroyRef, Directive, ElementRef, NgZone, inject } from '@angular/core';

type Rgb = readonly [number, number, number];

@Directive({
  selector: '[appPointerGlow]',
})
export class PointerGlowDirective {
  private static readonly NEON_CYAN: Rgb = [54, 186, 255];
  private static readonly NEON_VIOLET: Rgb = [140, 92, 255];
  private static readonly NEON_MAGENTA: Rgb = [230, 80, 197];

  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement;
  private readonly document = inject(DOCUMENT);
  private readonly zone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);

  private animationFrameId: number | null = null;
  private pointerX = 0;
  private pointerY = 0;

  constructor() {
    const window = this.document.defaultView;
    if (!window) return;

    this.zone.runOutsideAngular(() => {
      const hoverPointer = typeof window.matchMedia === 'function'
        ? window.matchMedia('(hover: hover) and (pointer: fine)')
        : null;

      const handlePointerMove = (event: PointerEvent): void => {
        if (!hoverPointer?.matches) return;

        this.pointerX = event.clientX;
        this.pointerY = event.clientY;
        if (this.animationFrameId !== null) return;

        this.animationFrameId = window.requestAnimationFrame(() => {
          this.animationFrameId = null;
          this.applyLighting();
        });
      };

      const handlePointerLeave = (): void => {
        if (this.animationFrameId !== null) {
          window.cancelAnimationFrame(this.animationFrameId);
          this.animationFrameId = null;
        }
        this.resetLighting();
      };

      this.element.addEventListener('pointermove', handlePointerMove, { passive: true });
      this.element.addEventListener('pointerleave', handlePointerLeave, { passive: true });

      this.destroyRef.onDestroy(() => {
        if (this.animationFrameId !== null) window.cancelAnimationFrame(this.animationFrameId);
        this.element.removeEventListener('pointermove', handlePointerMove);
        this.element.removeEventListener('pointerleave', handlePointerLeave);
      });
    });
  }

  private applyLighting(): void {
    const rect = this.element.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;

    const x = Math.min(rect.width, Math.max(0, this.pointerX - rect.left));
    const y = Math.min(rect.height, Math.max(0, this.pointerY - rect.top));
    const color = this.neonColorAt(x / rect.width);

    this.element.style.setProperty('--pointer-x', `${x}px`);
    this.element.style.setProperty('--pointer-y', `${y}px`);
    this.element.style.setProperty('--pointer-r', `${color[0]}`);
    this.element.style.setProperty('--pointer-g', `${color[1]}`);
    this.element.style.setProperty('--pointer-b', `${color[2]}`);
  }

  private resetLighting(): void {
    this.element.style.removeProperty('--pointer-x');
    this.element.style.removeProperty('--pointer-y');
    this.element.style.removeProperty('--pointer-r');
    this.element.style.removeProperty('--pointer-g');
    this.element.style.removeProperty('--pointer-b');
  }

  private neonColorAt(position: number): Rgb {
    const normalized = Math.min(1, Math.max(0, position));
    if (normalized <= 0.5) {
      return this.mixColor(PointerGlowDirective.NEON_CYAN, PointerGlowDirective.NEON_VIOLET, normalized * 2);
    }
    return this.mixColor(PointerGlowDirective.NEON_VIOLET, PointerGlowDirective.NEON_MAGENTA, (normalized - 0.5) * 2);
  }

  private mixColor(from: Rgb, to: Rgb, amount: number): Rgb {
    return [
      Math.round(from[0] + (to[0] - from[0]) * amount),
      Math.round(from[1] + (to[1] - from[1]) * amount),
      Math.round(from[2] + (to[2] - from[2]) * amount),
    ];
  }
}
