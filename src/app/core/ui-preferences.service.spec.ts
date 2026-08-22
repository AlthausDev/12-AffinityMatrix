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

  it('restores a stored font scale and sanitized hidden categories when the application initializes', () => {
    localStorage.setItem(UI_PREFERENCES_STORAGE_KEY, JSON.stringify({
      confirmQuestionnaireExit: true,
      fontScale: 'extra-large',
      hiddenCategoriesByProfile: {
        'profile-a': ['edge', 'edge', '', 4, 'fluids'],
        'profile-b': 'not-an-array',
      },
    }));

    const service = TestBed.inject(UiPreferencesService);
    service.initialize();

    expect(service.fontScale()).toBe('extra-large');
    expect(document.documentElement.dataset['fontScale']).toBe('extra-large');
    expect(service.hiddenCategoryIds('profile-a')).toEqual(['edge', 'fluids']);
    expect(service.hiddenCategoryIds('profile-b')).toEqual([]);
  });

  it('ignores malformed or unsupported stored preference shapes', () => {
    localStorage.setItem(UI_PREFERENCES_STORAGE_KEY, JSON.stringify({
      confirmQuestionnaireExit: 'no',
      fontScale: 'huge',
      hiddenCategoriesByProfile: null,
    }));

    const service = TestBed.inject(UiPreferencesService);
    expect(service.preferences()).toEqual(DEFAULT_UI_PREFERENCES);
  });
});
