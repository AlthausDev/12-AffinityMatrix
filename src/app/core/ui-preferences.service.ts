import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';

export const UI_PREFERENCES_STORAGE_KEY = 'preference-profile.ui-preferences.v1';

export const FONT_SCALE_VALUES = ['normal', 'large', 'extra-large'] as const;
export type FontScale = (typeof FONT_SCALE_VALUES)[number];

export interface UiPreferences {
  readonly confirmQuestionnaireExit: boolean;
  readonly fontScale: FontScale;
  readonly hiddenCategoriesByProfile: Readonly<Record<string, readonly string[]>>;
  readonly profileOrder: readonly string[];
}

export const DEFAULT_UI_PREFERENCES: UiPreferences = {
  confirmQuestionnaireExit: true,
  fontScale: 'normal',
  hiddenCategoriesByProfile: {},
  profileOrder: [],
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

  hiddenCategoryIds(profileId: string): readonly string[] {
    return this.state().hiddenCategoriesByProfile[profileId] ?? [];
  }

  profileOrder(): readonly string[] {
    return this.state().profileOrder;
  }

  isCategoryHidden(profileId: string, categoryId: string): boolean {
    return this.hiddenCategoryIds(profileId).includes(categoryId);
  }

  setConfirmQuestionnaireExit(value: boolean): void {
    this.update({ confirmQuestionnaireExit: value });
  }

  setFontScale(value: FontScale): void {
    this.update({ fontScale: value });
    this.applyFontScale(value);
  }

  setProfileOrder(profileIds: readonly string[]): void {
    const profileOrder = [...new Set(profileIds.filter((profileId) => profileId.length > 0))];
    this.update({ profileOrder });
  }

  setCategoryHidden(profileId: string, categoryId: string, hidden: boolean): void {
    if (!profileId || !categoryId) return;
    const current = new Set(this.hiddenCategoryIds(profileId));
    if (hidden) current.add(categoryId);
    else current.delete(categoryId);

    const hiddenCategoriesByProfile = { ...this.state().hiddenCategoriesByProfile };
    if (current.size === 0) delete hiddenCategoriesByProfile[profileId];
    else hiddenCategoriesByProfile[profileId] = [...current].sort();
    this.update({ hiddenCategoriesByProfile });
  }

  showAllCategories(profileId: string): void {
    const hiddenCategoriesByProfile = { ...this.state().hiddenCategoriesByProfile };
    if (!(profileId in hiddenCategoriesByProfile)) return;
    delete hiddenCategoriesByProfile[profileId];
    this.update({ hiddenCategoriesByProfile });
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
        hiddenCategoriesByProfile: this.readHiddenCategories(parsed['hiddenCategoriesByProfile']),
        profileOrder: this.readProfileOrder(parsed['profileOrder']),
      };
    } catch {
      return DEFAULT_UI_PREFERENCES;
    }
  }

  private readHiddenCategories(value: unknown): Readonly<Record<string, readonly string[]>> {
    if (!this.isRecord(value)) return {};
    const result: Record<string, readonly string[]> = {};
    for (const [profileId, categoryIds] of Object.entries(value)) {
      if (!profileId || !Array.isArray(categoryIds)) continue;
      const clean = [...new Set(categoryIds.filter(
        (categoryId): categoryId is string => typeof categoryId === 'string' && categoryId.length > 0,
      ))].sort();
      if (clean.length > 0) result[profileId] = clean;
    }
    return result;
  }

  private readProfileOrder(value: unknown): readonly string[] {
    if (!Array.isArray(value)) return [];
    return [...new Set(value.filter(
      (profileId): profileId is string => typeof profileId === 'string' && profileId.length > 0,
    ))];
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
