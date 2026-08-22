import { DOCUMENT } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { LOCALE_STORAGE_KEY } from './locale';
import { TranslationService } from './translation.service';

describe('TranslationService', () => {
  beforeEach(() => {
    window.localStorage.removeItem(LOCALE_STORAGE_KEY);
    TestBed.resetTestingModule();
  });

  afterEach(() => {
    window.localStorage.removeItem(LOCALE_STORAGE_KEY);
  });

  it('starts in Spanish and interpolates parameters', () => {
    const service = TestBed.inject(TranslationService);

    expect(service.locale()).toBe('es');
    expect(service.t('common.createProfile')).toBe('Crear perfil');
    expect(service.t('validation.alias.maxLength', { max: 80 })).toBe(
      'El alias no puede superar 80 caracteres.',
    );
  });

  it('switches language reactively and persists only the UI locale', () => {
    const service = TestBed.inject(TranslationService);
    const document = TestBed.inject(DOCUMENT);

    service.setLocale('en');

    expect(service.locale()).toBe('en');
    expect(service.t('common.createProfile')).toBe('Create profile');
    expect(document.documentElement.lang).toBe('en');
    expect(window.localStorage.getItem(LOCALE_STORAGE_KEY)).toBe('en');
  });

  it('uses locale-aware plural variants', () => {
    const service = TestBed.inject(TranslationService);

    expect(service.plural(1, 'dashboard.answered.one', 'dashboard.answered.other')).toBe(
      '1 respondida',
    );
    expect(service.plural(2, 'dashboard.answered.one', 'dashboard.answered.other')).toBe(
      '2 respondidas',
    );

    service.setLocale('en');
    expect(service.plural(2, 'dashboard.answered.one', 'dashboard.answered.other')).toBe(
      '2 answered',
    );
  });

  it('uses partner terminology and questionnaire exit resources in both locales', () => {
    const service = TestBed.inject(TranslationService);

    expect(service.t('questionnaireRole.counterpart', { sex: 'Mujer' })).toBe('Pareja: Mujer');
    expect(service.plural(3, 'questionnaire.pending.one', 'questionnaire.pending.other')).toBe(
      'Quedan 3 preguntas visibles pendientes',
    );

    service.setLocale('en');
    expect(service.t('questionnaireRole.counterpart', { sex: 'Woman' })).toBe('Partner: Woman');
    expect(service.t('questionnaire.finish.action')).toBe('Finish');
  });
});
