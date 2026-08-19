import { ApplicationConfig, inject, provideAppInitializer } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { CatalogueStore } from './core/catalogue.store';
import { ProfileStore } from './core/profile.store';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideAppInitializer(() =>
      Promise.all([
        inject(ProfileStore).initialize(),
        inject(CatalogueStore).initialize(),
      ]).then(() => undefined),
    ),
  ],
};
