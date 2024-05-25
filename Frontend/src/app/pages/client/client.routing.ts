import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./client.component'),
    children: [
        {
            path: '',
            loadComponent: () => import('../../features/client/home/home.component')
        },
        {
            path: 'categoria/:categoryName',
            loadComponent : () => import('../../features/client/category/category.component')
        }
    ]
  },
  
];

export default routes
