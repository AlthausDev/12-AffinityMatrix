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
            <div>
              <p class="semantic-kicker">{{ i18n.t('dashboard.semantic.themes') }}</p>
              <strong>{{ i18n.t('dashboard.semantic.inventory', { dimensions: themes().length, tags: semanticTagCount() }) }}</strong>
            </div>
          </div>

          <p class="semantic-scale-note">
            {{ text(
              'Cada línea mide afinidad dentro de lo que ya has respondido. No es progreso: responder más añade evidencia y estabilidad, pero no empuja el marcador hacia 100.',
              'Each line measures affinity within what you have already answered. It is not completion: answering more adds evidence and stability, but does not push the marker toward 100.'
            ) }}
          </p>

          <div class="semantic-scale-legend" aria-hidden="true">
            <span>{{ text('Baja', 'Low') }}</span>
            <span>{{ text('Media', 'Medium') }}</span>
            <span>{{ text('Alta', 'High') }}</span>
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
                    <span>{{ entry.score }} · {{ dimensionAffinityLabel(entry.score) }}</span>
                  } @else {
                    <span class="semantic-no-score">{{ text('Sin datos', 'No data') }}</span>
                  }
                </div>

                <div
                  class="semantic-spectrum"
                  role="img"
                  [attr.aria-label]="themeAriaLabel(entry)"
                >
                  <span class="semantic-spectrum-midline" aria-hidden="true"></span>
                  @if (entry.evidenceCount > 0) {
                    <span
                      class="semantic-spectrum-marker"
                      [style.left.%]="scorePosition(entry.score)"
                      aria-hidden="true"
                    ></span>
                  }
                </div>

                <small class="semantic-evidence">
                  {{ entry.evidenceCount > 0 ? evidenceLabel(entry.evidenceCount) : text('Aún no has respondido prácticas de esta dimensión', 'You have not answered practices in this dimension yet') }}
                </small>
              </div>
            }
          </div>
        </section>

        @if (primaryCoordinateMap(); as entry) {
          <section class="semantic-relative-section" [attr.aria-label]="i18n.t('dashboard.semantic.coordinates')">
            <header class="semantic-relative-heading">
              <div>
                <p class="semantic-kicker">{{ i18n.t('dashboard.semantic.coordinates') }}</p>
                <h4>{{ coordinateMapLabel(entry) }}</h4>
                <p>{{ i18n.t('dashboard.semantic.coordinatesDescription') }}</p>
              </div>
              <small>{{ evidenceLabel(entry.evidenceCount) }}</small>
            </header>

            <div class="semantic-relative-grid">
              <article class="semantic-relative-axis">
                <div class="semantic-relative-labels" aria-hidden="true">
                  <strong>{{ axisLabel(entry.map.x, 'low') }}</strong>
                  <span>{{ i18n.t('dashboard.semantic.coordinatesCenter') }}</span>
                  <strong>{{ axisLabel(entry.map.x, 'high') }}</strong>
                </div>
                <div class="semantic-relative-rail" role="img" [attr.aria-label]="relativeAxisAriaLabel(entry.x, entry.map.x)">
                  <span class="semantic-relative-midline" aria-hidden="true"></span>
                  <span class="semantic-relative-marker" [style.left.%]="coordinateLeft(entry.x)" aria-hidden="true"></span>
                </div>
                <small>{{ relativeDiagnosis(entry.x, entry.map.x) }}</small>
              </article>

              <article class="semantic-relative-axis semantic-relative-axis-secondary">
                <div class="semantic-relative-labels" aria-hidden="true">
                  <strong>{{ axisLabel(entry.map.y, 'low') }}</strong>
                  <span>{{ i18n.t('dashboard.semantic.coordinatesCenter') }}</span>
                  <strong>{{ axisLabel(entry.map.y, 'high') }}</strong>
                </div>
                <div class="semantic-relative-rail" role="img" [attr.aria-label]="relativeAxisAriaLabel(entry.y, entry.map.y)">
                  <span class="semantic-relative-midline" aria-hidden="true"></span>
                  <span class="semantic-relative-marker semantic-relative-marker-secondary" [style.left.%]="coordinateLeft(entry.y)" aria-hidden="true"></span>
                </div>
                <small>{{ relativeDiagnosis(entry.y, entry.map.y) }}</small>
              </article>
            </div>
          </section>
        }

        <section class="semantic-highlight-panel" [attr.aria-label]="i18n.t('dashboard.semantic.highlights')">
          <div class="semantic-panel-kicker semantic-highlight-heading">
            <div>
              <p class="semantic-kicker">{{ i18n.t('dashboard.semantic.highlights') }}</p>
              <strong>{{ text('Tus señales más marcadas, con una lectura rápida de intensidad', 'Your strongest signals, with a quick intensity reading') }}</strong>
            </div>
          </div>

          @if (highlights().length > 0) {
            <div class="semantic-highlight-grid">
              @for (entry of highlights(); track entry.tag.id; let index = $index) {
                <article class="semantic-highlight" [style.--semantic-rank]="index" [title]="tagDescription(entry)">
                  <div class="semantic-highlight-topline">
                    <strong>{{ tagLabel(entry) }}</strong>
                    <span>{{ entry.score }}%</span>
                  </div>
                  <span class="semantic-highlight-diagnosis">{{ affinityDiagnosis(entry.score) }}</span>
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
    :host { display: block; min-width: 0; }
    .dashboard-semantic-card { position: relative; overflow: hidden; margin-top: 1rem; isolation: isolate; }
    .semantic-heading { position: relative; z-index: 1; }
    .semantic-theme-panel,
    .semantic-highlight-panel,
    .semantic-relative-section {
      min-width: 0;
      padding: 0.9rem;
      border: 1px solid color-mix(in srgb, var(--border-subtle) 74%, transparent);
      border-radius: 0.78rem;
      background: linear-gradient(145deg, rgba(15, 33, 69, 0.48), rgba(38, 24, 63, 0.36));
    }
    .semantic-highlight-panel,
    .semantic-relative-section { margin-top: 0.8rem; }
    .semantic-panel-kicker { margin-bottom: 0.6rem; }
    .semantic-panel-kicker > div { display: grid; gap: 0.12rem; }
    .semantic-panel-kicker strong,
    .semantic-relative-heading > small {
      color: var(--text-secondary);
      font-size: 0.62rem;
      font-weight: 620;
    }
    .semantic-kicker {
      margin: 0;
      color: color-mix(in srgb, var(--text-secondary) 78%, var(--neon-cyan));
      font-size: 0.66rem;
      font-weight: 780;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .semantic-scale-note {
      margin: 0 0 0.7rem;
      padding: 0.55rem 0.62rem;
      border-left: 2px solid color-mix(in srgb, var(--neon-cyan) 58%, var(--neon-violet));
      background: rgba(13, 31, 62, 0.32);
      color: var(--text-secondary);
      font-size: 0.62rem;
      line-height: 1.45;
    }
    .semantic-scale-legend {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      margin: 0 0.18rem 0.35rem;
      color: color-mix(in srgb, var(--text-secondary) 76%, white);
      font-size: 0.54rem;
      font-weight: 700;
    }
    .semantic-scale-legend span:nth-child(2) { text-align: center; }
    .semantic-scale-legend span:last-child { text-align: right; }
    .semantic-theme-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.72rem 1rem; }
    .semantic-theme {
      --semantic-accent: #69d9ff;
      display: grid;
      align-content: start;
      gap: 0.3rem;
      min-width: 0;
      padding: 0.34rem 0.08rem;
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
    .semantic-theme-empty { opacity: 0.42; }
    .semantic-theme-heading { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 0.65rem; align-items: start; }
    .semantic-theme-heading > div { display: grid; gap: 0.08rem; min-width: 0; }
    .semantic-theme-heading strong { font-size: 0.8rem; line-height: 1.25; }
    .semantic-theme-heading small,
    .semantic-evidence,
    .semantic-highlight small,
    .semantic-relative-axis small {
      color: var(--text-secondary);
      font-size: 0.6rem;
      line-height: 1.35;
    }
    .semantic-theme-heading > span {
      color: color-mix(in srgb, var(--semantic-accent) 82%, white);
      font-size: 0.66rem;
      font-weight: 780;
      text-align: right;
      white-space: nowrap;
    }
    .semantic-theme-heading > .semantic-no-score { color: var(--text-secondary); }
    .semantic-spectrum {
      position: relative;
      height: 0.58rem;
      margin: 0.05rem 0.18rem;
      border: 1px solid color-mix(in srgb, var(--border-subtle) 62%, transparent);
      border-radius: 0.24rem;
      background: linear-gradient(90deg,
        rgba(37, 52, 84, 0.58) 0%,
        color-mix(in srgb, var(--semantic-accent) 10%, rgba(46, 44, 91, 0.58)) 50%,
        color-mix(in srgb, var(--semantic-accent) 30%, rgba(36, 48, 82, 0.64)) 100%);
      box-shadow: inset 0 1px 2px rgba(2, 7, 22, 0.28);
    }
    .semantic-spectrum-midline,
    .semantic-relative-midline {
      position: absolute;
      top: -0.18rem;
      bottom: -0.18rem;
      left: 50%;
      width: 1px;
      background: color-mix(in srgb, var(--border-strong) 46%, transparent);
    }
    .semantic-spectrum-marker,
    .semantic-relative-marker {
      position: absolute;
      z-index: 2;
      top: 50%;
      width: 0.72rem;
      height: 0.72rem;
      transform: translate(-50%, -50%) rotate(45deg);
      border: 2px solid #f5f2ff;
      border-radius: 0.13rem;
      background: var(--semantic-accent);
      box-shadow: 0 0 0.55rem color-mix(in srgb, var(--semantic-accent) 52%, transparent);
    }

    .semantic-relative-section { background: linear-gradient(155deg, rgba(13, 31, 65, 0.58), rgba(34, 23, 62, 0.46)); }
    .semantic-relative-heading {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: end;
      gap: 1rem;
      margin-bottom: 0.72rem;
    }
    .semantic-relative-heading > div { display: grid; gap: 0.14rem; }
    .semantic-relative-heading h4 { margin: 0; font-size: 0.86rem; }
    .semantic-relative-heading p:last-child { max-width: 54rem; margin: 0; color: var(--text-secondary); font-size: 0.62rem; line-height: 1.42; }
    .semantic-relative-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.68rem; }
    .semantic-relative-axis {
      display: grid;
      gap: 0.34rem;
      min-width: 0;
      padding: 0.68rem;
      border: 1px solid color-mix(in srgb, var(--border-subtle) 60%, transparent);
      border-radius: 0.62rem;
      background: rgba(11, 25, 54, 0.42);
    }
    .semantic-relative-labels { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.35rem; align-items: end; }
    .semantic-relative-labels strong { font-size: 0.6rem; line-height: 1.22; }
    .semantic-relative-labels span { color: var(--text-secondary); font-size: 0.52rem; text-align: center; }
    .semantic-relative-labels strong:last-child { text-align: right; }
    .semantic-relative-rail {
      position: relative;
      height: 0.72rem;
      margin: 0.12rem 0.1rem;
      border: 1px solid color-mix(in srgb, var(--border-subtle) 66%, transparent);
      border-radius: 0.25rem;
      background: linear-gradient(90deg, rgba(49, 116, 166, 0.28), rgba(45, 38, 86, 0.58) 50%, rgba(159, 71, 179, 0.25));
      box-shadow: inset 0 1px 3px rgba(2, 7, 22, 0.3);
    }
    .semantic-relative-marker {
      --semantic-accent: var(--neon-violet);
      width: 0.82rem;
      height: 0.82rem;
      background: linear-gradient(135deg, var(--neon-cyan), var(--neon-violet) 58%, var(--neon-magenta));
    }
    .semantic-relative-marker-secondary { background: linear-gradient(135deg, var(--preference-positive), var(--neon-violet), var(--preference-boundary)); }
    .semantic-relative-axis small { justify-self: center; color: color-mix(in srgb, var(--text-secondary) 82%, white); font-weight: 680; text-align: center; }

    .semantic-highlight-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 0.55rem; }
    .semantic-highlight {
      --rank-accent: color-mix(in srgb, var(--neon-violet) 74%, var(--neon-cyan));
      display: grid;
      align-content: start;
      gap: 0.34rem;
      min-height: 6.1rem;
      padding: 0.68rem;
      border: 1px solid color-mix(in srgb, var(--rank-accent) 30%, var(--border-subtle));
      border-radius: 0.62rem;
      background: linear-gradient(155deg, color-mix(in srgb, var(--rank-accent) 9%, rgba(15, 27, 54, 0.72)), rgba(12, 23, 46, 0.58));
    }
    .semantic-highlight:nth-child(3n + 2) { --rank-accent: #43dec8; }
    .semantic-highlight:nth-child(3n) { --rank-accent: #ff7ea8; }
    .semantic-highlight-topline { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 0.45rem; align-items: start; }
    .semantic-highlight-topline strong { font-size: 0.72rem; line-height: 1.24; }
    .semantic-highlight-topline span { color: color-mix(in srgb, var(--rank-accent) 82%, white); font-size: 0.72rem; font-weight: 800; }
    .semantic-highlight-diagnosis {
      width: fit-content;
      padding: 0.13rem 0.34rem;
      border: 1px solid color-mix(in srgb, var(--rank-accent) 30%, transparent);
      border-radius: 0.3rem;
      background: color-mix(in srgb, var(--rank-accent) 9%, rgba(12, 23, 46, 0.5));
      color: color-mix(in srgb, var(--rank-accent) 68%, white);
      font-size: 0.58rem;
      font-weight: 750;
      line-height: 1.2;
    }
    .semantic-highlight small { margin-top: auto; }
    .semantic-highlight-empty { margin: 0; color: var(--text-secondary); font-size: 0.72rem; }
    .semantic-note { max-width: 68rem; margin: 0.82rem 0 0; color: var(--text-secondary); font-size: 0.61rem; line-height: 1.46; }
    .semantic-empty { min-height: 9rem; }

    @media (max-width: 920px) {
      .semantic-theme-list { grid-template-columns: 1fr; }
      .semantic-relative-grid { grid-template-columns: 1fr; }
      .semantic-highlight-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @media (max-width: 620px) {
      .semantic-theme-panel,
      .semantic-highlight-panel,
      .semantic-relative-section { padding: 0.72rem; }
      .semantic-theme-heading small { display: none; }
      .semantic-theme-heading { gap: 0.45rem; }
      .semantic-theme-heading > span { font-size: 0.62rem; }
      .semantic-relative-heading { grid-template-columns: 1fr; gap: 0.2rem; }
      .semantic-relative-heading > small { text-align: left; }
      .semantic-highlight { min-height: 6.35rem; }
    }
    @media (max-width: 370px) {
      .semantic-highlight-grid { grid-template-columns: 1fr; }
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
  readonly highlights = computed(() => strongestSemanticInsights(this.insights(), 10));
  readonly coordinateMaps = computed(() =>
    buildSemanticCoordinateMaps(this.insights()).filter((entry) => entry.evidenceCount > 0),
  );
  readonly primaryCoordinateMap = computed(() => this.coordinateMaps()[0]);
  readonly semanticTagCount = computed(() => CATALOGUE_INSIGHT_TAGS.length);
  readonly hasEvidence = computed(() => this.themes().some((entry) => entry.evidenceCount > 0));

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

  coordinateMapLabel(entry: SemanticCoordinateMapEntry): string {
    return this.i18n.locale() === 'es' ? entry.map.es : entry.map.en;
  }

  axisLabel(axis: SemanticAxisDefinition, side: 'low' | 'high'): string {
    if (this.i18n.locale() === 'es') return side === 'low' ? axis.lowEs : axis.highEs;
    return side === 'low' ? axis.lowEn : axis.highEn;
  }

  dimensionAffinityLabel(score: number): string {
    if (score < 20) return this.text('muy baja', 'very low');
    if (score < 40) return this.text('baja', 'low');
    if (score < 60) return this.text('media', 'medium');
    if (score < 80) return this.text('alta', 'high');
    return this.text('muy alta', 'very high');
  }

  affinityDiagnosis(score: number): string {
    if (score < 20) return this.text('Casi sin afinidad', 'Almost no affinity');
    if (score < 35) return this.text('Interés leve', 'Slight interest');
    if (score < 50) return this.text('Te genera curiosidad', 'It sparks curiosity');
    if (score < 60) return this.text('Te atrae moderadamente', 'Moderate attraction');
    if (score < 70) return this.text('Te gusta', 'You like it');
    if (score < 85) return this.text('Te gusta bastante', 'You like it quite a lot');
    return this.text('Preferencia muy marcada', 'Very strong preference');
  }

  scorePosition(score: number): number {
    return Math.max(5, Math.min(95, 5 + score * 0.9));
  }

  coordinateLeft(value: number): number {
    return Math.max(5, Math.min(95, 50 + value * 0.45));
  }

  relativeDiagnosis(value: number, axis: SemanticAxisDefinition): string {
    const magnitude = Math.abs(value);
    if (magnitude < 10) return this.text('Muy equilibrado entre ambos lados', 'Very balanced between both sides');
    const target = this.axisLabel(axis, value < 0 ? 'low' : 'high');
    if (magnitude < 25) return this.text(`Ligera inclinación hacia ${target}`, `Slight lean toward ${target}`);
    if (magnitude < 50) return this.text(`Tendencia hacia ${target}`, `Tendency toward ${target}`);
    return this.text(`Tendencia clara hacia ${target}`, `Clear tendency toward ${target}`);
  }

  themeAriaLabel(entry: SemanticThemeEntry): string {
    if (entry.evidenceCount === 0) return `${this.themeLabel(entry)} · ${this.text('sin datos', 'no data')}`;
    return `${this.themeLabel(entry)} · ${this.text('afinidad', 'affinity')} ${entry.score} / 100 · ${this.evidenceLabel(entry.evidenceCount)}`;
  }

  relativeAxisAriaLabel(value: number, axis: SemanticAxisDefinition): string {
    return `${this.axisLabel(axis, 'low')} ↔ ${this.axisLabel(axis, 'high')}: ${value}`;
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
