import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./pages/client/client.routing'),
    title: 'Menu Cafeteria'
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin/admin.component'),
    title: 'Admin'
  }
];
