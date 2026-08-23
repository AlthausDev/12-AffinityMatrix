import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

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
      <img
        class="brand-wordmark"
        src="/branding/desiresync-logo.avif"
        alt=""
        width="360"
        height="221"
      >
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
      width: min(82vw, 25rem);
      aspect-ratio: auto;
      overflow: visible;
      border: 0;
      border-radius: 0;
      background: transparent;
      box-shadow: none;
      backdrop-filter: none;
    }
    .brand-mark-hero .brand-icon { display: none; }
    .brand-mark-hero .brand-wordmark {
      display: block;
      width: 100%;
      height: auto;
      object-fit: contain;
      filter:
        drop-shadow(0 0 0.65rem color-mix(in srgb, var(--neon-cyan) 18%, transparent))
        drop-shadow(0 0 1rem color-mix(in srgb, var(--neon-magenta) 14%, transparent));
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandMarkComponent {
  @Input() variant: 'compact' | 'hero' = 'compact';
}
