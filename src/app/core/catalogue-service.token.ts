import { inject, InjectionToken } from '@angular/core';
import { CatalogueService } from '../../application/catalogue/catalogue-service';
import { CATALOGUE_PROVIDER } from './catalogue-provider.token';

export const CATALOGUE_SERVICE = new InjectionToken<CatalogueService>('CATALOGUE_SERVICE', {
  providedIn: 'root',
  factory: () => new CatalogueService(inject(CATALOGUE_PROVIDER)),
});
