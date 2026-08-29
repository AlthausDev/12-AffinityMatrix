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

          <div class="semantic-scale-bands" [attr.aria-label]="text('Límites de afinidad', 'Affinity thresholds')">
            <span><strong>0–19</strong><small>{{ text('Muy baja', 'Very low') }}</small></span>
            <span><strong>20–39</strong><small>{{ text('Baja', 'Low') }}</small></span>
            <span><strong>40–59</strong><small>{{ text('Moderada', 'Moderate') }}</small></span>
            <span><strong>60–79</strong><small>{{ text('Alta', 'High') }}</small></span>
            <span><strong>80–100</strong><small>{{ text('Muy alta', 'Very high') }}</small></span>
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
                    <span>{{ entry.score }}% · {{ dimensionAffinityLabel(entry.score) }}</span>
                  } @else {
                    <span class="semantic-no-score">{{ text('Sin datos', 'No data') }}</span>
                  }
                </div>

                <div class="semantic-spectrum" role="img" [attr.aria-label]="themeAriaLabel(entry)">
                  <span class="semantic-threshold threshold-20" aria-hidden="true"></span>
                  <span class="semantic-threshold threshold-40" aria-hidden="true"></span>
                  <span class="semantic-threshold threshold-60" aria-hidden="true"></span>
                  <span class="semantic-threshold threshold-80" aria-hidden="true"></span>
                  @if (entry.evidenceCount > 0) {
                    <span class="semantic-spectrum-marker" [style.left.%]="scorePosition(entry.score)" aria-hidden="true"></span>
                  }
                </div>

                <small class="semantic-evidence">
                  {{ entry.evidenceCount > 0 ? evidenceLabel(entry.evidenceCount) : text('Aún no has respondido prácticas de esta dimensión', 'You have not answered practices in this dimension yet') }}
                </small>
              </div>
            }
          </div>
        </section>

        @if (coordinateMaps().length > 0) {
          <section class="semantic-relative-section" [attr.aria-label]="i18n.t('dashboard.semantic.coordinates')">
            <header class="semantic-relative-heading">
              <div>
                <p class="semantic-kicker">{{ i18n.t('dashboard.semantic.coordinates') }}</p>
                <h4>{{ text('Cuatro comparaciones rápidas', 'Four quick comparisons') }}</h4>
                <p>{{ text(
                  'Los marcadores amplifican ligeramente las diferencias para que una inclinación real sea visible sin convertir cada pequeña variación en un extremo.',
                  'Markers gently amplify differences so a real lean is visible without turning every small variation into an extreme.'
                ) }}</p>
              </div>
            </header>

            <div class="semantic-relative-groups">
              @for (entry of coordinateMaps(); track entry.map.id) {
                <article class="semantic-relative-group">
                  <header>
                    <strong>{{ coordinateMapLabel(entry) }}</strong>
                    <small>{{ evidenceLabel(entry.evidenceCount) }}</small>
                  </header>
                  <div class="semantic-relative-grid">
                    <div class="semantic-relative-axis">
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
                    </div>

                    <div class="semantic-relative-axis">
                      <div class="semantic-relative-labels" aria-hidden="true">
                        <strong>{{ axisLabel(entry.map.y, 'low') }}</strong>
                        <span>{{ i18n.t('dashboard.semantic.coordinatesCenter') }}</span>
                        <strong>{{ axisLabel(entry.map.y, 'high') }}</strong>
                      </div>
                      <div class="semantic-relative-rail semantic-relative-rail-secondary" role="img" [attr.aria-label]="relativeAxisAriaLabel(entry.y, entry.map.y)">
                        <span class="semantic-relative-midline" aria-hidden="true"></span>
                        <span class="semantic-relative-marker semantic-relative-marker-secondary" [style.left.%]="coordinateLeft(entry.y)" aria-hidden="true"></span>
                      </div>
                      <small>{{ relativeDiagnosis(entry.y, entry.map.y) }}</small>
                    </div>
                  </div>
                </article>
              }
            </div>
          </section>

          <section class="semantic-coordinate-section" [attr.aria-label]="text('Mapas de coordenadas', 'Coordinate maps')">
            <div class="semantic-panel-kicker">
              <div>
                <p class="semantic-kicker">{{ text('Mapas de coordenadas', 'Coordinate maps') }}</p>
                <strong>{{ text('Una lectura visual de cómo se combinan dos tendencias a la vez', 'A visual reading of how two tendencies combine at once') }}</strong>
              </div>
            </div>

            <div class="semantic-coordinate-grid">
              @for (entry of coordinateMaps(); track entry.map.id) {
                <article class="semantic-coordinate-card">
                  <header>
                    <strong>{{ coordinateMapLabel(entry) }}</strong>
                    <small>{{ evidenceLabel(entry.evidenceCount) }}</small>
                  </header>
                  <div class="semantic-coordinate-plane" role="img" [attr.aria-label]="coordinateMapAriaLabel(entry)">
                    <span class="semantic-coordinate-axis axis-x" aria-hidden="true"></span>
                    <span class="semantic-coordinate-axis axis-y" aria-hidden="true"></span>
                    <span class="coordinate-label label-left">{{ axisLabel(entry.map.x, 'low') }}</span>
                    <span class="coordinate-label label-right">{{ axisLabel(entry.map.x, 'high') }}</span>
                    <span class="coordinate-label label-top">{{ axisLabel(entry.map.y, 'high') }}</span>
                    <span class="coordinate-label label-bottom">{{ axisLabel(entry.map.y, 'low') }}</span>
                    <span
                      class="semantic-coordinate-marker"
                      [style.left.%]="coordinateLeft(entry.x)"
                      [style.top.%]="coordinateTop(entry.y)"
                      aria-hidden="true"
                    ></span>
                  </div>
                </article>
              }
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
    .semantic-relative-section,
    .semantic-coordinate-section {
      min-width: 0;
      padding: 0.9rem;
      border: 1px solid color-mix(in srgb, var(--border-subtle) 74%, transparent);
      border-radius: 0.78rem;
      background: linear-gradient(145deg, rgba(15, 33, 69, 0.48), rgba(38, 24, 63, 0.36));
    }
    .semantic-highlight-panel,
    .semantic-relative-section,
    .semantic-coordinate-section { margin-top: 0.8rem; }
    .semantic-panel-kicker { margin-bottom: 0.6rem; }
    .semantic-panel-kicker > div { display: grid; gap: 0.12rem; }
    .semantic-panel-kicker strong,
    .semantic-relative-heading > small { color: var(--text-secondary); font-size: 0.62rem; font-weight: 620; }
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
    .semantic-scale-bands {
      display: grid;
      grid-template-columns: repeat(5, minmax(0, 1fr));
      gap: 0.2rem;
      margin: 0 0.15rem 0.48rem;
    }
    .semantic-scale-bands span { display: grid; gap: 0.02rem; min-width: 0; text-align: center; }
    .semantic-scale-bands strong { color: color-mix(in srgb, var(--text-secondary) 86%, white); font-size: 0.52rem; }
    .semantic-scale-bands small { color: var(--text-secondary); font-size: 0.48rem; line-height: 1.15; }
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
    .semantic-relative-axis small,
    .semantic-coordinate-card small { color: var(--text-secondary); font-size: 0.6rem; line-height: 1.35; }
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
        rgba(28, 43, 76, 0.62) 0% 20%,
        rgba(41, 48, 87, 0.62) 20% 40%,
        rgba(49, 44, 91, 0.62) 40% 60%,
        color-mix(in srgb, var(--semantic-accent) 18%, rgba(48, 40, 83, 0.64)) 60% 80%,
        color-mix(in srgb, var(--semantic-accent) 32%, rgba(39, 47, 79, 0.66)) 80% 100%);
      box-shadow: inset 0 1px 2px rgba(2, 7, 22, 0.28);
    }
    .semantic-threshold { position: absolute; top: -0.12rem; bottom: -0.12rem; width: 1px; background: rgba(190, 205, 235, 0.18); }
    .threshold-20 { left: 20%; } .threshold-40 { left: 40%; } .threshold-60 { left: 60%; } .threshold-80 { left: 80%; }
    .semantic-spectrum-marker,
    .semantic-relative-marker,
    .semantic-coordinate-marker {
      position: absolute;
      z-index: 2;
      width: 0.76rem;
      height: 0.76rem;
      transform: translate(-50%, -50%) rotate(45deg);
      border: 2px solid #f5f2ff;
      border-radius: 0.13rem;
      background: var(--semantic-accent, var(--neon-violet));
      box-shadow: 0 0 0.55rem color-mix(in srgb, var(--semantic-accent, var(--neon-violet)) 52%, transparent);
    }
    .semantic-spectrum-marker { top: 50%; }

    .semantic-relative-section { background: linear-gradient(155deg, rgba(13, 31, 65, 0.58), rgba(34, 23, 62, 0.46)); }
    .semantic-relative-heading { margin-bottom: 0.72rem; }
    .semantic-relative-heading > div { display: grid; gap: 0.14rem; }
    .semantic-relative-heading h4 { margin: 0; font-size: 0.86rem; }
    .semantic-relative-heading p:last-child { max-width: 54rem; margin: 0; color: var(--text-secondary); font-size: 0.62rem; line-height: 1.42; }
    .semantic-relative-groups { display: grid; gap: 0.68rem; }
    .semantic-relative-group {
      display: grid;
      gap: 0.55rem;
      padding: 0.68rem;
      border: 1px solid color-mix(in srgb, var(--border-subtle) 58%, transparent);
      border-radius: 0.62rem;
      background: rgba(11, 25, 54, 0.34);
    }
    .semantic-relative-group > header,
    .semantic-coordinate-card > header { display: flex; justify-content: space-between; align-items: baseline; gap: 0.6rem; }
    .semantic-relative-group > header strong,
    .semantic-coordinate-card > header strong { font-size: 0.7rem; }
    .semantic-relative-group > header small { color: var(--text-secondary); font-size: 0.56rem; }
    .semantic-relative-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.65rem; }
    .semantic-relative-axis { display: grid; gap: 0.34rem; min-width: 0; }
    .semantic-relative-labels { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.35rem; align-items: end; }
    .semantic-relative-labels strong { font-size: 0.58rem; line-height: 1.22; }
    .semantic-relative-labels span { color: var(--text-secondary); font-size: 0.5rem; text-align: center; }
    .semantic-relative-labels strong:last-child { text-align: right; }
    .semantic-relative-rail {
      position: relative;
      height: 0.72rem;
      margin: 0.12rem 0.1rem;
      border: 1px solid color-mix(in srgb, var(--border-subtle) 66%, transparent);
      border-radius: 0.25rem;
      background: linear-gradient(90deg, rgba(49, 116, 166, 0.32), rgba(45, 38, 86, 0.58) 50%, rgba(159, 71, 179, 0.3));
      box-shadow: inset 0 1px 3px rgba(2, 7, 22, 0.3);
    }
    .semantic-relative-rail-secondary { background: linear-gradient(90deg, rgba(72, 161, 142, 0.28), rgba(45, 38, 86, 0.58) 50%, rgba(218, 85, 132, 0.27)); }
    .semantic-relative-midline { position: absolute; top: -0.18rem; bottom: -0.18rem; left: 50%; width: 1px; background: color-mix(in srgb, var(--border-strong) 46%, transparent); }
    .semantic-relative-marker { top: 50%; --semantic-accent: var(--neon-violet); width: 0.84rem; height: 0.84rem; background: linear-gradient(135deg, var(--neon-cyan), var(--neon-violet) 58%, var(--neon-magenta)); }
    .semantic-relative-marker-secondary { background: linear-gradient(135deg, var(--preference-positive), var(--neon-violet), var(--preference-boundary)); }
    .semantic-relative-axis small { justify-self: center; color: color-mix(in srgb, var(--text-secondary) 82%, white); font-weight: 680; text-align: center; }

    .semantic-coordinate-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0.68rem; }
    .semantic-coordinate-card { display: grid; gap: 0.48rem; min-width: 0; }
    .semantic-coordinate-plane {
      position: relative;
      min-height: 12rem;
      overflow: hidden;
      border: 1px solid color-mix(in srgb, var(--border-subtle) 66%, transparent);
      border-radius: 0.62rem;
      background:
        linear-gradient(90deg, transparent 24.8%, rgba(130, 150, 205, 0.05) 25%, transparent 25.2%, transparent 74.8%, rgba(130, 150, 205, 0.05) 75%, transparent 75.2%),
        linear-gradient(0deg, transparent 24.8%, rgba(130, 150, 205, 0.05) 25%, transparent 25.2%, transparent 74.8%, rgba(130, 150, 205, 0.05) 75%, transparent 75.2%),
        linear-gradient(145deg, rgba(10, 23, 52, 0.78), rgba(31, 20, 54, 0.7));
    }
    .semantic-coordinate-axis { position: absolute; background: color-mix(in srgb, var(--neon-violet) 40%, var(--border-strong)); }
    .axis-x { left: 8%; right: 8%; top: 50%; height: 1px; }
    .axis-y { top: 10%; bottom: 10%; left: 50%; width: 1px; }
    .coordinate-label { position: absolute; z-index: 1; padding: 0.12rem 0.24rem; background: rgba(8, 16, 36, 0.76); color: color-mix(in srgb, var(--text-secondary) 88%, white); font-size: 0.5rem; font-weight: 700; line-height: 1.15; }
    .label-left { left: 0.25rem; top: 50%; transform: translateY(-50%); }
    .label-right { right: 0.25rem; top: 50%; transform: translateY(-50%); text-align: right; }
    .label-top { top: 0.25rem; left: 50%; transform: translateX(-50%); text-align: center; }
    .label-bottom { bottom: 0.25rem; left: 50%; transform: translateX(-50%); text-align: center; }
    .semantic-coordinate-marker { --semantic-accent: var(--neon-violet); width: 0.9rem; height: 0.9rem; background: linear-gradient(135deg, var(--neon-cyan), var(--neon-violet) 55%, var(--neon-magenta)); }

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
      .semantic-theme-list,
      .semantic-relative-grid,
      .semantic-coordinate-grid { grid-template-columns: 1fr; }
      .semantic-highlight-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @media (max-width: 620px) {
      .semantic-theme-panel,
      .semantic-highlight-panel,
      .semantic-relative-section,
      .semantic-coordinate-section { padding: 0.72rem; }
      .semantic-theme-heading small { display: none; }
      .semantic-theme-heading { gap: 0.45rem; }
      .semantic-theme-heading > span { font-size: 0.62rem; }
      .semantic-scale-bands strong { font-size: 0.48rem; }
      .semantic-scale-bands small { font-size: 0.44rem; }
      .semantic-coordinate-plane { min-height: 11rem; }
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
    buildSemanticCoordinateMaps(this.insights()).filter((entry) => entry.evidenceCount >= 3),
  );
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
    if (score < 20) return this.text('Afinidad muy baja', 'Very low affinity');
    if (score < 40) return this.text('Afinidad baja', 'Low affinity');
    if (score < 60) return this.text('Afinidad moderada', 'Moderate affinity');
    if (score < 80) return this.text('Afinidad alta', 'High affinity');
    return this.text('Afinidad muy alta', 'Very high affinity');
  }

  affinityDiagnosis(score: number): string {
    if (score < 15) return this.text('Sin afinidad apreciable', 'No meaningful affinity');
    if (score < 25) return this.text('Interés muy leve', 'Very slight interest');
    if (score < 35) return this.text('Interés leve', 'Slight interest');
    if (score < 45) return this.text('Te genera curiosidad', 'It sparks curiosity');
    if (score < 55) return this.text('Curiosidad marcada', 'Marked curiosity');
    if (score < 65) return this.text('Te atrae moderadamente', 'Moderate attraction');
    if (score < 75) return this.text('Te gusta', 'You like it');
    if (score < 85) return this.text('Te gusta bastante', 'You like it quite a lot');
    if (score < 95) return this.text('Preferencia fuerte', 'Strong preference');
    return this.text('Preferencia muy marcada', 'Very strong preference');
  }

  scorePosition(score: number): number {
    return Math.max(3, Math.min(97, score));
  }

  coordinateLeft(value: number): number {
    return Math.max(5, Math.min(95, 50 + this.sensitiveBalance(value) * 0.45));
  }

  coordinateTop(value: number): number {
    return Math.max(5, Math.min(95, 50 - this.sensitiveBalance(value) * 0.45));
  }

  relativeDiagnosis(value: number, axis: SemanticAxisDefinition): string {
    const sensitive = this.sensitiveBalance(value);
    const magnitude = Math.abs(sensitive);
    if (magnitude < 7) return this.text('Muy equilibrado entre ambos lados', 'Very balanced between both sides');
    const target = this.axisLabel(axis, sensitive < 0 ? 'low' : 'high');
    if (magnitude < 22) return this.text(`Ligera inclinación hacia ${target}`, `Slight lean toward ${target}`);
    if (magnitude < 45) return this.text(`Tendencia hacia ${target}`, `Tendency toward ${target}`);
    return this.text(`Tendencia clara hacia ${target}`, `Clear tendency toward ${target}`);
  }

  themeAriaLabel(entry: SemanticThemeEntry): string {
    if (entry.evidenceCount === 0) return `${this.themeLabel(entry)} · ${this.text('sin datos', 'no data')}`;
    return `${this.themeLabel(entry)} · ${this.text('afinidad', 'affinity')} ${entry.score} / 100 · ${this.evidenceLabel(entry.evidenceCount)}`;
  }

  relativeAxisAriaLabel(value: number, axis: SemanticAxisDefinition): string {
    return `${this.axisLabel(axis, 'low')} ↔ ${this.axisLabel(axis, 'high')}: ${this.sensitiveBalance(value)}`;
  }

  coordinateMapAriaLabel(entry: SemanticCoordinateMapEntry): string {
    return `${this.coordinateMapLabel(entry)} · ${this.axisLabel(entry.map.x, 'low')} ↔ ${this.axisLabel(entry.map.x, 'high')}: ${this.sensitiveBalance(entry.x)}; ${this.axisLabel(entry.map.y, 'low')} ↔ ${this.axisLabel(entry.map.y, 'high')}: ${this.sensitiveBalance(entry.y)}`;
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

  private sensitiveBalance(value: number): number {
    return Math.max(-100, Math.min(100, Math.round(value * 2.4)));
  }
}
