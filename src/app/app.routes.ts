import { Routes } from '@angular/router';
import { ProfileEditorPageComponent } from './pages/profile-editor/profile-editor-page.component';
import { ProfileExportPageComponent } from './pages/profile-export/profile-export-page.component';
import { ProfileImportPageComponent } from './pages/profile-import/profile-import-page.component';
import { PRODUCT_NAME } from './shared/product-brand';

const brandedTitle = (page: string): string => `${PRODUCT_NAME} · ${page}`;

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home-page.component')
        .then((module) => module.HomePageComponent),
    title: PRODUCT_NAME,
  },
  {
    path: 'profiles/new',
    component: ProfileEditorPageComponent,
    title: brandedTitle('Create profile'),
  },
  {
    path: 'profiles/import',
    component: ProfileImportPageComponent,
    title: brandedTitle('Import profile'),
  },
  {
    path: 'profiles/:id/edit',
    component: ProfileEditorPageComponent,
    title: brandedTitle('Edit profile'),
  },
  {
    path: 'profiles/:id/glossary',
    loadComponent: () =>
      import('./pages/catalogue-glossary/catalogue-glossary-page.component')
        .then((module) => module.CatalogueGlossaryPageComponent),
    title: brandedTitle('Glossary'),
  },
  {
    path: 'profiles/:id/settings',
    loadComponent: () =>
      import('./pages/settings/settings-page.component')
        .then((module) => module.SettingsPageComponent),
    title: brandedTitle('Settings'),
  },
  {
    path: 'profiles/:id/compare',
    loadComponent: () =>
      import('./pages/profile-comparison/profile-comparison-page.component')
        .then((module) => module.ProfileComparisonPageComponent),
    title: brandedTitle('Compare profiles'),
  },
  {
    path: 'profiles/:id/export',
    component: ProfileExportPageComponent,
    title: brandedTitle('Export profile'),
  },
  {
    path: 'profiles/:id',
    loadComponent: () =>
      import('./pages/profile-dashboard/profile-dashboard-page.component')
        .then((module) => module.ProfileDashboardPageComponent),
    title: brandedTitle('Profile'),
    children: [
      {
        path: 'questionnaire',
        loadComponent: () =>
          import('./questionnaire/questionnaire-shell.component')
            .then((module) => module.QuestionnaireShellComponent),
        children: [
          {
            path: '',
            loadComponent: () =>
              import('./pages/questionnaire-categories/questionnaire-categories-page.component')
                .then((module) => module.QuestionnaireCategoriesPageComponent),
            title: brandedTitle('Questionnaire categories'),
          },
          {
            path: ':category',
            loadComponent: () =>
              import('./pages/questionnaire-category/questionnaire-category-page.component')
                .then((module) => module.QuestionnaireCategoryPageComponent),
            title: brandedTitle('Questionnaire'),
          },
        ],
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
