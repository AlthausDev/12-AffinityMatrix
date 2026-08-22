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
      transition: width 180ms ease, background-color 120ms linear, box-shadow 120ms linear;
    }
    .progress-danger {
      background: var(--completion-danger);
      box-shadow: 0 0 0.55rem color-mix(in srgb, var(--completion-danger) 30%, transparent);
    }
    .progress-low {
      background: var(--completion-low);
      box-shadow: 0 0 0.55rem color-mix(in srgb, var(--completion-low) 28%, transparent);
    }
    .progress-mid {
      background: var(--completion-mid);
      box-shadow: 0 0 0.55rem color-mix(in srgb, var(--completion-mid) 26%, transparent);
    }
    .progress-high {
      background: var(--completion-high);
      box-shadow: 0 0 0.55rem color-mix(in srgb, var(--completion-high) 26%, transparent);
    }
    .progress-complete {
      background: var(--completion-complete);
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
