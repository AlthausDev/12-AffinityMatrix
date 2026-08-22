import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';

export const UI_PREFERENCES_STORAGE_KEY = 'preference-profile.ui-preferences.v1';

export const FONT_SCALE_VALUES = ['normal', 'large', 'extra-large'] as const;
export type FontScale = (typeof FONT_SCALE_VALUES)[number];

export interface UiPreferences {
  readonly confirmQuestionnaireExit: boolean;
  readonly fontScale: FontScale;
}

export const DEFAULT_UI_PREFERENCES: UiPreferences = {
  confirmQuestionnaireExit: true,
  fontScale: 'normal',
};

@Injectable({ providedIn: 'root' })
export class UiPreferencesService {
  private readonly document = inject(DOCUMENT);
  private readonly state = signal<UiPreferences>(this.read());

  readonly preferences = this.state.asReadonly();

  initialize(): void {
    this.applyFontScale(this.state().fontScale);
  }

  confirmQuestionnaireExit(): boolean {
    return this.state().confirmQuestionnaireExit;
  }

  fontScale(): FontScale {
    return this.state().fontScale;
  }

  setConfirmQuestionnaireExit(value: boolean): void {
    this.update({ confirmQuestionnaireExit: value });
  }

  setFontScale(value: FontScale): void {
    this.update({ fontScale: value });
    this.applyFontScale(value);
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
        fontScale: this.isFontScale(parsed['fontScale'])
          ? parsed['fontScale']
          : DEFAULT_UI_PREFERENCES.fontScale,
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

  private applyFontScale(value: FontScale): void {
    this.document.documentElement.dataset['fontScale'] = value;
  }

  private isFontScale(value: unknown): value is FontScale {
    return typeof value === 'string' && FONT_SCALE_VALUES.includes(value as FontScale);
  }

  private isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }
}
