import { Routes } from '@angular/router';
import { ProfileEditorPageComponent } from './pages/profile-editor/profile-editor-page.component';
import { ProfileExportPageComponent } from './pages/profile-export/profile-export-page.component';
import { ProfileImportPageComponent } from './pages/profile-import/profile-import-page.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home-page.component')
        .then((module) => module.HomePageComponent),
    title: 'Affinity Matrix',
  },
  {
    path: 'profiles/new',
    component: ProfileEditorPageComponent,
    title: 'Create profile',
  },
  {
    path: 'profiles/import',
    component: ProfileImportPageComponent,
    title: 'Import profile',
  },
  {
    path: 'profiles/:id/edit',
    component: ProfileEditorPageComponent,
    title: 'Edit profile',
  },
  {
    path: 'profiles/:id/settings',
    loadComponent: () =>
      import('./pages/settings/settings-page.component')
        .then((module) => module.SettingsPageComponent),
    title: 'Settings',
  },
  {
    path: 'profiles/:id/compare',
    loadComponent: () =>
      import('./pages/profile-comparison/profile-comparison-page.component')
        .then((module) => module.ProfileComparisonPageComponent),
    title: 'Compare profiles',
  },
  {
    path: 'profiles/:id/export',
    component: ProfileExportPageComponent,
    title: 'Export profile',
  },
  {
    path: 'profiles/:id',
    loadComponent: () =>
      import('./pages/profile-dashboard/profile-dashboard-page.component')
        .then((module) => module.ProfileDashboardPageComponent),
    title: 'Profile',
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
            title: 'Questionnaire categories',
          },
          {
            path: ':category',
            loadComponent: () =>
              import('./pages/questionnaire-category/questionnaire-category-page.component')
                .then((module) => module.QuestionnaireCategoryPageComponent),
            title: 'Questionnaire',
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
