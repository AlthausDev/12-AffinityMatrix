import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PRODUCT_NAME } from './product-brand';

/** Stable presentation slot for DesireSync branding. */
@Component({
  selector: 'app-brand-mark',
  template: `
    <span
      class="brand-mark"
      [class.brand-mark-hero]="variant === 'hero'"
      aria-hidden="true"
    >
      <img
        class="brand-icon"
        src="/branding/desiresync-icon.avif"
        alt=""
        width="128"
        height="128"
      >
      <span class="brand-wordmark">{{ productName }}</span>
    </span>
  `,
  styles: `
    :host { display: inline-flex; flex: 0 0 auto; }
    .brand-mark {
      position: relative;
      display: grid;
      width: var(--brand-mark-size, clamp(4.6rem, 8vw, 5.8rem));
      aspect-ratio: 1;
      place-items: center;
      overflow: hidden;
      border: 1px solid transparent;
      border-radius: 1.35rem;
      background:
        linear-gradient(145deg, rgba(38, 54, 94, 0.52), rgba(31, 25, 69, 0.58)) padding-box,
        var(--window-border-gradient) border-box;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.16),
        0 1rem 2.4rem rgba(6, 10, 28, 0.24),
        0 0 2rem color-mix(in srgb, var(--neon-violet) 18%, transparent);
      backdrop-filter: blur(16px) saturate(128%);
    }
    .brand-icon {
      display: block;
      width: 92%;
      height: 92%;
      object-fit: contain;
      filter:
        drop-shadow(0 0 0.32rem color-mix(in srgb, var(--neon-cyan) 28%, transparent))
        drop-shadow(0 0 0.5rem color-mix(in srgb, var(--neon-magenta) 20%, transparent));
    }
    .brand-wordmark { display: none; }

    .brand-mark-hero {
      display: flex;
      width: min(82vw, 27rem);
      aspect-ratio: auto;
      align-items: center;
      flex-direction: column;
      gap: 0.2rem;
      overflow: visible;
      border: 0;
      border-radius: 0;
      background: transparent;
      box-shadow: none;
      backdrop-filter: none;
    }
    .brand-mark-hero .brand-icon {
      display: block;
      width: clamp(7rem, 18vw, 10.5rem);
      height: auto;
      filter:
        drop-shadow(0 0 0.65rem color-mix(in srgb, var(--neon-cyan) 24%, transparent))
        drop-shadow(0 0 0.9rem color-mix(in srgb, var(--neon-magenta) 20%, transparent));
    }
    .brand-mark-hero .brand-wordmark {
      display: block;
      padding: 0.05em 0.08em 0.12em;
      background: linear-gradient(
        90deg,
        #53d6ff 0%,
        #6fa8ff 27%,
        #a56cff 56%,
        #ef62c8 82%,
        #ff7eaa 100%
      );
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
      font-size: clamp(2.65rem, 7vw, 4.2rem);
      font-weight: 850;
      letter-spacing: -0.065em;
      line-height: 0.95;
      filter:
        drop-shadow(0 0 0.42rem rgba(54, 186, 255, 0.2))
        drop-shadow(0 0 0.65rem rgba(230, 80, 197, 0.15));
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandMarkComponent {
  @Input() variant: 'compact' | 'hero' = 'compact';
  readonly productName = PRODUCT_NAME;
}
