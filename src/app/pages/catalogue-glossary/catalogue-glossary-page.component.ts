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
        <a class="back-link" [routerLink]="['/profiles', profileId]">{{ text('← Perfil', '← Profile') }}</a>
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
          <input
            type="search"
            [placeholder]="text('Nombre, alias o definición…', 'Name, alias or definition…')"
            [value]="query()"
            (input)="setQuery($event)"
          />
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
    .glossary-topbar { display: flex; justify-content: flex-start; margin-bottom: 1.2rem; }
    .glossary-header {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(17rem, 24rem);
      gap: clamp(1.4rem, 4vw, 3rem);
      align-items: end;
    }
    .glossary-header .lead { max-width: 52rem; }
    .glossary-search { display: grid; gap: 0.45rem; }
    .glossary-search > span {
      color: var(--text-secondary);
      font-size: 0.72rem;
      font-weight: 760;
      letter-spacing: 0.055em;
      text-transform: uppercase;
    }
    .glossary-search input { width: 100%; }
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
      scroll-margin-top: 1rem;
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

  text(es: string, en: string): string {
    return this.i18n.locale() === 'es' ? es : en;
  }
}
