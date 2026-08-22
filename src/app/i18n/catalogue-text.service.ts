import { Injectable, inject } from '@angular/core';
import { Practice, PracticeCategory, PracticeRole } from '../../domain/catalogue/practice';
import { CATALOGUE_V3_CONTENT } from '../../infrastructure/catalogue/v3/content/final';
import { describeCataloguePractice } from '../../infrastructure/catalogue/v3/content/practice-description';
import { CataloguePracticeSeed } from '../../infrastructure/catalogue/v3/content/types';
import { EN_CATALOGUE_TRANSLATIONS } from './catalogue/en-catalogue.translations';
import {
  CatalogueTranslationKey,
  ES_CATALOGUE_TRANSLATIONS,
} from './catalogue/es-catalogue.translations';
import { Locale } from './locale';
import { TranslationService } from './translation.service';

const CATALOGUE_TRANSLATIONS: Readonly<Record<Locale, Readonly<Record<CatalogueTranslationKey, string>>>> = {
  es: ES_CATALOGUE_TRANSLATIONS,
  en: EN_CATALOGUE_TRANSLATIONS,
};

const V3_CATEGORIES = new Map(CATALOGUE_V3_CONTENT.map((category) => [category.id, category]));
const V3_PRACTICES = new Map<string, CataloguePracticeSeed>(
  CATALOGUE_V3_CONTENT.flatMap((category) => category.practices.map((practice) => [practice.id, practice] as const)),
);

const V3_ROLE_LABELS: Readonly<Record<Locale, Readonly<Record<string, string>>>> = {
  es: {
    participate: 'Participar',
    give: 'Dar / hacer',
    receive: 'Recibir',
    self: 'Hacerlo / vivirlo yo',
    'self-state': 'En mí / yo',
    'partner-state': 'En mi pareja',
    wear: 'Llevarlo yo',
    'partner-wears': 'Que lo lleve mi pareja',
    watch: 'Mirar',
    'be-watched': 'Ser observado/a',
    lead: 'Llevar el rol activo / de control',
    follow: 'Llevar el rol receptivo / de seguimiento',
    center: 'Ser el centro',
    interest: 'Me interesa / atrae',
    'use-on-self': 'Usarlo conmigo',
    'use-on-partner': 'Usarlo en mi pareja',
    'partner-uses-on-me': 'Que mi pareja lo use conmigo',
  },
  en: {
    participate: 'Participate',
    give: 'Give / do',
    receive: 'Receive',
    self: 'Do / experience it myself',
    'self-state': 'For me / myself',
    'partner-state': 'For my partner',
    wear: 'Wear it myself',
    'partner-wears': 'Have my partner wear it',
    watch: 'Watch',
    'be-watched': 'Be watched',
    lead: 'Lead / control',
    follow: 'Follow / receive',
    center: 'Be the center',
    interest: 'Interested / attracted',
    'use-on-self': 'Use it on myself',
    'use-on-partner': 'Use it on my partner',
    'partner-uses-on-me': 'Have my partner use it on me',
  },
};

export function categoryLabelKey(categoryId: string): string {
  return `catalogue.category.${categoryId}.label`;
}

export function categoryDescriptionKey(categoryId: string): string {
  return `catalogue.category.${categoryId}.description`;
}

export function practiceLabelKey(practiceId: string): string {
  return `catalogue.practice.${practiceId}.label`;
}

export function practiceDescriptionKey(practiceId: string): string {
  return `catalogue.practice.${practiceId}.description`;
}

export function roleLabelKey(practiceId: string, roleId: string): string {
  return `catalogue.practice.${practiceId}.role.${roleId}`;
}

@Injectable({ providedIn: 'root' })
export class CatalogueTextService {
  private readonly translations = inject(TranslationService);

  categoryLabel(category: PracticeCategory): string {
    const seed = V3_CATEGORIES.get(category.id);
    if (seed) return this.translations.locale() === 'es' ? seed.es : seed.en;
    return this.translate(categoryLabelKey(category.id), category.label);
  }

  categoryDescription(category: PracticeCategory): string {
    const seed = V3_CATEGORIES.get(category.id);
    if (seed) return this.translations.locale() === 'es' ? seed.descriptionEs : seed.descriptionEn;
    return category.description ? this.translate(categoryDescriptionKey(category.id), category.description) : '';
  }

  practiceLabel(practice: Practice): string {
    const seed = V3_PRACTICES.get(practice.id);
    if (seed) return this.translations.locale() === 'es' ? seed.es : seed.en;
    return this.translate(practiceLabelKey(practice.id), practice.label);
  }

  practiceDescription(practice: Practice): string {
    const seed = V3_PRACTICES.get(practice.id);
    if (seed) return describeCataloguePractice(seed, this.translations.locale());
    return practice.description
      ? this.translate(practiceDescriptionKey(practice.id), practice.description)
      : '';
  }

  roleLabel(practiceId: string, role: PracticeRole): string {
    const seed = V3_PRACTICES.get(practiceId);
    if (seed) {
      const locale = this.translations.locale();
      const explicitRole = seed.roleLabels?.[role.id];
      if (explicitRole) return locale === 'es' ? explicitRole.es : explicitRole.en;
      const pairedRole = seed.pairedRoles?.find((candidate) => candidate.id === role.id);
      if (pairedRole) return locale === 'es' ? pairedRole.es : pairedRole.en;
      return V3_ROLE_LABELS[locale][role.id] ?? role.label;
    }
    return this.translate(roleLabelKey(practiceId, role.id), role.label);
  }

  private translate(key: string, fallback: string): string {
    const resource = CATALOGUE_TRANSLATIONS[this.translations.locale()] as Readonly<Record<string, string>>;
    return resource[key] ?? fallback;
  }
}
