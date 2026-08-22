import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { PracticeRole } from '../../domain/catalogue/practice';
import {
  AnswerDetails,
  AnswerScope,
  DEPENDS_ON_MAX_LENGTH,
  DesiredFrequency,
  ExperienceContext,
  InitiativePreference,
  PracticeAnswer,
} from '../../domain/profile/profile-answer';
import { Sex } from '../../domain/profile/profile-metadata';
import { DETAIL_CAPABLE_PREFERENCES, PREFERENCE_VALUES, Preference } from '../../domain/profile/preference';
import { CatalogueTextService } from '../i18n/catalogue-text.service';
import { TranslationService } from '../i18n/translation.service';
import { PREFERENCE_PRESENTATION } from '../shared/comparison-presentation';

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
          <h3>{{ roleLabel() }}</h3>
          @if (counterpartSex(); as sex) {
            <p class="scope-note">{{ i18n.t('questionnaireRole.counterpart', { sex: sexLabel(sex) }) }}</p>
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
        }
      }
    </section>
  `,
  styles: `
    .role-block {
      display: grid;
      grid-template-columns: minmax(11rem, 15rem) minmax(0, 1fr);
      grid-template-areas:
        "heading scale"
        "details details";
      align-items: center;
      gap: 0.55rem 1rem;
      padding: 0.7rem 0;
      border-top: 1px solid var(--border-subtle);
    }
    .role-block:first-child { border-top: 0; padding-top: 0; }
    .filtered-role { opacity: 0.82; }
    .role-heading { grid-area: heading; display: flex; align-items: flex-start; justify-content: space-between; gap: 0.6rem; }
    .role-heading h3 { margin: 0; font-size: 0.95rem; }
    .scope-note, .filtered-note { margin: 0.18rem 0 0; color: var(--text-secondary); font-size: 0.72rem; }
    .scope-note { font-weight: 700; }
    .text-button { padding: 0; border: 0; background: transparent; color: var(--text-secondary); cursor: pointer; font-size: 0.72rem; text-decoration: underline; }
    .preference-scale { grid-area: scale; display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 0.3rem; }
    .preference-option {
      display: flex;
      min-height: 2.45rem;
      align-items: center;
      justify-content: center;
      gap: 0.25rem;
      padding: 0.3rem;
      border: 1px solid var(--border-subtle);
      border-radius: 0.4rem;
      background: var(--surface-elevated);
      color: var(--text-primary);
      cursor: pointer;
      font-size: 0.7rem;
      line-height: 1.15;
    }
    .preference-option span { display: inline; }
    .preference-option span:first-child { font-size: 0.9rem; }
    .preference-option.selected { border-color: var(--text-primary); box-shadow: inset 0 0 0 1px var(--text-primary); }
    .answer-details { grid-area: details; margin-top: 0.2rem; }
    .answer-details summary { color: var(--text-secondary); cursor: pointer; font-size: 0.82rem; }
    .detail-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 0.75rem; margin-top: 0.75rem; }
    .detail-field { display: grid; gap: 0.35rem; color: var(--text-secondary); font-size: 0.82rem; }
    .detail-field select, .detail-field textarea { width: 100%; padding: 0.55rem 0.65rem; border: 1px solid var(--border-strong); border-radius: 0.45rem; background: var(--surface-elevated); color: var(--text-primary); }
    .full-width { grid-column: 1 / -1; }
    @media (max-width: 920px) {
      .role-block {
        grid-template-columns: 1fr;
        grid-template-areas: "heading" "scale" "details";
      }
    }
    @media (max-width: 760px) {
      .preference-scale { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .preference-option { min-height: 2.75rem; }
      .detail-grid { grid-template-columns: 1fr; }
      .full-width { grid-column: auto; }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionnaireRoleComponent {
  readonly i18n = inject(TranslationService);
  private readonly catalogueText = inject(CatalogueTextService);

  readonly practiceId = input.required<string>();
  readonly role = input.required<PracticeRole>();
  readonly scope = input<AnswerScope | undefined>();
  readonly answer = input<PracticeAnswer | undefined>();
  readonly filtered = input(false);
  readonly answerChange = output<PracticeAnswer>();
  readonly answerRemove = output<{
    readonly practiceId: string;
    readonly roleId: string;
    readonly scope?: AnswerScope;
  }>();

  readonly counterpartSex = computed(() => this.scope()?.counterpartSex);
  readonly roleLabel = computed(() => this.catalogueText.roleLabel(this.practiceId(), this.role()));
  readonly ariaLabel = computed(() => {
    const role = this.roleLabel();
    const sex = this.counterpartSex();
    return sex
      ? this.i18n.t('questionnaireRole.preferenceWithSexAria', { role, sex: this.sexLabel(sex) })
      : this.i18n.t('questionnaireRole.preferenceAria', { role });
  });
  readonly preferenceOptions = PREFERENCE_OPTIONS;
  readonly dependsOnMaxLength = DEPENDS_ON_MAX_LENGTH;

  sexLabel(sex: Sex): string {
    return this.i18n.t(sex === 'male' ? 'questionnaireRole.sex.male' : 'questionnaireRole.sex.female');
  }

  supportsDetails(preference: Preference): boolean {
    return DETAIL_CAPABLE_PREFERENCES.includes(preference);
  }

  selectPreference(preference: Preference): void {
    const current = this.answer();
    let details = current?.details ? { ...current.details } : undefined;

    if (!this.supportsDetails(preference)) {
      details = undefined;
    } else if (details && preference !== 'depends') {
      const { dependsOn: _dependsOn, ...remaining } = details;
      details = Object.keys(remaining).length > 0 ? remaining : undefined;
    }

    const scope = this.scope();
    this.answerChange.emit({
      practiceId: this.practiceId(),
      roleId: this.role().id,
      ...(scope ? { scope: { ...scope } } : {}),
      preference,
      ...(details ? { details } : {}),
    });
  }

  clearAnswer(): void {
    const scope = this.scope();
    this.answerRemove.emit({
      practiceId: this.practiceId(),
      roleId: this.role().id,
      ...(scope ? { scope: { ...scope } } : {}),
    });
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
    if (value === undefined) delete details[key];
    else details[key] = value;

    const { details: _previousDetails, ...base } = answer;
    this.answerChange.emit({
      ...base,
      ...(Object.keys(details).length > 0 ? { details: details as AnswerDetails } : {}),
    });
  }
}
