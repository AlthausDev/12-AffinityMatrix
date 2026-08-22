import { Injectable, inject } from '@angular/core';
import { Practice, PracticeCategory, PracticeRole } from '../../domain/catalogue/practice';
import { EN_CATALOGUE_TRANSLATIONS } from './catalogue/en-catalogue.translations';
import {
  CatalogueTranslationKey,
  ES_CATALOGUE_TRANSLATIONS,
} from './catalogue/es-catalogue.translations';
import { Locale } from './locale';
import { TranslationService } from './translation.service';

const CATALOGUE_TRANSLATIONS: Readonly<
  Record<Locale, Readonly<Record<CatalogueTranslationKey, string>>>
> = {
  es: ES_CATALOGUE_TRANSLATIONS,
  en: EN_CATALOGUE_TRANSLATIONS,
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
    return this.translate(categoryLabelKey(category.id), category.label);
  }

  categoryDescription(category: PracticeCategory): string {
    return category.description
      ? this.translate(categoryDescriptionKey(category.id), category.description)
      : '';
  }

  practiceLabel(practice: Practice): string {
    return this.translate(practiceLabelKey(practice.id), practice.label);
  }

  practiceDescription(practice: Practice): string {
    return practice.description
      ? this.translate(practiceDescriptionKey(practice.id), practice.description)
      : '';
  }

  roleLabel(practiceId: string, role: PracticeRole): string {
    return this.translate(roleLabelKey(practiceId, role.id), role.label);
  }

  private translate(key: string, fallback: string): string {
    const resource = CATALOGUE_TRANSLATIONS[this.translations.locale()] as Readonly<Record<string, string>>;
    return resource[key] ?? fallback;
  }
}
