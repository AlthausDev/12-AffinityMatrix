import { TestBed } from '@angular/core/testing';
import {
  DEFAULT_UI_PREFERENCES,
  UI_PREFERENCES_STORAGE_KEY,
  UiPreferencesService,
} from './ui-preferences.service';

describe('UiPreferencesService', () => {
  beforeEach(() => {
    localStorage.removeItem(UI_PREFERENCES_STORAGE_KEY);
    TestBed.resetTestingModule();
  });

  afterEach(() => localStorage.removeItem(UI_PREFERENCES_STORAGE_KEY));

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
    });
  });

  it('ignores malformed or unsupported stored preference shapes', () => {
    localStorage.setItem(UI_PREFERENCES_STORAGE_KEY, JSON.stringify({ confirmQuestionnaireExit: 'no' }));
    const service = TestBed.inject(UiPreferencesService);
    expect(service.confirmQuestionnaireExit()).toBe(true);
  });
});
