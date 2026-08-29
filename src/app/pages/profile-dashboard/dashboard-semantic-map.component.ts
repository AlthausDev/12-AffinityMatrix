import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Profile } from '../../../domain/profile/profile';
import {
  CATALOGUE_INSIGHT_TAGS,
  CATALOGUE_V3_PRACTICE_INSIGHTS,
} from '../../../infrastructure/catalogue/v3/catalogue-insights';
import { TranslationService } from '../../i18n/translation.service';
import {
  buildSemanticCoordinateMaps,
  buildSemanticInsights,
  buildSemanticThemes,
  SemanticAxisDefinition,
  SemanticCoordinateMapEntry,
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

      @if (hasEvidence()) {
        <section class="semantic-theme-panel" [attr.aria-label]="i18n.t('dashboard.semantic.themes')">
          <div class="semantic-panel-kicker">
            <p class="semantic-kicker">{{ i18n.t('dashboard.semantic.themes') }}</p>
            <small>{{ i18n.t('dashboard.semantic.inventory', { dimensions: themes().length, tags: semanticTagCount() }) }}</small>
          </div>

          <div class="semantic-theme-list">
            @for (entry of themes(); track entry.theme.id) {
              <div
                class="semantic-theme"
                [class.semantic-theme-empty]="entry.evidenceCount === 0"
                [attr.data-theme]="entry.theme.id"
              >
                <div class="semantic-theme-heading">
                  <div>
                    <strong>{{ themeLabel(entry) }}</strong>
                    <small>{{ themeDescription(entry) }}</small>
                  </div>
                  @if (entry.evidenceCount > 0) {
                    <span>{{ entry.score }}%</span>
                  } @else {
                    <span class="semantic-no-score">—</span>
                  }
                </div>

                <div
                  class="semantic-track"
                  role="img"
                  [attr.aria-label]="themeAriaLabel(entry)"
                >
                  <span [style.width.%]="entry.evidenceCount > 0 ? entry.score : 0"></span>
                </div>

                <small class="semantic-evidence">
                  {{ entry.evidenceCount > 0 ? evidenceLabel(entry.evidenceCount) : i18n.t('dashboard.semantic.noData') }}
                </small>
              </div>
            }
          </div>
        </section>

        @if (primaryCoordinateMap(); as entry) {
          <section class="semantic-coordinate-section" [attr.aria-label]="i18n.t('dashboard.semantic.coordinates')">
            <header class="semantic-coordinate-heading">
              <div>
                <p class="semantic-kicker">{{ i18n.t('dashboard.semantic.coordinates') }}</p>
                <h4>{{ coordinateMapLabel(entry) }}</h4>
                <p>{{ i18n.t('dashboard.semantic.coordinatesDescription') }}</p>
              </div>
              <small>{{ evidenceLabel(entry.evidenceCount) }}</small>
            </header>

            <div class="semantic-coordinate-plane" role="img" [attr.aria-label]="coordinateAriaLabel(entry)">
              <span class="semantic-quadrant-glow" aria-hidden="true"></span>
              <span class="semantic-axis semantic-axis-x" aria-hidden="true"></span>
              <span class="semantic-axis semantic-axis-y" aria-hidden="true"></span>
              <span class="semantic-axis-label semantic-axis-left">{{ axisLabel(entry.map.x, 'low') }}</span>
              <span class="semantic-axis-label semantic-axis-right">{{ axisLabel(entry.map.x, 'high') }}</span>
              <span class="semantic-axis-label semantic-axis-top">{{ axisLabel(entry.map.y, 'high') }}</span>
              <span class="semantic-axis-label semantic-axis-bottom">{{ axisLabel(entry.map.y, 'low') }}</span>
              <span class="semantic-axis-center" aria-hidden="true">{{ i18n.t('dashboard.semantic.coordinatesCenter') }}</span>
              <span
                class="semantic-coordinate-marker"
                [style.left.%]="coordinateLeft(entry.x)"
                [style.top.%]="coordinateTop(entry.y)"
                aria-hidden="true"
              ></span>
            </div>
          </section>
        }

        <section class="semantic-highlight-panel" [attr.aria-label]="i18n.t('dashboard.semantic.highlights')">
          <div class="semantic-panel-kicker">
            <p class="semantic-kicker">{{ i18n.t('dashboard.semantic.highlights') }}</p>
            <small>{{ text('Señales concretas con mayor afinidad y evidencia', 'Concrete signals with the strongest affinity and evidence') }}</small>
          </div>

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
      z-index: -1;
      inset: -9rem -8rem auto auto;
      width: 19rem;
      height: 19rem;
      border-radius: 35% 65% 58% 42%;
      background: radial-gradient(circle at 38% 42%, rgba(67, 222, 255, 0.16), rgba(152, 76, 255, 0.08) 48%, transparent 72%);
      filter: blur(8px);
      pointer-events: none;
    }
    .semantic-heading { position: relative; z-index: 1; }
    .semantic-theme-panel,
    .semantic-highlight-panel,
    .semantic-coordinate-section {
      min-width: 0;
      padding: 0.9rem;
      border: 1px solid color-mix(in srgb, var(--border-subtle) 74%, transparent);
      border-radius: 0.78rem;
      background: linear-gradient(145deg, rgba(15, 33, 69, 0.48), rgba(38, 24, 63, 0.36));
    }
    .semantic-highlight-panel,
    .semantic-coordinate-section { margin-top: 0.8rem; }
    .semantic-panel-kicker {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 0.75rem;
      margin-bottom: 0.72rem;
    }
    .semantic-panel-kicker .semantic-kicker { margin-bottom: 0; }
    .semantic-panel-kicker > small,
    .semantic-coordinate-heading > small {
      color: var(--text-secondary);
      font-size: 0.62rem;
      text-align: right;
    }
    .semantic-kicker {
      margin: 0 0 0.72rem;
      color: color-mix(in srgb, var(--text-secondary) 78%, var(--neon-cyan));
      font-size: 0.66rem;
      font-weight: 780;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .semantic-theme-list {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.72rem 1rem;
    }
    .semantic-theme {
      --semantic-accent: #69d9ff;
      display: grid;
      align-content: start;
      gap: 0.28rem;
      min-width: 0;
      padding: 0.35rem 0.1rem;
    }
    .semantic-theme[data-theme='sensuality'] { --semantic-accent: #ff9fc7; }
    .semantic-theme[data-theme='play'] { --semantic-accent: #67e7c4; }
    .semantic-theme[data-theme='exploration'] { --semantic-accent: #bc7cff; }
    .semantic-theme[data-theme='intensity'] { --semantic-accent: #ff6f91; }
    .semantic-theme[data-theme='power'] { --semantic-accent: #ffae61; }
    .semantic-theme[data-theme='restraint'] { --semantic-accent: #739cff; }
    .semantic-theme[data-theme='visibility'] { --semantic-accent: #51d9d0; }
    .semantic-theme[data-theme='social'] { --semantic-accent: #e879dc; }
    .semantic-theme[data-theme='body-focus'] { --semantic-accent: #e6d56a; }
    .semantic-theme-empty { opacity: 0.46; }
    .semantic-theme-heading {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 0.7rem;
      align-items: start;
    }
    .semantic-theme-heading > div { display: grid; gap: 0.08rem; min-width: 0; }
    .semantic-theme-heading strong { font-size: 0.8rem; line-height: 1.25; }
    .semantic-theme-heading small,
    .semantic-evidence,
    .semantic-highlight small {
      color: var(--text-secondary);
      font-size: 0.62rem;
      line-height: 1.34;
    }
    .semantic-theme-heading > span {
      color: color-mix(in srgb, var(--semantic-accent) 82%, white);
      font-size: 0.78rem;
      font-weight: 800;
      font-variant-numeric: tabular-nums;
    }
    .semantic-theme-heading > .semantic-no-score { color: var(--text-secondary); }
    .semantic-track {
      position: relative;
      height: 0.42rem;
      overflow: hidden;
      border-radius: 0.2rem;
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

    .semantic-coordinate-section {
      background: linear-gradient(155deg, rgba(13, 31, 65, 0.58), rgba(34, 23, 62, 0.46));
    }
    .semantic-coordinate-heading {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: end;
      gap: 1rem;
      margin-bottom: 0.7rem;
    }
    .semantic-coordinate-heading .semantic-kicker { margin-bottom: 0.18rem; }
    .semantic-coordinate-heading h4 {
      margin: 0 0 0.18rem;
      font-size: 0.86rem;
    }
    .semantic-coordinate-heading p:last-child {
      max-width: 54rem;
      margin: 0;
      color: var(--text-secondary);
      font-size: 0.64rem;
      line-height: 1.42;
    }
    .semantic-coordinate-plane {
      position: relative;
      min-height: 16rem;
      overflow: hidden;
      border: 1px solid color-mix(in srgb, var(--border-subtle) 76%, transparent);
      border-radius: 0.68rem;
      background:
        linear-gradient(90deg, transparent 24.75%, rgba(119, 149, 203, 0.05) 25%, transparent 25.25%, transparent 74.75%, rgba(119, 149, 203, 0.05) 75%, transparent 75.25%),
        linear-gradient(0deg, transparent 24.75%, rgba(119, 149, 203, 0.05) 25%, transparent 25.25%, transparent 74.75%, rgba(119, 149, 203, 0.05) 75%, transparent 75.25%),
        linear-gradient(145deg, rgba(13, 25, 54, 0.84), rgba(30, 20, 53, 0.78));
      box-shadow: inset 0 0 1.5rem rgba(3, 8, 24, 0.24);
    }
    .semantic-quadrant-glow {
      position: absolute;
      inset: 16% 17%;
      background: radial-gradient(circle at center, rgba(112, 102, 255, 0.08), transparent 68%);
      pointer-events: none;
    }
    .semantic-axis {
      position: absolute;
      background: color-mix(in srgb, var(--neon-violet) 42%, var(--border-strong));
      box-shadow: 0 0 0.55rem rgba(115, 116, 255, 0.1);
    }
    .semantic-axis-x { left: 7%; right: 7%; top: 50%; height: 1px; }
    .semantic-axis-y { top: 8%; bottom: 8%; left: 50%; width: 1px; }
    .semantic-axis-label {
      position: absolute;
      z-index: 1;
      max-width: 8.4rem;
      padding: 0.14rem 0.3rem;
      background: rgba(9, 18, 40, 0.82);
      color: color-mix(in srgb, var(--text-secondary) 90%, white);
      font-size: 0.58rem;
      font-weight: 740;
      line-height: 1.2;
    }
    .semantic-axis-left { left: 0.35rem; top: 50%; transform: translateY(-50%); }
    .semantic-axis-right { right: 0.35rem; top: 50%; transform: translateY(-50%); text-align: right; }
    .semantic-axis-top { top: 0.35rem; left: 50%; transform: translateX(-50%); text-align: center; }
    .semantic-axis-bottom { bottom: 0.35rem; left: 50%; transform: translateX(-50%); text-align: center; }
    .semantic-axis-center {
      position: absolute;
      left: 50%;
      top: calc(50% + 0.45rem);
      transform: translateX(-50%);
      color: color-mix(in srgb, var(--text-secondary) 48%, transparent);
      font-size: 0.52rem;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    .semantic-coordinate-marker {
      position: absolute;
      z-index: 3;
      width: 1rem;
      height: 1rem;
      transform: translate(-50%, -50%) rotate(45deg);
      border: 2px solid #f7f1ff;
      border-radius: 0.16rem;
      background: linear-gradient(135deg, var(--neon-cyan), var(--neon-violet) 55%, var(--neon-magenta));
      box-shadow: 0 0 0.25rem rgba(255, 255, 255, 0.38), 0 0 1rem rgba(140, 92, 255, 0.6);
    }

    .semantic-highlight-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 0.55rem;
    }
    .semantic-highlight {
      --rank-accent: color-mix(in srgb, var(--neon-violet) 74%, var(--neon-cyan));
      display: grid;
      align-content: start;
      gap: 0.24rem;
      min-width: 0;
      min-height: 6rem;
      padding: 0.62rem;
      border: 1px solid color-mix(in srgb, var(--rank-accent) 26%, var(--border-subtle));
      border-radius: 0.62rem;
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
    .semantic-highlight-topline strong { font-size: 0.72rem; line-height: 1.22; }
    .semantic-highlight-topline span {
      color: color-mix(in srgb, var(--rank-accent) 82%, white);
      font-size: 0.72rem;
      font-weight: 800;
      font-variant-numeric: tabular-nums;
    }
    .semantic-highlight p {
      margin: 0;
      color: color-mix(in srgb, var(--text-secondary) 92%, white);
      font-size: 0.63rem;
      line-height: 1.34;
    }
    .semantic-highlight small { margin-top: auto; }
    .semantic-highlight-empty { margin: 0; color: var(--text-secondary); font-size: 0.78rem; }
    .semantic-note {
      max-width: 68rem;
      margin: 0.78rem 0 0;
      color: var(--text-secondary);
      font-size: 0.66rem;
      line-height: 1.44;
    }
    .semantic-empty { min-height: 9rem; }

    @media (max-width: 760px) {
      .semantic-theme-list { grid-template-columns: 1fr; gap: 0.5rem; }
      .semantic-theme { padding-block: 0.24rem; }
      .semantic-highlight-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .semantic-coordinate-plane { min-height: 13.5rem; }
    }
    @media (max-width: 520px) {
      .semantic-theme-panel,
      .semantic-highlight-panel,
      .semantic-coordinate-section { padding: 0.72rem; }
      .semantic-panel-kicker,
      .semantic-coordinate-heading { grid-template-columns: 1fr; align-items: start; gap: 0.18rem; }
      .semantic-panel-kicker { display: grid; }
      .semantic-panel-kicker > small,
      .semantic-coordinate-heading > small { text-align: left; }
      .semantic-theme-heading small { display: none; }
      .semantic-highlight { min-height: 4.5rem; }
      .semantic-highlight p { display: none; }
      .semantic-axis-label { max-width: 6.6rem; font-size: 0.54rem; }
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
  readonly hasEvidence = computed(() => this.insights().some((entry) => entry.evidenceCount > 0));
  readonly highlights = computed(() => strongestSemanticInsights(this.insights(), 10));
  readonly primaryCoordinateMap = computed(() =>
    buildSemanticCoordinateMaps(this.insights()).find((entry) => entry.map.id === 'style' && entry.evidenceCount > 0),
  );
  readonly semanticTagCount = computed(() => CATALOGUE_INSIGHT_TAGS.length);

  themeLabel(entry: SemanticThemeEntry): string {
    return this.i18n.locale() === 'es' ? entry.theme.es : entry.theme.en;
  }

  themeDescription(entry: SemanticThemeEntry): string {
    return this.i18n.locale() === 'es' ? entry.theme.descriptionEs : entry.theme.descriptionEn;
  }

  themeAriaLabel(entry: SemanticThemeEntry): string {
    if (entry.evidenceCount === 0) {
      return `${this.themeLabel(entry)} · ${this.i18n.t('dashboard.semantic.noData')}`;
    }
    return `${this.themeLabel(entry)} · ${this.i18n.t('dashboard.semantic.score')} ${entry.score}%`;
  }

  tagLabel(entry: SemanticInsightEntry): string {
    return this.i18n.locale() === 'es' ? entry.tag.es : entry.tag.en;
  }

  tagDescription(entry: SemanticInsightEntry): string {
    return this.i18n.locale() === 'es' ? entry.tag.descriptionEs : entry.tag.descriptionEn;
  }

  coordinateMapLabel(entry: SemanticCoordinateMapEntry): string {
    return this.i18n.locale() === 'es' ? entry.map.es : entry.map.en;
  }

  axisLabel(axis: SemanticAxisDefinition, side: 'low' | 'high'): string {
    if (this.i18n.locale() === 'es') return side === 'low' ? axis.lowEs : axis.highEs;
    return side === 'low' ? axis.lowEn : axis.highEn;
  }

  coordinateLeft(value: number): number {
    return Math.max(7, Math.min(93, 50 + value * 0.43));
  }

  coordinateTop(value: number): number {
    return Math.max(8, Math.min(92, 50 - value * 0.42));
  }

  coordinateAriaLabel(entry: SemanticCoordinateMapEntry): string {
    const xLow = this.axisLabel(entry.map.x, 'low');
    const xHigh = this.axisLabel(entry.map.x, 'high');
    const yLow = this.axisLabel(entry.map.y, 'low');
    const yHigh = this.axisLabel(entry.map.y, 'high');
    return `${this.coordinateMapLabel(entry)} · ${xLow} ↔ ${xHigh}: ${entry.x}; ${yLow} ↔ ${yHigh}: ${entry.y}`;
  }

  evidenceLabel(count: number): string {
    return this.i18n.plural(
      count,
      'dashboard.semantic.evidence.one',
      'dashboard.semantic.evidence.other',
    );
  }

  text(es: string, en: string): string {
    return this.i18n.locale() === 'es' ? es : en;
  }
}
