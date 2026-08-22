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
    });
  });

  it('restores a stored font scale when the application initializes', () => {
    localStorage.setItem(UI_PREFERENCES_STORAGE_KEY, JSON.stringify({
      confirmQuestionnaireExit: true,
      fontScale: 'extra-large',
    }));

    const service = TestBed.inject(UiPreferencesService);
    service.initialize();

    expect(service.fontScale()).toBe('extra-large');
    expect(document.documentElement.dataset['fontScale']).toBe('extra-large');
  });

  it('ignores malformed or unsupported stored preference shapes', () => {
    localStorage.setItem(UI_PREFERENCES_STORAGE_KEY, JSON.stringify({
      confirmQuestionnaireExit: 'no',
      fontScale: 'huge',
    }));

    const service = TestBed.inject(UiPreferencesService);
    expect(service.preferences()).toEqual(DEFAULT_UI_PREFERENCES);
  });
});
