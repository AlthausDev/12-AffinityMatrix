import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-home-page',
  template: `
    <main class="shell">
      <section class="intro" aria-labelledby="page-title">
        <p class="eyebrow">MVP · 0.1.0.0</p>
        <h1 id="page-title">Affinity Matrix</h1>
        <p class="summary">
          Create portable preference profiles and compare them locally.
        </p>
        <p class="status">Project scaffold ready. Profile management comes next.</p>
      </section>
    </main>
  `,
  styles: `
    :host {
      display: block;
    }

    .shell {
      width: min(100% - 2rem, 72rem);
      margin-inline: auto;
      padding-block: clamp(3rem, 10vw, 8rem);
    }

    .intro {
      max-width: 42rem;
      padding: clamp(1.5rem, 5vw, 3rem);
      border: 1px solid var(--border-subtle);
      border-radius: 1rem;
      background: var(--surface-panel);
    }

    .eyebrow,
    .status {
      color: var(--text-secondary);
    }

    .eyebrow {
      margin: 0 0 0.75rem;
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    h1 {
      margin: 0;
      font-size: clamp(2rem, 8vw, 4rem);
      line-height: 1;
    }

    .summary {
      margin: 1.5rem 0 0;
      color: var(--text-secondary);
      font-size: clamp(1rem, 2vw, 1.2rem);
      line-height: 1.6;
    }

    .status {
      margin: 2rem 0 0;
      padding-top: 1rem;
      border-top: 1px solid var(--border-subtle);
      font-size: 0.9rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {}
