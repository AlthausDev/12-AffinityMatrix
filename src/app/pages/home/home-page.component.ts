import { DOCUMENT } from '@angular/common';
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
import { CompletionProgressComponent } from '../../shared/completion-progress.component';
import { PointerGlowDirective } from '../../shared/pointer-glow.directive';
import { PRODUCT_MONOGRAM, PRODUCT_NAME } from '../../shared/product-brand';

interface ProfileCardView {
  readonly profile: Profile;
  readonly answerCount: number;
  readonly completionPercentage?: number;
}

interface ProfilePointerDragState {
  readonly profileId: string;
  readonly pointerId: number;
  readonly startX: number;
  readonly startY: number;
  active: boolean;
}

@Component({
  selector: 'app-home-page',
  imports: [RouterLink, ProfileDeleteDialogComponent, CompletionProgressComponent, PointerGlowDirective],
  template: `
    <main class="page profile-hub">
      <header class="hub-hero">
        <div class="brand-cluster">
          <h1
            style="position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;"
          >{{ productName }}</h1>
          <img
            src="/branding/desiresync-logo.png"
            alt=""
            aria-hidden="true"
            width="800"
            height="485"
            style="display:block;width:min(86vw,34rem);height:auto;object-fit:contain;position:relative;z-index:10;visibility:visible;opacity:1;"
          >
          <div class="brand-copy">
            <p class="lead">{{ i18n.t('homeHub.tagline') }}</p>
            <span class="version-pill">v{{ appVersion }}</span>
          </div>
        </div>
      </header>

      @if (profileStore.error()) {
        <p class="alert" role="alert">{{ i18n.t('common.profileStorageError') }}</p>
      }

      <section class="profiles-section" aria-labelledby="local-profiles-title">
        <div class="profiles-toolbar">
          <div class="profiles-heading">
            <div>
              <p class="eyebrow">{{ i18n.t('homeHub.profiles.eyebrow') }}</p>
              <div class="profiles-title-row">
                <h2 id="local-profiles-title">{{ i18n.t('homeHub.profiles.title') }}</h2>
                <span class="profile-count-pill">{{ profileCards().length }}</span>
              </div>
            </div>
          </div>

          <nav class="profile-toolbar-actions" [attr.aria-label]="i18n.t('homeHub.actionsLabel')">
            <a class="hub-action-button hub-action-primary" routerLink="/profiles/new">
              <span aria-hidden="true">+</span>
              {{ i18n.t('common.createProfile') }}
            </a>
            <a class="hub-action-button" routerLink="/profiles/import">
              <span aria-hidden="true">↓</span>
              {{ i18n.t('common.importProfile') }}
            </a>
          </nav>
        </div>

        @if (profileCards().length === 0) {
          <div class="empty-hub-state">
            <div class="empty-orb" aria-hidden="true">{{ productMonogram }}</div>
            <div>
              <h3>{{ i18n.t('homeHub.empty.title') }}</h3>
              <p>{{ i18n.t('homeHub.empty.description') }}</p>
            </div>
          </div>
        } @else {
          <div class="profile-card-grid">
            @for (card of profileCards(); track card.profile.id) {
              <article
                class="profile-card"
                appPointerGlow
                [class.profile-card-dragging]="draggedProfileId() === card.profile.id"
                [attr.data-profile-id]="card.profile.id"
                (pointerdown)="startProfileDrag($event, card.profile.id)"
                (pointermove)="moveProfileDrag($event)"
                (pointerup)="endProfileDrag($event)"
                (pointercancel)="cancelProfileDrag($event)"
                (lostpointercapture)="cancelProfileDrag()"
                (click)="suppressProfileClickAfterDrag($event)"
              >
                <a
                  class="profile-card-main"
                  [routerLink]="['/profiles', card.profile.id]"
                  draggable="false"
                  aria-keyshortcuts="Alt+ArrowUp Alt+ArrowDown"
                  (dragstart)="$event.preventDefault()"
                  (keydown)="reorderFromKeyboard($event, card.profile.id)"
                >
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

                  <span class="profile-card-arrow" aria-hidden="true">→</span>
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

      <footer class="hub-footer">
        <div class="privacy-capsule">
          <span class="privacy-lock" aria-hidden="true">◇</span>
          <span>
            <strong>{{ i18n.t('homeHub.privacy.title') }}</strong>
            <small>{{ i18n.t('homeHub.privacy.description') }}</small>
          </span>
        </div>
        <p class="footer-meta">{{ currentYear }} · v{{ appVersion }}</p>
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageComponent {
  readonly profileStore = inject(ProfileStore);
  readonly catalogueStore = inject(CatalogueStore);
  readonly i18n = inject(TranslationService);
  private readonly questionnaireService = inject(QUESTIONNAIRE_SERVICE);
  private readonly preferences = inject(UiPreferencesService);
  private readonly document = inject(DOCUMENT);

  readonly appVersion = APP_VERSION;
  readonly productName = PRODUCT_NAME;
  readonly productMonogram = PRODUCT_MONOGRAM;
  readonly currentYear = new Date().getFullYear();
  readonly pendingDeletion = signal<Profile | null>(null);
  readonly activeMenuProfileId = signal<string | null>(null);
  readonly draggedProfileId = signal<string | null>(null);
  private profilePointerDrag: ProfilePointerDragState | null = null;
  private suppressProfileClickUntil = 0;
  private readonly profileDragThreshold = 7;

  readonly profileCards = computed<readonly ProfileCardView[]>(() => {
    const snapshot = this.catalogueStore.snapshot();
    const manualOrder = this.preferences.profileOrder();
    const orderIndex = new Map(manualOrder.map((profileId, index) => [profileId, index]));
    const profiles = [...this.profileStore.profiles()].sort((left, right) => {
      const leftIndex = orderIndex.get(left.id);
      const rightIndex = orderIndex.get(right.id);
      if (leftIndex !== undefined && rightIndex !== undefined) return leftIndex - rightIndex;
      if (leftIndex !== undefined) return -1;
      if (rightIndex !== undefined) return 1;
      return Date.parse(right.updatedAt) - Date.parse(left.updatedAt);
    });

    return profiles.map((profile) => {
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

  startProfileDrag(event: PointerEvent, profileId: string): void {
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    const target = event.target instanceof Element ? event.target : null;
    if (target?.closest('.profile-card-actions')) return;

    this.suppressProfileClickUntil = 0;
    this.profilePointerDrag = {
      profileId,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      active: false,
    };
    (event.currentTarget as HTMLElement | null)?.setPointerCapture(event.pointerId);
  }

  moveProfileDrag(event: PointerEvent): void {
    const drag = this.profilePointerDrag;
    if (!drag || drag.pointerId !== event.pointerId) return;

    if (!drag.active) {
      const distance = Math.hypot(event.clientX - drag.startX, event.clientY - drag.startY);
      if (distance < this.profileDragThreshold) return;

      drag.active = true;
      this.activeMenuProfileId.set(null);
      this.draggedProfileId.set(drag.profileId);
    }

    event.preventDefault();
    const target = this.document
      .elementFromPoint(event.clientX, event.clientY)
      ?.closest<HTMLElement>('[data-profile-id]');
    const targetProfileId = target?.dataset['profileId'];
    if (!targetProfileId || targetProfileId === drag.profileId) return;

    this.moveProfile(drag.profileId, targetProfileId);
  }

  endProfileDrag(event: PointerEvent): void {
    const drag = this.profilePointerDrag;
    if (!drag || drag.pointerId !== event.pointerId) return;

    if (event.currentTarget instanceof HTMLElement && event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    if (drag.active) {
      event.preventDefault();
      this.suppressProfileClickUntil = Date.now() + 300;
    }

    this.profilePointerDrag = null;
    this.draggedProfileId.set(null);
  }

  cancelProfileDrag(event?: PointerEvent): void {
    if (event?.currentTarget instanceof HTMLElement && event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    this.profilePointerDrag = null;
    this.draggedProfileId.set(null);
  }

  suppressProfileClickAfterDrag(event: MouseEvent): void {
    if (Date.now() > this.suppressProfileClickUntil) return;

    this.suppressProfileClickUntil = 0;
    event.preventDefault();
    event.stopPropagation();
  }

  reorderFromKeyboard(event: KeyboardEvent, profileId: string): void {
    if (!event.altKey) return;

    const backwards = event.key === 'ArrowUp';
    const forwards = event.key === 'ArrowDown';
    if (!backwards && !forwards) return;

    const orderedIds = this.profileCards().map((card) => card.profile.id);
    const currentIndex = orderedIds.indexOf(profileId);
    const targetIndex = currentIndex + (backwards ? -1 : 1);
    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= orderedIds.length) return;

    event.preventDefault();
    event.stopPropagation();
    const targetProfileId = orderedIds[targetIndex];
    if (targetProfileId) this.moveProfile(profileId, targetProfileId);
  }

  private moveProfile(profileId: string, targetProfileId: string): void {
    const orderedIds = this.profileCards().map((card) => card.profile.id);
    const sourceIndex = orderedIds.indexOf(profileId);
    const targetIndex = orderedIds.indexOf(targetProfileId);
    if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) return;

    orderedIds.splice(sourceIndex, 1);
    orderedIds.splice(targetIndex, 0, profileId);
    this.preferences.setProfileOrder(orderedIds);
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
