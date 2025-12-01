import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css'],
})
export class Header {
  @Input() stats: { minTemperature: number; maxTemperature: number; avgTemperature: number } = {
    minTemperature: 0,
    maxTemperature: 0,
    avgTemperature: 0,
  };

  get minColor(): string {
    return this.stats.minTemperature >= 30 && this.stats.minTemperature <= 40 ? 'red' : 'green';
  }

  get maxColor(): string {
    return this.stats.maxTemperature >= 80 && this.stats.maxTemperature <= 100 ? 'red' : 'green';
  }
}
