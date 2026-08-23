import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Profile } from '../../../domain/profile/profile';
import { Sex, SexualOrientation } from '../../../domain/profile/profile-metadata';
import { CatalogueStore } from '../../core/catalogue.store';
import { ProfileStore } from '../../core/profile.store';
import { QUESTIONNAIRE_SERVICE } from '../../core/questionnaire-service.token';
import { UiPreferencesService } from '../../core/ui-preferences.service';
import { TranslationService } from '../../i18n/translation.service';
import { ProfileDeleteDialogComponent } from '../../profile/profile-delete-dialog.component';
import { APP_VERSION } from '../../shared/app-version';
import { BrandMarkComponent } from '../../shared/brand-mark.component';
import { CompletionProgressComponent } from '../../shared/completion-progress.component';

interface ProfileCardView {
  readonly profile: Profile;
  readonly answerCount: number;
  readonly completionPercentage?: number;
}

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, ProfileDeleteDialogComponent, BrandMarkComponent, CompletionProgressComponent],
  template: `
    <main class="page profile-hub">
      <div class="ambient-glow ambient-blue" aria-hidden="true"></div>
      <div class="ambient-glow ambient-purple" aria-hidden="true"></div>

      <header class="hub-hero">
        <div class="brand-cluster">
          <app-brand-mark />
          <div class="brand-copy">
            <div class="brand-meta">
              <span class="version-pill">v{{ appVersion }}</span>
            </div>
            <h1>Affinity Matrix</h1>
            <p class="lead">{{ i18n.t('homeHub.tagline') }}</p>
          </div>
        </div>
      </header>

      @if (profileStore.error()) {
        <p class="alert" role="alert">{{ i18n.t('common.profileStorageError') }}</p>
      }

      <section class="entry-actions" aria-label="Profile entry actions">
        <a class="entry-card entry-card-primary" routerLink="/profiles/new">
          <span class="entry-icon" aria-hidden="true">+</span>
          <span class="entry-content">
            <span class="eyebrow">{{ i18n.t('homeHub.create.eyebrow') }}</span>
            <strong>{{ i18n.t('common.createProfile') }}</strong>
            <span class="entry-description">{{ i18n.t('homeHub.create.description') }}</span>
          </span>
          <span class="entry-arrow" aria-hidden="true">→</span>
        </a>

        <a class="entry-card" routerLink="/profiles/import">
          <span class="entry-icon import-icon" aria-hidden="true">↓</span>
          <span class="entry-content">
            <span class="eyebrow">{{ i18n.t('homeHub.import.eyebrow') }}</span>
            <strong>{{ i18n.t('common.importProfile') }}</strong>
            <span class="entry-description">{{ i18n.t('homeHub.import.description') }}</span>
          </span>
          <span class="entry-arrow" aria-hidden="true">→</span>
        </a>
      </section>

      <section class="profiles-section" aria-labelledby="local-profiles-title">
        <div class="profiles-heading">
          <div>
            <p class="eyebrow">{{ i18n.t('homeHub.profiles.eyebrow') }}</p>
            <h2 id="local-profiles-title">{{ i18n.t('homeHub.profiles.title') }}</h2>
          </div>
          <span class="profile-count-pill">{{ profileCards().length }}</span>
        </div>

        @if (profileCards().length === 0) {
          <div class="empty-hub-state">
            <div class="empty-orb" aria-hidden="true">AM</div>
            <div>
              <h3>{{ i18n.t('homeHub.empty.title') }}</h3>
              <p>{{ i18n.t('homeHub.empty.description') }}</p>
            </div>
          </div>
        } @else {
          <div class="profile-card-grid">
            @for (card of profileCards(); track card.profile.id) {
              <article class="profile-card">
                <a class="profile-card-main" [routerLink]="['/profiles', card.profile.id]">
                  <header class="profile-card-header">
                    <div class="profile-title-copy">
                      <h3>{{ card.profile.metadata.alias || i18n.t('common.untitledProfile') }}</h3>
                      <p>{{ metadataLabel(card.profile) }}</p>
                    </div>
                  </header>

                  @if (card.completionPercentage !== undefined) {
                    <div class="profile-progress-block">
                      <div class="profile-progress-copy">
                        <span>{{ i18n.t('homeHub.profile.progress', { percentage: card.completionPercentage }) }}</span>
                        <strong>{{ card.completionPercentage }}%</strong>
                      </div>
                      <app-completion-progress [value]="card.completionPercentage" />
                    </div>
                  }

                  <div class="profile-facts">
                    <span>{{ answersLabel(card.answerCount) }}</span>
                    <span>{{ i18n.t('homeHub.profile.updated', { date: updatedAtLabel(card.profile.updatedAt) }) }}</span>
                  </div>

                  <div class="profile-open">
                    <span>{{ i18n.t('homeHub.profile.open') }}</span>
                    <span aria-hidden="true">→</span>
                  </div>
                </a>

                <div class="profile-card-actions">
                  <button
                    class="profile-menu-button"
                    type="button"
                    [attr.aria-label]="i18n.t('homeHub.profile.menu', { alias: card.profile.metadata.alias || i18n.t('common.untitledProfile') })"
                    [attr.aria-expanded]="activeMenuProfileId() === card.profile.id"
                    (click)="toggleProfileMenu(card.profile.id)"
                  >⋯</button>

                  @if (activeMenuProfileId() === card.profile.id) {
                    <div class="profile-menu">
                      <button class="profile-delete-action" type="button" (click)="requestDeletion(card.profile)">
                        {{ i18n.t('profileDeletion.homeAction') }}
                      </button>
                    </div>
                  }
                </div>
              </article>
            }
          </div>
        }
      </section>

      <footer class="privacy-capsule">
        <span class="privacy-lock" aria-hidden="true">◇</span>
        <span>
          <strong>{{ i18n.t('homeHub.privacy.title') }}</strong>
          <small>{{ i18n.t('homeHub.privacy.description') }}</small>
        </span>
      </footer>
    </main>

    @if (pendingDeletion(); as profile) {
      <app-profile-delete-dialog
        [profileId]="profile.id"
        [alias]="profile.metadata.alias ?? ''"
        (cancelled)="pendingDeletion.set(null)"
        (deleted)="pendingDeletion.set(null)"
      />
    }
  `,
  styles: `
    :host { display: block; }
    .profile-hub {
      position: relative;
      isolation: isolate;
      width: min(100% - 2rem, 76rem);
      overflow: clip;
      padding-top: clamp(2rem, 5vw, 3.5rem);
    }
    .ambient-glow {
      position: absolute;
      z-index: -1;
      border-radius: 50%;
      filter: blur(12px);
      opacity: 0.72;
      pointer-events: none;
    }
    .ambient-blue {
      top: -10rem;
      left: -9rem;
      width: 27rem;
      height: 27rem;
      background: radial-gradient(circle, rgba(77, 126, 234, 0.28), rgba(61, 91, 184, 0.08) 48%, transparent 72%);
    }
    .ambient-purple {
      right: -11rem;
      bottom: 4rem;
      width: 31rem;
      height: 31rem;
      background: radial-gradient(circle, rgba(151, 69, 218, 0.25), rgba(93, 53, 165, 0.08) 50%, transparent 72%);
    }
    .hub-hero { margin-bottom: 1.8rem; }
    .brand-cluster { display: flex; align-items: center; gap: 1.25rem; }
    .brand-copy { min-width: 0; }
    .brand-meta { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 0.55rem; }
    .version-pill {
      display: inline-flex;
      min-height: 1.8rem;
      align-items: center;
      padding: 0.22rem 0.62rem;
      border: 1px solid color-mix(in srgb, var(--border-strong) 66%, transparent);
      border-radius: 999px;
      background: rgba(25, 34, 58, 0.52);
      color: var(--text-secondary);
      font-size: 0.72rem;
      font-weight: 750;
      letter-spacing: 0.04em;
      backdrop-filter: blur(12px);
    }
    .hub-hero h1 { margin-bottom: 0.45rem; font-size: clamp(2.35rem, 6vw, 4.1rem); letter-spacing: -0.045em; }
    .hub-hero .lead { margin: 0; color: color-mix(in srgb, var(--text-primary) 72%, var(--text-secondary)); font-size: clamp(1rem, 2.2vw, 1.15rem); }

    .entry-actions { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; margin-bottom: 2.8rem; }
    .entry-card {
      position: relative;
      display: grid;
      min-height: 10.2rem;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: center;
      gap: 1rem;
      overflow: hidden;
      padding: 1.3rem 1.35rem;
      border: 1px solid transparent;
      border-radius: 1rem;
      background:
        linear-gradient(145deg, rgba(47, 61, 96, 0.72), rgba(31, 31, 67, 0.78)) padding-box,
        var(--window-border-gradient-soft) border-box;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.12),
        0 0.9rem 2.4rem rgba(5, 9, 24, 0.16);
      color: inherit;
      text-decoration: none;
      backdrop-filter: blur(18px) saturate(125%);
      transition: transform 160ms ease, box-shadow 160ms ease, border-color 160ms ease;
    }
    .entry-card::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.075), transparent 34%);
      pointer-events: none;
    }
    .entry-card::after {
      content: '';
      position: absolute;
      inset: 0 auto auto 0;
      width: 100%;
      height: 3px;
      background: var(--window-border-gradient);
      opacity: 0.7;
    }
    .entry-card-primary {
      background:
        linear-gradient(145deg, rgba(49, 76, 126, 0.78), rgba(41, 34, 84, 0.82)) padding-box,
        var(--window-border-gradient) border-box;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.15),
        0 1rem 2.6rem rgba(6, 10, 28, 0.2),
        0 0 2rem color-mix(in srgb, #6572ff 10%, transparent);
    }
    .entry-card:hover {
      transform: translateY(-3px);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.16),
        0 1.2rem 2.8rem rgba(5, 9, 24, 0.23),
        0 0 2rem color-mix(in srgb, #7b67f0 13%, transparent);
    }
    .entry-icon {
      position: relative;
      z-index: 1;
      display: grid;
      width: 3.3rem;
      aspect-ratio: 1;
      place-items: center;
      border: 1px solid rgba(195, 211, 255, 0.28);
      border-radius: 0.9rem;
      background: linear-gradient(145deg, rgba(113, 144, 221, 0.34), rgba(83, 62, 159, 0.38));
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2), 0 0.5rem 1.4rem rgba(7, 10, 28, 0.18);
      color: #f5f8ff;
      font-size: 1.65rem;
      font-weight: 300;
    }
    .import-icon { font-size: 1.35rem; }
    .entry-content { position: relative; z-index: 1; display: grid; gap: 0.25rem; }
    .entry-content .eyebrow { margin-bottom: 0.15rem; }
    .entry-content strong { font-size: 1.22rem; }
    .entry-description { max-width: 28rem; color: var(--text-secondary); font-size: 0.88rem; line-height: 1.5; }
    .entry-arrow { position: relative; z-index: 1; color: #d9e3ff; font-size: 1.2rem; transition: transform 160ms ease; }
    .entry-card:hover .entry-arrow { transform: translateX(0.2rem); }

    .profiles-section { margin-top: 0.25rem; }
    .profiles-heading { display: flex; align-items: end; justify-content: space-between; gap: 1rem; margin-bottom: 1rem; }
    .profiles-heading h2 { margin-bottom: 0; font-size: 1.55rem; }
    .profile-count-pill {
      display: inline-grid;
      min-width: 2.15rem;
      height: 2.15rem;
      place-items: center;
      padding-inline: 0.55rem;
      border: 1px solid var(--border-subtle);
      border-radius: 999px;
      background: rgba(32, 42, 69, 0.58);
      color: var(--text-secondary);
      font-size: 0.82rem;
      font-weight: 800;
      backdrop-filter: blur(12px);
    }
    .profile-card-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 1rem; }
    .profile-card {
      position: relative;
      overflow: visible;
      border: 1px solid transparent;
      border-radius: 1rem;
      background:
        linear-gradient(150deg, rgba(40, 53, 83, 0.78), rgba(29, 29, 62, 0.82)) padding-box,
        var(--window-border-gradient-soft) border-box;
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.1),
        0 0.85rem 2rem rgba(4, 8, 22, 0.15);
      backdrop-filter: blur(17px) saturate(122%);
      transition: transform 160ms ease, box-shadow 160ms ease;
    }
    .profile-card::before {
      content: '';
      position: absolute;
      z-index: 0;
      inset: 0;
      overflow: hidden;
      border-radius: inherit;
      background:
        linear-gradient(180deg, rgba(255, 255, 255, 0.055), transparent 28%),
        radial-gradient(circle at 88% 12%, rgba(126, 88, 219, 0.15), transparent 34%);
      pointer-events: none;
    }
    .profile-card::after {
      content: '';
      position: absolute;
      z-index: 1;
      inset: 0 auto auto 1rem;
      width: calc(100% - 2rem);
      height: 2px;
      border-radius: 999px;
      background: var(--window-border-gradient);
      opacity: 0.62;
      pointer-events: none;
    }
    .profile-card:hover {
      transform: translateY(-2px);
      box-shadow:
        inset 0 1px 0 rgba(255, 255, 255, 0.13),
        0 1rem 2.5rem rgba(4, 8, 22, 0.22),
        0 0 1.8rem color-mix(in srgb, #765fe2 9%, transparent);
    }
    .profile-card-main {
      position: relative;
      z-index: 2;
      display: grid;
      min-height: 15.8rem;
      gap: 1rem;
      padding: 1.25rem 1.3rem 1.1rem;
      color: inherit;
      text-decoration: none;
    }
    .profile-card-header { padding-right: 2.8rem; }
    .profile-title-copy h3 { margin-bottom: 0.32rem; font-size: 1.3rem; letter-spacing: -0.02em; }
    .profile-title-copy p { margin: 0; color: var(--text-secondary); font-size: 0.84rem; }
    .profile-progress-block { display: grid; gap: 0.62rem; align-self: end; }
    .profile-progress-copy { display: flex; align-items: baseline; justify-content: space-between; gap: 1rem; color: var(--text-secondary); font-size: 0.8rem; }
    .profile-progress-copy strong { color: var(--text-primary); font-size: 1rem; }
    .profile-facts { display: flex; flex-wrap: wrap; gap: 0.45rem 0.8rem; color: var(--text-secondary); font-size: 0.76rem; }
    .profile-facts span + span::before { content: '·'; margin-right: 0.8rem; color: color-mix(in srgb, var(--text-secondary) 55%, transparent); }
    .profile-open { display: flex; align-items: center; justify-content: space-between; gap: 1rem; margin-top: auto; padding-top: 0.8rem; border-top: 1px solid color-mix(in srgb, var(--border-subtle) 72%, transparent); color: #dbe4ff; font-size: 0.84rem; font-weight: 750; }
    .profile-open span:last-child { transition: transform 160ms ease; }
    .profile-card-main:hover .profile-open span:last-child { transform: translateX(0.2rem); }
    .profile-card-actions { position: absolute; z-index: 5; top: 0.85rem; right: 0.85rem; }
    .profile-menu-button {
      display: grid;
      width: 2.3rem;
      height: 2.3rem;
      place-items: center;
      border: 1px solid transparent;
      border-radius: 0.65rem;
      background: rgba(26, 34, 57, 0.48);
      color: var(--text-secondary);
      font-size: 1.25rem;
      line-height: 1;
      cursor: pointer;
      backdrop-filter: blur(10px);
      transition: background 140ms ease, border-color 140ms ease, color 140ms ease;
    }
    .profile-menu-button:hover,
    .profile-menu-button[aria-expanded='true'] { border-color: var(--border-subtle); background: rgba(47, 59, 91, 0.88); color: var(--text-primary); }
    .profile-menu {
      position: absolute;
      top: calc(100% + 0.35rem);
      right: 0;
      min-width: 10rem;
      padding: 0.35rem;
      border: 1px solid var(--border-subtle);
      border-radius: 0.65rem;
      background: rgba(25, 31, 51, 0.97);
      box-shadow: 0 0.8rem 2rem rgba(3, 6, 18, 0.38);
      backdrop-filter: blur(18px);
    }
    .profile-delete-action {
      width: 100%;
      padding: 0.62rem 0.72rem;
      border: 0;
      border-radius: 0.45rem;
      background: transparent;
      color: #ffdce0;
      text-align: left;
      font-size: 0.8rem;
      font-weight: 750;
      cursor: pointer;
    }
    .profile-delete-action:hover { background: color-mix(in srgb, var(--preference-boundary) 15%, transparent); }

    .empty-hub-state {
      display: flex;
      align-items: center;
      gap: 1.2rem;
      padding: 1.4rem 1.5rem;
      border: 1px dashed color-mix(in srgb, var(--border-strong) 62%, transparent);
      border-radius: 1rem;
      background: rgba(29, 38, 63, 0.42);
      color: var(--text-secondary);
      backdrop-filter: blur(12px);
    }
    .empty-hub-state h3 { margin-bottom: 0.3rem; color: var(--text-primary); }
    .empty-hub-state p { margin: 0; line-height: 1.5; }
    .empty-orb { display: grid; width: 3.15rem; aspect-ratio: 1; flex: 0 0 auto; place-items: center; border: 1px solid var(--border-subtle); border-radius: 50%; background: linear-gradient(145deg, rgba(79, 112, 188, 0.28), rgba(110, 61, 160, 0.3)); color: #dce6ff; font-size: 0.72rem; font-weight: 850; }

    .privacy-capsule {
      display: flex;
      width: fit-content;
      max-width: 100%;
      align-items: center;
      gap: 0.75rem;
      margin: 2rem auto 0;
      padding: 0.72rem 1rem;
      border: 1px solid color-mix(in srgb, var(--border-subtle) 78%, transparent);
      border-radius: 999px;
      background: rgba(24, 31, 52, 0.54);
      box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.06);
      color: var(--text-secondary);
      backdrop-filter: blur(14px);
    }
    .privacy-capsule > span:last-child { display: grid; gap: 0.08rem; }
    .privacy-capsule strong { color: var(--text-primary); font-size: 0.78rem; }
    .privacy-capsule small { font-size: 0.72rem; line-height: 1.35; }
    .privacy-lock { display: grid; width: 1.85rem; aspect-ratio: 1; place-items: center; border: 1px solid rgba(164, 186, 239, 0.22); border-radius: 50%; background: rgba(69, 92, 145, 0.2); color: #cbd9ff; }

    @media (max-width: 760px) {
      .entry-actions, .profile-card-grid { grid-template-columns: 1fr; }
      .entry-card { min-height: 8.8rem; }
    }
    @media (max-width: 560px) {
      .profile-hub { width: min(100% - 1.25rem, 76rem); padding-top: 1.25rem; }
      .brand-cluster { align-items: flex-start; gap: 0.9rem; }
      .hub-hero h1 { font-size: clamp(2rem, 12vw, 3rem); }
      .entry-card { grid-template-columns: auto minmax(0, 1fr); padding: 1.05rem; }
      .entry-arrow { display: none; }
      .entry-icon { width: 2.85rem; }
      .profile-card-main { min-height: 14.5rem; }
      .profile-facts { display: grid; gap: 0.2rem; }
      .profile-facts span + span::before { content: none; }
      .privacy-capsule { width: 100%; border-radius: 0.85rem; }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  readonly profileStore = inject(ProfileStore);
  readonly catalogueStore = inject(CatalogueStore);
  readonly i18n = inject(TranslationService);
  private readonly questionnaireService = inject(QUESTIONNAIRE_SERVICE);
  private readonly preferences = inject(UiPreferencesService);

  readonly appVersion = APP_VERSION;
  readonly pendingDeletion = signal<Profile | null>(null);
  readonly activeMenuProfileId = signal<string | null>(null);
  readonly profileCards = computed<readonly ProfileCardView[]>(() => {
    const snapshot = this.catalogueStore.snapshot();

    return [...this.profileStore.profiles()]
      .sort((left, right) => Date.parse(right.updatedAt) - Date.parse(left.updatedAt))
      .map((profile) => {
        const answerCount = Object.keys(profile.answers).length;
        if (!snapshot) return { profile, answerCount };

        const summaries = this.questionnaireService.getCategorySummaries(
          snapshot,
          profile,
          false,
          this.preferences.hiddenCategoryIds(profile.id),
        );
        const answered = summaries.reduce((total, item) => total + item.answered, 0);
        const questions = summaries.reduce((total, item) => total + item.total, 0);
        const completionPercentage = questions === 0 ? 0 : Math.round((answered / questions) * 100);
        return { profile, answerCount, completionPercentage };
      });
  });

  constructor() {
    void this.catalogueStore.initialize();
  }

  answersLabel(count: number): string {
    return this.i18n.plural(count, 'homeHub.profile.answers.one', 'homeHub.profile.answers.other');
  }

  metadataLabel(profile: Profile): string {
    const labels = [
      this.sexLabel(profile.metadata.sex),
      this.orientationLabel(profile.metadata.orientation),
    ].filter((label): label is string => Boolean(label));
    return labels.length > 0 ? labels.join(' · ') : this.i18n.t('common.notSpecified');
  }

  updatedAtLabel(value: string): string {
    return new Intl.DateTimeFormat(this.i18n.locale(), {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  }

  toggleProfileMenu(profileId: string): void {
    this.activeMenuProfileId.update((current) => current === profileId ? null : profileId);
  }

  requestDeletion(profile: Profile): void {
    this.activeMenuProfileId.set(null);
    this.pendingDeletion.set(profile);
  }

  private sexLabel(sex: Sex | undefined): string | undefined {
    if (!sex) return undefined;
    return this.i18n.t(sex === 'male' ? 'profileEditor.sex.male' : 'profileEditor.sex.female');
  }

  private orientationLabel(orientation: SexualOrientation | undefined): string | undefined {
    if (!orientation) return undefined;
    if (orientation === 'heterosexual') return this.i18n.t('profileEditor.orientation.heterosexual');
    if (orientation === 'homosexual') return this.i18n.t('profileEditor.orientation.homosexual');
    return this.i18n.t('profileEditor.orientation.bisexual');
  }
}
