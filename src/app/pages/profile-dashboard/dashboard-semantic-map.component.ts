import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Profile } from '../../../domain/profile/profile';
import {
  CATALOGUE_INSIGHT_TAGS,
  CATALOGUE_V3_PRACTICE_INSIGHTS,
} from '../../../infrastructure/catalogue/v3/catalogue-insights';
import { TranslationService } from '../../i18n/translation.service';
import {
  buildSemanticInsights,
  buildSemanticThemes,
  SemanticInsightEntry,
  SemanticThemeEntry,
  strongestSemanticInsights,
} from './profile-dashboard-semantic-insights';

@Component({
  selector: 'app-dashboard-semantic-map',
  template: `
    <article class="dashboard-chart-card dashboard-semantic-card">
      <header class="dashboard-chart-heading semantic-heading">
        <div>
          <h3>{{ i18n.t('dashboard.semantic.title') }}</h3>
          <p>{{ i18n.t('dashboard.semantic.description') }}</p>
        </div>
      </header>

      @if (visibleThemes().length > 0) {
        <div class="semantic-layout">
          <section class="semantic-theme-panel" [attr.aria-label]="i18n.t('dashboard.semantic.themes')">
            <p class="semantic-kicker">{{ i18n.t('dashboard.semantic.themes') }}</p>

            <div class="semantic-theme-list">
              @for (entry of visibleThemes(); track entry.theme.id) {
                <div class="semantic-theme" [attr.data-theme]="entry.theme.id">
                  <div class="semantic-theme-heading">
                    <div>
                      <strong>{{ themeLabel(entry) }}</strong>
                      <small>{{ themeDescription(entry) }}</small>
                    </div>
                    <span>{{ entry.score }}%</span>
                  </div>

                  <div
                    class="semantic-track"
                    role="img"
                    [attr.aria-label]="themeLabel(entry) + ' · ' + i18n.t('dashboard.semantic.score') + ' ' + entry.score + '%'
                  >
                    <span [style.width.%]="entry.score"></span>
                  </div>

                  <small class="semantic-evidence">{{ evidenceLabel(entry.evidenceCount) }}</small>
                </div>
              }
            </div>
          </section>

          <section class="semantic-highlight-panel" [attr.aria-label]="i18n.t('dashboard.semantic.highlights')">
            <p class="semantic-kicker">{{ i18n.t('dashboard.semantic.highlights') }}</p>

            @if (highlights().length > 0) {
              <div class="semantic-highlight-grid">
                @for (entry of highlights(); track entry.tag.id; let index = $index) {
                  <article class="semantic-highlight" [style.--semantic-rank]="index">
                    <div class="semantic-highlight-topline">
                      <strong>{{ tagLabel(entry) }}</strong>
                      <span>{{ entry.score }}%</span>
                    </div>
                    <p>{{ tagDescription(entry) }}</p>
                    <small>{{ evidenceLabel(entry.evidenceCount) }}</small>
                  </article>
                }
              </div>
            } @else {
              <p class="semantic-highlight-empty">{{ i18n.t('dashboard.semantic.empty') }}</p>
            }
          </section>
        </div>

        <p class="semantic-note">{{ i18n.t('dashboard.semantic.note') }}</p>
      } @else {
        <div class="dashboard-chart-empty semantic-empty">
          <span aria-hidden="true">◇</span>
          <p>{{ i18n.t('dashboard.semantic.empty') }}</p>
        </div>
      }
    </article>
  `,
  styles: `
    :host { display: block; }
    .dashboard-semantic-card {
      position: relative;
      overflow: hidden;
      margin-top: 1rem;
      isolation: isolate;
    }
    .dashboard-semantic-card::before {
      content: '';
      position: absolute;
      inset: -9rem -8rem auto auto;
      width: 19rem;
      height: 19rem;
      border-radius: 35% 65% 58% 42%;
      background: radial-gradient(circle at 38% 42%, rgba(67, 222, 255, 0.16), rgba(152, 76, 255, 0.08) 48%, transparent 72%);
      filter: blur(8px);
      pointer-events: none;
      z-index: -1;
    }
    .semantic-heading { position: relative; z-index: 1; }
    .semantic-layout {
      display: grid;
      grid-template-columns: minmax(0, 1.15fr) minmax(18rem, 0.85fr);
      gap: 1rem;
      align-items: start;
    }
    .semantic-theme-panel,
    .semantic-highlight-panel {
      min-width: 0;
      padding: 0.9rem;
      border: 1px solid color-mix(in srgb, var(--border-subtle) 74%, transparent);
      border-radius: 0.78rem;
      background: linear-gradient(145deg, rgba(15, 33, 69, 0.48), rgba(38, 24, 63, 0.36));
    }
    .semantic-kicker {
      margin: 0 0 0.72rem;
      color: color-mix(in srgb, var(--text-secondary) 78%, var(--neon-cyan));
      font-size: 0.66rem;
      font-weight: 780;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .semantic-theme-list { display: grid; gap: 0.78rem; }
    .semantic-theme { --semantic-accent: #69d9ff; display: grid; gap: 0.3rem; }
    .semantic-theme[data-theme='exploration'] { --semantic-accent: #bc7cff; }
    .semantic-theme[data-theme='intensity'] { --semantic-accent: #ff6f91; }
    .semantic-theme[data-theme='power'] { --semantic-accent: #ffae61; }
    .semantic-theme[data-theme='visibility'] { --semantic-accent: #67e7c4; }
    .semantic-theme[data-theme='body-focus'] { --semantic-accent: #e6d56a; }
    .semantic-theme-heading {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 0.7rem;
      align-items: start;
    }
    .semantic-theme-heading > div { display: grid; gap: 0.1rem; min-width: 0; }
    .semantic-theme-heading strong { font-size: 0.82rem; line-height: 1.25; }
    .semantic-theme-heading small,
    .semantic-evidence,
    .semantic-highlight small { color: var(--text-secondary); font-size: 0.66rem; line-height: 1.35; }
    .semantic-theme-heading > span {
      color: color-mix(in srgb, var(--semantic-accent) 82%, white);
      font-size: 0.8rem;
      font-weight: 800;
      font-variant-numeric: tabular-nums;
    }
    .semantic-track {
      position: relative;
      height: 0.48rem;
      overflow: hidden;
      border-radius: 0.3rem;
      background: color-mix(in srgb, var(--surface-page) 72%, #0a1122);
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--border-subtle) 68%, transparent);
    }
    .semantic-track > span {
      position: absolute;
      inset: 0 auto 0 0;
      border-radius: inherit;
      background: linear-gradient(90deg, color-mix(in srgb, var(--semantic-accent) 66%, #6d5dff), var(--semantic-accent));
      box-shadow: 0 0 0.7rem color-mix(in srgb, var(--semantic-accent) 36%, transparent);
    }
    .semantic-highlight-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.55rem;
    }
    .semantic-highlight {
      --rank-accent: color-mix(in srgb, var(--neon-violet) 74%, var(--neon-cyan));
      display: grid;
      align-content: start;
      gap: 0.28rem;
      min-height: 7.25rem;
      padding: 0.7rem;
      border: 1px solid color-mix(in srgb, var(--rank-accent) 26%, var(--border-subtle));
      border-radius: 0.64rem;
      background: linear-gradient(155deg, color-mix(in srgb, var(--rank-accent) 9%, rgba(15, 27, 54, 0.72)), rgba(12, 23, 46, 0.58));
    }
    .semantic-highlight:nth-child(3n + 2) { --rank-accent: #43dec8; }
    .semantic-highlight:nth-child(3n) { --rank-accent: #ff7ea8; }
    .semantic-highlight-topline {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 0.45rem;
      align-items: start;
    }
    .semantic-highlight-topline strong { font-size: 0.76rem; line-height: 1.25; }
    .semantic-highlight-topline span {
      color: color-mix(in srgb, var(--rank-accent) 82%, white);
      font-size: 0.75rem;
      font-weight: 800;
      font-variant-numeric: tabular-nums;
    }
    .semantic-highlight p {
      margin: 0;
      color: color-mix(in srgb, var(--text-secondary) 92%, white);
      font-size: 0.68rem;
      line-height: 1.38;
    }
    .semantic-highlight small { margin-top: auto; }
    .semantic-highlight-empty { margin: 0; color: var(--text-secondary); font-size: 0.78rem; }
    .semantic-note {
      max-width: 68rem;
      margin: 0.72rem 0 0;
      color: var(--text-secondary);
      font-size: 0.68rem;
      line-height: 1.45;
    }
    .semantic-empty { min-height: 9rem; }
    @media (max-width: 820px) {
      .semantic-layout { grid-template-columns: 1fr; }
      .semantic-highlight-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @media (max-width: 520px) {
      .semantic-theme-panel,
      .semantic-highlight-panel { padding: 0.72rem; }
      .semantic-highlight-grid { grid-template-columns: 1fr; }
      .semantic-highlight { min-height: auto; }
      .semantic-theme-heading small { display: none; }
    }
    @media (prefers-reduced-motion: reduce) {
      .semantic-track > span { transition: none; }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardSemanticMapComponent {
  readonly profile = input<Profile | undefined>();
  readonly i18n = inject(TranslationService);

  readonly insights = computed(() =>
    buildSemanticInsights(this.profile(), CATALOGUE_INSIGHT_TAGS, CATALOGUE_V3_PRACTICE_INSIGHTS),
  );
  readonly themes = computed(() => buildSemanticThemes(this.insights()));
  readonly visibleThemes = computed(() => this.themes().filter((entry) => entry.evidenceCount > 0));
  readonly highlights = computed(() => strongestSemanticInsights(this.insights(), 8));

  themeLabel(entry: SemanticThemeEntry): string {
    return this.i18n.locale() === 'es' ? entry.theme.es : entry.theme.en;
  }

  themeDescription(entry: SemanticThemeEntry): string {
    return this.i18n.locale() === 'es' ? entry.theme.descriptionEs : entry.theme.descriptionEn;
  }

  tagLabel(entry: SemanticInsightEntry): string {
    return this.i18n.locale() === 'es' ? entry.tag.es : entry.tag.en;
  }

  tagDescription(entry: SemanticInsightEntry): string {
    return this.i18n.locale() === 'es' ? entry.tag.descriptionEs : entry.tag.descriptionEn;
  }

  evidenceLabel(count: number): string {
    return this.i18n.plural(
      count,
      'dashboard.semantic.evidence.one',
      'dashboard.semantic.evidence.other',
    );
  }
}
