import { Practice, PracticeCategory } from './practice';

export interface PracticeCatalogue {
  readonly categories: readonly PracticeCategory[];
  readonly practices: readonly Practice[];
}
