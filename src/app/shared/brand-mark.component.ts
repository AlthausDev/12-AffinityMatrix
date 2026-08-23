import { ChangeDetectionStrategy, Component } from '@angular/core';

/**
 * Stable presentation slot for the product mark.
 *
 * The temporary AM monogram deliberately lives behind this component so a future
 * image/SVG logo can replace it without changing page layout or brand spacing.
 */
@Component({
  selector: 'app-brand-mark',
  template: `
    <span class="brand-mark" aria-hidden="true">
      <span class="brand-monogram">AM</span>
    </span>
  `,
  styles: `
    :host { display: inline-flex; flex: 0 0 auto; }
    .brand-mark {
      position: relative;
      display: grid;
      width: clamp(4.6rem, 8vw, 5.8rem);
      aspect-ratio: 1;
      place-items: center;
      overflow: hidden;
      border: 1px solid transparent;
      border-radius: 1.35rem;
      background:
        linear-gradient(145deg, rgba(74, 101, 157, 0.7), rgba(38, 37, 83, 0.78)) padding-box,
        var(--window-border-gradient) border-box;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.24),
        inset 0 -1px 0 rgba(88, 69, 155, 0.28),
        0 1rem 2.4rem rgba(6, 10, 28, 0.28),
        0 0 2.4rem color-mix(in srgb, #6572ff 16%, transparent);
      backdrop-filter: blur(18px) saturate(132%);
    }
    .brand-mark::before {
      content: '';
      position: absolute;
      inset: 0.22rem 0.35rem auto;
      height: 43%;
      border-radius: 1rem 1rem 45% 45%;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.015));
      pointer-events: none;
    }
    .brand-mark::after {
      content: '';
      position: absolute;
      right: -24%;
      bottom: -28%;
      width: 78%;
      aspect-ratio: 1;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(157, 77, 226, 0.42), transparent 68%);
      pointer-events: none;
    }
    .brand-monogram {
      position: relative;
      z-index: 1;
      background: linear-gradient(135deg, #f7fbff 12%, #cbd7ff 50%, #ddbfff 92%);
      background-clip: text;
      color: transparent;
      font-size: clamp(1.25rem, 3vw, 1.65rem);
      font-weight: 850;
      letter-spacing: -0.08em;
      text-shadow: 0 0 1.2rem rgba(184, 197, 255, 0.18);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandMarkComponent {}
