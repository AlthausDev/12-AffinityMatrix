import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { CatalogueStore } from '../core/catalogue.store';
import { ProfileStore } from '../core/profile.store';
import { QUESTIONNAIRE_SERVICE } from '../core/questionnaire-service.token';
import { TranslationService } from '../i18n/translation.service';
import { findRouteParam } from '../shared/route-param';

@Component({
  selector: 'app-questionnaire-shell',
  imports: [RouterOutlet],
  template: `
    <div #viewport class="questionnaire-overlay">
      <section class="questionnaire-window" [attr.aria-label]="i18n.t('questionnaire.windowAria')">
        <header class="questionnaire-window-toolbar">
          <span class="muted">{{ pendingLabel(pendingCount()) }}</span>
          <button class="button secondary" type="button" (click)="requestFinish()">
            {{ i18n.t('questionnaire.finish.action') }}
          </button>
        </header>
        <router-outlet />
      </section>
    </div>

    @if (finishDialogOpen()) {
      <div class="questionnaire-exit-backdrop">
        <section
          class="questionnaire-exit-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="questionnaire-exit-title"
          aria-describedby="questionnaire-exit-description"
        >
          <p class="eyebrow">{{ i18n.t('questionnaire.finish.eyebrow') }}</p>
          <h2 id="questionnaire-exit-title">{{ i18n.t('questionnaire.finish.title') }}</h2>
          <p id="questionnaire-exit-description" class="muted">
            {{ finishDescription(pendingCount()) }}
          </p>
          <p class="muted">{{ i18n.t('questionnaire.finish.saved') }}</p>
          <div class="form-actions">
            <button class="button secondary" type="button" (click)="continueQuestionnaire()">
              {{ i18n.t('questionnaire.finish.continue') }}
            </button>
            <button class="button" type="button" (click)="confirmFinish()">
              {{ i18n.t('questionnaire.finish.exit') }}
            </button>
          </div>
        </section>
      </div>
    }
  `,
  styles: `
    .questionnaire-overlay {
      position: fixed;
      inset: 0;
      z-index: 10;
      overflow-y: auto;
      padding: clamp(1rem, 4vw, 3rem);
      background: rgba(8, 10, 15, 0.76);
      backdrop-filter: blur(4px);
    }
    .questionnaire-window {
      width: min(100%, 76rem);
      min-height: min(44rem, calc(100vh - 2rem));
      margin: 0 auto;
      overflow: hidden;
      border: 2px solid transparent;
      border-radius: 10px;
      background:
        linear-gradient(rgba(17, 19, 24, 0.96), rgba(17, 19, 24, 0.96)) padding-box,
        var(--window-border-gradient) border-box;
      box-shadow: 0 1.5rem 5rem rgba(0, 0, 0, 0.48);
    }
    .questionnaire-window-toolbar {
      position: sticky;
      top: 0;
      z-index: 3;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.75rem clamp(1rem, 3vw, 2rem);
      border-bottom: 1px solid var(--border-subtle);
      background: rgba(25, 28, 34, 0.94);
      backdrop-filter: blur(8px);
      font-size: 0.85rem;
    }
    .questionnaire-exit-backdrop {
      position: fixed;
      inset: 0;
      z-index: 40;
      display: grid;
      place-items: center;
      padding: 1rem;
      background: rgba(5, 6, 9, 0.78);
    }
    .questionnaire-exit-dialog {
      width: min(100%, 34rem);
      padding: clamp(1.25rem, 4vw, 2rem);
      border: 2px solid transparent;
      border-radius: 10px;
      background:
        linear-gradient(var(--surface-panel), var(--surface-panel)) padding-box,
        var(--window-border-gradient) border-box;
      box-shadow: 0 1.25rem 4rem rgba(0, 0, 0, 0.55);
    }
    .questionnaire-exit-dialog p { line-height: 1.55; }
    @media (max-width: 720px) {
      .questionnaire-overlay { padding: 0; }
      .questionnaire-window { min-height: 100vh; border-radius: 0; }
      .questionnaire-window-toolbar { align-items: stretch; flex-direction: column; }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionnaireShellComponent {
  @ViewChild('viewport') private viewport?: ElementRef<HTMLElement>;

  readonly i18n = inject(TranslationService);
  readonly catalogueStore = inject(CatalogueStore);
  private readonly profileStore = inject(ProfileStore);
  private readonly questionnaireService = inject(QUESTIONNAIRE_SERVICE);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly profileId = findRouteParam(this.route, 'id') ?? '';

  readonly finishDialogOpen = signal(false);
  readonly profile = computed(() => this.profileStore.findById(this.profileId));
  readonly pendingCount = computed(() => {
    const profile = this.profile();
    const snapshot = this.catalogueStore.snapshot();
    if (!profile || !snapshot) return 0;

    return this.questionnaireService
      .getCategorySummaries(snapshot, profile, false)
      .reduce((pending, summary) => pending + Math.max(0, summary.total - summary.answered), 0);
  });

  constructor() {
    void this.catalogueStore.initialize();
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => queueMicrotask(() => this.scrollToTop()));
  }

  requestFinish(): void {
    this.finishDialogOpen.set(true);
  }

  continueQuestionnaire(): void {
    this.finishDialogOpen.set(false);
  }

  confirmFinish(): void {
    this.finishDialogOpen.set(false);
    void this.router.navigate(['/profiles', this.profileId]);
  }

  pendingLabel(count: number): string {
    return count === 0
      ? this.i18n.t('questionnaire.pending.complete')
      : this.i18n.plural(count, 'questionnaire.pending.one', 'questionnaire.pending.other');
  }

  finishDescription(count: number): string {
    return count === 0
      ? this.i18n.t('questionnaire.finish.complete')
      : this.i18n.plural(count, 'questionnaire.finish.remaining.one', 'questionnaire.finish.remaining.other');
  }

  private scrollToTop(): void {
    this.viewport?.nativeElement.scrollTo({ top: 0, behavior: 'auto' });
  }
}
