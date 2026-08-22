import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-completion-progress',
  template: `
    <div class="completion-progress" aria-hidden="true">
      <span [style.clip-path]="clipPath()"></span>
    </div>
  `,
  styles: `
    .completion-progress {
      position: relative;
      height: 0.45rem;
      overflow: hidden;
      border: 1px solid color-mix(in srgb, var(--border-strong) 60%, transparent);
      border-radius: 999px;
      background: color-mix(in srgb, var(--surface-page) 52%, transparent);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.035);
    }
    .completion-progress span {
      position: absolute;
      inset: 0;
      background: var(--completion-gradient);
      transition: clip-path 180ms ease;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CompletionProgressComponent {
  readonly value = input(0);
  readonly normalized = computed(() => Math.min(100, Math.max(0, this.value())));
  readonly clipPath = computed(() => `inset(0 ${100 - this.normalized()}% 0 0 round 999px)`);
}
