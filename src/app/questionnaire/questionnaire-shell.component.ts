import { DOCUMENT } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { CatalogueStore } from '../core/catalogue.store';
import { ProfileStore } from '../core/profile.store';
import { QUESTIONNAIRE_SERVICE } from '../core/questionnaire-service.token';
import { UiPreferencesService } from '../core/ui-preferences.service';
import { TranslationService } from '../i18n/translation.service';
import { findRouteParam } from '../shared/route-param';

@Component({
  selector: 'app-questionnaire-shell',
  imports: [RouterLink, RouterOutlet],
  template: `
    <div
      #viewport
      class="questionnaire-overlay"
      [class.category-navigation-active]="currentCategoryId()"
    >
      <header class="questionnaire-top-dock">
        <div class="questionnaire-dock-inner toolbar-primary">
          <span class="pending-label pending-label-full">{{ pendingLabel(pendingCount()) }}</span>
          <span class="pending-label pending-label-short">{{ pendingShortLabel(pendingCount()) }}</span>

          <nav
            class="toolbar-global-actions"
            [class.category-navigation-active]="currentCategoryId()"
            [attr.aria-label]="i18n.t('questionnaire.navigationAria')"
          >
            @if (currentCategoryId()) {
              <a
                class="button secondary compact-button categories-button"
                [routerLink]="['/profiles', profileId, 'questionnaire']"
                [queryParams]="includeFiltered() ? { filtered: '1' } : null"
              >{{ i18n.t('common.categories') }}</a>
            }
            <button class="button compact-button exit-button" type="button" (click)="requestFinish()">
              {{ i18n.t('questionnaire.finish.action') }}
            </button>
          </nav>
        </div>
      </header>

      @if (currentCategoryId()) {
        <nav class="questionnaire-bottom-dock" [attr.aria-label]="i18n.t('questionnaire.navigationAria')">
          <div class="questionnaire-dock-inner toolbar-sequence-actions">
            <span class="sequence-slot sequence-slot-previous">
              @if (neighbours().previousCategoryId; as previousId) {
                <a
                  class="button secondary compact-button sequence-button"
                  [routerLink]="['/profiles', profileId, 'questionnaire', previousId]"
                  [queryParams]="includeFiltered() ? { filtered: '1' } : null"
                >{{ i18n.t('questionnaire.previous') }}</a>
              } @else {
                <span class="sequence-placeholder" aria-hidden="true"></span>
              }
            </span>

            @if (currentCategoryProgress(); as categoryProgress) {
              <span
                class="category-dock-progress"
                [attr.aria-label]="i18n.t('questionnaire.category.progressAria', {
                  answered: categoryProgress.answered,
                  total: categoryProgress.total,
                  percentage: categoryProgress.completionPercentage
                })"
              >
                <span class="category-dock-progress-text">
                  {{ i18n.t('questionnaire.category.dockProgress', { answered: categoryProgress.answered, total: categoryProgress.total }) }}
                </span>
                <span class="category-dock-progress-track" aria-hidden="true">
                  <span
                    class="category-dock-progress-fill"
                    [style.width.%]="categoryProgress.completionPercentage"
                  ></span>
                </span>
              </span>
            }

            <span class="sequence-slot sequence-slot-next">
              @if (neighbours().nextCategoryId; as nextId) {
                <a
                  class="button secondary compact-button sequence-button"
                  [routerLink]="['/profiles', profileId, 'questionnaire', nextId]"
                  [queryParams]="includeFiltered() ? { filtered: '1' } : null"
                >{{ i18n.t('questionnaire.next') }}</a>
              } @else {
                <span class="sequence-placeholder" aria-hidden="true"></span>
              }
            </span>
          </div>
        </nav>
      }

      <section class="questionnaire-window" [attr.aria-label]="i18n.t('questionnaire.windowAria')">
        <router-outlet />
      </section>

      <nav class="questionnaire-scroll-controls" [attr.aria-label]="i18n.t('questionnaire.scroll.aria')">
        <button type="button" [attr.aria-label]="i18n.t('questionnaire.scroll.top')" [attr.title]="i18n.t('questionnaire.scroll.top')" (click)="scrollToTop()">↑</button>
        <button type="button" [attr.aria-label]="i18n.t('questionnaire.scroll.bottom')" [attr.title]="i18n.t('questionnaire.scroll.bottom')" (click)="scrollToBottom()">↓</button>
      </nav>
    </div>

    @if (finishDialogOpen()) {
      <div class="questionnaire-exit-backdrop">
        <section class="questionnaire-exit-dialog" role="dialog" aria-modal="true" aria-labelledby="questionnaire-exit-title" aria-describedby="questionnaire-exit-description">
          <p class="eyebrow">{{ i18n.t('questionnaire.finish.eyebrow') }}</p>
          <h2 id="questionnaire-exit-title">{{ i18n.t('questionnaire.finish.title') }}</h2>
          <p id="questionnaire-exit-description" class="muted">{{ finishDescription(pendingCount()) }}</p>
          <p class="muted">{{ i18n.t('questionnaire.finish.saved') }}</p>
          <label class="check-field exit-preference">
            <input type="checkbox" [checked]="dontAskAgain()" (change)="toggleDontAskAgain($event)" />
            <span><strong>{{ i18n.t('questionnaire.finish.dontAskAgain') }}</strong><small>{{ i18n.t('questionnaire.finish.dontAskAgainHint') }}</small></span>
          </label>
          <div class="form-actions">
            <button class="button secondary" type="button" (click)="continueQuestionnaire()">{{ i18n.t('questionnaire.finish.continue') }}</button>
            <button class="button" type="button" (click)="confirmFinish()">{{ i18n.t('questionnaire.finish.exit') }}</button>
          </div>
        </section>
      </div>
    }
  `,
  styleUrls: ['./questionnaire-shell.css', './questionnaire-progress.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionnaireShellComponent {
  @ViewChild('viewport') private viewport?: ElementRef<HTMLElement>;

  readonly i18n = inject(TranslationService);
  readonly catalogueStore = inject(CatalogueStore);
  private readonly profileStore = inject(ProfileStore);
  private readonly questionnaireService = inject(QUESTIONNAIRE_SERVICE);
  private readonly preferences = inject(UiPreferencesService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly document = inject(DOCUMENT);
  private readonly destroyRef = inject(DestroyRef);
  private lastRoutePath = '';

  readonly profileId = findRouteParam(this.route, 'id') ?? '';
  readonly finishDialogOpen = signal(false);
  readonly dontAskAgain = signal(false);
  readonly currentCategoryId = signal<string | null>(null);
  readonly includeFiltered = signal(false);
  readonly profile = computed(() => this.profileStore.findById(this.profileId));
  readonly hiddenCategoryIds = computed(() => this.preferences.hiddenCategoryIds(this.profileId));
  readonly neighbours = computed(() => {
    const snapshot = this.catalogueStore.snapshot();
    const categoryId = this.currentCategoryId();
    return snapshot && categoryId
      ? this.questionnaireService.getNeighbours(snapshot, categoryId, this.hiddenCategoryIds())
      : {};
  });
  readonly currentCategoryProgress = computed(() => {
    const profile = this.profile();
    const snapshot = this.catalogueStore.snapshot();
    const categoryId = this.currentCategoryId();
    return profile && snapshot && categoryId
      ? this.questionnaireService.getCategory(snapshot, profile, categoryId, this.includeFiltered())
      : undefined;
  });
  readonly pendingCount = computed(() => {
    const profile = this.profile();
    const snapshot = this.catalogueStore.snapshot();
    if (!profile || !snapshot) return 0;
    return this.questionnaireService
      .getCategorySummaries(snapshot, profile, false, this.hiddenCategoryIds())
      .reduce((pending, summary) => pending + Math.max(0, summary.total - summary.answered), 0);
  });

  constructor() {
    this.lockBackgroundScroll();
    this.syncRouteState(this.router.url);
    this.lastRoutePath = this.routePath(this.router.url);
    void this.catalogueStore.initialize();
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd), takeUntilDestroyed())
      .subscribe((event) => {
        const nextPath = this.routePath(event.urlAfterRedirects);
        const routeChanged = nextPath !== this.lastRoutePath;
        this.lastRoutePath = nextPath;
        this.syncRouteState(event.urlAfterRedirects);
        if (routeChanged) queueMicrotask(() => this.scrollToTop());
      });
  }

  requestFinish(): void {
    if (!this.preferences.confirmQuestionnaireExit()) {
      this.navigateToProfile();
      return;
    }
    this.dontAskAgain.set(false);
    this.finishDialogOpen.set(true);
  }

  continueQuestionnaire(): void {
    this.finishDialogOpen.set(false);
    this.dontAskAgain.set(false);
  }

  confirmFinish(): void {
    if (this.dontAskAgain()) this.preferences.setConfirmQuestionnaireExit(false);
    this.finishDialogOpen.set(false);
    this.navigateToProfile();
  }

  toggleDontAskAgain(event: Event): void {
    this.dontAskAgain.set((event.target as HTMLInputElement).checked);
  }

  pendingLabel(count: number): string {
    return count === 0
      ? this.i18n.t('questionnaire.pending.complete')
      : this.i18n.plural(count, 'questionnaire.pending.one', 'questionnaire.pending.other');
  }

  pendingShortLabel(count: number): string {
    return count === 0
      ? this.i18n.t('questionnaire.pending.short.complete')
      : this.i18n.plural(count, 'questionnaire.pending.short.one', 'questionnaire.pending.short.other');
  }

  finishDescription(count: number): string {
    return count === 0
      ? this.i18n.t('questionnaire.finish.complete')
      : this.i18n.plural(count, 'questionnaire.finish.remaining.one', 'questionnaire.finish.remaining.other');
  }

  scrollToTop(): void {
    this.viewport?.nativeElement.scrollTo({ top: 0, behavior: this.scrollBehavior() });
  }

  scrollToBottom(): void {
    const viewport = this.viewport?.nativeElement;
    if (viewport) viewport.scrollTo({ top: viewport.scrollHeight, behavior: this.scrollBehavior() });
  }

  private navigateToProfile(): void {
    void this.router.navigate(['/profiles', this.profileId]);
  }

  private syncRouteState(url: string): void {
    const tree = this.router.parseUrl(url);
    const segments = tree.root.children['primary']?.segments.map((segment) => segment.path) ?? [];
    const questionnaireIndex = segments.indexOf('questionnaire');
    const categoryId = questionnaireIndex >= 0 ? segments[questionnaireIndex + 1] ?? null : null;
    this.currentCategoryId.set(categoryId);
    this.includeFiltered.set(tree.queryParams['filtered'] === '1');
  }

  private lockBackgroundScroll(): void {
    const body = this.document.body;
    const previousBodyOverflow = body.style.overflow;
    const previousBodyOverscroll = body.style.overscrollBehavior;
    body.style.overflow = 'hidden';
    body.style.overscrollBehavior = 'none';
    this.destroyRef.onDestroy(() => {
      body.style.overflow = previousBodyOverflow;
      body.style.overscrollBehavior = previousBodyOverscroll;
    });
  }

  private routePath(url: string): string {
    return url.split('?')[0] ?? url;
  }

  private scrollBehavior(): ScrollBehavior {
    return this.document.defaultView?.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
  }
}
