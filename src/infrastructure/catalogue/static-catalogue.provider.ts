import { CatalogueProvider } from '../../application/catalogue/catalogue-provider';
import { CatalogueSnapshot } from '../../domain/catalogue/catalogue-snapshot';
import { catalogueSnapshotValidator } from '../../domain/catalogue/catalogue-snapshot';
import { CURRENT_CATALOGUE_SNAPSHOT } from './catalogue-v3';

export class StaticCatalogueProvider implements CatalogueProvider {
  async getCurrent(): Promise<CatalogueSnapshot> {
    return catalogueSnapshotValidator.assert(
      CURRENT_CATALOGUE_SNAPSHOT,
      'Static catalogue failed domain validation.',
    );
  }
}
