import { Injectable, inject } from '@angular/core';
import { Practice, PracticeCategory, PracticeRole } from '../../domain/catalogue/practice';
import { Sex } from '../../domain/profile/profile-metadata';
import { CATALOGUE_V3_CONTENT } from '../../infrastructure/catalogue/v3/content/final';
import { describeCataloguePractice } from '../../infrastructure/catalogue/v3/content/practice-description';
import { CataloguePracticeSeed } from '../../infrastructure/catalogue/v3/content/types';
import { EN_CATALOGUE_TRANSLATIONS } from './catalogue/en-catalogue.translations';
import {
  CatalogueTranslationKey,
  ES_CATALOGUE_TRANSLATIONS,
} from './catalogue/es-catalogue.translations';
import { relativeGroupCompositionLabel } from './catalogue-context-label';
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
    give: 'Hacerlo yo a mi pareja',
    receive: 'Que mi pareja me lo haga a mí',
    self: 'Hacerlo / vivirlo yo',
    'self-state': 'En mí / yo',
    'partner-state': 'En mi pareja',
    wear: 'Llevarlo yo',
    'partner-wears': 'Que lo lleve mi pareja',
    watch: 'Observar yo',
    'be-watched': 'Que mi pareja me observe',
    lead: 'Llevar yo el rol activo / de control',
    follow: 'Llevar yo el rol receptivo / de seguimiento',
    center: 'Ser yo el centro',
    interest: 'Me interesa / atrae',
    'use-on-self': 'Usarlo conmigo',
    'use-on-partner': 'Usarlo yo en mi pareja',
    'partner-uses-on-me': 'Que mi pareja lo use conmigo',
  },
  en: {
    participate: 'Participate',
    give: 'I do it to my partner',
    receive: 'My partner does it to me',
    self: 'I do / experience it myself',
    'self-state': 'For me / myself',
    'partner-state': 'For my partner',
    wear: 'I wear it',
    'partner-wears': 'My partner wears it',
    watch: 'I watch',
    'be-watched': 'My partner watches me',
    lead: 'I take the active / controlling role',
    follow: 'I take the receptive / following role',
    center: 'I am the center',
    interest: 'Interested / attracted',
    'use-on-self': 'I use it on myself',
    'use-on-partner': 'I use it on my partner',
    'partner-uses-on-me': 'My partner uses it on me',
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

  practiceLabel(practice: Practice, selfSex?: Sex): string {
    const seed = V3_PRACTICES.get(practice.id);
    if (seed) {
      const locale = this.translations.locale();
      const relativeGroupLabel = relativeGroupCompositionLabel(seed.groupComposition, selfSex, locale);
      if (relativeGroupLabel) return relativeGroupLabel;
      return locale === 'es' ? seed.es : seed.en;
    }
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
