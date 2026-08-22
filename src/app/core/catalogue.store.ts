import { Injectable, inject, signal } from '@angular/core';
import { CatalogueSnapshot } from '../../domain/catalogue/catalogue-snapshot';
import { CATALOGUE_SERVICE } from './catalogue-service.token';

@Injectable({ providedIn: 'root' })
export class CatalogueStore {
  private readonly service = inject(CATALOGUE_SERVICE);
  private readonly snapshotState = signal<CatalogueSnapshot | null>(null);
  private readonly loadingState = signal(false);
  private readonly errorState = signal<string | null>(null);
  private initialization?: Promise<void>;

  readonly snapshot = this.snapshotState.asReadonly();
  readonly loading = this.loadingState.asReadonly();
  readonly error = this.errorState.asReadonly();

  initialize(): Promise<void> {
    this.initialization ??= this.load();
    return this.initialization;
  }

  private async load(): Promise<void> {
    this.loadingState.set(true);
    try {
      this.snapshotState.set(await this.service.getCurrent());
      this.errorState.set(null);
    } catch (error: unknown) {
      this.snapshotState.set(null);
      this.errorState.set(error instanceof Error ? error.message : 'Unable to load the questionnaire catalogue.');
    } finally {
      this.loadingState.set(false);
    }
  }
}
