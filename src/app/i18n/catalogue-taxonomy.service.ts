import { Injectable, inject } from '@angular/core';
import { CATALOGUE_V3_SUBCATEGORIES } from '../../infrastructure/catalogue/v3/catalogue-taxonomy';
import { TranslationService } from './translation.service';

export interface LocalizedCatalogueSubcategory {
  readonly id: string;
  readonly categoryId: string;
  readonly label: string;
  readonly description: string;
  readonly order: number;
  readonly practiceIds: readonly string[];
}

@Injectable({ providedIn: 'root' })
export class CatalogueTaxonomyService {
  private readonly i18n = inject(TranslationService);

  subcategoriesFor(categoryId: string): readonly LocalizedCatalogueSubcategory[] {
    const locale = this.i18n.locale();
    return CATALOGUE_V3_SUBCATEGORIES
      .filter((subcategory) => subcategory.categoryId === categoryId)
      .sort((left, right) => left.order - right.order)
      .map((subcategory) => ({
        id: subcategory.id,
        categoryId: subcategory.categoryId,
        label: locale === 'es' ? subcategory.es : subcategory.en,
        description: locale === 'es' ? subcategory.descriptionEs : subcategory.descriptionEn,
        order: subcategory.order,
        practiceIds: subcategory.practiceIds,
      }));
  }
}
