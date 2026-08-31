import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';
import {
  DEFAULT_LOCALE,
  isLocale,
  Locale,
  LOCALE_STORAGE_KEY,
  SUPPORTED_LOCALES,
} from './locale';
import {
  DashboardUxTranslationKey,
  EN_DASHBOARD_UX_TRANSLATIONS,
  ES_DASHBOARD_UX_TRANSLATIONS,
} from './ui/dashboard-ux.translations';
import { EN_UI_TRANSLATIONS } from './ui/en-ui.translations';
import { ES_UI_TRANSLATIONS, TranslationKey as BaseTranslationKey } from './ui/es-ui.translations';
import {
  EN_HOME_HUB_TRANSLATIONS,
  ES_HOME_HUB_TRANSLATIONS,
  HomeHubTranslationKey,
} from './ui/home-hub.translations';
import {
  EN_PREFERENCE_SCALE_TRANSLATIONS,
  ES_PREFERENCE_SCALE_TRANSLATIONS,
  PreferenceScaleTranslationKey,
} from './ui/preference-scale.translations';
import {
  EN_QUESTIONNAIRE_UX_TRANSLATIONS,
  ES_QUESTIONNAIRE_UX_TRANSLATIONS,
  QuestionnaireUxTranslationKey,
} from './ui/questionnaire-ux.translations';
import {
  EN_SEMANTIC_DASHBOARD_TRANSLATIONS,
  ES_SEMANTIC_DASHBOARD_TRANSLATIONS,
  SemanticDashboardTranslationKey,
} from './ui/semantic-dashboard.translations';

export type TranslationParameters = Readonly<Record<string, string | number>>;
export type TranslationKey =
  | BaseTranslationKey
  | QuestionnaireUxTranslationKey
  | PreferenceScaleTranslationKey
  | DashboardUxTranslationKey
  | HomeHubTranslationKey
  | SemanticDashboardTranslationKey;

const TRANSLATIONS: Readonly<Record<Locale, Readonly<Record<TranslationKey, string>>>> = {
  es: {
    ...ES_UI_TRANSLATIONS,
    ...ES_QUESTIONNAIRE_UX_TRANSLATIONS,
    ...ES_PREFERENCE_SCALE_TRANSLATIONS,
    ...ES_DASHBOARD_UX_TRANSLATIONS,
    ...ES_HOME_HUB_TRANSLATIONS,
    ...ES_SEMANTIC_DASHBOARD_TRANSLATIONS,
  },
  en: {
    ...EN_UI_TRANSLATIONS,
    ...EN_QUESTIONNAIRE_UX_TRANSLATIONS,
    ...EN_PREFERENCE_SCALE_TRANSLATIONS,
    ...EN_DASHBOARD_UX_TRANSLATIONS,
    ...EN_HOME_HUB_TRANSLATIONS,
    ...EN_SEMANTIC_DASHBOARD_TRANSLATIONS,
  },
};

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly document = inject(DOCUMENT);
  private readonly localeState = signal<Locale>(this.readInitialLocale());

  readonly locale = this.localeState.asReadonly();
  readonly supportedLocales = SUPPORTED_LOCALES;

  constructor() {
    this.applyDocumentLanguage(this.localeState());
  }

  setLocale(locale: Locale): void {
    if (locale === this.localeState()) return;

    this.localeState.set(locale);
    this.applyDocumentLanguage(locale);

    try {
      this.document.defaultView?.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch {
      // Language selection still works for the current session when storage is unavailable.
    }
  }

  t(key: TranslationKey, parameters: TranslationParameters = {}): string {
    return this.interpolate(TRANSLATIONS[this.localeState()][key], parameters);
  }

  plural(
    count: number,
    oneKey: TranslationKey,
    otherKey: TranslationKey,
    parameters: TranslationParameters = {},
  ): string {
    const rule = new Intl.PluralRules(this.localeState()).select(count);
    const key = rule === 'one' ? oneKey : otherKey;
    return this.t(key, { count, ...parameters });
  }

  hasTranslation(key: string, locale: Locale = this.localeState()): boolean {
    return Object.hasOwn(TRANSLATIONS[locale], key);
  }

  private readInitialLocale(): Locale {
    try {
      const stored = this.document.defaultView?.localStorage.getItem(LOCALE_STORAGE_KEY);
      return isLocale(stored) ? stored : DEFAULT_LOCALE;
    } catch {
      return DEFAULT_LOCALE;
    }
  }

  private applyDocumentLanguage(locale: Locale): void {
    this.document.documentElement.lang = locale;
  }

  private interpolate(template: string, parameters: TranslationParameters): string {
    return template.replace(/\{([a-zA-Z][a-zA-Z0-9]*)\}/gu, (placeholder, name: string) =>
      Object.hasOwn(parameters, name) ? String(parameters[name]) : placeholder,
    );
  }
}
