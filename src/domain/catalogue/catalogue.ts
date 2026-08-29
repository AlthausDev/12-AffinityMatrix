import { Practice, PracticeCategory, PracticeSubcategory } from './practice';

export interface PracticeCatalogue {
  readonly categories: readonly PracticeCategory[];
  /** Optional during the 0.2 taxonomy migration; consumers must handle catalogues without it. */
  readonly subcategories?: readonly PracticeSubcategory[];
  readonly practices: readonly Practice[];
}
