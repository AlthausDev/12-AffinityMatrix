import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-completion-progress',
  template: `
    <div class="completion-progress" aria-hidden="true">
      <span [style.width.%]="normalized()" [class]="toneClass()"></span>
    </div>
  `,
  styles: `
    .completion-progress {
      position: relative;
      height: 0.55rem;
      overflow: hidden;
      border: 1px solid color-mix(in srgb, var(--border-strong) 65%, transparent);
      border-radius: 999px;
      background: color-mix(in srgb, var(--surface-page) 58%, #090d18);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.035);
    }
    .completion-progress span {
      position: absolute;
      inset: 0 auto 0 0;
      border-radius: inherit;
      transition: width 180ms ease, background 140ms linear, box-shadow 140ms linear;
    }
    .progress-danger {
      background: linear-gradient(
        90deg,
        var(--completion-danger) 0%,
        color-mix(in srgb, var(--completion-danger) 72%, var(--completion-low)) 100%
      );
      box-shadow: 0 0 0.55rem color-mix(in srgb, var(--completion-danger) 30%, transparent);
    }
    .progress-low {
      background: linear-gradient(
        90deg,
        color-mix(in srgb, var(--completion-low) 82%, var(--completion-danger)) 0%,
        var(--completion-low) 62%,
        color-mix(in srgb, var(--completion-low) 72%, var(--completion-mid)) 100%
      );
      box-shadow: 0 0 0.55rem color-mix(in srgb, var(--completion-low) 28%, transparent);
    }
    .progress-mid {
      background: linear-gradient(
        90deg,
        color-mix(in srgb, var(--completion-mid) 82%, var(--completion-low)) 0%,
        var(--completion-mid) 62%,
        color-mix(in srgb, var(--completion-mid) 74%, var(--completion-high)) 100%
      );
      box-shadow: 0 0 0.55rem color-mix(in srgb, var(--completion-mid) 26%, transparent);
    }
    .progress-high {
      background: linear-gradient(
        90deg,
        color-mix(in srgb, var(--completion-high) 84%, var(--completion-mid)) 0%,
        var(--completion-high) 62%,
        color-mix(in srgb, var(--completion-high) 74%, var(--completion-complete)) 100%
      );
      box-shadow: 0 0 0.55rem color-mix(in srgb, var(--completion-high) 26%, transparent);
    }
    .progress-complete {
      background: linear-gradient(
        90deg,
        color-mix(in srgb, var(--completion-complete) 84%, var(--completion-high)) 0%,
        var(--completion-complete) 70%,
        color-mix(in srgb, var(--completion-complete) 84%, white) 100%
      );
      box-shadow: 0 0 0.65rem color-mix(in srgb, var(--completion-complete) 34%, transparent);
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompletionProgressComponent {
  readonly value = input(0);
  readonly normalized = computed(() => Math.min(100, Math.max(0, this.value())));
  readonly toneClass = computed(() => {
    const value = this.normalized();
    if (value < 20) return 'progress-danger';
    if (value < 40) return 'progress-low';
    if (value < 60) return 'progress-mid';
    if (value < 80) return 'progress-high';
    return 'progress-complete';
  });
}
