import { Routes } from '@angular/router';
import { HomePageComponent } from './pages/home/home-page.component';
import { ProfileDashboardPageComponent } from './pages/profile-dashboard/profile-dashboard-page.component';
import { ProfileEditorPageComponent } from './pages/profile-editor/profile-editor-page.component';
import { ProfileExportPageComponent } from './pages/profile-export/profile-export-page.component';
import { ProfileImportPageComponent } from './pages/profile-import/profile-import-page.component';

export const routes: Routes = [
  {
    path: '',
    component: HomePageComponent,
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
    path: 'profiles/:id',
    component: ProfileDashboardPageComponent,
    title: 'Profile',
  },
  {
    path: 'profiles/:id/edit',
    component: ProfileEditorPageComponent,
    title: 'Edit profile',
  },
  {
    path: 'profiles/:id/export',
    component: ProfileExportPageComponent,
    title: 'Export profile',
  },
  {
    path: '**',
    redirectTo: '',
  },
];
