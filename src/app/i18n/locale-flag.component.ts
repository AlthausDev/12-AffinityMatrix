import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-locale-flag',
  template: `
    <span class="flag-frame">
      @switch (locale()) {
        @case ('es') {
          <svg viewBox="0 0 30 20" focusable="false">
            <rect width="30" height="20" fill="#aa151b" />
            <rect y="5" width="30" height="10" fill="#f1bf00" />
            <rect x="9" y="8" width="2.2" height="4" rx="0.35" fill="#aa151b" opacity="0.88" />
            <rect x="8.45" y="7.4" width="3.3" height="0.8" rx="0.25" fill="#aa151b" opacity="0.78" />
            <circle cx="10.1" cy="12.5" r="0.7" fill="#aa151b" opacity="0.72" />
          </svg>
        }
        @case ('en') {
          <svg viewBox="0 0 30 20" focusable="false">
            <rect width="30" height="20" fill="#012169" />
            <path d="M0 0 30 20M30 0 0 20" stroke="#fff" stroke-width="4.6" />
            <path d="M0 0 30 20M30 0 0 20" stroke="#c8102e" stroke-width="2.2" />
            <path d="M15 0v20M0 10h30" stroke="#fff" stroke-width="6.2" />
            <path d="M15 0v20M0 10h30" stroke="#c8102e" stroke-width="3.2" />
          </svg>
        }
        @case ('fr') {
          <svg viewBox="0 0 30 20" focusable="false">
            <rect width="10" height="20" fill="#0055a4" />
            <rect x="10" width="10" height="20" fill="#fff" />
            <rect x="20" width="10" height="20" fill="#ef4135" />
          </svg>
        }
        @case ('de') {
          <svg viewBox="0 0 30 20" focusable="false">
            <rect width="30" height="6.67" fill="#111" />
            <rect y="6.67" width="30" height="6.66" fill="#dd0000" />
            <rect y="13.33" width="30" height="6.67" fill="#ffce00" />
          </svg>
        }
        @case ('ru') {
          <svg viewBox="0 0 30 20" focusable="false">
            <rect width="30" height="6.67" fill="#fff" />
            <rect y="6.67" width="30" height="6.66" fill="#0039a6" />
            <rect y="13.33" width="30" height="6.67" fill="#d52b1e" />
          </svg>
        }
        @case ('zh') {
          <svg viewBox="0 0 30 20" focusable="false">
            <rect width="30" height="20" fill="#de2910" />
            <path d="m5.2 3.2.8 1.7 1.9.2-1.4 1.3.4 1.9-1.7-.9-1.7.9.4-1.9-1.4-1.3 1.9-.2.8-1.7Z" fill="#ffde00" />
            <circle cx="10.2" cy="3.4" r="0.55" fill="#ffde00" />
            <circle cx="11.5" cy="5.2" r="0.55" fill="#ffde00" />
            <circle cx="11.4" cy="7.6" r="0.55" fill="#ffde00" />
            <circle cx="9.8" cy="9" r="0.55" fill="#ffde00" />
          </svg>
        }
        @case ('ja') {
          <svg viewBox="0 0 30 20" focusable="false">
            <rect width="30" height="20" fill="#fff" />
            <circle cx="15" cy="10" r="5.2" fill="#bc002d" />
          </svg>
        }
        @default {
          <svg viewBox="0 0 30 20" focusable="false">
            <rect width="30" height="20" fill="#24345f" />
            <path d="M4 10h22" stroke="#6bc7ff" stroke-width="1.4" opacity="0.8" />
          </svg>
        }
      }
      <span class="flag-sheen" aria-hidden="true"></span>
    </span>
  `,
  styles: `
    :host {
      display: inline-flex;
      width: var(--locale-flag-width, 1.55rem);
      aspect-ratio: 3 / 2;
      flex: 0 0 auto;
      vertical-align: middle;
    }

    .flag-frame {
      position: relative;
      display: block;
      width: 100%;
      height: 100%;
      overflow: hidden;
      border: 1px solid rgba(224, 238, 255, 0.34);
      border-radius: 0.24rem;
      background: rgba(8, 18, 43, 0.8);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.28),
        inset 0 -1px 0 rgba(2, 7, 20, 0.28),
        0 0.2rem 0.5rem rgba(2, 8, 24, 0.26),
        0 0 0.55rem rgba(69, 153, 255, 0.07);
      transform: translateZ(0);
    }

    svg {
      display: block;
      width: 100%;
      height: 100%;
      filter: saturate(1.08) contrast(1.02);
    }

    .flag-sheen {
      position: absolute;
      inset: 0;
      background:
        linear-gradient(160deg, rgba(255, 255, 255, 0.22), transparent 38%),
        linear-gradient(0deg, rgba(2, 7, 20, 0.08), transparent 42%);
      pointer-events: none;
    }
  `,
  host: { 'aria-hidden': 'true' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LocaleFlagComponent {
  readonly locale = input.required<string>();
}
