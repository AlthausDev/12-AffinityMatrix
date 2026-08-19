import { CatalogueSnapshot } from '../../domain/catalogue/catalogue-snapshot';
import { CatalogueProvider } from './catalogue-provider';

export class CatalogueService {
  private currentSnapshot?: Promise<CatalogueSnapshot>;

  constructor(private readonly provider: CatalogueProvider) {}

  getCurrent(): Promise<CatalogueSnapshot> {
    this.currentSnapshot ??= this.provider.getCurrent();
    return this.currentSnapshot;
  }
}
