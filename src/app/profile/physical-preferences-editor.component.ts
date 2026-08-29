import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import {
  PHYSICAL_ATTRACTION_MAX_SCORE,
  PHYSICAL_ATTRACTION_MIN_SCORE,
  PHYSICAL_ATTRACTION_NEUTRAL_SCORE,
  PhysicalPreferences,
  normalizePhysicalPreferences,
} from '../../domain/profile/physical-preferences';
import { Sex, SexualOrientation } from '../../domain/profile/profile-metadata';
import { TranslationService } from '../i18n/translation.service';
import { physicalPreferenceGroupsFor } from './physical-preferences.config';

@Component({
  selector: 'app-physical-preferences-editor',
  template: `
    <details class="physical-preferences" [attr.data-has-values]="hasValues()">
      <summary>
        <span>
          <span class="physical-preferences-eyebrow">{{ text('Physical attraction', 'Atracción física') }}</span>
          <strong>{{ text('Physical preferences', 'Preferencias físicas') }}</strong>
          <small>{{ text('Optional · you can complete or change this later', 'Opcional · puedes completarlo o cambiarlo más tarde') }}</small>
        </span>
        @if (ratedCount() > 0) {
          <span class="physical-preferences-count">{{ ratedCount() }}</span>
        }
        <span class="physical-preferences-chevron" aria-hidden="true">⌄</span>
      </summary>

      <div class="physical-preferences-body">
        <p class="physical-preferences-intro">
          {{ text(
            'Rate each trait independently from 0 to 10. Leaving a value unrated is different from giving it a neutral 5.',
            'Valora cada rasgo de forma independiente de 0 a 10. Dejar un valor sin puntuar es distinto de darle un 5 neutral.'
          ) }}
        </p>

        <div class="physical-preference-groups">
          @for (group of groups(); track group.id) {
            <section class="physical-preference-group">
              <header>
                <h3>{{ localized(group.en, group.es) }}</h3>
                <p>{{ localized(group.descriptionEn, group.descriptionEs) }}</p>
              </header>

              <div class="physical-preference-options">
                @for (option of group.options; track option.id) {
                  <div class="physical-preference-option" [class.is-unrated]="score(group.id, option.id) === undefined">
                    <div class="physical-preference-option-heading">
                      <label [for]="controlId(group.id, option.id)">{{ localized(option.en, option.es) }}</label>
                      <div class="physical-preference-value">
                        <strong>{{ score(group.id, option.id) ?? '—' }}</strong>
                        @if (score(group.id, option.id) !== undefined) {
                          <button
                            type="button"
                            class="physical-preference-clear"
                            (click)="clearScore(group.id, option.id)"
                            [attr.aria-label]="text('Clear rating for ', 'Borrar valoración de ') + localized(option.en, option.es)"
                          >×</button>
                        }
                      </div>
                    </div>
                    <input
                      [id]="controlId(group.id, option.id)"
                      type="range"
                      [min]="minScore"
                      [max]="maxScore"
                      step="1"
                      [value]="score(group.id, option.id) ?? neutralScore"
                      [attr.aria-valuetext]="scoreAriaText(group.id, option.id)"
                      (input)="setScore(group.id, option.id, $event)"
                    />
                  </div>
                }
              </div>
            </section>
          }
        </div>

        <div class="physical-preference-scale-legend" aria-hidden="true">
          <span><strong>0</strong> {{ text('Not attractive', 'No me atrae') }}</span>
          <span><strong>5</strong> {{ text('Neutral', 'Neutral') }}</span>
          <span><strong>10</strong> {{ text('Very attractive', 'Me atrae mucho') }}</span>
        </div>
      </div>
    </details>
  `,
  styles: `
    .physical-preferences {
      overflow: clip;
      border: 1px solid color-mix(in srgb, var(--border-strong) 60%, var(--neon-violet));
      border-radius: 0.9rem;
      background: linear-gradient(145deg, rgba(17, 43, 81, 0.72), rgba(58, 31, 84, 0.72));
      box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
    }
    summary {
      position: relative;
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto auto;
      align-items: center;
      gap: 0.7rem;
      min-height: 4.7rem;
      padding: 0.9rem 1rem;
      cursor: pointer;
      list-style: none;
    }
    summary::-webkit-details-marker { display: none; }
    summary > span:first-child { display: grid; gap: 0.15rem; min-width: 0; }
    summary strong { color: var(--text-primary); font-size: 1rem; }
    summary small { color: var(--text-secondary); font-size: 0.74rem; line-height: 1.35; }
    .physical-preferences-eyebrow {
      color: color-mix(in srgb, var(--text-secondary) 78%, var(--neon-cyan));
      font-size: 0.62rem;
      font-weight: 750;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .physical-preferences-count {
      min-width: 2rem;
      padding: 0.24rem 0.48rem;
      border: 1px solid color-mix(in srgb, var(--neon-cyan) 34%, var(--border-strong));
      border-radius: 0.5rem;
      color: var(--text-secondary);
      font-size: 0.72rem;
      font-variant-numeric: tabular-nums;
      text-align: center;
    }
    .physical-preferences-chevron { color: var(--text-secondary); transition: transform 160ms ease; }
    details[open] .physical-preferences-chevron { transform: rotate(180deg); }
    .physical-preferences-body {
      padding: 0 1rem 1rem;
      border-top: 1px solid color-mix(in srgb, var(--border-subtle) 76%, transparent);
    }
    .physical-preferences-intro {
      max-width: 52rem;
      margin: 0.9rem 0 1rem;
      color: var(--text-secondary);
      font-size: 0.82rem;
      line-height: 1.5;
    }
    .physical-preference-groups { display: grid; gap: 0.8rem; }
    .physical-preference-group {
      padding: 0.85rem;
      border: 1px solid color-mix(in srgb, var(--border-subtle) 86%, var(--neon-violet));
      border-radius: 0.72rem;
      background: rgba(11, 29, 57, 0.48);
    }
    .physical-preference-group header { margin-bottom: 0.7rem; }
    .physical-preference-group h3 { margin: 0 0 0.2rem; color: var(--text-primary); font-size: 0.98rem; }
    .physical-preference-group p { margin: 0; color: var(--text-secondary); font-size: 0.75rem; line-height: 1.4; }
    .physical-preference-options { display: grid; gap: 0.55rem; }
    .physical-preference-option { display: grid; gap: 0.3rem; }
    .physical-preference-option-heading { display: flex; align-items: center; justify-content: space-between; gap: 0.7rem; }
    .physical-preference-option label { color: var(--text-primary); font-size: 0.78rem; font-weight: 650; }
    .physical-preference-value { display: flex; align-items: center; gap: 0.3rem; min-width: 2.9rem; justify-content: flex-end; }
    .physical-preference-value strong { min-width: 1.25rem; color: color-mix(in srgb, var(--text-primary) 90%, var(--neon-cyan)); font-size: 0.78rem; text-align: right; }
    .physical-preference-clear {
      width: 1.35rem; height: 1.35rem; padding: 0; border: 0; border-radius: 0.35rem;
      background: transparent; color: var(--text-secondary); cursor: pointer; line-height: 1;
    }
    input[type='range'] { width: 100%; accent-color: var(--neon-violet); cursor: pointer; }
    .is-unrated input[type='range'] { opacity: 0.36; }
    .is-unrated .physical-preference-value strong { color: var(--text-secondary); }
    .physical-preference-scale-legend {
      display: flex;
      justify-content: space-between;
      gap: 0.7rem;
      margin-top: 0.85rem;
      color: var(--text-secondary);
      font-size: 0.66rem;
    }
    .physical-preference-scale-legend strong { color: var(--text-primary); }
    @media (prefers-reduced-motion: reduce) { .physical-preferences-chevron { transition: none; } }
    @media (max-width: 640px) {
      summary { min-height: 4.5rem; padding: 0.82rem 0.85rem; }
      .physical-preferences-body { padding: 0 0.7rem 0.75rem; }
      .physical-preference-group { padding: 0.72rem; }
      .physical-preference-scale-legend { font-size: 0.6rem; }
      .physical-preference-scale-legend span:nth-child(2) { text-align: center; }
      .physical-preference-scale-legend span:last-child { text-align: right; }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PhysicalPreferencesEditorComponent {
  readonly i18n = inject(TranslationService);
  readonly value = input<PhysicalPreferences>({});
  readonly sex = input<Sex | '' | undefined>();
  readonly orientation = input<SexualOrientation | '' | undefined>();
  readonly valueChange = output<PhysicalPreferences>();

  readonly minScore = PHYSICAL_ATTRACTION_MIN_SCORE;
  readonly maxScore = PHYSICAL_ATTRACTION_MAX_SCORE;
  readonly neutralScore = PHYSICAL_ATTRACTION_NEUTRAL_SCORE;
  readonly groups = computed(() => physicalPreferenceGroupsFor(this.sex(), this.orientation()));
  readonly ratedCount = computed(() =>
    Object.values(this.value()).reduce((sum, scores) => sum + Object.keys(scores).length, 0),
  );
  readonly hasValues = computed(() => this.ratedCount() > 0);

  localized(en: string, es: string): string {
    return this.i18n.locale() === 'es' ? es : en;
  }

  text(en: string, es: string): string {
    return this.localized(en, es);
  }

  score(groupId: string, optionId: string): number | undefined {
    return this.value()[groupId]?.[optionId];
  }

  controlId(groupId: string, optionId: string): string {
    return `physical-preference-${groupId}-${optionId}`;
  }

  setScore(groupId: string, optionId: string, event: Event): void {
    const score = Number((event.target as HTMLInputElement).value);
    const current = this.value();
    this.valueChange.emit(normalizePhysicalPreferences({
      ...current,
      [groupId]: {
        ...(current[groupId] ?? {}),
        [optionId]: score,
      },
    }));
  }

  clearScore(groupId: string, optionId: string): void {
    const current = this.value();
    const group = { ...(current[groupId] ?? {}) };
    delete group[optionId];
    const next = { ...current, [groupId]: group };
    this.valueChange.emit(normalizePhysicalPreferences(next));
  }

  scoreAriaText(groupId: string, optionId: string): string {
    const score = this.score(groupId, optionId);
    if (score === undefined) return this.text('Not rated', 'Sin valorar');
    return `${score} / ${this.maxScore}`;
  }
}
