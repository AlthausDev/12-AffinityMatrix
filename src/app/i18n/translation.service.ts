import { DOCUMENT } from '@angular/common';
import { Injectable, inject, signal } from '@angular/core';
import {
  DEFAULT_LOCALE,
  isLocale,
  Locale,
  LOCALE_STORAGE_KEY,
  SUPPORTED_LOCALES,
} from './locale';
import { EN_UI_TRANSLATIONS } from './ui/en-ui.translations';
import { ES_UI_TRANSLATIONS, TranslationKey } from './ui/es-ui.translations';

export type TranslationParameters = Readonly<Record<string, string | number>>;

const TRANSLATIONS: Readonly<Record<Locale, Readonly<Record<TranslationKey, string>>>> = {
  es: ES_UI_TRANSLATIONS,
  en: EN_UI_TRANSLATIONS,
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
