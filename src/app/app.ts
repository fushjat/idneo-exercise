import { Component, inject } from '@angular/core';
import { TemperatureDashboardPage } from './features/dashboards/dashboard-temperature/temperature.dashboard.page';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  imports: [TemperatureDashboardPage],
  standalone: true,
  templateUrl: 'app.html',
  styleUrls: ['./app.css'],
})
export class App {
  theme = inject(ThemeService);
  toggleTheme() {
    this.theme.toggleTheme();
  }
}
