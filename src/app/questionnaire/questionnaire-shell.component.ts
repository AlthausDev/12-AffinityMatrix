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
    <div #viewport class="questionnaire-overlay">
      <section class="questionnaire-window" [attr.aria-label]="i18n.t('questionnaire.windowAria')">
        <header class="questionnaire-window-toolbar">
          <span class="pending-label">{{ pendingLabel(pendingCount()) }}</span>

          <nav class="questionnaire-toolbar-actions" [attr.aria-label]="i18n.t('questionnaire.navigationAria')">
            @if (currentCategoryId()) {
              @if (neighbours().previousCategoryId; as previousId) {
                <a class="button secondary compact-button" [routerLink]="['/profiles', profileId, 'questionnaire', previousId]" [queryParams]="includeFiltered() ? { filtered: '1' } : null">{{ i18n.t('questionnaire.previous') }}</a>
              }
              <a class="button secondary compact-button" [routerLink]="['/profiles', profileId, 'questionnaire']" [queryParams]="includeFiltered() ? { filtered: '1' } : null">{{ i18n.t('common.categories') }}</a>
              @if (neighbours().nextCategoryId; as nextId) {
                <a class="button secondary compact-button" [routerLink]="['/profiles', profileId, 'questionnaire', nextId]" [queryParams]="includeFiltered() ? { filtered: '1' } : null">{{ i18n.t('questionnaire.next') }}</a>
              }
            }
            <button class="button secondary compact-button finish-button" type="button" (click)="requestFinish()">{{ i18n.t('questionnaire.finish.action') }}</button>
          </nav>
        </header>
        <router-outlet />
      </section>
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
  styles: `
    :host { position: relative; z-index: 30; }
    .questionnaire-overlay { position: fixed; inset: 0; z-index: 30; overflow-y: auto; overscroll-behavior: contain; padding: clamp(1rem, 4vw, 3rem); background: rgba(10, 14, 29, 0.78); }
    .questionnaire-window { width: min(100%, 76rem); min-height: min(44rem, calc(100vh - 2rem)); margin: 0 auto; overflow: hidden; border: 2px solid transparent; border-radius: 10px; background: linear-gradient(rgba(24, 31, 49, 0.97), rgba(30, 29, 49, 0.97)) padding-box, var(--window-border-gradient) border-box; box-shadow: 0 1.25rem 3.5rem rgba(4, 6, 16, 0.42); }
    .questionnaire-window-toolbar { position: sticky; top: 0; z-index: 3; display: flex; align-items: center; justify-content: space-between; gap: 1rem; padding: 0.72rem clamp(1rem, 3vw, 2rem); border-bottom: 1px solid color-mix(in srgb, var(--border-subtle) 72%, transparent); background: rgba(25, 32, 52, 0.98); font-size: 0.85rem; }
    .pending-label { color: var(--text-secondary); white-space: nowrap; }
    .questionnaire-toolbar-actions { display: flex; flex-wrap: wrap; align-items: center; justify-content: flex-end; gap: 0.45rem; }
    .compact-button { min-height: 2.25rem; padding: 0.45rem 0.72rem; font-size: 0.8rem; }
    .finish-button { margin-left: 0.3rem; border-color: color-mix(in srgb, var(--preference-boundary) 45%, var(--border-strong)); }
    .questionnaire-exit-backdrop { position: fixed; inset: 0; z-index: 60; display: grid; place-items: center; padding: 1rem; background: rgba(5, 7, 16, 0.86); }
    .questionnaire-exit-dialog { width: min(100%, 34rem); padding: clamp(1.25rem, 4vw, 2rem); border: 2px solid transparent; border-radius: 10px; background: linear-gradient(rgba(27, 34, 54, 0.99), rgba(30, 27, 49, 0.99)) padding-box, var(--window-border-gradient) border-box; box-shadow: 0 1.25rem 4rem rgba(0, 0, 0, 0.5); }
    .questionnaire-exit-dialog p { line-height: 1.55; }
    .exit-preference { margin: 1.25rem 0; background: rgba(39, 49, 74, 0.88); }
    @media (max-width: 820px) { .questionnaire-window-toolbar { align-items: flex-start; flex-direction: column; } .questionnaire-toolbar-actions { width: 100%; justify-content: flex-start; } }
    @media (max-width: 720px) { .questionnaire-overlay { padding: 0; } .questionnaire-window { min-height: 100vh; border-radius: 0; } .questionnaire-toolbar-actions .button { flex: 1 1 auto; } .finish-button { margin-left: 0; } }
  `,
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
    const snapshot = this.catalogueStore.snapshot(); const categoryId = this.currentCategoryId();
    return snapshot && categoryId ? this.questionnaireService.getNeighbours(snapshot, categoryId, this.hiddenCategoryIds()) : {};
  });
  readonly pendingCount = computed(() => {
    const profile = this.profile(); const snapshot = this.catalogueStore.snapshot();
    if (!profile || !snapshot) return 0;
    return this.questionnaireService.getCategorySummaries(snapshot, profile, false, this.hiddenCategoryIds()).reduce((pending, summary) => pending + Math.max(0, summary.total - summary.answered), 0);
  });

  constructor() {
    this.lockBackgroundScroll();
    this.syncRouteState(this.router.url);
    this.lastRoutePath = this.routePath(this.router.url);
    void this.catalogueStore.initialize();
    this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd), takeUntilDestroyed()).subscribe((event) => {
      const nextPath = this.routePath(event.urlAfterRedirects); const routeChanged = nextPath !== this.lastRoutePath;
      this.lastRoutePath = nextPath; this.syncRouteState(event.urlAfterRedirects);
      if (routeChanged) queueMicrotask(() => this.scrollToTop());
    });
  }

  requestFinish(): void { if (!this.preferences.confirmQuestionnaireExit()) { this.navigateToProfile(); return; } this.dontAskAgain.set(false); this.finishDialogOpen.set(true); }
  requestCompletion(): void { if (this.pendingCount() === 0) { this.navigateToProfile(); return; } this.requestFinish(); }
  continueQuestionnaire(): void { this.finishDialogOpen.set(false); this.dontAskAgain.set(false); }
  confirmFinish(): void { if (this.dontAskAgain()) this.preferences.setConfirmQuestionnaireExit(false); this.finishDialogOpen.set(false); this.navigateToProfile(); }
  toggleDontAskAgain(event: Event): void { this.dontAskAgain.set((event.target as HTMLInputElement).checked); }
  pendingLabel(count: number): string { return count === 0 ? this.i18n.t('questionnaire.pending.complete') : this.i18n.plural(count, 'questionnaire.pending.one', 'questionnaire.pending.other'); }
  finishDescription(count: number): string { return count === 0 ? this.i18n.t('questionnaire.finish.complete') : this.i18n.plural(count, 'questionnaire.finish.remaining.one', 'questionnaire.finish.remaining.other'); }

  private navigateToProfile(): void { void this.router.navigate(['/profiles', this.profileId]); }
  private syncRouteState(url: string): void {
    const tree = this.router.parseUrl(url); const segments = tree.root.children['primary']?.segments.map((segment) => segment.path) ?? [];
    const questionnaireIndex = segments.indexOf('questionnaire'); const categoryId = questionnaireIndex >= 0 ? segments[questionnaireIndex + 1] ?? null : null;
    this.currentCategoryId.set(categoryId); this.includeFiltered.set(tree.queryParams['filtered'] === '1');
  }
  private lockBackgroundScroll(): void {
    const body = this.document.body; const previousBodyOverflow = body.style.overflow; const previousBodyOverscroll = body.style.overscrollBehavior;
    body.style.overflow = 'hidden'; body.style.overscrollBehavior = 'none';
    this.destroyRef.onDestroy(() => { body.style.overflow = previousBodyOverflow; body.style.overscrollBehavior = previousBodyOverscroll; });
  }
  private routePath(url: string): string { return url.split('?')[0] ?? url; }
  private scrollToTop(): void { this.viewport?.nativeElement.scrollTo({ top: 0, behavior: 'auto' }); }
}
