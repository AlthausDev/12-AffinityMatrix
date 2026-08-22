import { Injectable, inject } from '@angular/core';
import { Practice, PracticeCategory, PracticeRole } from '../../domain/catalogue/practice';
import { TranslationService } from './translation.service';

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
    return this.translations.dynamic(categoryLabelKey(category.id), category.label);
  }

  categoryDescription(category: PracticeCategory): string {
    return category.description
      ? this.translations.dynamic(categoryDescriptionKey(category.id), category.description)
      : '';
  }

  practiceLabel(practice: Practice): string {
    return this.translations.dynamic(practiceLabelKey(practice.id), practice.label);
  }

  practiceDescription(practice: Practice): string {
    return practice.description
      ? this.translations.dynamic(practiceDescriptionKey(practice.id), practice.description)
      : '';
  }

  roleLabel(practiceId: string, role: PracticeRole): string {
    return this.translations.dynamic(roleLabelKey(practiceId, role.id), role.label);
  }
}
