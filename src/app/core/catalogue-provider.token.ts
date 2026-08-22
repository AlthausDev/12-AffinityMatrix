import { InjectionToken } from '@angular/core';
import { CatalogueProvider } from '../../application/catalogue/catalogue-provider';
import { StaticCatalogueProvider } from '../../infrastructure/catalogue/static-catalogue.provider';

export const CATALOGUE_PROVIDER = new InjectionToken<CatalogueProvider>('CATALOGUE_PROVIDER', {
  providedIn: 'root',
  factory: () => new StaticCatalogueProvider(),
});
