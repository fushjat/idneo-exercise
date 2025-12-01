import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-current-temperature',
  standalone: true,
  imports: [],
  templateUrl: './current-temperature.html',
  styleUrls: ['./current-temperature.css'],
})
export class CurrentTemperature {
  @Input() value?: number;
}
