import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Profile } from '../../../domain/profile/profile';
import { PROFILE_ALIAS_MAX_LENGTH, Sex, SexualOrientation } from '../../../domain/profile/profile-metadata';
import { CatalogueStore } from '../../core/catalogue.store';
import { PROFILE_STORAGE_CONTEXT } from '../../core/profile-repository.token';
import { ProfileStore } from '../../core/profile.store';
import { QUESTIONNAIRE_SERVICE } from '../../core/questionnaire-service.token';
import { ProfileSortMode, UiPreferencesService } from '../../core/ui-preferences.service';
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

type ProfileDropPosition = 'before' | 'after';

interface ProfilePointerDragState {
  readonly profileId: string;
  readonly pointerId: number;
  targetProfileId: string | null;
  dropPosition: ProfileDropPosition | null;
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
        <p class="alert profile-storage-alert" role="alert">{{ i18n.t('homeHub.storage.error') }}</p>
      } @else if (storageContext.mode !== 'persistent') {
        <p class="profile-storage-notice" role="status">
          <span aria-hidden="true">◇</span>
          {{ i18n.t(storageContext.mode === 'session' ? 'homeHub.storage.session' : 'homeHub.storage.memory') }}
        </p>
      }

      <section
        class="profiles-section"
        [class.profile-reorder-mode]="reorderMode()"
        [class.profile-manual-reorder-mode]="manualReorderEnabled()"
        aria-labelledby="local-profiles-title"
      >
        <div class="profiles-toolbar">
          <div class="profiles-heading">
            <div>
              <p class="eyebrow">{{ i18n.t('homeHub.profiles.eyebrow') }}</p>
              <div class="profiles-title-row">
                <h2 id="local-profiles-title">{{ i18n.t('homeHub.profiles.title') }}</h2>
                <span class="profile-count-pill">{{ profileCards().length }}</span>
                @if (profileCards().length > 1) {
                  <button
                    class="profile-order-button"
                    type="button"
                    [attr.aria-pressed]="reorderMode()"
                    (click)="toggleReorderMode()"
                  >
                    <span aria-hidden="true">{{ reorderMode() ? '✓' : '↕' }}</span>
                    {{ i18n.t(reorderMode() ? 'homeHub.profiles.orderDone' : 'homeHub.profiles.order') }}
                  </button>
                }
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

        @if (reorderMode() && profileCards().length > 1) {
          <div class="profile-order-tools">
            <div class="profile-sort-options" role="group" [attr.aria-label]="i18n.t('homeHub.profiles.sortOptionsLabel')">
              @for (mode of profileSortModes; track mode) {
                <button
                  class="profile-sort-option"
                  type="button"
                  [attr.aria-pressed]="profileSortMode() === mode"
                  (click)="setProfileSortMode(mode)"
                >{{ sortModeLabel(mode) }}</button>
              }
            </div>
            <p class="profile-reorder-hint" role="status">
              {{ i18n.t(profileSortMode() === 'manual' ? 'homeHub.profiles.orderHint.manual' : 'homeHub.profiles.orderHint.sorted') }}
            </p>
          </div>
        }

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
                [class.profile-card-drop-before]="dragTargetProfileId() === card.profile.id && dragDropPosition() === 'before'"
                [class.profile-card-drop-after]="dragTargetProfileId() === card.profile.id && dragDropPosition() === 'after'"
                [attr.data-profile-id]="card.profile.id"
                (pointerdown)="startProfileDrag($event, card.profile.id)"
                (pointermove)="moveProfileDrag($event)"
                (pointerup)="endProfileDrag($event)"
                (pointercancel)="cancelProfileDrag()"
                (lostpointercapture)="cancelProfileDrag()"
                (contextmenu)="suppressProfileContextMenu($event)"
              >
                <a
                  class="profile-card-main"
                  [routerLink]="reorderMode() ? null : ['/profiles', card.profile.id]"
                  [attr.aria-disabled]="reorderMode() ? 'true' : null"
                  [attr.tabindex]="manualReorderEnabled() ? 0 : reorderMode() ? -1 : null"
                  [attr.aria-keyshortcuts]="manualReorderEnabled() ? 'Alt+ArrowUp Alt+ArrowDown' : null"
                  [attr.title]="profileDisplayName(card.profile)"
                  draggable="false"
                  (click)="suppressProfileNavigationInReorderMode($event)"
                  (dragstart)="$event.preventDefault()"
                  (keydown)="reorderFromKeyboard($event, card.profile.id)"
                >
                  <header class="profile-card-header">
                    <div class="profile-title-copy">
                      <h3>{{ profileDisplayName(card.profile) }}</h3>
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

                @if (!reorderMode()) {
                  <div class="profile-card-actions">
                    <button
                      class="profile-menu-button"
                      type="button"
                      [attr.aria-label]="i18n.t('homeHub.profile.menu', { alias: profileDisplayName(card.profile) })"
                      [attr.aria-expanded]="activeMenuProfileId() === card.profile.id"
                      [attr.aria-controls]="'profile-actions-' + card.profile.id"
                      (click)="toggleProfileMenu(card.profile.id)"
                    >⋯</button>

                    @if (activeMenuProfileId() === card.profile.id) {
                      <div
                        class="profile-menu"
                        [id]="'profile-actions-' + card.profile.id"
                        (keydown.escape)="closeProfileMenu($event)"
                      >
                        <button
                          class="profile-menu-action"
                          type="button"
                          [disabled]="profileStore.saving()"
                          (click)="duplicateProfile(card.profile)"
                        >{{ i18n.t('homeHub.profile.duplicate') }}</button>
                        <button
                          class="profile-menu-action profile-menu-action-danger"
                          type="button"
                          (click)="requestDeletion(card.profile)"
                        >{{ i18n.t('profileDeletion.homeAction') }}</button>
                      </div>
                    }
                  </div>
                }
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

      <p class="profile-live-region" aria-live="polite" aria-atomic="true">{{ liveAnnouncement() }}</p>
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
  readonly storageContext = inject(PROFILE_STORAGE_CONTEXT);
  private readonly questionnaireService = inject(QUESTIONNAIRE_SERVICE);
  private readonly preferences = inject(UiPreferencesService);
  private readonly document = inject(DOCUMENT);

  readonly appVersion = APP_VERSION;
  readonly productName = PRODUCT_NAME;
  readonly productMonogram = PRODUCT_MONOGRAM;
  readonly currentYear = new Date().getFullYear();
  readonly profileSortModes: readonly ProfileSortMode[] = ['manual', 'recent', 'completion', 'alias'];
  readonly pendingDeletion = signal<Profile | null>(null);
  readonly activeMenuProfileId = signal<string | null>(null);
  readonly reorderMode = signal(false);
  readonly draggedProfileId = signal<string | null>(null);
  readonly dragTargetProfileId = signal<string | null>(null);
  readonly dragDropPosition = signal<ProfileDropPosition | null>(null);
  readonly liveAnnouncement = signal('');
  readonly profileSortMode = computed(() => this.preferences.profileSortMode());
  readonly manualReorderEnabled = computed(() => this.reorderMode() && this.profileSortMode() === 'manual');
  private profilePointerDrag: ProfilePointerDragState | null = null;

  readonly profileCards = computed<readonly ProfileCardView[]>(() => {
    const snapshot = this.catalogueStore.snapshot();
    const cards = this.profileStore.profiles().map((profile): ProfileCardView => {
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

    const updatedDescending = (left: ProfileCardView, right: ProfileCardView) =>
      Date.parse(right.profile.updatedAt) - Date.parse(left.profile.updatedAt);
    const mode = this.profileSortMode();

    if (mode === 'recent') return [...cards].sort(updatedDescending);
    if (mode === 'completion') {
      return [...cards].sort((left, right) =>
        ((right.completionPercentage ?? -1) - (left.completionPercentage ?? -1)) || updatedDescending(left, right),
      );
    }
    if (mode === 'alias') {
      const collator = new Intl.Collator(this.i18n.locale(), { sensitivity: 'base', numeric: true });
      return [...cards].sort((left, right) =>
        collator.compare(this.profileDisplayName(left.profile), this.profileDisplayName(right.profile)) ||
        updatedDescending(left, right),
      );
    }

    const manualOrder = this.manualProfileIds();
    const orderIndex = new Map(manualOrder.map((profileId, index) => [profileId, index]));
    return [...cards].sort((left, right) =>
      (orderIndex.get(left.profile.id) ?? Number.MAX_SAFE_INTEGER) -
      (orderIndex.get(right.profile.id) ?? Number.MAX_SAFE_INTEGER),
    );
  });

  constructor() {
    void this.catalogueStore.initialize();
  }

  answersLabel(count: number): string {
    return this.i18n.plural(count, 'homeHub.profile.answers.one', 'homeHub.profile.answers.other');
  }

  profileDisplayName(profile: Profile): string {
    return profile.metadata.alias?.trim() || this.i18n.t('common.untitledProfile');
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

  sortModeLabel(mode: ProfileSortMode): string {
    if (mode === 'recent') return this.i18n.t('homeHub.profiles.sort.recent');
    if (mode === 'completion') return this.i18n.t('homeHub.profiles.sort.completion');
    if (mode === 'alias') return this.i18n.t('homeHub.profiles.sort.alias');
    return this.i18n.t('homeHub.profiles.sort.manual');
  }

  setProfileSortMode(mode: ProfileSortMode): void {
    if (mode === this.profileSortMode()) return;
    this.cancelProfileDrag();
    this.preferences.setProfileSortMode(mode);
    this.liveAnnouncement.set(this.i18n.t('homeHub.profiles.sortApplied', { sort: this.sortModeLabel(mode) }));
  }

  toggleProfileMenu(profileId: string): void {
    this.activeMenuProfileId.update((current) => current === profileId ? null : profileId);
  }

  closeProfileMenu(event?: Event): void {
    event?.preventDefault();
    event?.stopPropagation();
    this.activeMenuProfileId.set(null);
  }

  async duplicateProfile(profile: Profile): Promise<void> {
    this.activeMenuProfileId.set(null);
    const previousManualOrder = this.manualProfileIds();
    const copyAlias = this.copyAliasFor(profile);
    const duplicate = await this.profileStore.duplicate(profile.id, { ...profile.metadata, alias: copyAlias });
    if (!duplicate) return;

    const sourceIndex = previousManualOrder.indexOf(profile.id);
    const nextOrder = [...previousManualOrder];
    nextOrder.splice(sourceIndex >= 0 ? sourceIndex + 1 : nextOrder.length, 0, duplicate.id);
    this.preferences.setProfileOrder(nextOrder);
    this.liveAnnouncement.set(this.i18n.t('homeHub.profile.duplicated'));
  }

  requestDeletion(profile: Profile): void {
    this.activeMenuProfileId.set(null);
    this.pendingDeletion.set(profile);
  }

  toggleReorderMode(): void {
    this.cancelProfileDrag();
    this.activeMenuProfileId.set(null);
    this.reorderMode.update((current) => !current);
  }

  startProfileDrag(event: PointerEvent, profileId: string): void {
    if (!this.manualReorderEnabled()) return;
    if (event.pointerType === 'mouse' && event.button !== 0) return;

    event.preventDefault();
    this.activeMenuProfileId.set(null);
    this.profilePointerDrag = {
      profileId,
      pointerId: event.pointerId,
      targetProfileId: null,
      dropPosition: null,
    };
    this.draggedProfileId.set(profileId);

    const card = event.currentTarget as HTMLElement | null;
    if (card && !card.hasPointerCapture(event.pointerId)) {
      try {
        card.setPointerCapture(event.pointerId);
      } catch {
        // Drag can continue while the pointer remains over the card if capture is unavailable.
      }
    }
  }

  moveProfileDrag(event: PointerEvent): void {
    if (!this.manualReorderEnabled()) return;

    const drag = this.profilePointerDrag;
    if (!drag || drag.pointerId !== event.pointerId) return;

    event.preventDefault();
    const target = this.document
      .elementFromPoint(event.clientX, event.clientY)
      ?.closest<HTMLElement>('[data-profile-id]');
    const targetProfileId = target?.dataset['profileId'];

    if (!target || !targetProfileId || targetProfileId === drag.profileId) {
      this.setDragTarget(drag, null, null);
      return;
    }

    const bounds = target.getBoundingClientRect();
    const dropPosition: ProfileDropPosition = event.clientY < bounds.top + (bounds.height / 2)
      ? 'before'
      : 'after';
    this.setDragTarget(drag, targetProfileId, dropPosition);
  }

  endProfileDrag(event: PointerEvent): void {
    const drag = this.profilePointerDrag;
    if (!drag || drag.pointerId !== event.pointerId) return;

    const shouldDrop = drag.targetProfileId !== null && drag.dropPosition !== null;
    const targetProfileId = drag.targetProfileId;
    const dropPosition = drag.dropPosition;

    event.preventDefault();
    this.resetProfileDrag();

    if (shouldDrop && targetProfileId && dropPosition) {
      this.placeProfile(drag.profileId, targetProfileId, dropPosition);
    }
  }

  cancelProfileDrag(): void {
    this.resetProfileDrag();
  }

  suppressProfileContextMenu(event: MouseEvent): void {
    if (!this.manualReorderEnabled()) return;

    event.preventDefault();
    event.stopPropagation();
  }

  suppressProfileNavigationInReorderMode(event: MouseEvent): void {
    if (!this.reorderMode()) return;

    event.preventDefault();
    event.stopPropagation();
  }

  reorderFromKeyboard(event: KeyboardEvent, profileId: string): void {
    if (!this.manualReorderEnabled() || !event.altKey) return;

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

  private manualProfileIds(): string[] {
    const manualOrder = this.preferences.profileOrder();
    const orderIndex = new Map(manualOrder.map((profileId, index) => [profileId, index]));
    return [...this.profileStore.profiles()]
      .sort((left, right) => {
        const leftIndex = orderIndex.get(left.id);
        const rightIndex = orderIndex.get(right.id);
        if (leftIndex !== undefined && rightIndex !== undefined) return leftIndex - rightIndex;
        if (leftIndex !== undefined) return -1;
        if (rightIndex !== undefined) return 1;
        return Date.parse(right.updatedAt) - Date.parse(left.updatedAt);
      })
      .map((profile) => profile.id);
  }

  private copyAliasFor(profile: Profile): string {
    const desired = this.i18n.t('homeHub.profile.copyName', { alias: this.profileDisplayName(profile) });
    return desired.length <= PROFILE_ALIAS_MAX_LENGTH
      ? desired
      : desired.slice(0, PROFILE_ALIAS_MAX_LENGTH).trimEnd();
  }

  private setDragTarget(
    drag: ProfilePointerDragState,
    targetProfileId: string | null,
    dropPosition: ProfileDropPosition | null,
  ): void {
    drag.targetProfileId = targetProfileId;
    drag.dropPosition = dropPosition;
    this.dragTargetProfileId.set(targetProfileId);
    this.dragDropPosition.set(dropPosition);
  }

  private resetProfileDrag(): void {
    this.profilePointerDrag = null;
    this.draggedProfileId.set(null);
    this.dragTargetProfileId.set(null);
    this.dragDropPosition.set(null);
  }

  private placeProfile(profileId: string, targetProfileId: string, position: ProfileDropPosition): void {
    const orderedIds = this.profileCards().map((card) => card.profile.id);
    const originalOrder = [...orderedIds];
    const sourceIndex = orderedIds.indexOf(profileId);
    if (sourceIndex < 0) return;

    orderedIds.splice(sourceIndex, 1);
    const targetIndex = orderedIds.indexOf(targetProfileId);
    if (targetIndex < 0) return;

    const insertionIndex = position === 'after' ? targetIndex + 1 : targetIndex;
    orderedIds.splice(insertionIndex, 0, profileId);
    if (orderedIds.every((id, index) => id === originalOrder[index])) return;

    this.preferences.setProfileOrder(orderedIds);
    this.announceProfilePosition(profileId, orderedIds);
  }

  private moveProfile(profileId: string, targetProfileId: string): void {
    const orderedIds = this.profileCards().map((card) => card.profile.id);
    const sourceIndex = orderedIds.indexOf(profileId);
    const targetIndex = orderedIds.indexOf(targetProfileId);
    if (sourceIndex < 0 || targetIndex < 0 || sourceIndex === targetIndex) return;

    orderedIds.splice(sourceIndex, 1);
    orderedIds.splice(targetIndex, 0, profileId);
    this.preferences.setProfileOrder(orderedIds);
    this.announceProfilePosition(profileId, orderedIds);
  }

  private announceProfilePosition(profileId: string, orderedIds: readonly string[]): void {
    const profile = this.profileStore.findById(profileId);
    const position = orderedIds.indexOf(profileId) + 1;
    if (!profile || position <= 0) return;
    this.liveAnnouncement.set(this.i18n.t('homeHub.profiles.moved', {
      alias: this.profileDisplayName(profile),
      position,
      total: orderedIds.length,
    }));
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
