import { TestBed } from '@angular/core/testing';
import {
  DEFAULT_UI_PREFERENCES,
  UI_PREFERENCES_STORAGE_KEY,
  UiPreferencesService,
} from './ui-preferences.service';

describe('UiPreferencesService', () => {
  beforeEach(() => {
    localStorage.removeItem(UI_PREFERENCES_STORAGE_KEY);
    document.documentElement.removeAttribute('data-font-scale');
    TestBed.resetTestingModule();
  });

  afterEach(() => {
    localStorage.removeItem(UI_PREFERENCES_STORAGE_KEY);
    document.documentElement.removeAttribute('data-font-scale');
  });

  it('uses safe defaults when no preference has been stored', () => {
    const service = TestBed.inject(UiPreferencesService);
    expect(service.preferences()).toEqual(DEFAULT_UI_PREFERENCES);
  });

  it('persists questionnaire-exit confirmation preferences locally', () => {
    const service = TestBed.inject(UiPreferencesService);
    service.setConfirmQuestionnaireExit(false);

    expect(service.confirmQuestionnaireExit()).toBe(false);
    expect(JSON.parse(localStorage.getItem(UI_PREFERENCES_STORAGE_KEY) ?? '{}')).toEqual({
      confirmQuestionnaireExit: false,
      fontScale: 'normal',
      hiddenCategoriesByProfile: {},
      profileOrder: [],
      profileSortMode: 'manual',
    });
  });

  it('applies and persists the selected font scale globally', () => {
    const service = TestBed.inject(UiPreferencesService);
    service.initialize();
    expect(document.documentElement.dataset['fontScale']).toBe('normal');

    service.setFontScale('large');

    expect(service.fontScale()).toBe('large');
    expect(document.documentElement.dataset['fontScale']).toBe('large');
    expect(JSON.parse(localStorage.getItem(UI_PREFERENCES_STORAGE_KEY) ?? '{}')).toEqual({
      confirmQuestionnaireExit: true,
      fontScale: 'large',
      hiddenCategoriesByProfile: {},
      profileOrder: [],
      profileSortMode: 'manual',
    });
  });

  it('keeps hidden categories local and isolated by profile', () => {
    const service = TestBed.inject(UiPreferencesService);

    service.setCategoryHidden('profile-a', 'edge', true);
    service.setCategoryHidden('profile-a', 'fluids', true);
    service.setCategoryHidden('profile-b', 'roleplay', true);

    expect(service.hiddenCategoryIds('profile-a')).toEqual(['edge', 'fluids']);
    expect(service.hiddenCategoryIds('profile-b')).toEqual(['roleplay']);
    expect(service.isCategoryHidden('profile-a', 'roleplay')).toBe(false);

    service.setCategoryHidden('profile-a', 'edge', false);
    expect(service.hiddenCategoryIds('profile-a')).toEqual(['fluids']);

    service.showAllCategories('profile-a');
    expect(service.hiddenCategoryIds('profile-a')).toEqual([]);
    expect(service.hiddenCategoryIds('profile-b')).toEqual(['roleplay']);
  });

  it('cleans profile-scoped UI preferences when a profile is deleted', () => {
    const service = TestBed.inject(UiPreferencesService);
    service.setProfileOrder(['profile-a', 'profile-b']);
    service.setCategoryHidden('profile-a', 'edge', true);
    service.setCategoryHidden('profile-b', 'roleplay', true);

    service.removeProfile('profile-a');

    expect(service.profileOrder()).toEqual(['profile-b']);
    expect(service.hiddenCategoryIds('profile-a')).toEqual([]);
    expect(service.hiddenCategoryIds('profile-b')).toEqual(['roleplay']);
  });

  it('persists a sanitized local profile order', () => {
    const service = TestBed.inject(UiPreferencesService);

    service.setProfileOrder(['profile-b', 'profile-a', 'profile-b', '']);

    expect(service.profileOrder()).toEqual(['profile-b', 'profile-a']);
    expect(JSON.parse(localStorage.getItem(UI_PREFERENCES_STORAGE_KEY) ?? '{}')).toEqual({
      confirmQuestionnaireExit: true,
      fontScale: 'normal',
      hiddenCategoriesByProfile: {},
      profileOrder: ['profile-b', 'profile-a'],
      profileSortMode: 'manual',
    });
  });

  it('persists the selected profile sort mode without changing the manual order', () => {
    const service = TestBed.inject(UiPreferencesService);
    service.setProfileOrder(['profile-b', 'profile-a']);

    service.setProfileSortMode('completion');

    expect(service.profileSortMode()).toBe('completion');
    expect(service.profileOrder()).toEqual(['profile-b', 'profile-a']);
    expect(JSON.parse(localStorage.getItem(UI_PREFERENCES_STORAGE_KEY) ?? '{}')).toMatchObject({
      profileOrder: ['profile-b', 'profile-a'],
      profileSortMode: 'completion',
    });
  });

  it('restores stored preferences and sanitizes local collections when the application initializes', () => {
    localStorage.setItem(UI_PREFERENCES_STORAGE_KEY, JSON.stringify({
      confirmQuestionnaireExit: true,
      fontScale: 'extra-large',
      hiddenCategoriesByProfile: {
        'profile-a': ['edge', 'edge', '', 4, 'fluids'],
        'profile-b': 'not-an-array',
      },
      profileOrder: ['profile-c', 'profile-a', 'profile-c', 7, ''],
      profileSortMode: 'alias',
    }));

    const service = TestBed.inject(UiPreferencesService);
    service.initialize();

    expect(service.fontScale()).toBe('extra-large');
    expect(document.documentElement.dataset['fontScale']).toBe('extra-large');
    expect(service.hiddenCategoryIds('profile-a')).toEqual(['edge', 'fluids']);
    expect(service.hiddenCategoryIds('profile-b')).toEqual([]);
    expect(service.profileOrder()).toEqual(['profile-c', 'profile-a']);
    expect(service.profileSortMode()).toBe('alias');
  });

  it('ignores malformed or unsupported stored preference shapes', () => {
    localStorage.setItem(UI_PREFERENCES_STORAGE_KEY, JSON.stringify({
      confirmQuestionnaireExit: 'no',
      fontScale: 'huge',
      hiddenCategoriesByProfile: null,
      profileOrder: 'not-an-array',
      profileSortMode: 'random',
    }));

    const service = TestBed.inject(UiPreferencesService);
    expect(service.preferences()).toEqual(DEFAULT_UI_PREFERENCES);
  });
});
