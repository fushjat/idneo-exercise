import { Routes } from '@angular/router';
import { TemperatureDashboardPage } from './features/dashboards/dashboard-temperature/temperature.dashboard.page';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard-temperature',
    pathMatch: 'full',
  },
  {
    path: 'dashboard-temperature',
    component: TemperatureDashboardPage,
  },
];
