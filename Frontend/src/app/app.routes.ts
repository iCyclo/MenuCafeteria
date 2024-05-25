import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/client/client.routing'),
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.component')
  }
];
