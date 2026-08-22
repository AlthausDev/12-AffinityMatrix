import { CATALOGUE_V3_CONTENT } from '../../content/catalogue/v3';
import { CatalogueSnapshot } from '../../domain/catalogue/catalogue-snapshot';
import { CATALOGUE_VERSION_V3 } from '../../domain/catalogue/catalogue-version';
import { buildPractice } from './v3/practice-builders';

export const CURRENT_CATALOGUE_SNAPSHOT: CatalogueSnapshot = {
  version: CATALOGUE_VERSION_V3,
  catalogue: {
    categories: CATALOGUE_V3_CONTENT.map((category) => ({
      id: category.id,
      label: category.en,
      description: category.descriptionEn,
      order: category.order,
    })),
    practices: CATALOGUE_V3_CONTENT.flatMap((category) =>
      category.practices.map((practice) => buildPractice(practice, category.id)),
    ),
  },
};
