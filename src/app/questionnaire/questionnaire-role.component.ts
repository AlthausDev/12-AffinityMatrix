import { ChangeDetectionStrategy, Component, computed, inject, input, OnDestroy, OnInit, output } from '@angular/core';
import { PracticeRole } from '../../domain/catalogue/practice';
import {
  AnswerDetails,
  AnswerScope,
  DEPENDS_ON_MAX_LENGTH,
  DesiredFrequency,
  ExperienceContext,
  InitiativePreference,
  PracticeAnswer,
  TargetSite,
} from '../../domain/profile/profile-answer';
import { Sex } from '../../domain/profile/profile-metadata';
import { DETAIL_CAPABLE_PREFERENCES, PREFERENCE_VALUES, Preference } from '../../domain/profile/preference';
import { CatalogueTextService } from '../i18n/catalogue-text.service';
import { TranslationService } from '../i18n/translation.service';
import { PREFERENCE_PRESENTATION } from '../shared/comparison-presentation';
import { QuestionnaireCounterpartContextService } from './questionnaire-counterpart-context.service';

const PREFERENCE_OPTIONS = PREFERENCE_VALUES.map((value) => ({
  value,
  ...PREFERENCE_PRESENTATION[value],
}));

@Component({
  selector: 'app-questionnaire-role',
  template: `
    <section class="role-block" [class.filtered-role]="filtered()">
      <div class="role-heading">
        <div>
          @if (headingLevel() === 4) {
            <h4>{{ roleLabel() }}</h4>
          } @else {
            <h3>{{ roleLabel() }}</h3>
          }
          @if (showCounterpartSex()) {
            @if (counterpartSex(); as sex) {
              <p class="scope-note">{{ i18n.t('questionnaireRole.counterpart', { sex: sexLabel(sex) }) }}</p>
            }
          }
          @if (targetSite(); as site) {
            <p class="scope-note">{{ i18n.t('questionnaireRole.targetSite', { site: targetSiteLabel(site) }) }}</p>
          }
          @if (filtered()) {
            <p class="filtered-note">{{ i18n.t('questionnaireRole.filtered') }}</p>
          }
        </div>
        @if (answer()) {
          <button class="text-button" type="button" (click)="clearAnswer()">{{ i18n.t('questionnaireRole.clear') }}</button>
        }
      </div>

      <div class="preference-scale" role="group" [attr.aria-label]="ariaLabel()">
        @for (option of preferenceOptions; track option.value) {
          <button
            type="button"
            class="preference-option"
            [attr.data-tone]="option.tone"
            [attr.title]="i18n.t(option.hintKey)"
            [attr.aria-label]="i18n.t(option.labelKey) + '. ' + i18n.t(option.hintKey)"
            [class.selected]="answer()?.preference === option.value"
            [attr.aria-pressed]="answer()?.preference === option.value"
            (click)="selectPreference(option.value)"
          >
            <span aria-hidden="true">{{ option.symbol }}</span>
            <span>{{ i18n.t(option.labelKey) }}</span>
          </button>
        }
      </div>

      @if (answer(); as currentAnswer) {
        @if (supportsDetails(currentAnswer.preference)) {
          <div class="role-details">
            @if (refinementGroup(); as refinementGroup) {
              <section class="trait-refinements" [attr.aria-label]="refinementGroup.prompt">
                <div class="trait-refinement-copy">
                  <strong>{{ refinementGroup.prompt }}</strong>
                  <small>{{ refinementGroup.hint }}</small>
                </div>
                <div
                  class="trait-refinement-options"
                  role="group"
                  [attr.aria-label]="refinementGroup.prompt + '. ' + refinementGroup.hint"
                >
                  @for (option of refinementGroup.options; track option.id) {
                    <button
                      type="button"
                      class="trait-refinement-option"
                      [class.selected]="isRefinementSelected(option.id)"
                      [attr.aria-pressed]="isRefinementSelected(option.id)"
                      (click)="toggleRefinement(option.id)"
                    >{{ option.label }}</button>
                  }
                </div>
              </section>
            }

            <details class="answer-details">
              <summary>{{ i18n.t('questionnaireRole.optionalDetails') }}</summary>
              <div class="detail-grid">
                <label class="detail-field">
                  <span>{{ i18n.t('questionnaireRole.context') }}</span>
                  <select [value]="currentAnswer.details?.context ?? ''" (change)="updateContext($event)">
                    <option value="">{{ i18n.t('common.notSpecified') }}</option>
                    <option value="fantasy-only">{{ i18n.t('questionnaireRole.context.fantasyOnly') }}</option>
                    <option value="want-to-try">{{ i18n.t('questionnaireRole.context.wantToTry') }}</option>
                    <option value="current">{{ i18n.t('questionnaireRole.context.current') }}</option>
                  </select>
                </label>

                <label class="detail-field">
                  <span>{{ i18n.t('questionnaireRole.frequency') }}</span>
                  <select [value]="currentAnswer.details?.desiredFrequency ?? ''" (change)="updateFrequency($event)">
                    <option value="">{{ i18n.t('common.notSpecified') }}</option>
                    <option value="rarely">{{ i18n.t('questionnaireRole.frequency.rarely') }}</option>
                    <option value="occasionally">{{ i18n.t('questionnaireRole.frequency.occasionally') }}</option>
                    <option value="regularly">{{ i18n.t('questionnaireRole.frequency.regularly') }}</option>
                    <option value="frequently">{{ i18n.t('questionnaireRole.frequency.frequently') }}</option>
                  </select>
                </label>

                <label class="detail-field">
                  <span>{{ i18n.t('questionnaireRole.initiative') }}</span>
                  <select [value]="currentAnswer.details?.initiative ?? ''" (change)="updateInitiative($event)">
                    <option value="">{{ i18n.t('common.notSpecified') }}</option>
                    <option value="prefer-partner">{{ i18n.t('questionnaireRole.initiative.preferPartner') }}</option>
                    <option value="either">{{ i18n.t('questionnaireRole.initiative.either') }}</option>
                    <option value="prefer-initiate">{{ i18n.t('questionnaireRole.initiative.preferInitiate') }}</option>
                  </select>
                </label>

                @if (currentAnswer.preference === 'depends') {
                  <label class="detail-field full-width">
                    <span>{{ i18n.t('questionnaireRole.dependsOn') }}</span>
                    <textarea
                      rows="3"
                      [maxLength]="dependsOnMaxLength"
                      [value]="currentAnswer.details?.dependsOn ?? ''"
                      [placeholder]="i18n.t('questionnaireRole.dependsPlaceholder')"
                      (change)="updateDependsOn($event)"
                    ></textarea>
                  </label>
                }
              </div>
            </details>
          </div>
        }
      }
    </section>
  `,
  styles: `
    .role-block {
      display: grid;
      grid-template-columns: minmax(11rem, 15rem) minmax(0, 1fr);
      grid-template-areas: "heading scale" "details details";
      align-items: center;
      gap: 0.55rem 1rem;
      padding: 0.85rem 0;
      border-top: 1px solid color-mix(in srgb, var(--border-subtle) 72%, transparent);
    }
    .role-block:first-child { border-top: 0; padding-top: 0; }
    .filtered-role { opacity: 0.82; }
    .role-heading { grid-area: heading; display: flex; align-items: flex-start; justify-content: space-between; gap: 0.6rem; }
    .role-heading :is(h3, h4) { margin: 0; font-size: 1rem; line-height: 1.25; letter-spacing: -0.01em; }
    .scope-note, .filtered-note { margin: 0.2rem 0 0; color: var(--text-secondary); font-size: 0.72rem; }
    .scope-note { font-weight: 700; }
    .text-button { padding: 0; border: 0; background: transparent; color: var(--text-secondary); cursor: pointer; font-size: 0.72rem; text-decoration: underline; }
    .preference-scale { grid-area: scale; display: grid; grid-template-columns: repeat(6, minmax(0, 1fr)); gap: 0.35rem; }
    .preference-option {
      --preference-accent: var(--border-strong);
      display: flex; min-height: 2.55rem; align-items: center; justify-content: center; gap: 0.28rem;
      padding: 0.35rem; border: 1px solid color-mix(in srgb, var(--border-strong) 74%, white);
      border-radius: 0.52rem; background: color-mix(in srgb, var(--surface-elevated) 86%, #f3f5ff 6%);
      color: #fafbff; cursor: pointer; font-size: 0.7rem; line-height: 1.15;
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.045);
      transition: border-color 140ms ease, box-shadow 140ms ease, background 140ms ease, transform 140ms ease;
    }
    .preference-option[data-tone='favorite'] { --preference-accent: var(--preference-favorite); }
    .preference-option[data-tone='positive'] { --preference-accent: var(--preference-positive); }
    .preference-option[data-tone='conditional'] { --preference-accent: var(--preference-conditional); }
    .preference-option[data-tone='curious'] { --preference-accent: var(--preference-curious); }
    .preference-option[data-tone='negative'] { --preference-accent: var(--preference-negative); }
    .preference-option[data-tone='boundary'] { --preference-accent: var(--preference-boundary); }
    .preference-option span:first-child {
      color: color-mix(in srgb, var(--text-primary) 74%, var(--text-secondary)); font-size: 0.95rem; font-weight: 800;
      transition: color 140ms ease, text-shadow 140ms ease;
    }
    .preference-option:hover {
      border-color: color-mix(in srgb, var(--preference-accent) 82%, white);
      background: color-mix(in srgb, var(--preference-accent) 16%, var(--surface-elevated));
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 0 1.05rem color-mix(in srgb, var(--preference-accent) 34%, transparent);
      transform: translateY(-1px);
    }
    .preference-option:hover span:first-child { color: color-mix(in srgb, var(--preference-accent) 82%, white); text-shadow: 0 0 0.55rem color-mix(in srgb, var(--preference-accent) 40%, transparent); }
    .preference-option.selected {
      border-color: color-mix(in srgb, var(--preference-accent) 86%, white);
      background: color-mix(in srgb, var(--preference-accent) 24%, var(--surface-elevated));
      box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--preference-accent) 72%, white), inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 0 1.15rem color-mix(in srgb, var(--preference-accent) 40%, transparent);
    }
    .preference-option.selected span:first-child { color: color-mix(in srgb, var(--preference-accent) 84%, white); text-shadow: 0 0 0.65rem color-mix(in srgb, var(--preference-accent) 46%, transparent); }
    .role-details { grid-area: details; display: grid; gap: 0.55rem; margin-top: 0.2rem; }
    .trait-refinements {
      padding: 0.62rem 0.68rem;
      border: 1px solid color-mix(in srgb, var(--neon-violet) 22%, var(--border-subtle));
      border-radius: 0.62rem;
      background: linear-gradient(145deg, rgba(22, 48, 88, 0.34), rgba(63, 34, 91, 0.30));
    }
    .trait-refinement-copy { display: flex; align-items: baseline; justify-content: space-between; gap: 0.75rem; margin-bottom: 0.48rem; }
    .trait-refinement-copy strong { color: var(--text-primary); font-size: 0.78rem; line-height: 1.25; }
    .trait-refinement-copy small { color: var(--text-secondary); font-size: 0.68rem; text-align: right; }
    .trait-refinement-options { display: flex; flex-wrap: wrap; gap: 0.38rem; }
    .trait-refinement-option {
      min-height: 2rem;
      padding: 0.34rem 0.66rem;
      border: 1px solid color-mix(in srgb, var(--border-strong) 76%, var(--neon-cyan));
      border-radius: 0.52rem;
      background: rgba(24, 43, 78, 0.64);
      color: color-mix(in srgb, var(--text-primary) 88%, var(--text-secondary));
      cursor: pointer;
      font-size: 0.72rem;
      font-weight: 650;
      transition: border-color 130ms ease, background 130ms ease, box-shadow 130ms ease;
    }
    .trait-refinement-option:hover { border-color: color-mix(in srgb, var(--neon-cyan) 62%, var(--neon-violet)); }
    .trait-refinement-option.selected {
      border-color: color-mix(in srgb, var(--neon-cyan) 60%, var(--neon-violet));
      background: linear-gradient(135deg, rgba(38, 103, 146, 0.62), rgba(91, 55, 139, 0.66));
      color: #fff;
      box-shadow: inset 0 0 0 1px rgba(160, 211, 255, 0.12), 0 0 0.75rem rgba(96, 139, 255, 0.10);
    }
    .answer-details { margin-top: 0; }
    .answer-details summary { color: var(--text-secondary); cursor: pointer; font-size: 0.82rem; }
    .detail-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.75rem; margin-top: 0.75rem; }
    .detail-field { display: grid; gap: 0.35rem; color: var(--text-secondary); font-size: 0.82rem; }
    .detail-field select, .detail-field textarea { width: 100%; padding: 0.55rem 0.65rem; border: 1px solid var(--border-strong); border-radius: 0.45rem; background: var(--surface-elevated); color: var(--text-primary); }
    .full-width { grid-column: 1 / -1; }
    @media (prefers-reduced-motion: reduce) {
      .preference-option, .preference-option span:first-child, .trait-refinement-option { transition: none; }
      .preference-option:hover { transform: none; }
    }
    @media (max-width: 920px) {
      .role-block { grid-template-columns: 1fr; grid-template-areas: "heading" "scale" "details"; gap: 0.6rem; }
    }
    @media (max-width: 760px) {
      .role-block { padding: 0.9rem 0; }
      .role-heading :is(h3, h4) { font-size: 1.02rem; }
      .preference-scale { grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.42rem; }
      .preference-option { min-height: 3rem; padding: 0.42rem 0.28rem; flex-direction: column; gap: 0.18rem; font-size: 0.67rem; }
      .preference-option span:first-child { font-size: 1rem; }
      .trait-refinements { padding: 0.65rem; }
      .trait-refinement-copy { display: grid; gap: 0.18rem; }
      .trait-refinement-copy small { text-align: left; }
      .trait-refinement-option { min-height: 2.25rem; padding-inline: 0.72rem; }
      .detail-grid { grid-template-columns: 1fr; }
      .full-width { grid-column: auto; }
    }
    @media (max-width: 360px) {
      .preference-option { font-size: 0.62rem; }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionnaireRoleComponent implements OnInit, OnDestroy {
  readonly i18n = inject(TranslationService);
  private readonly catalogueText = inject(CatalogueTextService);
  private readonly counterpartContext = inject(QuestionnaireCounterpartContextService);
  private unregisterCounterpart?: () => void;

  readonly practiceId = input.required<string>();
  readonly role = input.required<PracticeRole>();
  readonly scope = input<AnswerScope | undefined>();
  readonly answer = input<PracticeAnswer | undefined>();
  readonly filtered = input(false);
  readonly headingLevel = input<3 | 4>(3);
  readonly answerChange = output<PracticeAnswer>();
  readonly answerRemove = output<{ readonly practiceId: string; readonly roleId: string; readonly scope?: AnswerScope }>();

  readonly counterpartSex = computed(() => this.scope()?.counterpartSex);
  readonly targetSite = computed(() => this.scope()?.targetSite);
  readonly roleLabel = computed(() => this.catalogueText.roleLabel(this.practiceId(), this.role()));
  readonly refinementGroup = computed(() =>
    this.catalogueText.practiceRefinementGroup(this.practiceId(), this.counterpartSex()),
  );
  readonly showCounterpartSex = computed(() =>
    !!this.counterpartSex()
      && this.counterpartContext.hasMultipleSexVariants(this.practiceId(), this.role().id),
  );
  readonly ariaLabel = computed(() => {
    const parts = [this.roleLabel()];
    const sex = this.counterpartSex();
    if (sex && this.showCounterpartSex()) {
      parts.push(this.i18n.t('questionnaireRole.counterpart', { sex: this.sexLabel(sex) }));
    }
    const site = this.targetSite();
    if (site) parts.push(this.i18n.t('questionnaireRole.targetSite', { site: this.targetSiteLabel(site) }));
    return parts.join('. ');
  });
  readonly preferenceOptions = PREFERENCE_OPTIONS;
  readonly dependsOnMaxLength = DEPENDS_ON_MAX_LENGTH;

  ngOnInit(): void {
    const sex = this.scope()?.counterpartSex;
    if (sex) this.unregisterCounterpart = this.counterpartContext.register(this.practiceId(), this.role().id, sex);
  }

  ngOnDestroy(): void {
    this.unregisterCounterpart?.();
  }

  sexLabel(sex: Sex): string {
    return this.i18n.t(sex === 'male' ? 'questionnaireRole.sex.male' : 'questionnaireRole.sex.female');
  }

  targetSiteLabel(site: TargetSite): string {
    const keys = {
      mouth: 'questionnaireRole.targetSite.mouth',
      vaginal: 'questionnaireRole.targetSite.vaginal',
      anal: 'questionnaireRole.targetSite.anal',
      'external-genitals': 'questionnaireRole.targetSite.externalGenitals',
      penis: 'questionnaireRole.targetSite.penis',
      nipples: 'questionnaireRole.targetSite.nipples',
      body: 'questionnaireRole.targetSite.body',
    } as const;
    return this.i18n.t(keys[site]);
  }

  supportsDetails(preference: Preference): boolean {
    return DETAIL_CAPABLE_PREFERENCES.includes(preference);
  }

  isRefinementSelected(refinementId: string): boolean {
    return this.answer()?.details?.refinements?.includes(refinementId) ?? false;
  }

  toggleRefinement(refinementId: string): void {
    const answer = this.answer();
    const group = this.refinementGroup();
    if (!answer || !group || !this.supportsDetails(answer.preference)) return;
    if (!group.options.some((option) => option.id === refinementId)) return;

    const selected = new Set(answer.details?.refinements ?? []);
    if (selected.has(refinementId)) selected.delete(refinementId);
    else selected.add(refinementId);

    const refinements = group.options
      .map((option) => option.id)
      .filter((optionId) => selected.has(optionId));
    this.updateDetail('refinements', refinements.length > 0 ? refinements : undefined);
  }

  selectPreference(preference: Preference): void {
    const current = this.answer();
    if (current?.preference === preference) {
      this.clearAnswer();
      return;
    }
    let details = current?.details ? { ...current.details } : undefined;
    if (!this.supportsDetails(preference)) details = undefined;
    else if (details && preference !== 'depends') {
      const { dependsOn: _dependsOn, ...remaining } = details;
      details = Object.keys(remaining).length > 0 ? remaining : undefined;
    }
    const scope = this.scope();
    this.answerChange.emit({
      practiceId: this.practiceId(), roleId: this.role().id,
      ...(scope ? { scope: { ...scope } } : {}), preference,
      ...(details ? { details } : {}),
    });
  }

  clearAnswer(): void {
    const scope = this.scope();
    this.answerRemove.emit({ practiceId: this.practiceId(), roleId: this.role().id, ...(scope ? { scope: { ...scope } } : {}) });
  }

  updateContext(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as '' | ExperienceContext;
    this.updateDetail('context', value || undefined);
  }
  updateFrequency(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as '' | DesiredFrequency;
    this.updateDetail('desiredFrequency', value || undefined);
  }
  updateInitiative(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as '' | InitiativePreference;
    this.updateDetail('initiative', value || undefined);
  }
  updateDependsOn(event: Event): void {
    const value = (event.target as HTMLTextAreaElement).value.trim();
    this.updateDetail('dependsOn', value || undefined);
  }

  private updateDetail(key: keyof AnswerDetails, value: AnswerDetails[keyof AnswerDetails] | undefined): void {
    const answer = this.answer();
    if (!answer || !this.supportsDetails(answer.preference)) return;
    const details = { ...(answer.details ?? {}) } as Record<keyof AnswerDetails, unknown>;
    if (value === undefined) delete details[key]; else details[key] = value;
    const { details: _previousDetails, ...base } = answer;
    this.answerChange.emit({ ...base, ...(Object.keys(details).length > 0 ? { details: details as AnswerDetails } : {}) });
  }
}
