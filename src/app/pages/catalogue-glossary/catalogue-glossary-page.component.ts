import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  CatalogueGlossaryCategory,
  LocalizedCatalogueGlossaryEntry,
  localizedCatalogueGlossary,
} from '../../i18n/catalogue-glossary';
import { TranslationService } from '../../i18n/translation.service';
import { findRouteParam } from '../../shared/route-param';

interface GlossaryGroup {
  readonly category: CatalogueGlossaryCategory;
  readonly label: string;
  readonly entries: readonly LocalizedCatalogueGlossaryEntry[];
}

const CATEGORY_ORDER: readonly CatalogueGlossaryCategory[] = [
  'anatomy',
  'orgasm-control',
  'groups-non-monogamy',
  'visibility-media',
  'power-service',
  'restraint',
  'psychological',
  'sensation',
  'fluids',
  'roleplay-fantasy',
  'toys-penetration',
  'edge',
];

const CATEGORY_LABELS: Readonly<Record<CatalogueGlossaryCategory, Readonly<{ es: string; en: string }>>> = {
  anatomy: { es: 'Anatomía', en: 'Anatomy' },
  'orgasm-control': { es: 'Orgasmo y control', en: 'Orgasm & control' },
  'groups-non-monogamy': { es: 'Grupos y no monogamia consensuada', en: 'Groups & consensual non-monogamy' },
  'visibility-media': { es: 'Visibilidad y contenido', en: 'Visibility & media' },
  'power-service': { es: 'Poder, BDSM y servicio', en: 'Power, BDSM & service' },
  restraint: { es: 'Restricción', en: 'Restraint' },
  psychological: { es: 'Juego psicológico', en: 'Psychological play' },
  sensation: { es: 'Sensaciones', en: 'Sensation' },
  fluids: { es: 'Fluidos y sustancias', en: 'Fluids & substances' },
  'roleplay-fantasy': { es: 'Roleplay y fantasía', en: 'Roleplay & fantasy' },
  'toys-penetration': { es: 'Juguetes y penetración', en: 'Toys & penetration' },
  edge: { es: 'Edge', en: 'Edge' },
};

@Component({
  selector: 'app-catalogue-glossary-page',
  imports: [RouterLink],
  template: `
    <main class="page glossary-page">
      <nav class="glossary-topbar" [attr.aria-label]="text('Navegación del glosario', 'Glossary navigation')">
        <a class="back-link glossary-profile-link" [routerLink]="['/profiles', profileId]">
          <span aria-hidden="true">←</span>
          <span>{{ text('Perfil', 'Profile') }}</span>
        </a>
      </nav>

      <header class="page-header glossary-header">
        <div>
          <p class="eyebrow">{{ text('Referencia', 'Reference') }}</p>
          <h1>{{ text('Glosario', 'Glossary') }}</h1>
          <p class="muted lead">
            {{ text(
              'Definiciones breves de los términos que aparecen en DesireSync. El glosario explica conceptos, no sustituye consentimiento, comunicación ni criterios de seguridad.',
              'Short definitions for terms used throughout DesireSync. The glossary explains concepts; it does not replace consent, communication or safety judgement.'
            ) }}
          </p>
        </div>

        <label class="glossary-search">
          <span>{{ text('Buscar término', 'Search terms') }}</span>
          <span class="glossary-search-field">
            <svg class="glossary-search-icon" viewBox="0 0 24 24" aria-hidden="true">
              <path d="m20 20-4.4-4.4M10.8 18a7.2 7.2 0 1 1 0-14.4 7.2 7.2 0 0 1 0 14.4Z" />
            </svg>
            <input
              type="search"
              [placeholder]="text('Nombre, alias o definición…', 'Name, alias or definition…')"
              [value]="query()"
              (input)="setQuery($event)"
            />
            @if (query()) {
              <button
                class="glossary-search-clear"
                type="button"
                [attr.aria-label]="text('Borrar búsqueda', 'Clear search')"
                (click)="clearQuery()"
              >
                <span aria-hidden="true">×</span>
              </button>
            }
          </span>
        </label>
      </header>

      @if (groups().length > 0) {
        <div class="glossary-groups">
          @for (group of groups(); track group.category) {
            <section class="panel glossary-group" [attr.aria-labelledby]="'glossary-group-' + group.category">
              <header class="glossary-group-heading">
                <h2 [id]="'glossary-group-' + group.category">{{ group.label }}</h2>
                <span>{{ group.entries.length }}</span>
              </header>

              <dl class="glossary-entry-list">
                @for (entry of group.entries; track entry.id) {
                  <div class="glossary-entry" [id]="'term-' + entry.id">
                    <dt>{{ entry.title }}</dt>
                    <dd>{{ entry.definition }}</dd>
                  </div>
                }
              </dl>
            </section>
          }
        </div>
      } @else {
        <section class="panel glossary-empty" role="status">
          <h2>{{ text('Sin resultados', 'No results') }}</h2>
          <p class="muted">{{ text('Prueba con otro término o borra la búsqueda.', 'Try another term or clear the search.') }}</p>
        </section>
      }
    </main>
  `,
  styles: `
    .glossary-page { width: min(100% - 2rem, 72rem); }
    .glossary-topbar {
      position: sticky;
      z-index: 12;
      top: max(0.65rem, env(safe-area-inset-top));
      display: flex;
      width: max-content;
      justify-content: flex-start;
      margin-bottom: 1.2rem;
    }
    .glossary-profile-link {
      display: inline-flex;
      min-height: 2.45rem;
      align-items: center;
      gap: 0.42rem;
      margin: 0;
      padding: 0.42rem 0.72rem;
      border: 1px solid color-mix(in srgb, var(--neon-violet) 26%, var(--border-subtle));
      border-radius: 0.58rem;
      background: linear-gradient(145deg, rgba(13, 28, 58, 0.88), rgba(34, 22, 61, 0.86));
      box-shadow: 0 0.45rem 1.2rem rgba(2, 7, 22, 0.2);
      color: color-mix(in srgb, var(--text-secondary) 90%, white);
      font-size: 0.75rem;
      font-weight: 760;
      backdrop-filter: blur(14px) saturate(120%);
      transition: border-color 150ms ease, color 150ms ease, transform 150ms ease, box-shadow 150ms ease;
    }
    .glossary-profile-link:hover {
      transform: translateY(-1px);
      border-color: color-mix(in srgb, var(--neon-cyan) 48%, var(--neon-violet));
      box-shadow: 0 0.55rem 1.4rem rgba(74, 91, 210, 0.18);
      color: var(--text-primary);
    }
    .glossary-header {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(17rem, 24rem);
      gap: clamp(1.4rem, 4vw, 3rem);
      align-items: end;
    }
    .glossary-header .lead { max-width: 52rem; }
    .glossary-search { display: grid; gap: 0.45rem; }
    .glossary-search > span:first-child {
      color: var(--text-secondary);
      font-size: 0.72rem;
      font-weight: 760;
      letter-spacing: 0.055em;
      text-transform: uppercase;
    }
    .glossary-search-field {
      display: grid;
      min-height: 3rem;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: center;
      gap: 0.45rem;
      padding: 0.28rem 0.34rem 0.28rem 0.78rem;
      border: 1px solid color-mix(in srgb, var(--neon-violet) 30%, var(--border-strong));
      border-radius: 0.68rem;
      background:
        linear-gradient(145deg, rgba(18, 38, 75, 0.76), rgba(40, 24, 68, 0.76)) padding-box,
        linear-gradient(135deg, rgba(54, 186, 255, 0.22), rgba(140, 92, 255, 0.34), rgba(230, 80, 197, 0.18)) border-box;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.055), 0 0.45rem 1.2rem rgba(2, 7, 22, 0.13);
      color: var(--text-secondary);
      transition: border-color 150ms ease, box-shadow 180ms ease, background 180ms ease;
    }
    .glossary-search-field:focus-within {
      border-color: color-mix(in srgb, var(--neon-cyan) 60%, var(--neon-violet));
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.075), 0 0 0.9rem rgba(100, 103, 255, 0.2);
    }
    .glossary-search-icon {
      width: 1.05rem;
      height: 1.05rem;
      fill: none;
      stroke: currentColor;
      stroke-linecap: round;
      stroke-width: 1.7;
    }
    .glossary-search input {
      width: 100%;
      min-width: 0;
      min-height: 2.25rem;
      padding: 0;
      border: 0;
      outline: 0;
      background: transparent;
      color: var(--text-primary);
      font-size: 0.82rem;
    }
    .glossary-search input::placeholder { color: color-mix(in srgb, var(--text-secondary) 62%, transparent); }
    .glossary-search input::-webkit-search-cancel-button { display: none; }
    .glossary-search-clear {
      display: grid;
      width: 2.15rem;
      height: 2.15rem;
      padding: 0;
      border: 1px solid color-mix(in srgb, var(--border-subtle) 72%, transparent);
      border-radius: 0.48rem;
      background: rgba(36, 46, 78, 0.52);
      color: var(--text-secondary);
      cursor: pointer;
      place-items: center;
      font-size: 1.05rem;
      line-height: 1;
      transition: color 140ms ease, border-color 140ms ease, background 140ms ease;
    }
    .glossary-search-clear:hover {
      border-color: color-mix(in srgb, var(--neon-magenta) 38%, var(--border-strong));
      background: rgba(66, 39, 82, 0.66);
      color: var(--text-primary);
    }
    .glossary-groups { display: grid; gap: 1rem; }
    .glossary-group { padding: 1.05rem 1.1rem; }
    .glossary-group-heading {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 1rem;
      padding-bottom: 0.72rem;
      border-bottom: 1px solid var(--border-subtle);
    }
    .glossary-group-heading h2 { margin: 0; font-size: 1.14rem; }
    .glossary-group-heading span {
      color: var(--text-secondary);
      font-size: 0.72rem;
      font-variant-numeric: tabular-nums;
    }
    .glossary-entry-list { display: grid; margin: 0; }
    .glossary-entry {
      display: grid;
      grid-template-columns: minmax(9rem, 0.34fr) minmax(0, 1fr);
      gap: 1.1rem;
      padding: 0.8rem 0.15rem;
      border-bottom: 1px solid color-mix(in srgb, var(--border-subtle) 58%, transparent);
      scroll-margin-top: 4.5rem;
    }
    .glossary-entry:last-child { border-bottom: 0; }
    .glossary-entry dt {
      color: color-mix(in srgb, var(--text-primary) 90%, var(--neon-cyan));
      font-weight: 780;
    }
    .glossary-entry dd { margin: 0; color: var(--text-secondary); line-height: 1.55; }
    .glossary-empty { text-align: center; }
    @media (max-width: 720px) {
      .glossary-page { width: min(100% - 1rem, 72rem); }
      .glossary-header { grid-template-columns: 1fr; gap: 1rem; }
      .glossary-entry { grid-template-columns: 1fr; gap: 0.25rem; }
    }
    @media (prefers-reduced-motion: reduce) {
      .glossary-profile-link,
      .glossary-search-field,
      .glossary-search-clear { transition: none; }
      .glossary-profile-link:hover { transform: none; }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogueGlossaryPageComponent {
  readonly i18n = inject(TranslationService);
  private readonly route = inject(ActivatedRoute);
  readonly profileId = findRouteParam(this.route, 'id') ?? '';
  readonly query = signal('');

  readonly groups = computed<readonly GlossaryGroup[]>(() => {
    const locale = this.i18n.locale();
    const normalizedQuery = this.query().trim().toLocaleLowerCase(locale);
    const entries = localizedCatalogueGlossary(locale).filter((entry) => {
      if (!normalizedQuery) return true;
      const haystack = [entry.title, entry.definition, ...entry.aliases]
        .join(' ')
        .toLocaleLowerCase(locale);
      return haystack.includes(normalizedQuery);
    });

    return CATEGORY_ORDER.flatMap((category): GlossaryGroup[] => {
      const matching = entries.filter((entry) => entry.category === category);
      if (matching.length === 0) return [];
      return [{
        category,
        label: CATEGORY_LABELS[category][locale],
        entries: matching,
      }];
    });
  });

  setQuery(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  clearQuery(): void {
    this.query.set('');
  }

  text(es: string, en: string): string {
    return this.i18n.locale() === 'es' ? es : en;
  }
}
