import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';

export const UI_PREFERENCES_STORAGE_KEY = 'preference-profile.ui-preferences.v1';

export interface UiPreferences {
  readonly confirmQuestionnaireExit: boolean;
}

export const DEFAULT_UI_PREFERENCES: UiPreferences = {
  confirmQuestionnaireExit: true,
};

@Injectable({ providedIn: 'root' })
export class UiPreferencesService {
  private readonly document = inject(DOCUMENT);
  private readonly state = signal<UiPreferences>(this.read());

  readonly preferences = this.state.asReadonly();

  confirmQuestionnaireExit(): boolean {
    return this.state().confirmQuestionnaireExit;
  }

  setConfirmQuestionnaireExit(value: boolean): void {
    this.update({ confirmQuestionnaireExit: value });
  }

  private update(patch: Partial<UiPreferences>): void {
    const next = { ...this.state(), ...patch };
    this.state.set(next);
    this.persist(next);
  }

  private read(): UiPreferences {
    try {
      const raw = this.document.defaultView?.localStorage.getItem(UI_PREFERENCES_STORAGE_KEY);
      if (!raw) return DEFAULT_UI_PREFERENCES;

      const parsed: unknown = JSON.parse(raw);
      if (!this.isRecord(parsed)) return DEFAULT_UI_PREFERENCES;

      return {
        confirmQuestionnaireExit:
          typeof parsed['confirmQuestionnaireExit'] === 'boolean'
            ? parsed['confirmQuestionnaireExit']
            : DEFAULT_UI_PREFERENCES.confirmQuestionnaireExit,
      };
    } catch {
      return DEFAULT_UI_PREFERENCES;
    }
  }

  private persist(value: UiPreferences): void {
    try {
      this.document.defaultView?.localStorage.setItem(UI_PREFERENCES_STORAGE_KEY, JSON.stringify(value));
    } catch {
      // UI preferences remain valid for this session when browser storage is unavailable.
    }
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }
}
