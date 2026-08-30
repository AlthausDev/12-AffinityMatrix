import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  FinalCatalogueGlossaryCategory,
  LocalizedFinalCatalogueGlossaryEntry,
  localizedFinalCatalogueGlossary,
} from '../../i18n/catalogue-glossary-final';
import { TranslationService } from '../../i18n/translation.service';
import { findRouteParam } from '../../shared/route-param';

interface GlossaryGroup {
  readonly category: FinalCatalogueGlossaryCategory;
  readonly label: string;
  readonly entries: readonly LocalizedFinalCatalogueGlossaryEntry[];
}

const CATEGORY_ORDER: readonly FinalCatalogueGlossaryCategory[] = [
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
  'places-settings',
  'toys-penetration',
  'edge',
];

const CATEGORY_LABELS: Readonly<Record<FinalCatalogueGlossaryCategory, Readonly<{ es: string; en: string }>>> = {
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
  'places-settings': { es: 'Lugares y entornos', en: 'Places & settings' },
  'toys-penetration': { es: 'Juguetes y penetración', en: 'Toys & penetration' },
  edge: { es: 'Edge', en: 'Edge' },
};

@Component({
  selector: 'app-catalogue-glossary-page',
  imports: [RouterLink],
  template: `
    <main id="glossary-top" class="page glossary-page">
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

      <button
        class="glossary-scroll-top"
        type="button"
        [attr.aria-label]="text('Volver arriba', 'Back to top')"
        [title]="text('Volver arriba', 'Back to top')"
        (click)="scrollToTop()"
      >
        <span aria-hidden="true">↑</span>
      </button>
    </main>
  `,
  styles: `
    .glossary-page {
      width: min(100% - 2rem, 72rem);
      padding-top: 0.75rem;
      padding-bottom: clamp(2.5rem, 5vw, 4rem);
    }
    .glossary-topbar {
      position: static;
      z-index: 12;
      display: flex;
      width: max-content;
      min-height: 2.35rem;
      justify-content: flex-start;
      margin-bottom: 0.9rem;
    }
    .glossary-profile-link {
      display: inline-flex;
      min-height: 2.35rem;
      align-items: center;
      gap: 0.42rem;
      margin: 0;
      padding: 0.4rem 0.72rem;
      border: 1px solid color-mix(in srgb, var(--neon-cyan) 24%, var(--border-subtle));
      border-radius: 0.65rem;
      background: linear-gradient(145deg, rgba(12, 28, 59, 0.78), rgba(31, 20, 62, 0.78));
      box-shadow: inset 0 1px 0 rgba(255,255,255,.07), 0 .45rem 1.1rem rgba(2,6,22,.14);
      color: color-mix(in srgb, var(--text-secondary) 90%, white);
      font-size: 0.75rem;
      font-weight: 760;
      backdrop-filter: blur(12px) saturate(124%);
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
      margin-bottom: 1.25rem;
    }
    .glossary-header h1 {
      margin-bottom: 0.5rem;
      font-size: clamp(2rem, 4.8vw, 2.85rem);
      letter-spacing: -0.04em;
    }
    .glossary-header .lead { max-width: 52rem; line-height: 1.52; }
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
    .glossary-groups { display: grid; gap: 0.78rem; }
    .glossary-group {
      padding: 0.9rem 1rem;
      border-radius: 0.9rem;
      background:
        linear-gradient(145deg, rgba(15, 33, 69, 0.72), rgba(38, 24, 67, 0.72)) padding-box,
        linear-gradient(135deg, rgba(54,186,255,.38), rgba(65,108,255,.32) 34%, rgba(140,92,255,.4) 68%, rgba(230,80,197,.28)) border-box;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.07), 0 .7rem 1.8rem rgba(2,6,22,.14);
    }
    .glossary-group-heading {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 1rem;
      padding-bottom: 0.62rem;
      border-bottom: 1px solid var(--border-subtle);
    }
    .glossary-group-heading h2 { margin: 0; font-size: 1.08rem; }
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
      padding: 0.72rem 0.15rem;
      border-bottom: 1px solid color-mix(in srgb, var(--border-subtle) 58%, transparent);
      scroll-margin-top: 1rem;
    }
    .glossary-entry:last-child { border-bottom: 0; }
    .glossary-entry dt {
      color: color-mix(in srgb, var(--text-primary) 90%, var(--neon-cyan));
      font-weight: 780;
    }
    .glossary-entry dd { margin: 0; color: var(--text-secondary); line-height: 1.5; }
    .glossary-empty { text-align: center; }
    .glossary-scroll-top { display: none; }

    @media (min-width: 721px) {
      .glossary-scroll-top {
        position: fixed;
        right: clamp(1rem, 2vw, 2rem);
        bottom: 1.25rem;
        z-index: 18;
        display: grid;
        width: 2.8rem;
        aspect-ratio: 1;
        place-items: center;
        padding: 0;
        border: 1px solid color-mix(in srgb, var(--neon-cyan) 24%, var(--border-subtle));
        border-radius: 0.6rem;
        clip-path: polygon(15% 0,85% 0,100% 15%,100% 85%,85% 100%,15% 100%,0 85%,0 15%);
        background: linear-gradient(145deg, rgba(18,42,81,.88), rgba(48,29,79,.9));
        color: var(--text-primary);
        cursor: pointer;
        font-size: 1.1rem;
        font-weight: 800;
        box-shadow: inset 0 1px 0 rgba(255,255,255,.08), 0 .55rem 1.4rem rgba(2,6,22,.24);
        backdrop-filter: blur(12px);
        transition: border-color 140ms ease, transform 140ms ease, box-shadow 140ms ease;
      }
      .glossary-scroll-top:hover {
        border-color: color-mix(in srgb, var(--neon-cyan) 58%, var(--neon-violet));
        transform: translateY(-1px);
        box-shadow: inset 0 1px 0 rgba(255,255,255,.1), 0 .65rem 1.6rem rgba(2,6,22,.3);
      }
    }

    @media (max-width: 720px) {
      .glossary-page {
        width: min(100% - 1rem, 72rem);
        padding-top: 4.9rem;
      }
      .glossary-topbar {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 25;
        width: auto;
        min-height: 4.55rem;
        margin: 0;
        padding: 0.5rem 4.35rem 1.3rem 0.5rem;
        pointer-events: none;
        background:
          radial-gradient(circle at 14% 0%, rgba(38,185,255,.14), transparent 28%),
          linear-gradient(to bottom, rgba(10,32,74,.96), rgba(28,35,94,.82) 36%, rgba(61,34,104,.46) 62%, rgba(68,34,104,.14) 78%, transparent 96%);
      }
      .glossary-profile-link {
        pointer-events: auto;
        backdrop-filter: none;
      }
      .glossary-header {
        grid-template-columns: 1fr;
        gap: 0.9rem;
        margin-bottom: 1rem;
      }
      .glossary-header h1 { font-size: clamp(1.9rem, 10vw, 2.5rem); }
      .glossary-entry {
        grid-template-columns: 1fr;
        gap: 0.25rem;
        scroll-margin-top: 5.1rem;
      }
      .glossary-scroll-top { display: none; }
    }
    @media (prefers-reduced-motion: reduce) {
      .glossary-profile-link,
      .glossary-search-field,
      .glossary-search-clear,
      .glossary-scroll-top { transition: none; }
      .glossary-profile-link:hover,
      .glossary-scroll-top:hover { transform: none; }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogueGlossaryPageComponent {
  readonly i18n = inject(TranslationService);
  private readonly route = inject(ActivatedRoute);
  private readonly document = inject(DOCUMENT);
  readonly profileId = findRouteParam(this.route, 'id') ?? '';
  readonly query = signal('');

  readonly groups = computed<readonly GlossaryGroup[]>(() => {
    const locale = this.i18n.locale();
    const normalizedQuery = this.query().trim().toLocaleLowerCase(locale);
    const entries = localizedFinalCatalogueGlossary(locale).filter((entry) => {
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

  scrollToTop(): void {
    const window = this.document.defaultView;
    if (!window) return;
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
    window.scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' });
  }

  text(es: string, en: string): string {
    return this.i18n.locale() === 'es' ? es : en;
  }
}
