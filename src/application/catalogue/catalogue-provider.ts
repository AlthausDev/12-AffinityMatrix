import { CatalogueSnapshot } from '../../domain/catalogue/catalogue-snapshot';

export interface CatalogueProvider {
  getCurrent(): Promise<CatalogueSnapshot>;
}
