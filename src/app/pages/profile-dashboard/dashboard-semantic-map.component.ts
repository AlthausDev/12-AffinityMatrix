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
          <div class="semantic-panel-kicker semantic-dimension-heading">
            <div>
              <p class="semantic-kicker">{{ i18n.t('dashboard.semantic.themes') }}</p>
              <strong>{{ i18n.t('dashboard.semantic.inventory', { dimensions: themes().length, tags: semanticTagCount() }) }}</strong>
            </div>
            <small class="semantic-scale-inline-note">{{ text(
              '0% = sin afinidad positiva · Depende ≈ 38 · Curiosidad = 50 · Me gusta ≈ 78 · 100% = Favorito. Responder más añade evidencia, no hace subir el porcentaje.',
              '0% = no positive affinity · Depends ≈ 38 · Curious = 50 · Like ≈ 78 · 100% = Favorite. More answers add evidence; they do not make the percentage rise.'
            ) }}</small>
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

                <div class="semantic-spectrum-endpoints" aria-hidden="true">
                  <span><b>0%</b> {{ text('Sin afinidad', 'No affinity') }}</span>
                  <span><b>100%</b> {{ text('Favorito', 'Favorite') }}</span>
                </div>
                <div class="semantic-spectrum" role="img" [attr.aria-label]="themeAriaLabel(entry)">
                  <span class="semantic-threshold threshold-depends" aria-hidden="true"></span>
                  <span class="semantic-threshold threshold-curious" aria-hidden="true"></span>
                  <span class="semantic-threshold threshold-like" aria-hidden="true"></span>
                  @if (entry.evidenceCount > 0) {
                    <span class="semantic-spectrum-marker" [style.left.%]="scorePosition(entry.score)" aria-hidden="true"></span>
                  }
                </div>

                <div class="semantic-theme-footer">
                  <small>{{ entry.evidenceCount > 0 ? evidenceLabel(entry.evidenceCount) : text('Aún no has respondido prácticas de esta dimensión', 'You have not answered practices in this dimension yet') }}</small>
                  @if (entry.evidenceCount > 0) {
                    <small>{{ dimensionContext(entry.score) }}</small>
                  }
                </div>
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
                  'Cada eje compara el peso relativo de dos tendencias que pueden gustarte a la vez; el centro sólo significa que ambas pesan parecido.',
                  'Each axis compares the relative weight of two tendencies that can both appeal to you; the center only means they carry similar weight.'
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
                <strong>{{ text('Dos fotografías rápidas del estilo que dibujan tus respuestas', 'Two quick snapshots of the style drawn by your answers') }}</strong>
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
  styles: `:host { display: block; min-width: 0; }`,
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
    if (score < 15) return this.text('Prácticamente nula', 'Almost none');
    if (score < 32) return this.text('Afinidad baja', 'Low affinity');
    if (score < 44) return this.text('Condicional', 'Conditional');
    if (score < 58) return this.text('Curiosidad / interés mixto', 'Curiosity / mixed interest');
    if (score < 70) return this.text('Interés positivo', 'Positive interest');
    if (score < 88) return this.text('Te gusta', 'You like it');
    return this.text('Preferencia muy marcada', 'Very strong preference');
  }

  dimensionContext(score: number): string {
    if (score < 15) return this.text('Muy cerca de «no me interesa».', 'Very close to “not interested”.');
    if (score < 32) return this.text('Predominan respuestas de poco interés.', 'Low-interest answers predominate.');
    if (score < 44) return this.text('Se parece más a «depende» que a una preferencia estable.', 'Closer to “depends” than to a stable preference.');
    if (score < 58) return this.text('Zona de curiosidad: interés real, todavía mixto.', 'Curiosity zone: real but still mixed interest.');
    if (score < 70) return this.text('Hay una inclinación positiva clara.', 'There is a clear positive lean.');
    if (score < 88) return this.text('Está cerca de «me gusta».', 'It is close to “like”.');
    return this.text('Se acerca a una preferencia favorita y consistente.', 'It approaches a consistent favorite-level preference.');
  }

  affinityDiagnosis(score: number): string {
    if (score < 10) return this.text('No aparece afinidad', 'No affinity showing');
    if (score < 22) return this.text('Interés muy bajo', 'Very low interest');
    if (score < 32) return this.text('Interés leve', 'Slight interest');
    if (score < 42) return this.text('Depende bastante', 'Quite conditional');
    if (score < 50) return this.text('Te genera curiosidad', 'It sparks curiosity');
    if (score < 58) return this.text('Curiosidad marcada', 'Marked curiosity');
    if (score < 68) return this.text('Te atrae moderadamente', 'Moderate attraction');
    if (score < 76) return this.text('Te gusta ligeramente', 'You like it slightly');
    if (score < 84) return this.text('Te gusta', 'You like it');
    if (score < 92) return this.text('Te gusta mucho', 'You like it a lot');
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
