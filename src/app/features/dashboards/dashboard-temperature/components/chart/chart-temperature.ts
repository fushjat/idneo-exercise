import { AfterViewInit, Component, Input, ViewChild, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-chart-temperature',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './chart-temperature.html',
  styleUrls: ['./chart-temperature.css'],
})
export class ChartTemperature implements AfterViewInit {
  private data = signal<number[]>([]);

  @Input()
  set dataTemp(d: number[]) {
    this.data.set(d ?? []);

    this.updateChart(this.data());
  }
  get dataTemp() {
    return this.data();
  }

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  public lineChartType: ChartConfiguration<'line'>['type'] = 'line';

  public lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    animation: { duration: 200, easing: 'linear' },
    interaction: { intersect: false, mode: 'index' },
    elements: { line: { tension: 0.25 } },
  };

  public lineChartData = {
    labels: [] as string[],
    datasets: [{ data: [] as number[], label: 'Temp', borderColor: 'blue', fill: false }],
  };

  constructor() {}

  ngAfterViewInit(): void {
    this.updateChart(this.data());
  }

  private updateChart(arr: number[]) {
    if (!this.chart?.chart) return;

    const chart = this.chart.chart;

    chart.data.labels = arr.map((_, i) => `${i + 1}`);
    chart.data.datasets[0].data = [...arr];

    chart.update();
  }
}
